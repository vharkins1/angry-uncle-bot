'use client';
import { useState, useEffect, useRef } from 'react';
import Message from './Message';

export default function ChatBox() {
  // 1️⃣ First render = empty
  const [messages, setMessages] = useState([]);
  const [input, setInput]   = useState('');   // <- renamed consistently
  const bottomRef = useRef(null);

  // 2️⃣ Load history after mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('aub_chat') || '[]');
    setMessages(stored);
  }, []);

  // 3️⃣ Persist & scroll
  useEffect(() => {
    if (messages.length) {
      localStorage.setItem('aub_chat', JSON.stringify(messages));
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

    async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const next = [...messages, { role: 'user', content: input }];
    setMessages(next);
    setInput('');

    try {
        const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next })
        });
        const data = await res.json();

        if (res.ok) {
        // OpenAI returned a proper assistant message
        setMessages(m => [...m, data]);        // data has role & content
        } else {
        alert(data.error || 'OpenAI error – see console');
        // DON’T push anything to messages, so no malformed object is saved
        }
    } catch (err) {
        console.error('chat fetch failed', err);
        alert('Network error – see console');
    }
    }


  return (
    <>
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((m, i) => <Message key={i} {...m} />)}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 border-t p-4">
        <input
          className="flex-grow rounded border px-3 py-2 dark:bg-gray-800"
          value={input}                         // matches state name
          onChange={e => setInput(e.target.value)}
          placeholder="Ask the angry uncle…"
        />
        <button className="rounded bg-blue-600 px-4 py-2 text-white">
          Send
        </button>
      </form>
    </>
  );
}
