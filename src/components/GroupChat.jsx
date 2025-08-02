'use client';
import { useId } from 'react';
import { useState, useEffect, useRef } from 'react';
import { IoIosArrowUp } from 'react-icons/io';

/* ---------- Constants ---------- */

const TOPICS = [
  'Abortion',
  'Climate Change',
  'Gun Rights',
  'Healthcare',
  'Freedom of Expression',
];

const AVATAR = {
  user: '🫵',
  uncle: '😠',
  coach: '🧑‍🏫',
};

const LIMIT = 3; // user‑message limit

/* ---------- Helper Components ---------- */

function Bubble({ role, content }) {
  const isUser = role === 'user';
  const labelText =
    role === 'user' ? 'You' : role === 'uncle' ? 'Angry Uncle' : 'Dr. T';

  // Ring color by role
  const ring = {
    coach: 'ring-green-500',
    uncle: 'ring-red-500',
    user: 'ring-gray-500',
  }[role] || 'ring-gray-500';

  // Map Angry Uncle's leading emoji to the avatar; strip it from bubble text
  const UNCLE_EMOJIS = ['🥴🥂', '😒', '😠', '😡', '🤬', '🙂', '😊', '😁'];

  let avatarEmoji = AVATAR[role] || '🙂';
  let displayContent = content;

  if (role === 'uncle' && typeof content === 'string') {
    const trimmed = content.trimStart();
    const found = UNCLE_EMOJIS.find(e => trimmed.startsWith(e));
    if (found) {
      avatarEmoji = found;
      // Remove the leading emoji and any immediate whitespace from the message body
      displayContent = trimmed.slice(found.length).trimStart();
    } else {
      avatarEmoji = AVATAR.uncle; // fallback to default if no emoji was found
    }
  }

  // Avatar + text alignment container
  const containerClass = `my-3 flex ${isUser ? 'justify-end' : 'justify-start'}`;
  const rowClass = `flex items-start justify-between gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`;


  // Avatar emoji styling
  const avatarClass = `grid h-8 w-8 shrink-0 place-content-center rounded-full bg-[rgba(255,255,255,0.08)] text-xl ring-2 ${ring} select-none`;


  // Bubble appearance (colors, shape)
  const bubbleBase =
  'flex flex-col w-fit max-w-[70vw] sm:max-w-[320px] leading-1.5 px-3 py-1 shadow-sm';

  const bubbleShape = isUser
    ? 'bg-[#007aff] text-black rounded-xl rounded-tr-none'
    : 'bg-[rgba(255,255,255,0.08)] text-white rounded-xl rounded-tl-none';
  const bubbleClass = `${bubbleBase} ${bubbleShape} focus:outline-none`;


  // Name + time styling
  const headerClass = `flex items-center space-x-2 rtl:space-x-reverse ${
    isUser ? 'justify-end' : 'justify-start'
  }`;
  const nameClass = 'text-sm font-semibold text-white'


  // Message body
  const messageClass = 'text-sm font-normal py-1 text-white'


  return (
    <div className={containerClass}>
      <div className={rowClass}>
        {/* Avatar */}
        <div className={`${avatarClass} mt-[20px]`} title={labelText} aria-hidden="true">
          {avatarEmoji}
        </div>

        {/* Outer message container */}
        <div className="flex flex-col items-start">
          {/* Name and time (above bubble) */}
          <div className={'flex items-center space-x-2 text-xs mb-1 ' +(isUser ? 'ml-auto' : 'mr-auto')}>
            <span className="font-medium">
              {labelText}
            </span>
          </div>

          {/* Message bubble */}
          <div className={bubbleClass}>
            <p className={messageClass}>{displayContent}</p>
          </div>
        </div>
      </div>
    </div>
  );
}





function TypingBubble() {
  return (
    <div className="my-1 flex justify-start">
      <div className="max-w-xs">
        <div className="relative inline-flex w-16 items-center justify-center gap-1 rounded-[20px] bg-[rgba(255,255,255,0.08)] px-4 py-2">
          <span className="animate-pulse">•</span>
          <span className="animate-pulse delay-150">•</span>
          <span className="animate-pulse delay-300">•</span>
        </div>
      </div>
    </div>
  );
}

function TopicPicker({ onPick }) {
  return (
    <div className="absolute inset-0 z-40 grid place-content-center gap-4 bg-[rgba(0,0,0,0.75)] backdrop-blur-md p-6 text-center">
      <h3 className="text-lg font-semibold text-white inline-block">
        Choose a topic to discuss
      </h3>
      <div className="flex flex-wrap justify-center gap-5">
        {TOPICS.map((t) => (
          <button
            key={t}
            className="rounded-full border border-[#fbb041] px-8 py-3 text-lg text-white hover:bg-[#fbb041] hover:text-black transition"
            onClick={() => {
              onPick(t);
              localStorage.setItem('aub_topic', t);
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Main Component ---------- */

export default function GroupChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  /* Load history once */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('aub_chat') || '[]');
    if (Array.isArray(stored) && stored.length) setMessages(stored);
  }, []);

  /* Restore topic once */
  useEffect(() => {
    const savedTopic = localStorage.getItem('aub_topic');
    if (savedTopic) setTopic(savedTopic);
  }, []);

  /* Persist & auto‑scroll */
  useEffect(() => {
    if (messages.length) {
      localStorage.setItem('aub_chat', JSON.stringify(messages));
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  /* Bootstrap conversation once a topic is picked and no history */
  useEffect(() => {
    if (!topic || messages.length) return;
    setMessages([
      {
        role: 'coach',
        content: `Welcome! Let’s practice discussing ${topic.toLowerCase()}. Your goal is to stay calm and curious.`,
      },
      {
        role: 'uncle',
        content: `Oh boy, here we go again about ${topic.toLowerCase()}… you people never get it!`,
      },
    ]);
  }, [topic]);

  const remaining = Math.max(
    0,
    LIMIT - messages.filter((m) => m.role === 'user').length
  );

  async function sendMessage(e) {
    e.preventDefault();
    if (remaining === 0) {
      alert("Turn limit reached. Please reset the chat to start a new round.");
      return;
    }
    if (!input.trim() || loading) return;

    const next = [...messages, { role: 'user', content: input }];
    setMessages(next);
    setLoading(true);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, topic }),
      });

      // If the server returns 429 (rate‑limit) inform the user and bail early
      if (res.status === 429) {
        alert("Whoa! You hit the rate limit. Please reset the chat or wait a minute.");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error('Server error');

      const data = await res.json();
      const incoming = Array.isArray(data) ? data : data.messages;

      if (!incoming?.length) throw new Error('Empty reply');

      setMessages((m) => [...m, ...incoming.slice(0, 3)]); // cap spam
    } catch (err) {
      console.error(err);
      alert(err.message || 'Chat error');
    } finally {
      setLoading(false);
    }
  }

  /* ---------- Render ---------- */

  return (
    <div className="relative flex flex-col min-h-screen items-center bg-gradient-to-br from-[#3e4e8b] to-black text-white">
      <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-0 sm:px-4">
        {!topic && <TopicPicker onPick={setTopic} />}

        {/* Header */}
        <div
          className="sticky top-0 -mt-6 z-35 mx-auto flex  max-w-[calc(100%-6.5rem)] sm:max-w-2xl items-center justify-between gap-4 rounded-b-lg bg-[rgba(255,255,255,0.08)] px-6 py-3 text-sm text-white shadow-lg shadow-black/30 backdrop-blur-md"
        >
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <h2 className="text-m font-bold m-0">{topic ?? 'Pick a topic'}</h2>
              <span className="text-sm text-white/80">| {remaining} turns left</span>
            </div>
            <span className="block h-1 w-16 bg-[#dd494f] mt-1 rounded" />
          </div>
          <button
            className="rounded-xl bg-[#fbb041] px-2 py-.5 text-lg font-bold text-black hover:brightness-90"
            onClick={() => {
              localStorage.removeItem('aub_chat');
              localStorage.removeItem('aub_topic');
              setMessages([]);
              setTopic(null);
            }}
          >
            ↺
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 pt-12 pb-25">
          {messages.map((m, i) => (
            <Bubble key={i} role={m.role} content={m.content} />
          ))}
          {loading && <TypingBubble />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 flex w-[95%] max-w-3xl items-center gap-2 rounded-xl bg-[rgba(255,255,255,0.04)] backdrop-blur px-4 py-3 shadow-lg"
      >
        <input
          className="flex-1 rounded-full bg-[rgba(255,255,255,0.08)] px-4 py-2 text-white placeholder-white/60 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={topic ? 'Type a message…' : 'Pick a topic first'}
          disabled={!topic}
        />
        <button
          className="grid h-10 w-10 place-content-center rounded-full bg-[#fbb041] text-black disabled:bg-[#fbb041]/60 disabled:opacity-60 hover:brightness-90"
          disabled={!topic || !input.trim()}
        >
          <IoIosArrowUp className="text-xl text-black" />
        </button>
      </form>
    </div>
  );
}
