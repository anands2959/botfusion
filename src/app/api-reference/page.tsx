import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ApiReferencePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6 md:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">API Reference</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete documentation for the BotFusion API endpoints and integration options.
            </p>
          </div>
        </section>
        
        {/* API Overview */}
        <section className="py-16 px-6 md:px-12 bg-white text-gray-700">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">API Overview</h2>
              <div className="prose max-w-none">
                <p>
                  BotFusion provides a comprehensive REST API that allows you to programmatically manage your chatbots, 
                  knowledge base, and user interactions. All API endpoints use standard HTTP methods and return JSON responses.
                </p>
                
                <h3 className="mt-8">Base URL</h3>
                <p>All API requests should be made to:</p>
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                  <code>https://your-botfusion-instance.com/api</code>
                </pre>
                
                <h3 className="mt-8">Authentication</h3>
                <p>
                  API requests must be authenticated using an API key. You can generate an API key in your BotFusion dashboard 
                  under Settings → API Keys. Include your API key in the request headers as follows:
                </p>
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                  <code>Authorization: Bearer YOUR_API_KEY</code>
                </pre>
                
                <h3 className="mt-8">Rate Limiting</h3>
                <p>
                  API requests are rate-limited to 100 requests per minute per API key. If you exceed this limit, 
                  you'll receive a 429 Too Many Requests response. The response headers include information about your rate limit status:
                </p>
                <ul>
                  <li><code>X-RateLimit-Limit</code>: Maximum number of requests allowed per minute</li>
                  <li><code>X-RateLimit-Remaining</code>: Number of requests remaining in the current window</li>
                  <li><code>X-RateLimit-Reset</code>: Time when the rate limit window resets (Unix timestamp)</li>
                </ul>
              </div>
            </div>
            
            {/* API Endpoints */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">API Endpoints</h2>
              
              {/* Chatbots */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Chatbots</h3>
                
                <div className="space-y-8">
                  {/* GET /api/chatbots */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center mb-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-mono text-sm mr-4">GET</span>
                      <code className="font-mono text-gray-800">/api/chatbots</code>
                    </div>
                    <p className="text-gray-600 mb-4">List all chatbots for the authenticated user.</p>
                    
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-2">Response</h4>
                      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        <code>{
`{
  "chatbots": [
    {
      "id": "clq2x5z9h0000jk5dx8r1z3q9",
      "name": "Support Bot",
      "description": "Customer support chatbot",
      "createdAt": "2023-12-15T10:30:00.000Z",
      "updatedAt": "2023-12-16T14:20:00.000Z"
    },
    {
      "id": "clq2x6z9h0001jk5dx8r1z3q0",
      "name": "Sales Assistant",
      "description": "Product information and sales",
      "createdAt": "2023-12-16T09:15:00.000Z",
      "updatedAt": "2023-12-16T15:45:00.000Z"
    }
  ]
}`}
                        </code>
                      </pre>
                    </div>
                  </div>
                  
                  {/* POST /api/chatbots */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md font-mono text-sm mr-4">POST</span>
                      <code className="font-mono text-gray-800">/api/chatbots</code>
                    </div>
                    <p className="text-gray-600 mb-4">Create a new chatbot.</p>
                    
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold mb-2">Request Body</h4>
                      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        <code>{
`{
  "name": "Product FAQ Bot",
  "description": "Answers questions about our products",
  "model": "gpt-3.5-turbo",
  "temperature": 0.7,
  "systemPrompt": "You are a helpful assistant that answers questions about our products."
}`}
                        </code>
                      </pre>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-2">Response</h4>
                      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        <code>{
`{
  "id": "clq2x7z9h0002jk5dx8r1z3q1",
  "name": "Product FAQ Bot",
  "description": "Answers questions about our products",
  "model": "gpt-3.5-turbo",
  "temperature": 0.7,
  "systemPrompt": "You are a helpful assistant that answers questions about our products.",
  "createdAt": "2023-12-17T11:20:00.000Z",
  "updatedAt": "2023-12-17T11:20:00.000Z"
}`}
                        </code>
                      </pre>
                    </div>
                  </div>
                  
                  {/* GET /api/chatbots/:id */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center mb-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-mono text-sm mr-4">GET</span>
                      <code className="font-mono text-gray-800">/api/chatbots/:id</code>
                    </div>
                    <p className="text-gray-600 mb-4">Get details for a specific chatbot.</p>
                    
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold mb-2">Path Parameters</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        <li><code>id</code> - The ID of the chatbot</li>
                      </ul>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-2">Response</h4>
                      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        <code>{
`{
  "id": "clq2x7z9h0002jk5dx8r1z3q1",
  "name": "Product FAQ Bot",
  "description": "Answers questions about our products",
  "model": "gpt-3.5-turbo",
  "temperature": 0.7,
  "systemPrompt": "You are a helpful assistant that answers questions about our products.",
  "createdAt": "2023-12-17T11:20:00.000Z",
  "updatedAt": "2023-12-17T11:20:00.000Z",
  "sources": [
    {
      "id": "clq2x8z9h0003jk5dx8r1z3q2",
      "type": "website",
      "url": "https://example.com/products",
      "createdAt": "2023-12-17T11:25:00.000Z"
    },
    {
      "id": "clq2x9z9h0004jk5dx8r1z3q3",
      "type": "pdf",
      "filename": "product_manual.pdf",
      "createdAt": "2023-12-17T11:30:00.000Z"
    }
  ]
}`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Knowledge Base */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Knowledge Base</h3>
                
                <div className="space-y-8">
                  {/* POST /api/chatbots/:id/sources */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md font-mono text-sm mr-4">POST</span>
                      <code className="font-mono text-gray-800">/api/chatbots/:id/sources</code>
                    </div>
                    <p className="text-gray-600 mb-4">Add a new knowledge source to a chatbot.</p>
                    
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold mb-2">Path Parameters</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        <li><code>id</code> - The ID of the chatbot</li>
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold mb-2">Request Body</h4>
                      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        <code>{
`{
  "type": "website",
  "url": "https://example.com/documentation"
}`}
                        </code>
                      </pre>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-2">Response</h4>
                      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        <code>{
`{
  "id": "clq2xaz9h0005jk5dx8r1z3q4",
  "type": "website",
  "url": "https://example.com/documentation",
  "status": "processing",
  "createdAt": "2023-12-17T12:00:00.000Z"
}`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chat */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Chat</h3>
                
                <div className="space-y-8">
                  {/* POST /api/embed/:id */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md font-mono text-sm mr-4">POST</span>
                      <code className="font-mono text-gray-800">/api/embed/:id</code>
                    </div>
                    <p className="text-gray-600 mb-4">Send a message to a chatbot and get a response.</p>
                    
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold mb-2">Path Parameters</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        <li><code>id</code> - The API key of the chatbot</li>
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold mb-2">Request Body</h4>
                      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        <code>{
`{
  "message": "What features does your product offer?",
  "conversationId": "optional-conversation-id"
}`}
                        </code>
                      </pre>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-2">Response</h4>
                      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        <code>{
`{
  "response": "Our product offers several key features including real-time analytics, customizable dashboards, automated reporting, and integration with over 50 third-party services. Would you like more information about any specific feature?",
  "conversationId": "clq2xbz9h0006jk5dx8r1z3q5",
  "sources": [
    {
      "title": "Product Features",
      "url": "https://example.com/features"
    }
  ]
}`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
           
          </div>
        </section>
        
        {/* Help & Support */}
        <section className="py-16 px-6 md:px-12 bg-gray-50">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Need API Support?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our developer team is ready to help with any API integration questions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors inline-block"
              >
                Contact Developer Support
              </Link>
              <a 
                href="https://github.com/anands2959/botfusion/issues" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-3 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 transition-colors inline-block"
              >
                Report an Issue
              </a>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}