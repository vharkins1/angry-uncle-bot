

const AVATAR = {
  user: '🫵',
  uncle: '😠',
  coach: '🧑‍🏫',
};

export default function Bubble({ role, content }) {
  const isUser = role === 'user';
  const labelText =
    role === 'user' ? 'You' : role === 'uncle' ? 'Angry Uncle' : 'Dr. T';

  // Ring color by role
  const ring = {
    coach: 'ring-green-500',
    uncle: 'ring-red-500',
    user: 'ring-gray-500',
  }[role] || 'ring-gray-500';

  // Map Angry Uncle's leading emoji to the avatar; strip it from bubble text
  const UNCLE_EMOJIS = ['🥴🥂', '😒', '😠', '😡', '🤬', '🙂', '😊', '😁'];

  let avatarEmoji = AVATAR[role] || '🙂';
  let displayContent = content;

  if (role === 'uncle' && typeof content === 'string') {
    const trimmed = content.trimStart();
    const found = UNCLE_EMOJIS.find(e => trimmed.startsWith(e));
    if (found) {
      avatarEmoji = found;
      // Remove the leading emoji and any immediate whitespace from the message body
      displayContent = trimmed.slice(found.length).trimStart();
    } else {
      avatarEmoji = AVATAR.uncle; // fallback to default if no emoji was found
    }
  }

  // Avatar + text alignment container
  const containerClass = `my-3 flex ${isUser ? 'justify-end' : 'justify-start'}`;
  const rowClass = `flex items-start justify-between gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`;


  // Avatar emoji styling
  const avatarClass = `grid h-8 w-8 shrink-0 place-content-center rounded-full bg-[rgba(255,255,255,0.08)] text-xl ring-2 ${ring} select-none`;


  // Bubble appearance (colors, shape)
  const bubbleBase =
  'flex flex-col w-fit max-w-[70vw] sm:max-w-[320px] leading-1.5 px-3 py-1 shadow-sm';

  const bubbleShape = isUser
    ? 'bg-[#007aff] text-black rounded-xl rounded-tr-none'
    : 'bg-[rgba(255,255,255,0.08)] text-white rounded-xl rounded-tl-none';
  const bubbleClass = `${bubbleBase} ${bubbleShape} focus:outline-none`;


  // Name + time styling
  const headerClass = `flex items-center space-x-2 rtl:space-x-reverse ${
    isUser ? 'justify-end' : 'justify-start'
  }`;
  const nameClass = 'text-sm font-semibold text-white'


  // Message body
  const messageClass = 'text-sm font-normal py-1 text-white'


  return (
    <div className={containerClass}>
      <div className={rowClass}>
        {/* Avatar */}
        <div className={`${avatarClass} mt-[20px]`} title={labelText} aria-hidden="true">
          {avatarEmoji}
        </div>

        {/* Outer message container */}
        <div className="flex flex-col items-start">
          {/* Name and time (above bubble) */}
          <div className={'flex items-center space-x-2 text-xs mb-1 ' +(isUser ? 'ml-auto' : 'mr-auto')}>
            <span className="font-medium">
              {labelText}
            </span>
          </div>

          {/* Message bubble */}
          <div className={bubbleClass}>
            <p className={messageClass}>{displayContent}</p>
          </div>
        </div>
      </div>
    </div>
  );
}