'use client'
import { useState } from 'react';
// import Image from 'next/image';

export default function Demo() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I\'m the BotFusion demo assistant. How can I help you today?' },
  ]);

  const [inputValue, setInputValue] = useState('');

  // Demo responses for specific questions
  const demoResponses: Record<string, string> = {
    'pricing': 'BotFusion is a self-hosted, open-source platform that you can deploy for free on your own infrastructure. You only need to provide your own AI model API keys (OpenAI, Anthropic, Google, etc.) to use the service.',
    'features': 'BotFusion is a complete AI chatbot solution with multi-source knowledge base (websites, PDFs, documents), fully customizable UI, simple website integration, advanced AI capabilities, and conversation analytics - all with the privacy benefits of self-hosting.',
    'how it works': 'BotFusion works in 4 steps: 1) Set up on your own server and configure API keys, 2) Connect your content sources, 3) Customize your chatbot appearance, 4) Embed on your website with a single line of JavaScript.',
    'integration': 'Integrating BotFusion is simple! After deploying on your server, just add one line of JavaScript to your website\'s HTML. The code will look something like: <script src="https://your-domain.com/botfusion/widget.js?id=YOUR_BOT_ID"></script>',
    'customize': 'You have complete control over your chatbot\'s appearance including logo, color scheme, widget position, size, and conversation behavior to perfectly match your brand identity.',
    'self-hosting': 'BotFusion runs on your own infrastructure, giving you complete data privacy and control. You can deploy it on any server that supports Node.js and Next.js applications.',
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text: inputValue }];
    setMessages(newMessages);
    setInputValue('');

    // Simulate bot response after a short delay
    setTimeout(() => {
      let botResponse = 'I\'m sorry, but I\'m just a demo. In the real BotFusion chatbot, I would provide an accurate answer based on your website content.';

      // Check for keywords in the user's message to provide relevant demo responses
      const lowercaseInput = inputValue.toLowerCase();
      for (const [keyword, response] of Object.entries(demoResponses)) {
        if (lowercaseInput.includes(keyword.toLowerCase())) {
          botResponse = response;
          break;
        }
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div id="demo" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Live Demo</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">Experience BotFusion in action</p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Try our interactive demo to see how a self-hosted AI chatbot powered by your content would work on your website.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="w-full lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Try asking about:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <p className="ml-3 text-gray-700">Pricing plans and features</p>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <p className="ml-3 text-gray-700">How BotFusion works</p>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <p className="ml-3 text-gray-700">Website integration process</p>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <p className="ml-3 text-gray-700">Customization options</p>
                </li>
              </ul>
              <p className="mt-6 text-sm text-gray-500">
                Note: This is a simplified demo. Your actual BotFusion chatbot will be trained on your specific content sources and powered by your chosen AI provider's models.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 max-w-md mx-auto">
              <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <span className="ml-2 font-medium text-white">BotFusion Assistant</span>
                </div>
                <button className="text-white hover:text-gray-200">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-white border border-gray-200 text-gray-800'}`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 p-3 flex">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 text-gray-700 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-3 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg className="h-5 w-6 rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}