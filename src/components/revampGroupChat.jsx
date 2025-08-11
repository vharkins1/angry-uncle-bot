// src/components/revampGroupChat.jsx
"use client";
import "../app/globals.css";
import React, { useState, useEffect, useRef } from 'react';
import GroupHeader from './GroupHeader';
import Bubble from './Bubble';
import TypingBubble  from './TypingBubble';
import TopicPicker from './TopicPicker';
import { IoIosArrowUp } from 'react-icons/io';


const LIMIT = 20;
//const WARN_THRESHOLDS = [50, 20, 10];


function FeedbackPrompt({ onFeedback, onReset, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="relative bg-white text-black rounded-lg shadow-lg p-6 max-w-sm w-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-5 text-lg text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-lg font-bold mb-4">Out of turns!</h2>
        <p className="mb-6">Would you like to give feedback or reset the chat?</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onReset}
            className="rounded-md bg-gray-300 px-4 py-2 hover:brightness-85"
          >
            Reset Chat
          </button>
          <button
            onClick={onFeedback}
            className="rounded-md bg-[#fbb041] px-4 py-2 font-semibold text-black hover:brightness-85"
          >
            Give Feedback
          </button>
        </div>
      </div>
    </div>
  );
}


export default function RevampGroupChat() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState('');
    const [topic, setTopic] = useState('');
    const [serverRL, setServerRL] = useState({ limit: null, remaining: null, reset: null });
    const [locked, setLocked] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const rootRef = useRef(null);
    

    {/* Get Static Limit Once */}
    useEffect(() => {
        (async () => {
            try {
                const r = await fetch('/api/chat', { method: 'HEAD' });
                const limit = Number(r.headers.get('X-RateLimit-Limit')) || null;
                setServerRL(s => ({ ...s, limit }));
            } catch {}
        })();
    }, []);


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
    
    const turns_remaining = Math.max(0, LIMIT - messages.filter((m) => m.role === 'user').length);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('aub_chat') || '[]');
        if (Array.isArray(stored) && stored.length) setMessages(stored);
    }, []);

    useEffect(() => {
        const savedTopic = localStorage.getItem('aub_topic');
        if (savedTopic) setTopic(savedTopic);
    }, []);

    async function sendMessage(e) {
    e.preventDefault();
    if (turns_remaining === 0) {
      setShowPrompt(true);
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

        const limit = Number(res.headers.get('X-RateLimit-Limit'));
        const remaining = Number(res.headers.get('X-RateLimit-Remaining'));
        const reset = Number(res.headers.get('X-RateLimit-Reset'));

        setServerRL(prev => ({
        limit: Number.isNaN(limit) ? prev.limit : limit,
        remaining: Number.isNaN(remaining) ? prev.remaining : remaining,
        reset: Number.isNaN(reset) ? prev.reset : reset,
        }));

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

    useEffect(() => {
      if (messages.length) {
        localStorage.setItem('aub_chat', JSON.stringify(messages));
      }
    }, [messages]);

    function handleReset() {
      localStorage.removeItem('aub_chat');
      localStorage.removeItem('aub_topic');
      setMessages([]); setTopic(''); setInput('');
    }




  // 1) Lock scroll on the messages area while input focused (iOS needs passive:false)
  React.useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const onTouchMove = (e) => {
      if (locked) {
        // prevent scroll so iOS keeps keyboard open
        e.preventDefault();
      }
    };
    scroller.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => scroller.removeEventListener('touchmove', onTouchMove);
  }, [locked]);

  // 2) Blur input if user taps outside the form
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onPointerDown = (e) => {
      const form = root.querySelector('form[data-chat-input]');
      if (!form) return;
      const clickedInsideForm = form.contains(e.target);
      if (!clickedInsideForm && document.activeElement === inputRef.current) {
        inputRef.current.blur();     // closes keyboard
        setLocked(false);            // re-enable scrolling
      }
    };
    root.addEventListener('pointerdown', onPointerDown);
    return () => root.removeEventListener('pointerdown', onPointerDown);
  }, []);

  // 3) Toggle lock on focus/blur
  const onFocus = () => setLocked(true);
  const onBlur  = () => setLocked(false);

  return (
    <div ref={rootRef} className="flex min-h-[100svh] flex-col overflow-hidden">
      {/* Topic Picker */}
      {!topic && (<TopicPicker onPick={(t) => {
        setTopic(t);
        localStorage.setItem('aub_topic', t);
        }} />)}

      {/* Out of Turns & Feedback Form */}
      {showPrompt && (
        <FeedbackPrompt
          onFeedback={() => {
            window.open("https://docs.google.com/forms/d/e/1FAIpQLSfHn2Ro_HqV9bGjQUhtBBSL7-ZySem_GbByV6B290MbncXStw/viewform", "_blank");
            setShowPrompt(false);
          }}
          onReset={() => {
            handleReset();
            setShowPrompt(false);
          }}
          onClose={() => setShowPrompt(false)} // X button closes it
        />
      )}

      {/* Header */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-35 w-full max-w-[45rem] px-13 sm:px-10">
        <div className="flex items-center justify-between gap-3 rounded-b-lg bg-[rgba(255,255,255,0.08)] px-4 py-2.5 text-sm text-white shadow-lg shadow-black/30 backdrop-blur-md">
          
          {/* Text cluster */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold truncate">{topic}</span>
            <span className="text-white/60 shrink-0">•</span>
            <span className="text-white/80 shrink-0">{turns_remaining} turns left</span>
            <span className="hidden md:inline text-white/60 shrink-0">| {serverRL.remaining} total left today</span>
          </div>

          {/* Reset */}
          <button
            type="button"
            className="h-9 w-9 rounded-full bg-[#fbb041] font-bold text-black hover:brightness-90 grid place-items-center"
            onClick={handleReset}
            title="Reset chat"
          >
            ↺
          </button>
        </div>
      </div>


      {/* Scrollable messages */}
      <div ref={scrollRef} className={`flex-1 overflow-y-auto overscroll-contain px-4 pt-12 pb-28 ${locked ? 'touch-none' : ''}`}>
        <div className="mx-auto w-full max-w-[50rem] px-4 pt-12 pb-0">
          {messages.map((m, i) => (
            <Bubble key={i} role={m.role} content={m.content} />
          ))}
          {loading && <TypingBubble />}
        </div>
      </div>

      {/* Input */}
      <form data-chat-input onSubmit={sendMessage} className="fixed bottom-0 left-1/2 -translate-x-1/2 z-20 w-full max-w-[43rem] rounded-lg backdrop-blur">
        <div className="px-4 py-3 flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            inputMode="text"
            enterKeyHint="send"
            className="flex-1 rounded-full bg-white/20 px-3 py-2 leading-6 text-white placeholder-white/60 focus:outline-none"
            placeholder="Type your message…"
            disabled={loading || !topic}
          />
          <button
     type="submit"
     disabled={!topic || !input.trim() || loading}
     className="h-10 w-10 flex items-center justify-center rounded-full bg-[#fbb041] font-bold text-black disabled:opacity-60 hover:brightness-95"
   >
    <IoIosArrowUp className="text-xl text-black" />
   </button>
        </div>

         <h5 className="text-center text-xs text-white/70 mb-2">
    BETA —{' '}
    <a
      href="https://docs.google.com/forms/d/e/1FAIpQLSfHn2Ro_HqV9bGjQUhtBBSL7-ZySem_GbByV6B290MbncXStw/viewform"
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-blue-400 hover:text-blue-300"
    >
      Give Feedback here
    </a>
  </h5>
        
        <div className="h-[env(safe-area-inset-bottom)]" />
      </form>
    </div>
  );




}
