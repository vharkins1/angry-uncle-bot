import React from 'react';

export default function PageShell({ children, className = '' }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#3e4e8b] to-black text-white">
      <section className={`mx-auto w-full max-w-6xl px-6 py-16 flex-1 ${className}`.trim()}>
        {children}
      </section>
    </main>
  );
}
