// src/app/page.jsx
import ChatBox from "@/components/GroupChat";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <main className="flex min-h-screen flex-col bg-white">
        <ChatBox />
      </main>
      <Analytics />
    </>
  );
}
