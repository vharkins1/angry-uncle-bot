import React from "react";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-12 text-center font-sans bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-semibold mb-4 text-gray-900 dark:text-gray-100">About</h1>
      <p className="text-gray-700 mb-12 leading-relaxed dark:text-gray-300">
        Angry Uncle Bot is a web app that helps you practice having hard conversations—with family, friends, 
        or anyone who sees the world differently. Powered by GPT, it simulates real-time, 
        emotionally charged discussions so you can learn to stay calm, listen actively, 
        and respond thoughtfully. Every interaction is dynamic, personal, and unpredictable, just like real life.
      </p>
      <div className="grid gap-10">
        <section>
          <h2 className="text-2xl font-medium text-gray-900 mb-2 dark:text-gray-100">Clean Design</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Inspired by modern interfaces, we focus on simplicity and readability.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-medium text-gray-900 mb-2 dark:text-gray-100">Modern Tech</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Built with Next.js, React, and Tailwind CSS for a fast, responsive experience.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-medium text-gray-900 mb-2 dark:text-gray-100">Witty Replies</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Powered by OpenAI GPT-3.5 Turbo to add dynamic generative conversations, giving you personalized and feedback in each conversation.
          </p>
        </section>
      </div>
    </main>
  );
}