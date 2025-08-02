/* eslint react-hooks/exhaustive-deps: 0 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LightDarkToggle from "@/components/LightDarkToggle";
import {
  Bars3Icon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";

/**
 * Responsive slide-out menu:
 * - Hamburger in top-left always visible.
 * - On desktop: panel slides out from left (width 15rem).
 * - On mobile: panel takes full screen.
 * - Clicking backdrop or close button dismisses.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);

  // close on Escape + body scroll lock
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // lock scroll and reset padding when menu state changes
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      {/* Menu toggle button */}
      <div className="fixed top-2 left-2 z-50">
        <button
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
          className="p-2 rounded-md bg-[rgba(255,255,255,0.08)] text-white shadow ring-1 ring-inset ring-white/20 hover:bg-[#fbb041] hover:text-black transition"
        >
          {open ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-60 bg-black/40 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Slide-out panel */}
      <aside className={`fixed top-0 left-0 bottom-0 z-60 flex flex-col bg-[#1f2a44] text-white transition-transform duration-300 shadow-lg ${open ? "translate-x-0" : "-translate-x-full"} w-full md:w-60`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#dd494f]/40">
          <h1 href="/" className="text-xl font-bold">
            Angry Uncle Bot
            <span className="block h-1 w-16 bg-[#dd494f] mt-1 rounded" />
          </h1>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-[rgba(255,255,255,0.1)]"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <NavItem
            href="/"
            label="Explore"
            icon={<HomeIcon className="h-5 w-5" />}
            onClick={() => setOpen(false)}
          />
          <NavItem
            href="/chat"
            label="Chat"
            icon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
            onClick={() => setOpen(false)}
          />
          <NavItem
            href="/about"
            label="About"
            icon={<InformationCircleIcon className="h-5 w-5" />}
            onClick={() => setOpen(false)}
          />
          <NavItem
            href="/contact"
            label="Contact Us"
            icon={<EnvelopeIcon className="h-5 w-5" />}
            onClick={() => setOpen(false)}
          />
        </nav>

      </aside>
    </>
  );
}

function NavItem({ href, label, icon, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded px-3 py-2 text-white/90 hover:bg-[#fbb041] hover:text-black transition"
    >
      <span className="h-5 w-5">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
