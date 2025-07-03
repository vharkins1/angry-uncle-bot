// src/components/GroupHeader.jsx
import { BsThreeDots } from 'react-icons/bs';
import '../app/globals.css';

export default function GroupHeader({
  title = 'Angry Uncle Group Chat',
  remaining = null,
  onReset = () => {}
}) {
  return (
    <header
      className="sticky top-0 z-20 mx-4 my-2 flex items-center justify-between gap-3
                 rounded-full border bg-white/80 backdrop-blur p-4
                 dark:bg-gray-800/80"
    >
      {/* avatar stack */}
      <div className="relative h-8 w-8">
        {/* Angry Uncle */}
        <div
          className="absolute inset-0 flex h-8 w-8 items-center justify-center
                     rounded-full bg-red-200 text-base"
        >
          😠
        </div>

        {/* Dr. T offset */}
        <div
          className="absolute left-5 top-0 flex h-8 w-8 items-center justify-center
                     rounded-full bg-blue-200 text-base ring-2 ring-white
                     dark:ring-gray-900"
        >
          🧑‍🏫
        </div>
      </div>

      {/* title + counter */}
      <div className="grow text-center leading-tight">
        <h1 className="text font-semibold">{title}</h1>
        <p className="text text-gray-500 dark:text-gray-400">
          Dr. T, Angry Uncle &amp; You
          {remaining !== null && (
            <span className="ml-2 font-medium">· {remaining} messages left</span>
          )}
        </p>
      </div>

      {/* reset + menu */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="rounded-full p-2 text-3xl text-gray-600 hover:bg-gray-200
             dark:text-gray-300 dark:hover:bg-gray-700"
          title="Reset chat"
        >
          ↺
        </button>
      </div>
    </header>
  );
}
