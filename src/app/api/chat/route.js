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
You are simulating two personas in a political-dialogue practice chat.

Return BOTH replies by calling **dualReply** with JSON:
{ "uncle": "<Angry Uncle text ≤200 chars>", "coach": "<Dr. T text ≤200 chars>" }

• Angry Uncle must answer first, be confrontational, opposite the user's stance.
• Dr. T (Karin Tamerius style) follows with calm coaching: validate, ask open Qs.
`;

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
    return NextResponse.json({
      messages: [
        { role: 'uncle', content: uncle },
        { role: 'coach', content: coach }
      ]
    });
  } catch (err) {
    console.error('[api/chat]', err);
    return NextResponse.json(
      { error: err.message || 'Internal error' },
      { status: 500 }
    );
  }
}
