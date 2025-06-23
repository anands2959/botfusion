import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DocumentationPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6 md:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Documentation</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about setting up and using BotFusion.
            </p>
          </div>
        </section>
        
        {/* Documentation Navigation */}
        <section className="py-12 px-6 md:px-12 bg-white">
          <div className="max-w-6xl mx-auto">
            
            
            {/* Full Documentation */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Full Documentation</h2>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-gray-700">
                <div className="prose max-w-none">
                  <h3>Introduction to BotFusion</h3>
                  <p>
                    BotFusion is a self-hosted, open-source AI chatbot platform that allows you to create intelligent chatbots powered by your own content - websites, PDFs, and documents. With complete control over your data and AI models, BotFusion provides a privacy-focused solution for enhancing customer support and engagement.
                  </p>
                  
                  <h3 className="mt-8">System Requirements</h3>
                  <p>To run BotFusion, you'll need:</p>
                  <ul>
                    <li>Node.js 18.0 or higher</li>
                    <li>PostgreSQL database</li>
                    <li>API key from an AI provider (OpenAI, Anthropic, etc.)</li>
                    <li>Minimum 2GB RAM for the application server</li>
                  </ul>
                  
                  <h3 className="mt-8">Installation</h3>
                  <p>Follow these steps to install BotFusion:</p>
                  <ol>
                    <li>Clone the repository: <code>git clone https://github.com/anands2959/botfusion.git</code></li>
                    <li>Navigate to the project directory: <code>cd botfusion</code></li>
                    <li>Install dependencies: <code>npm install</code></li>
                    <li>Set up environment variables (see Configuration section)</li>
                    <li>Initialize the database: <code>npx prisma migrate dev</code></li>
                    <li>Start the development server: <code>npm run dev</code></li>
                  </ol>
                  
                  <h3 className="mt-8">Configuration</h3>
                  <p>
                    Create a <code>.env</code> file in the root directory with the following variables:
                  </p>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    <code>
                      DATABASE_URL="postgresql://username:password@localhost:5432/botfusion"
                      NEXTAUTH_URL="http://localhost:3000"
                      NEXTAUTH_SECRET="your-secret-key"
                      OPENAI_API_KEY="your-openai-api-key"
                      # Optional: Configure email for verification
                      EMAIL_SERVER_HOST="smtp.example.com"
                      EMAIL_SERVER_PORT=587
                      EMAIL_SERVER_USER="your-email@example.com"
                      EMAIL_SERVER_PASSWORD="your-email-password"
                      EMAIL_FROM="noreply@yourdomain.com"
                    </code>
                  </pre>
                  
                  <p className="mt-4">
                    For more detailed configuration options, please refer to the <Link href="/configuration-guide" className="text-blue-600 hover:text-blue-800">Configuration Guide</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Help & Support */}
        <section className="py-16 px-6 md:px-12 bg-gray-50">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Need More Help?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our team is here to help you get the most out of BotFusion.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors inline-block"
              >
                Contact Support
              </Link>
              <a 
                href="https://github.com/anands2959/botfusion" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-3 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 transition-colors inline-block"
              >
                GitHub Repository
              </a>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}