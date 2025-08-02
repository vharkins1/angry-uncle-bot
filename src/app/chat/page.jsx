import GroupChat from "@/components/GroupChat";

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
      <main className="flex min-h-screen flex-col">
        <GroupChat />
      </main>
    </>
  );
}