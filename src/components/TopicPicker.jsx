// src/components/TopicPicker.jsx
import { useEffect } from "react";

const TOPICS = [
  'Abortion',
  'Climate Change',
  'Gun Rights',
  'Healthcare',
  'Freedom of Expression',
  'Immigration',
  'LGBTQ+ Rights',
  'Racial Justice',
  'Education Reform',
];

export default function TopicPicker({ onPick }) {
  // lock background scroll while the picker is mounted
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm overflow-y-auto">
      {/* flex center; allow page-size scrolling */}
      <div className="min-h-full flex items-center justify-center p-4">
        {/* panel with its own max height */}
        <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[rgba(62,78,139,0.25)]">
          {/* header */}
          <div className="px-6 pt-6 pb-4">
            <h3 className="text-2xl font-semibold text-white inline-block">
              Choose a topic to discuss
            </h3>
            <span className="block h-1 w-16 bg-[#dd494f] mt-3 rounded" />
          </div>

          {/* scrollable grid area */}
          <div className="px-6 pb-6">
            <div className="max-h-[60vh] overflow-y-auto pr-1 overscroll-contain">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      onPick(t);
                      localStorage.setItem("aub_topic", t);
                    }}
                    className={[
                      "group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300",
                      "hover:scale-[1.02] hover:shadow-2xl",
                      "border border-white/10 bg-[rgba(255,255,255,0.06)]",
                      "h-24 px-4 text-left",
                    ].join(" ")}
                  >
                    <div className="absolute inset-0 backdrop-blur-[2px] bg-[rgba(62,78,139,0.35)] transition-opacity group-hover:bg-[rgba(62,78,139,0.25)]" />
                    <div className="relative z-10 flex h-full items-center">
                      <span className="text-white text-lg font-semibold">{t}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-transparent group-hover:bg-[#fbb041] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}