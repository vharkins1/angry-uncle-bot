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
            Angry Uncle Bot is a web app that helps you practice having hard conversations, with family, friends, 
            or anyone who sees the world differently. Powered by GPT, it simulates real-time, 
            emotionally charged discussions so you can learn to stay calm, listen actively, 
            and respond thoughtfully. Every interaction is dynamic, personal, and unpredictable, just like real life.
          </p>
        </div>

        {/* Tiles Section */}
          <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Privacy & Data Use
          </h2>
          <p className="max-w-2xl text-white/90 text-lg mb-2">
            Your privacy matters. We designed Angry Uncle Bot to be safe and anonymous.
          </p>
          </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          <Tile
            label="No Login Needed"
            description="You can start chatting immediately — no account, no email, no hassle."
          />
          <Tile
            label="Local Storage Only"
            description="Your conversation history is stored in your own browser, not on our servers."
          />
          <Tile
            label="Private & Anonymous"
            description="Messages are sent anonymously to OpenAI to generate responses. We don’t track who you are."
          />
          </div>
          {/* <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Style & Technology
          </h2>
          <p className="max-w-2xl text-white/90 text-lg mb-2">
            A lightweight chatbot using modern technology, private, secure, speedy.
          </p>
          </div> */}

          {/* <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mt-6">
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
          <Tile
            label="Vercel Hosting"
            description="Deployed and served via Vercel for blazing-fast global performance and zero server maintenance."
          />
          <Tile
            label="Redis Rate Limiting"
            description="Upstash Redis handles chat limits to prevent spam and keep things fair for all users."
          />
          <Tile
            label="OpenAI API"
            description="We use GPT-3.5 Turbo through OpenAI's API to generate each response in real time."
          />
        </div> */}
        {/* Privacy Detail Paragraph */}
        <div className="mt-8 text-white/80 text-base max-w-2xl">
          <p>
            All chat messages are processed by OpenAI’s API for real-time replies. We never send personal or identifying information. 
            OpenAI does not store or use these conversations for model training. 
            You can read more about their privacy policies <a
              href="https://openai.com/enterprise-privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#fbb041] hover:text-white"
            >here</a>.
          </p>
        </div>  

        {/* CTA */}
        <div className="mt-8 text-white/80 text-base">
          <p>
            Questions or ideas?{" "}
            <a href="/contact" className="underline text-[#fbb041] hover:text-white">
              Get in touch
            </a>
            .
          </p>
        </div>
      </div>
    </PageShell>
  );
}
