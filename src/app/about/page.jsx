import React from "react";
import Tile from '../../components/Tile';
import PageShell from '../../components/PageShell';

export default function AboutPage() {
  return (
    <PageShell className="py-12">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-semibold mb-4 text-white inline-block">
            About
            <span className="block h-1 w-16 bg-[#dd494f] mt-2 rounded"></span>
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-white/90">
            Angry Uncle Bot is a web app that helps you practice having hard conversations—with family, friends, 
            or anyone who sees the world differently. Powered by GPT, it simulates real-time, 
            emotionally charged discussions so you can learn to stay calm, listen actively, 
            and respond thoughtfully. Every interaction is dynamic, personal, and unpredictable, just like real life.
          </p>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          <Tile
            label="Clean Design"
            description="Inspired by modern interfaces, we focus on simplicity and readability."
          />
          <Tile
            label="Modern Tech"
            description="Built with Next.js, React, and Tailwind CSS for a fast, responsive experience."
          />
          <Tile
            label="Witty Replies"
            description="Powered by OpenAI GPT-3.5 Turbo to add dynamic generative conversations, giving you personalized and feedback in each conversation."
          />
        </div>
      </div>
    </PageShell>
  );
}