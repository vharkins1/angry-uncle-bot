import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import Tile from '../../components/Tile';
import PageShell from '../../components/PageShell';

export const metadata = {
  title: "Contact | Angry Uncle Bot",
};

export default function ContactPage() {
  return (
    <>
      <PageShell className="py-16">
        <div className="flex flex-col gap-15">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white inline-block">
              Contact Us
              <span className="block h-1 w-16 bg-[#dd494f] mt-4 rounded"></span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/90">
              Whether you're looking for an interview, a workshop, a partnership, or just have a question,
              pick one of the options below or send a quick message. We usually reply within one business day.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            <Tile
              label="Contact us"
              description="Have any recommendations, feedback on the Angry Uncle Chatbot? We’d love to hear from you!"
              href="https://docs.google.com/forms/d/e/1FAIpQLSfHn2Ro_HqV9bGjQUhtBBSL7-ZySem_GbByV6B290MbncXStw/viewform?usp=dialog"
              buttonText="Send us a note"
            />
            <Tile
              label="Extra Materials"
              description="We have a collection of resources, workshops and handouts."
              href="https://www.joinsmart.org/resources/"
              buttonText="Learn more"
            />
            <Tile
              label="Workshops & talks"
              description="Enjoying Angry Uncle Bot? We offer workshops and talks on how to have hard conversations."
              href="https://www.joinsmart.org/resources/"
              buttonText="Book a session"
            />
            <Tile
              label="FAQs"
              description="Interested in getting involved with the Smart movement? Check out our FAQs."
              href="https://www.joinsmart.org/what-we-do/"
              buttonText="Click me"
            />
            <Tile
              label="JoinSmart media"
              description="See how Smart presents itself and get inspiration or media resources."
              href="https://www.joinsmart.org"
              external
              buttonText="Visit JoinSmart"
            />
            <Tile
              label="Reach out to joinSmart"
              description="A form for those who want to reach out to the JoinSmart team."
              href="https://docs.google.com/forms/d/e/1FAIpQLSfBP8BXHq-mMqGQUwtq-S4z6b16mmuFUsLGLQ7be_xFB1qUMg/viewform"
              buttonText="Email media team"
            />
          </div>

          {/* Optional quick form
          <div className="mt-12 max-w-1xl">
            <div className="rounded-lg bg-[rgba(255,255,255,0.05)] p-3 shadow-xl border-l-4 border-[#dd494f]">
              <h2 className="text-xl font-semibold text-gray-100">Contact for Website Developers</h2>
              <p className="mt-1 text-sm text-gray-300">
                Send an email to vincenttharkins@gmail.com and whitehilljl@gmail.com
              </p>
            </div>
          </div> */}
        </div>
      </PageShell>
      <Analytics />
    </>
  );
}