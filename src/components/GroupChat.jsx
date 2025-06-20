// src/components/GroupChat.jsx
// iMessage‑style interactive group chat UI (user + Dr. T + Angry Uncle)
// Replaces <ChatBox/> in ClientPage.jsx.
// v2 – fixes nested‑array bug, auto‑migrates old localStorage, and
// guards against empty/invalid API replies.

'use client';
import { useState, useEffect, useRef } from 'react';
import GroupHeader from './GroupHeader';


/**
 * Topics offered on first launch. Feel free to reorder or extend.
 */
const TOPICS = [
  'Abortion',
  'Climate Change',
  'Gun Rights',
  'Healthcare',
  'Freedom of Expression'
];

/** Shared emoji avatars for each role */
const AVATAR = {
  user: '🫵', // you
  uncle: '😠',
  coach: '🧑‍🏫'
};

/**
 * Sanitises an arbitrary value into a valid {role, content} message or null.
 * Used when loading legacy localStorage that may contain nested arrays.
 */
function coerce(message) {
  if (!message) return null;
  if (Array.isArray(message)) return message.map(coerce).filter(Boolean);
  if (typeof message === 'object' && 'role' in message && 'content' in message)
    return message;
  return null;
}

/**
 * Flatten arbitrarily nested arrays one level (depth‑1 flatMap).
 */
function flatten(arr) {
  return arr.reduce((out, el) => {
    if (Array.isArray(el)) out.push(...flatten(el));
    else if (el) out.push(el);
    return out;
  }, []);
}

/**
 * Single chat bubble styled to match iOS Messages.
 * Blue bubbles = user. Gray bubbles = bots (Dr. T + Angry Uncle).
 * Emoji avatars + prefixed names for bots.
 */
function Bubble({ role, content, onSelect }) {
  const isUser = role === 'user';

  const base =
    'relative inline-block max-w-xs px-4 py-2 text-sm leading-snug shadow';

  // iMessage tails via ::before pseudo
  const userBubble =
    'bg-[#007aff] text-white rounded-2xl rounded-br-md before:absolute before:bottom-0 before:-right-1 before:border-t-8 before:border-t-transparent before:border-l-[10px] before:border-l-[#007aff] before:border-b-8 before:border-b-transparent';
  const botBubble =
    'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-50 rounded-2xl rounded-bl-md before:absolute before:bottom-0 before:-left-1 before:border-t-8 before:border-t-transparent before:border-r-[10px] before:border-r-gray-200 dark:before:border-r-gray-700 before:border-b-8 before:border-b-transparent';

  // prepend label for bots
  const label = !isUser ? (
    <p className="mb-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">
      {role === 'uncle' ? 'Angry Uncle' : 'Dr. T'}
    </p>
  ) : null;

  return (
    <div className={`my-1 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-xs">
        {label}
        <button
          className={`${base} ${isUser ? userBubble : botBubble}`}
          onClick={() => onSelect?.({ role, content })}
          aria-label="Select message"
        >
          <span className="mr-1 select-none">{AVATAR[role]}</span>
          {content}
        </button>
      </div>
    </div>
  );
}



/** Simple topic‑picker overlay shown on first load */
function TopicPicker({ onPick }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-white/90 p-6 text-center dark:bg-gray-900/90">
      <h3 className="text-lg font-semibold">Choose a topic to discuss</h3>
      <div className="flex flex-wrap justify-center gap-3">
        {TOPICS.map((t) => (
          <button
            key={t}
            className="rounded-full border px-4 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => onPick(t)}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

const LIMIT = 30;

export default function GroupChat() {
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [topic, setTopic] = useState(null); // null until chosen
  const bottomRef = useRef(null);
    // how many user messages so far?
  const userCount  = messages.filter(m => m.role === 'user').length;
  const remaining  = LIMIT - userCount;

  // reset handler for the ↺ button
  function resetChat() {
    localStorage.removeItem('aub_chat');
    setMessages([]);
    setTopic(null);          // optional: show topic picker again
  }

  // Load history ONCE on mount ── with migration for any nested‑array bug.
  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('aub_chat') || '[]');
    const migrated = flatten([coerce(raw)]);
    if (migrated.length) setMessages(migrated);
  }, []);

  // Persist & auto‑scroll
  useEffect(() => {
    if (messages.length) {
      localStorage.setItem('aub_chat', JSON.stringify(messages));
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Create initial onboarding once topic is picked and no history
  useEffect(() => {
    if (!topic || messages.length) return;

    const welcome = [
      {
        role: 'coach',
        content:
          `Welcome! Let’s practice discussing ${topic.toLowerCase()}. Your goal is to stay calm and curious.`
      },
      {
        role: 'uncle',
        content:
          `Oh boy, here we go again about ${topic.toLowerCase()}… you people never get it!`
      }
    ];
    setMessages(welcome);
  }, [topic]);

  /**
   * Submit user message → fetch OpenAI → render Dr. T + Angry Uncle replies.
   */
  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const next = [...messages, { role: 'user', content: input }];
    setMessages(next);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, topic })
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Server error');
      }

      const data = await res.json();
      const incoming = Array.isArray(data) ? data : data.messages;

      if (!Array.isArray(incoming) || !incoming.length)
        throw new Error('Empty reply from server');

      setMessages((m) => [...m, ...incoming]);
    } catch (err) {
      console.error('[GroupChat] sendMessage failed:', err);
      alert(err.message || 'Chat error—see console');
    }
  }

  return (
    <div className="relative flex h-full flex-col">
      {!topic && <TopicPicker onPick={setTopic} />}

      <GroupHeader remaining={remaining} onReset={resetChat} />

      {/* Messages */}
      <div className="flex-grow overflow-y-auto px-4 py-3">
        {messages.map((m, i) => (
          <Bubble
            key={i}
            role={m.role}
            content={m.content}
            onSelect={(msg) => console.log('Selected →', msg)}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={sendMessage}
        className="flex gap-2 border-t bg-white p-3 dark:bg-gray-900"
      >
        <input
          className="flex-grow rounded-full border px-4 py-2 text-sm dark:bg-gray-800"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={topic ? 'iMessage…' : 'Pick a topic first'}
          disabled={!topic}
        />
        <button
          className="rounded-full bg-[#007aff] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          disabled={!topic}
        >
          Send
        </button>
      </form>
    </div>
  );
}
