// ────────────────────────────────────────────────────────────
// src/app/api/chat/route.js
// Next 15 (app router) – POST /api/chat
// Returns { messages: [ {role:'uncle',content}, {role:'coach',content} ] }
// ────────────────────────────────────────────────────────────
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/** Helper: flatten anything weird that slipped into history */
const toFlatHistory = (arr = []) =>
  arr
    .flat(Infinity)
    .filter(
      m => m && typeof m === 'object' && !Array.isArray(m) && 'role' in m
    );

/** POST handler */
export async function POST(req) {
  try {
    /* 1️⃣  Input -------------------------------------------------------- */
    const { messages = [], topic } = await req.json();
    const history = toFlatHistory(messages);

    /* 2️⃣  Remap roles for OpenAI -------------------------------------- */
    const forOpenAI = history.map(({ role, content }) => ({
      role: role === 'user' ? 'user' : 'assistant',
      content
    }));

    /* 3️⃣  System prompt + tool schema --------------------------------- */
    const systemPrompt = `
You are orchestrating a practice political dialogue with THREE voices:

1. 😒/😠/😡/🤬 Angry Uncle – an argumentative relative who ALWAYS takes the stance *opposite* the user on the chosen issue.  
   • His message MUST start with a single emoji that reflects his current mood:  
     😒 annoyed | 😠 mad | 😡 furious | 🤬 apoplectic | 🙂 content | 😊 pleased | 😁 happy | 🥴🥂 drunk.  
   • Update the emoji every turn: happier when he agrees with the user, angrier when he disagrees.  
   • If he is drunk, always use 🥴🥂 regardless of anger.  
   • Keep his text ≤ 200 characters.

2. 👩🏻‍🏫 **Dr. T:** – a calm conversation‑coach inspired by Karin Tamerius.  
   • Greets the user with a *one‑sentence* overview, immediately introduces Angry Uncle, gives ≤ 250‑char tactical advice, and cues him with “👉 Uncle?”.  No set‑up questions for now.
   • After **every** user reply *and before* Uncle speaks, give concise (< 250 chars incl. emojis) tactical feedback based on the Persuasion Conversation Cycle and Pyramid of Trust, then cue Uncle to respond (e.g. “👉 Uncle?”).

3. The **User**.

Conversation cycle thereafter: Uncle ➜ User ➜ Dr. T ➜ Uncle …

Return BOTH persona messages for the *current* step by calling **dualReply** *exactly once* with JSON:

{ "uncle": "<Angry Uncle text>", "coach": "<Dr. T text>" }

• If a persona is silent this turn, pass an empty string "" for its value.  
• Do **not** output anything except that JSON object.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        ...(topic
          ? [
              {
                role: 'system',
                content: `Current topic is: ${topic}. Use it in replies.`
              }
            ]
          : []),
        ...forOpenAI
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'dualReply',
            description: 'Return replies for both personas',
            parameters: {
              type: 'object',
              properties: {
                uncle: { type: 'string', description: 'Angry Uncle reply' },
                coach: { type: 'string', description: 'Dr. T reply' }
              },
              required: ['uncle', 'coach']
            }
          }
        }
      ],
      // ask the model to *use* that function every turn
      tool_choice: { type: 'function', function: { name: 'dualReply' } }
    });

    /* 4️⃣  Extract arguments (SDK 4.x has tool_calls array) ------------ */
    const choice = completion.choices[0];
    const toolCall =
      choice.message.tool_calls?.[0] ?? choice.message.function_call; // fallback for SDK 0.x

    if (!toolCall)
      throw new Error('Model did not call dualReply as expected.');

    const { uncle, coach } = JSON.parse(toolCall.function.arguments);

    /* 5️⃣  Return to client -------------------------------------------- */
    const replies = [];
    if (coach) replies.push({ role: 'coach', content: coach });
    if (uncle) replies.push({ role: 'uncle', content: uncle });

    return NextResponse.json({ messages: replies });
  } catch (err) {
    console.error('[api/chat]', err);
    return NextResponse.json(
      { error: err.message || 'Internal error' },
      { status: 500 }
    );
  }
}
