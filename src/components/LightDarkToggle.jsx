'use client';
import { useEffect, useState } from 'react';
import { BsSun, BsMoon } from 'react-icons/bs';

export default function LightDarkToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only run on client
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme');
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(stored === 'dark' || (!stored && prefers));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark, mounted]);

  if (!mounted) return null;
  return (
    <button
      onClick={() => setIsDark((prev) => !prev)}
      className="p-2 text-2xl border rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? <BsSun /> : <BsMoon />}
    </button>
  );
}
