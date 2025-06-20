import ChatBox from "@/components/GroupChat";
import LightDarkToggle from "@/components/LightDarkToggle";
import { Analytics } from "@vercel/analytics/react";
import GroupHeader from "@/components/GroupHeader";
export const metadata = { title: "Angry Uncle Bot" };

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col dark:bg-gray-900">
      <GroupHeader />
      <ChatBox />
      <Analytics />
    </main>
  );
}
