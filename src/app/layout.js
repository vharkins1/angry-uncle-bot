// src/app/layout.js
import './globals.css';
import Navbar from "@/components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";


export const metadata = {
  title: 'Angry Uncle Bot',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { rel: 'icon', url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-dvh bg-gray-900 text-gray-100 antialiased">
        <Navbar />
        {children}
        <SpeedInsights />
      </body>
      
    </html>
  );
}