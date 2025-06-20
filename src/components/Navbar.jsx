import Link from "next/link";
import LightDarkToggle from "@/components/LightDarkToggle";

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-900 shadow p-4 w-full border-b border-gray-200 dark:border-gray-700">

      <div className="max-w-7xl mx-auto flex items-center justify-end">

        <div className="flex space-x-4 items-center">
          <Link href="/" className="text-gray-600 font-bold dark:text-gray-300 hover:underline">
            Home
          </Link>
          <Link href="/about" className="text-gray-600 font-bold dark:text-gray-300 hover:underline">
            About
          </Link>
          <Link href="/contact" className="text-gray-600 font-bold dark:text-gray-300 hover:underline">
            Contact
          </Link>
          <LightDarkToggle />
        </div>
      </div>

    </nav>
  );
}
