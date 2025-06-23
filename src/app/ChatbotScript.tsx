// app/components/ChatbotScript.tsx
'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function ChatbotScript() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) return null;

  return (
    <Script
      src="https://botfusion-ten.vercel.app/embed.js"
      data-chatbot-id="bf_c9b69ceae55965cc00c2de8763c31a27"
      strategy="afterInteractive"
    />
  );
}
