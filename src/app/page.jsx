// src/app/page.jsx
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import Tile from '../components/Tile';
import PageShell from '../components/PageShell';

/* ------------------------------------------------------------
   TILE DATA – edit here only
   shape: 'rect' (16/9) | 'square' | 'portrait'
   className: extra Tailwind classes (e.g. 'col-span-2 row-span-2')
   textClass: Tailwind classes for the label
---------------------------------------------------------------- */
const IMG = "/images/PeopleHugging.webp";
const tiles = [
  { label: "I’m New Here", href: "/about", img: "/images/bkg-blue1.jpg", className: "h-52" },
  { label: "Ready to Start Talking", href: "/chat", img: "/images/bkg-blue2.jpg", className: "h-52" },
  { label: "Join Smart", href: "https://www.joinsmart.org", external: true, img: "/images/bkg-red1.jpg", className: "h-52" },
  { label: "Resources", href: "https://www.joinsmart.org/resources/", img: "/images/bkg-red1.jpg", className: "h-52" },
  { label: "Have Some Ideas Let Us Know", img: "/images/SmartPoliticsLogo.png", className: "h-52" },
  { label: "Coming Soon", img: "/images/bkg-blue2.jpg", className: "h-52" },
];

/* ------------------------------------------------------------ */

export default function Home() {
  return (
    <>
      <PageShell className="py-12">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-white inline-block">
          Explore Angry Uncle Bot
          <span className="block h-1 w-16 bg-[#dd494f] mt-2 rounded"></span>
        </h1>

        {/* Responsive grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t, i) => (
            <Tile key={i} {...t} index={i} />
          ))}
        </div>
      </PageShell>
      <Analytics />
    </>
  );
}
