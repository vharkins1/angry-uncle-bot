// src/app/layout.js
import './globals.css';

export const metadata = {
  title: 'Angry Uncle Bot',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="bg-white text-black
          dark:bg-gray-900 dark:text-white
          transition-colors duration-500"
      >
        {children}
      </body>
    </html>
  );
}
