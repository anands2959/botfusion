import Link from 'next/link';

export default function CTA() {
  return (
    <div className="bg-blue-600">
      <div className="max-w-7xl mx-auto py-12 px-6 md:py-16 md:px-12 lg:py-20 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to deploy your own AI assistant?</span>
          <span className="block text-blue-200">Get started with BotFusion today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
            >
              Deploy now
            </Link>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Link
              href="https://github.com/anands2959/botfusion"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-colors"
            >
              Star on GitHub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}