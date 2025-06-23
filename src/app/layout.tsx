import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import AuthContext from '@/context/AuthContext';
import Script from 'next/script';


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'BotFusion - Transform Website Content into an Intelligent Chatbot',
  description: 'BotFusion helps you create AI-powered chatbots from your website content with just a few clicks. Enhance customer support and engagement.',
  keywords: 'chatbot, AI, website integration, customer support, conversational AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <AuthContext>
          {children}
        </AuthContext>
        <Script
        src="https://botfusion-ten.vercel.app/embed.js"
        data-chatbot-id="bf_c9b69ceae55965cc00c2de8763c31a27"
        strategy="afterInteractive"
      />
      </body>
    </html>
  );
}
