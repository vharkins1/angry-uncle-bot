// src/lib/openai.js
import OpenAI from 'openai';

/**
 * Singleton OpenAI client.
 * The key must be in your env:  OPENAI_API_KEY=sk-...
 * (Next.js will bundle it only in the server environment.)
 */
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
