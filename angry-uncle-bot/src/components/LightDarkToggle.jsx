'use client';
import { useEffect, useState } from 'react';
import { BsSun, BsMoon } from 'react-icons/bs';

export default function LightDarkToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  return (
    <button className="p-2" onClick={() => setDark(!dark)}>
      {dark ? <BsSun /> : <BsMoon />}
    </button>
  );
}