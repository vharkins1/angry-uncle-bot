// src/components/TypingBubble.jsx
export default function TypingBubble() {
  return (
    <div className="my-1 flex justify-start">
      <div className="max-w-xs">
        <div className="relative inline-flex w-16 items-center justify-center gap-1 rounded-[20px] bg-[rgba(255,255,255,0.08)] px-4 py-2">
          <span className="animate-pulse">•</span>
          <span className="animate-pulse delay-150">•</span>
          <span className="animate-pulse delay-300">•</span>
        </div>
      </div>
    </div>
  );
}