// src/components/GroupHeader.jsx
import { BsThreeDots } from 'react-icons/bs';
import '../app/globals.css';

export default function GroupHeader({
  title = 'Angry Uncle Group Chat',
  turns_remaining = null,
  total_remaining = null,
  topic = null,
  onReset = () => {}
}) {
  return (
    <>
    
      {/* Header */}
      <div
        className="sticky top-0 -mt-3 z-35 mx-auto flex  max-w-[calc(100%-6.5rem)] sm:max-w-2xl items-center justify-between gap-4 rounded-b-lg bg-[rgba(255,255,255,0.08)] px-6 py-3 text-sm text-white shadow-lg shadow-black/30 backdrop-blur-md"
      >
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <h2 className="text-m font-bold m-0">{topic ?? 'Pick a topic'}</h2>
            <span className="text-sm text-white/80"> {turns_remaining} turns left</span>
            <span className="text-sm text-white/80">| {total_remaining} total left</span>
          </div>
          <span className="block h-1 w-16 bg-[#dd494f] mt-1 rounded" />
        </div>
        <button
          className="rounded-xl bg-[#fbb041] px-2 py-.5 text-lg font-bold text-black hover:brightness-90"
          onClick={() => {
            localStorage.removeItem('aub_chat');
            localStorage.removeItem('aub_topic');
            setMessages([]);
            setTopic(null);
          }}
        >
          ↺
        </button>
      </div>
    </>
  );
}
