// src/app/chat/page.jsx

import GroupChat from "@/components/GroupChat";
import RevampGroupChat from "@/components/revampGroupChat";
/**
 * Chat page – mounts the interactive GroupChat component.
 * GroupChat itself is a client component that uses hooks/web‑sockets,
 * this wrapper is also marked `"use client"`.
 */

export const metadata = {
  title: "Chat | Angry Uncle Bot",
  description: "Practice tough conversations with Angry Uncle Bot",
};

export default function ChatPage() {
  return (
        <>
      <main className="flex flex-1 min-h-0 flex-col">
        <RevampGroupChat/>
      </main>
    </>
  );
}