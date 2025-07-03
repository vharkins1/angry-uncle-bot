import Link from "next/link";
import LightDarkToggle from "@/components/LightDarkToggle";

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-200 shadow p-4 w-full border-b border-gray-200 dark:border-gray-300 font-sans rounded-b-lg">

      <div className="max-w-7xl mx-auto flex items-center justify-end">

        <div className="flex space-x-4 items-center">
          <Link href="/" className="text-gray-600 font-bold dark:black hover:underline">
            Home
          </Link>
          <Link href="/about" className="text-gray-600 font-bold dark:black hover:underline">
            About
          </Link>
          <Link href="/contact" className="text-gray-600 font-bold dark:black hover:underline">
            Contact
          </Link>
          <LightDarkToggle />
        </div>
      </div>

    </nav>
  );
}
