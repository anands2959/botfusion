import Link from 'next/link';
// import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div className="pt-10 sm:pt-16 lg:pt-8 xl:pt-16">
            <div className="sm:text-center lg:text-left px-6 md:px-12">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Self-Hosted</span>
                <span className="block text-blue-600">AI Chatbot Solution</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Build intelligent chatbots powered by your content - websites, PDFs, and documents. Use your own AI model keys for complete control. Enhance customer support, boost engagement, and provide 24/7 assistance with BotFusion.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-full shadow">
                  <Link
                    href="/signup"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    href="https://github.com/anands2959/botfusion"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-blue-600 bg-white hover:bg-gray-50 border-blue-100 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    GitHub
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full bg-blue-50 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center p-8">
          <div className="relative w-full max-w-lg h-full max-h-96">
            <div className="absolute top-0 left-0 w-full h-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="p-4 h-full">
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-hidden">
                    {/* Website content mockup */}
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                    <div className="h-24 bg-gray-200 rounded w-full mb-6"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  </div>

                  {/* Chatbot UI */}
                  <div className="absolute bottom-4 right-4 w-64 h-85 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    <div className="h-10 bg-blue-600 flex items-center justify-between px-4">
                      <span className="text-white text-sm font-medium">BotFusion Assistant</span>
                      <button className="text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-3 h-64 bg-gray-50 overflow-y-auto">
                      <div className="flex flex-col space-y-3">
                        <div className="bg-blue-100 text-blue-800 p-2 rounded-lg rounded-tl-none max-w-[80%] text-sm self-start">
                          Hello! How can I help you today?
                        </div>
                        <div className="bg-gray-100 text-gray-800 p-2 rounded-lg rounded-tr-none max-w-[80%] text-sm self-end">
                          I'm looking for pricing information.
                        </div>
                        <div className="bg-blue-100 text-blue-800 p-2 rounded-lg rounded-tl-none max-w-[80%] text-sm self-start">
                          Our pricing starts at $29/month for the Basic plan. Would you like me to explain the features?
                        </div>
                      </div>
                    </div>
                    <div className="h-10 border-t border-gray-200 flex items-center px-3">
                      <input type="text" className="w-full text-gray-600 h-8 bg-gray-100 rounded-full px-3 text-sm" placeholder="Type your message..." disabled />
                      <button
                        className="ml-3 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <svg className="h-3 w-3 rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}