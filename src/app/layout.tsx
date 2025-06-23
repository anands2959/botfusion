import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import AuthContext from '@/context/AuthContext';
import ChatbotScript from './ChatbotScript';




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
        <ChatbotScript />

      </body>
    </html>
  );
}
