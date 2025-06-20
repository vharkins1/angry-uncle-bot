export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex items-center">
      <section className="max-w-xl mx-auto px-6 py-16 text-center">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-semibold mb-4">Get in touch</h1>

        {/* Blurb */}
        <p className="text-lg md:text-xl leading-relaxed mb-8">
          Questions, ideas, or just want to say hi? We’re always happy to hear from you.
        </p>

        {/* Primary contact action */}
        <a
          href="mailto:ninjaharkins@gmail.com"
          className="inline-block rounded-md bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg md:text-xl font-medium shadow focus:outline-none focus-visible:ring focus-visible:ring-blue-300"
        >
          Email us
        </a>

        
      </section>
    </main>
  );
}