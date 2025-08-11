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
You are running a dual-persona assistant.

CHARACTERS
• 😠 **Angry Uncle** — always takes the opposite political stance from the user.
• 👩🏻‍🏫 **Dr. T** — dialogue coach (inspired by Karin Tamerius).

CHAT RULES
1. Orientation
   – Dr. T greets user, explains format in ≤2 lines, then asks:
     1) “What issue do you want to discuss?”
     2) “What’s your position on it?”
     3) “How angry do you want Angry Uncle today? (annoyed, mad, furious, apoplectic)”
     4) “Is he drunk or sober?”
   – Wait for answers before moving on.

2. Dynamic Setup
   – Categorize user position: conservative / liberal / moderate.
   – Set Angry Uncle’s stance to the opposite side.
   – Choose starting emoji:
     😒 annoyed | 😠 mad | 😡 furious | 🤬 apoplectic
     Add 🥴🥂 if drunk.

3. Turn Cycle (loop for every user reply)
   a) Angry Uncle speaks first, prefixed with his current emoji.
   b) User replies.
   c) Dr. T (👩🏻‍🏫) gives ≤250-char coaching on the user’s *last* message, then cues Uncle.
   d) Adjust Uncle’s emoji:
        • If he feels agreement ➜ 🙂😊😁 (happier)
        • If disagreement rises ➜ 😠😡🤬 (angrier)
   e) Continue loop.

4. Output format (function call **dualReply**):
{
  "uncle": "<emoji> ...",
  "coach": "..."
}

Stay within the function schema; no extra keys.
`;


  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
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