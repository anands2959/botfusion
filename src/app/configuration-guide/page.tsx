import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ConfigurationGuidePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6 md:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Configuration Guide</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to configure and customize your BotFusion chatbots for optimal performance.
            </p>
          </div>
        </section>
        
        {/* Getting Started */}
        <section id="getting-started" className="py-16 px-6 md:px-12 bg-white">
          <div className="max-w-6xl mx-auto text-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Getting Started</h2>
            <div className="prose max-w-none">
              <p>
                Before diving into detailed configurations, let's ensure you have the basics set up correctly.
                Follow these steps to create your first chatbot:
              </p>
              
              <h3 className="mt-8">1. Create a New Chatbot</h3>
              <p>
                From your dashboard, click the "Create New Chatbot" button. You'll need to provide a name and 
                optional description for your chatbot.
              </p>
              
              <h3 className="mt-8">2. Choose an AI Model</h3>
              <p>
                Select an AI model that fits your needs. BotFusion supports various models with different capabilities 
                and pricing. For most use cases, we recommend starting with GPT-3.5-Turbo.
              </p>
              
              <h3 className="mt-8">3. Add Knowledge Sources</h3>
              <p>
                Your chatbot needs information to work with. You can add knowledge from:
              </p>
              <ul>
                <li>Website URLs (we'll crawl and index the content)</li>
                <li>PDF documents</li>
                <li>Text input (for custom instructions or information)</li>
              </ul>
              
              <h3 className="mt-8">4. Test Your Chatbot</h3>
              <p>
                Use the built-in chat interface to test how your chatbot responds. This helps you identify any 
                adjustments needed before deploying to your website.
              </p>
              
              <h3 className="mt-8">5. Deploy to Your Website</h3>
              <p>
                Once you're satisfied with your chatbot's performance, get the embed code from the "Embed" tab 
                and add it to your website.
              </p>
            </div>
          </div>
        </section>
        
        {/* Chatbot Settings */}
        <section id="chatbot-settings" className="py-16 px-6 md:px-12 bg-gray-50">
          <div className="max-w-6xl mx-auto text-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Chatbot Settings</h2>
            <div className="prose max-w-none">
              <p>
                Customize your chatbot's behavior and appearance through these essential settings:
              </p>
              
              <h3 className="mt-8">Basic Information</h3>
              <ul>
                <li><strong>Name:</strong> The internal name of your chatbot (not visible to users)</li>
                <li><strong>Description:</strong> A brief description to help you identify this chatbot</li>
                <li><strong>Avatar:</strong> Upload a custom avatar image for your chatbot</li>
              </ul>
              
              <h3 className="mt-8">Chat Interface</h3>
              <ul>
                <li><strong>Chat Title:</strong> The title displayed at the top of the chat window</li>
                <li><strong>Welcome Message:</strong> The first message users see when opening the chat</li>
                <li><strong>Placeholder Text:</strong> Text displayed in the input field before the user types</li>
                <li><strong>Primary Color:</strong> The main color used for the chat interface</li>
                <li><strong>Position:</strong> Where the chat button appears on your website (bottom-right, bottom-left, etc.)</li>
              </ul>
              
              <h3 className="mt-8">Behavior Settings</h3>
              <ul>
                <li><strong>Auto-Open:</strong> Whether the chat window should automatically open when a user visits your site</li>
                <li><strong>Show Sources:</strong> Whether to display the sources of information used to answer questions</li>
                <li><strong>Require Email:</strong> Whether to ask for the user's email before starting a conversation</li>
                <li><strong>Working Hours:</strong> Set specific hours when the chatbot is available</li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* Knowledge Base Configuration */}
        <section id="knowledge-base" className="py-16 px-6 md:px-12 bg-white">
          <div className="max-w-6xl mx-auto text-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Knowledge Base Configuration</h2>
            <div className="prose max-w-none">
              <p>
                Your chatbot's knowledge base determines what information it can access when answering questions.
                Here's how to optimize your knowledge sources:
              </p>
              
              <h3 className="mt-8">Website Crawling</h3>
              <p>
                When adding a website as a knowledge source, you can configure:
              </p>
              <ul>
                <li><strong>Crawl Depth:</strong> How many links deep the crawler should go (1-5)</li>
                <li><strong>URL Patterns:</strong> Specific patterns to include or exclude from crawling</li>
                <li><strong>Recrawl Frequency:</strong> How often the website should be recrawled for updates</li>
              </ul>
              
              <h3 className="mt-8">PDF Documents</h3>
              <p>
                When uploading PDF documents, consider these best practices:
              </p>
              <ul>
                <li>Use text-based PDFs rather than scanned documents for better extraction</li>
                <li>Keep documents under 50MB for optimal processing</li>
                <li>Use descriptive filenames to help identify the content</li>
              </ul>
              
              <h3 className="mt-8">Custom Text</h3>
              <p>
                Custom text entries are useful for:
              </p>
              <ul>
                <li>Providing specific instructions to the chatbot</li>
                <li>Adding information that isn't available on your website</li>
                <li>Creating fallback responses for common questions</li>
              </ul>
              
              <h3 className="mt-8">Knowledge Weights</h3>
              <p>
                You can assign different weights to your knowledge sources to prioritize certain information:
              </p>
              <ul>
                <li><strong>High Priority (weight 3):</strong> Critical information that should be preferred</li>
                <li><strong>Normal Priority (weight 2):</strong> Standard information sources</li>
                <li><strong>Low Priority (weight 1):</strong> Supplementary information used only when needed</li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* AI Model Settings */}
        <section id="ai-model" className="py-16 px-6 md:px-12 bg-gray-50">
          <div className="max-w-6xl mx-auto text-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">AI Model Settings</h2>
            <div className="prose max-w-none">
              <p>
                Fine-tune your chatbot's AI behavior with these advanced settings:
              </p>
              
              <h3 className="mt-8">Model Selection</h3>
              <p>
                BotFusion supports several AI models with different capabilities:
              </p>
              <ul>
                <li><strong>GPT-3.5-Turbo:</strong> Good balance of performance and cost</li>
                <li><strong>GPT-4:</strong> More capable but higher cost</li>
                <li><strong>Claude:</strong> Alternative model with different strengths</li>
              </ul>
              
              <h3 className="mt-8">Temperature</h3>
              <p>
                Temperature controls how creative or focused the AI responses are:
              </p>
              <ul>
                <li><strong>Low (0.0-0.3):</strong> More focused, deterministic responses</li>
                <li><strong>Medium (0.4-0.7):</strong> Balanced creativity and focus</li>
                <li><strong>High (0.8-1.0):</strong> More creative, varied responses</li>
              </ul>
              <p>
                For factual, support-oriented chatbots, we recommend a lower temperature (0.2-0.4).
              </p>
              
              <h3 className="mt-8">System Prompt</h3>
              <p>
                The system prompt provides instructions to the AI about how it should behave. A well-crafted system prompt can significantly improve your chatbot's performance.
              </p>
              <p>Example system prompt for a customer support chatbot:</p>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  You are a helpful customer support assistant for BotFusion, a company that provides AI chatbot solutions. Answer questions accurately based on the provided knowledge base. If you don't know the answer, politely say so and offer to connect the user with a human support agent. Keep responses concise and friendly. Always maintain a professional tone.
                </code>
              </pre>
              
              <h3 className="mt-8">Context Window</h3>
              <p>
                The context window determines how much of the conversation history and knowledge base content is sent to the AI model:
              </p>
              <ul>
                <li><strong>Small (2k tokens):</strong> Faster responses, less context</li>
                <li><strong>Medium (4k tokens):</strong> Balanced approach</li>
                <li><strong>Large (8k tokens):</strong> More context but potentially slower responses</li>
              </ul>
              <p>
                Larger context windows allow the AI to reference more information but may increase response time and costs.
              </p>
            </div>
          </div>
        </section>
        
        {/* Website Embedding */}
        <section id="embedding" className="py-16 px-6 md:px-12 bg-white">
          <div className="max-w-6xl mx-auto text-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Website Embedding</h2>
            <div className="prose max-w-none">
              <p>
                Once your chatbot is configured, you'll need to embed it on your website:
              </p>
              
              <h3 className="mt-8">Standard Embed</h3>
              <p>
                The simplest way to add your chatbot is with our standard embed code. Copy this code from the "Embed" tab in your dashboard and paste it just before the closing <code>&lt;/body&gt;</code> tag on your website:
              </p>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  &lt;script src="https://cdn.botfusion.ai/embed.js" data-bot-id="YOUR_BOT_ID" async&gt;&lt;/script&gt;
                </code>
              </pre>
              
              <h3 className="mt-8">Custom Trigger</h3>
              <p>
                You can also create custom elements to trigger the chatbot:
              </p>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  &lt;button onclick="BotFusion.open()"&gt;Chat with us&lt;/button&gt;
                </code>
              </pre>
              
              <h3 className="mt-8">JavaScript API</h3>
              <p>
                For more advanced integrations, use our JavaScript API:
              </p>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Initialize with custom options
  BotFusion.init({
    botId: 'YOUR_BOT_ID',
    position: 'bottom-right',
    primaryColor: '#4F46E5',
    welcomeMessage: 'How can I help you today?'
  });

  // Open the chat window
  BotFusion.open();

  // Close the chat window
  BotFusion.close();

  // Set user identity
  BotFusion.identify({
    email: 'user@example.com',
    name: 'John Doe',
    customData: {
      plan: 'premium',
      signupDate: '2023-01-15'
    }
  });`}
                </code>
              </pre>
              
              <h3 className="mt-8">Responsive Design</h3>
              <p>
                The BotFusion chat widget is fully responsive and works well on all devices. On mobile devices, the chat window will expand to full screen when opened for better usability.
              </p>
            </div>
          </div>
        </section>
        
        {/* Advanced Configuration */}
        <section id="advanced" className="py-16 px-6 md:px-12 bg-gray-50">
          <div className="max-w-6xl mx-auto text-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Advanced Configuration</h2>
            <div className="prose max-w-none">
              <p>
                For power users, BotFusion offers several advanced configuration options:
              </p>
              
              <h3 className="mt-8">Custom CSS</h3>
              <p>
                You can fully customize the appearance of your chatbot with custom CSS. Add your styles when initializing the chatbot:
              </p>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  {`BotFusion.init({
  botId: 'YOUR_BOT_ID',
  customCSS: \`
    .bf-chat-window {
      border-radius: 16px;
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }
    .bf-message-user {
      background-color: #F3F4F6;
      color: #1F2937;
    }
    .bf-message-bot {
      background-color: #4F46E5;
      color: white;
    }
  \`
});`}
                </code>
              </pre>
              
              <h3 className="mt-8">Webhooks</h3>
              <p>
                Set up webhooks to receive notifications when users interact with your chatbot:
              </p>
              <ol>
                <li>Go to Settings → Webhooks in your dashboard</li>
                <li>Add a new webhook URL</li>
                <li>Select the events you want to receive (conversation started, message sent, etc.)</li>
                <li>Save your webhook configuration</li>
              </ol>
              <p>
                Webhook payloads include detailed information about the event, such as user data, message content, and timestamps.
              </p>
              
              <h3 className="mt-8">Custom Functions</h3>
              <p>
                For advanced use cases, you can define custom functions that your chatbot can call:
              </p>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  {`BotFusion.init({
  botId: 'YOUR_BOT_ID',
  functions: [
    {
      name: 'getProductPrice',
      description: 'Get the current price of a product',
      parameters: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            description: 'The ID of the product'
          }
        },
        required: ['productId']
      },
      function: async ({ productId }) => {
        // Fetch the product price from your API
        const response = await fetch(\`/api/products/\${productId}\`);
        const product = await response.json();
        return { price: product.price, currency: product.currency };
      }
    }
  ]
});`}
                </code>
              </pre>
              <p>
                When a user asks about a product price, the chatbot can call this function to get real-time pricing information.
              </p>
              
              <h3 className="mt-8">Multi-Language Support</h3>
              <p>
                Configure your chatbot to support multiple languages:
              </p>
              <ol>
                <li>Go to Settings → Languages in your dashboard</li>
                <li>Enable the languages you want to support</li>
                <li>For each language, you can customize the welcome message and system prompt</li>
                <li>The chatbot will automatically detect the user's language and respond accordingly</li>
              </ol>
            </div>
          </div>
        </section>
        
        {/* Help & Support */}
        <section className="py-16 px-6 md:px-12 bg-blue-50">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Need Configuration Help?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our support team is ready to assist you with any configuration questions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors inline-block"
              >
                Contact Support
              </Link>
              <Link 
                href="/documentation" 
                className="px-8 py-3 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 transition-colors inline-block"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}