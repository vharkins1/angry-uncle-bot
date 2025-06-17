// src/app/page.jsx
import ChatBox from '@/components/ChatBox';
import LightDarkToggle from '@/components/LightDarkToggle';
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold">Angry Uncle Bot</h1>
          <LightDarkToggle />
        </header>
        <ChatBox />
      </main>
      <Analytics />
    </>
  );
}
