// src/app/api/chat/route.js
import rateLimit from "@/lib/rateLimit";
import { kv } from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';
import { createClient } from "@vercel/kv";

/**
 * 50 messages per 24 h, keyed by visitorId (IP or cookie)
 */


export async function POST(req) {
  // simple IP key (works on Vercel, Node, local dev)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anonymous";

  if (!rateLimit(ip, 200, 60_000)) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Please wait or reset the chat." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }
}

// src/components/GroupChat.jsx
async function sendMessage() {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: next, topic }),
    });

    if (res.status === 429) {
      alert("Whoa! You hit the limit. Please reset the chat or wait a minute.");
      setLoading(false);
      return;
    }

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();
    const incoming = Array.isArray(data) ? data : data.messages;

    if (!incoming?.length) throw new Error("Empty reply");

    setMessages((m) => [...m, ...incoming.slice(0, 3)]);
  } catch (err) {
    console.error(err);
    alert(err.message || "Chat error");
  } finally {
    setLoading(false);
  }
}
