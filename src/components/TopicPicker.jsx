// src/components/TopicPicker.jsx

const TOPICS = [
  'Abortion',
  'Climate Change',
  'Gun Rights',
  'Healthcare',
  'Freedom of Expression',
];

export default function TopicPicker({ onPick }) {
  return (
    <div className="absolute inset-0 z-40 grid place-content-center gap-4 bg-[rgba(0,0,0,0.75)] backdrop-blur-md p-6 text-center">
      <h3 className="text-lg font-semibold text-white inline-block">
        Choose a topic to discuss
      </h3>
      <div className="flex flex-wrap justify-center gap-5">
        {TOPICS.map((t) => (
          <button
            key={t}
            className="rounded-full border border-[#fbb041] px-8 py-3 text-lg text-white hover:bg-[#fbb041] hover:text-black transition"
            onClick={() => {
              onPick(t);
              localStorage.setItem('aub_topic', t);
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}