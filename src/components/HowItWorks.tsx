import Image from 'next/image';

export default function HowItWorks() {
  const steps = [
    {
      id: '01',
      title: 'Input Your Content Source',
      description: 'Provide your website URL or upload PDF documents containing your content. Our system will automatically crawl and extract the information.',
    },
    {
      id: '02',
      title: 'AI Analyzes Your Content',
      description: 'Our advanced AI processes your content, understanding context, relationships, and key information to build a knowledge base for your chatbot.',
    },
    {
      id: '03',
      title: 'Customize Your Chatbot',
      description: 'Personalize the appearance of your chatbot to match your brand. Adjust colors, icons, positioning, and behavior to create the perfect fit.',
    },
    {
      id: '04',
      title: 'Add to Your Website',
      description: 'Copy a single line of JavaScript code and add it to your website. Your AI chatbot will be instantly available to assist your visitors.',
    },
  ];

  return (
    <div id="how-it-works" className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">Create your AI chatbot in minutes</p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Follow these simple steps to transform your content into an intelligent chatbot assistant.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -ml-0.5" aria-hidden="true"></div>

          <div className="space-y-16">
            {steps.map((step, stepIdx) => (
              <div key={step.id} className="relative">
                <div className="md:flex items-center">
                  {/* Step indicator for mobile */}
                  <div className="md:hidden flex h-9 items-center" aria-hidden="true">
                    <div className="h-full w-0.5 bg-gray-200 -ml-px mx-auto"></div>
                  </div>

                  {/* Content for even steps (left side on desktop) */}
                  {stepIdx % 2 === 0 ? (
                    <>
                      <div className="md:w-1/2 pr-8 md:text-right">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-base text-gray-500">{step.description}</p>
                      </div>

                      {/* Center circle */}
                      <div className="hidden md:flex md:items-center md:justify-center">
                        <div className="h-12 w-12 rounded-full border-2 border-blue-500 bg-white flex items-center justify-center">
                          <span className="text-blue-600 font-bold">{step.id}</span>
                        </div>
                      </div>

                      {/* Empty space for even steps */}
                      <div className="md:w-1/2 pl-8"></div>
                    </>
                  ) : (
                    /* Content for odd steps (right side on desktop) */
                    <>
                      <div className="md:w-1/2 pr-8"></div>

                      {/* Center circle */}
                      <div className="hidden md:flex md:items-center md:justify-center">
                        <div className="h-12 w-12 rounded-full border-2 border-blue-500 bg-white flex items-center justify-center">
                          <span className="text-blue-600 font-bold">{step.id}</span>
                        </div>
                      </div>

                      <div className="md:w-1/2 pl-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-base text-gray-500">{step.description}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile step indicator */}
                <div className="md:hidden absolute top-0 left-0 -ml-1.5 mt-1.5">
                  <div className="h-8 w-8 rounded-full border-2 border-blue-500 bg-white flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">{step.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}