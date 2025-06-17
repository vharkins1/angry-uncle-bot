import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import rateLimit from '@/lib/rateLimit';   // keeps alias

const openai = new OpenAI();

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'local';
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: `You are “Angry Uncle”… (full prompt)`
        },
        ...messages
      ]
    });

    return NextResponse.json(completion.choices[0].message);
  } catch (err) {
    console.error('[api/chat] ❌', err);      // <- shows in terminal
    return NextResponse.json({ error: err.message ?? 'unknown' }, { status: 500 });
  }
}
