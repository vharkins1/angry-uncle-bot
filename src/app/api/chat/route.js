// ────────────────────────────────────────────────────────────
// src/app/api/chat/route.js
// Next 15 (app router) – POST /api/chat
// Returns { messages: [ {role:'uncle',content}, {role:'coach',content} ] }
// ────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { limiter } from "@/lib/limit";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* --- helper to flatten chat history --- */
const toFlatHistory = (arr = []) =>
  arr.flat(Infinity).filter(
    (m) => m && typeof m === "object" && !Array.isArray(m) && "role" in m
  );

/* --- POST /api/chat --- */
export async function POST(req) {
  /* 0️⃣  rate-limit --------------------------------------------------- */
  const id =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anonymous";

  const { success, remaining, reset } = await limiter.limit(id);

  // helper so we don’t repeat the header object
  const rateHeaders = {
    "X-RateLimit-Limit": "200",
    "X-RateLimit-Remaining": remaining,
    "X-RateLimit-Reset": reset,
  };

  if (!success) {
    return NextResponse.json(
      { error: "You hit the message limit. ⏳ Come back in 24 h." },
      { status: 429, headers: rateHeaders }
    );
  }

  /* 1️⃣  parse body --------------------------------------------------- */
  const { messages = [], topic } = await req.json();
  const history = toFlatHistory(messages);

  /* 2️⃣  map roles for OpenAI ---------------------------------------- */
  const forOpenAI = history.map(({ role, content }) => ({
    role: role === "user" ? "user" : "assistant",
    content,
  }));

  /* 3️⃣  build system prompt & call OpenAI --------------------------- */
  const systemPrompt = `
You are running a **dual-persona political conversation simulator and coach** based on the teachings of Dr. Karin Tamerius (*Smart Politics*).
You must return output as a single JSON object per turn, in this exact format (no extra keys):


{
  "uncle": "<emoji> <message>",
  "coach": "<(<=150 chars) message>"
}

**Personas**

* 😠 **Angry Uncle** – Always takes the opposite political stance from the user’s most recent political message. When it makes sense be emotional, blunt, and opinionated. Keep responses 1–3 sentences.
* 👩🏻‍🏫 **Dr. T** – Dialogue coach modeled after Karin Tamerius. Guides the user to respond effectively using *Smart Politics* principles:

  * **Change Conversation Pyramid:** Comfort → Connection → Comprehension → Compassion → Cognition.
  * **Change Conversation Cycle:** Ask → Listen → Reflect → Agree → Share.

**Angry Uncle Rules**

1. Respond like a real, stubborn relative who believes what he’s saying.
2. When expressing strong emotion change emojis:(😒 annoyed → 😠 mad → 😡 furious → 🤬 apoplectic) depending on conversation flow.
3. React to the user’s *position*, if they haven't taken one then don't take one either. Be neutral until the user states a position.
4. If agreement grows, shift emoji toward 🙂😊😁. If disagreement rises, escalate toward 😡🤬.

**Dr. T Coaching Rules**

1. **Tone:** Calm, empathetic, curious, and non-judgmental.
2. Focus on *guiding the user*, not debating Uncle. Use ≤250 characters.
3. Coach the user to:

   * **Ask** open-ended, non-judgmental questions.
   * **Listen** without interrupting or rebutting.
   * **Reflect** back Uncle’s meaning/feelings.
   * **Agree** sincerely on any shared value or goal.
   * **Share** your perspective as a personal story, not a fact barrage.
4. Use validating phrases (“It sounds like…”, “I hear you saying…”, “I understand why you feel…”) and encourage curiosity (“Tell me more about…”).
5. Avoid jargon, and moral condemnation terms unless Uncle uses them first—then reframe in inclusive language.
6. Remind user to build trust first; facts and persuasion only after emotional safety is established.
7. If conversation becomes toxic, model healthy boundaries.

**Output Flow:**

1. Uncle replies first (per rules above).
2. Coach gives feedback on the user’s *last message*, suggesting a next move in the cycle.
3. Keep everything in JSON format exactly as specified.

**Core Goal:**
Simulate realistic political disagreement while providing live coaching that helps the user stay calm, build rapport, and increase the chance of productive dialogue—mirroring Dr. Tamerius’s style and philosophy.'`;




  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    temperature: 0.7,
    messages: [
      { role: "system", content: systemPrompt },
      ...(topic
        ? [{ role: "system", content: `Current topic is: ${topic}.` }]
        : []),
      ...forOpenAI,
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "dualReply",
          description: "Return replies for both personas",
          parameters: {
            type: "object",
            properties: {
              uncle: { type: "string" },
              coach: { type: "string" },
            },
            required: ["uncle", "coach"],
          },
        },
      },
    ],
    tool_choice: { type: "function", function: { name: "dualReply" } },
  });

  /* 4️⃣  extract tool call ------------------------------------------- */
  const call =
    completion.choices[0].message.tool_calls?.[0] ??
    completion.choices[0].message.function_call;

  if (!call) throw new Error("Model did not call dualReply");

  const { uncle, coach } = JSON.parse(call.function.arguments);

  /* 5️⃣  send back to client ----------------------------------------- */
  const replies = [];
  if (coach) replies.push({ role: "coach", content: coach });
  if (uncle) replies.push({ role: "uncle", content: uncle });

  // Shows the number of tokens used
  console.log("Token usage:", completion.usage);

  return NextResponse.json({ messages: replies }, { headers: rateHeaders });
  
}


export async function GET() {
  // Lightweight info endpoint; does not consume a token.
  return NextResponse.json({ limit: 200 });
}

export async function HEAD() {
  // Return static limit header only; do not call the limiter so we don't consume.
  return new NextResponse(null, {
    status: 204,
    headers: {
      "X-RateLimit-Limit": "200",
    },
  });
}