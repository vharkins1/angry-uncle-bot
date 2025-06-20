// src/app/page.jsx
import ChatBox from "@/components/GroupChat";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col">
        <ChatBox />
      </main>
      <Analytics />
    </>
  );
}
