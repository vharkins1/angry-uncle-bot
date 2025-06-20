export default function Message({ role, content }) {
  const isUser   = role === 'user';
  const isUncle  = role === 'uncle';   // new
  const isCoach  = role === 'coach';   // new

  const align  = isUser ? 'justify-end' : 'justify-start';
  const bubble = isUser
    ? 'bg-blue-600 text-white'
    : 'bg-gray-100 dark:bg-gray-700';

  // Show speaker label above each bot message
  const label = isUser ? null : (
    <p className="mb-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">
      {isUncle ? 'Angry Uncle' : 'Dr. T'}
    </p>
  );

  return (
    <div className={`my-2 flex ${align}`}>
      <div className="max-w-md">
        {label}
        <div className={`rounded-xl px-4 py-2 text-sm shadow ${bubble}`}>
          {content}
        </div>
      </div>
    </div>
  );
}
