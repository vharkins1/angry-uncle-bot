export default function Message({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`my-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-md rounded-xl px-4 py-2 text-sm shadow \
        ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
        {content}
      </div>
    </div>
  );
}