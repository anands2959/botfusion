'use client';

import { useState, useEffect } from 'react';
import { Chatbot } from '@/types/chatbot';

interface ApiKeyGeneratorProps {
  chatbots: Chatbot[];
}

export default function ApiKeyGenerator({ chatbots }: ApiKeyGeneratorProps) {
  const [selectedChatbot, setSelectedChatbot] = useState<string>('');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [embedScript, setEmbedScript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch API key when chatbot selection changes
  useEffect(() => {
    if (selectedChatbot) {
      fetchApiKey(selectedChatbot);
    } else {
      setApiKey(null);
      setEmbedScript(null);
    }
  }, [selectedChatbot]);

  // Fetch existing API key for the selected chatbot
  const fetchApiKey = async (chatbotId: string) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/chatbots/${chatbotId}/apikey`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch API key');
      }
      
      const data = await response.json();
      setApiKey(data.apiKey);
      setEmbedScript(data.embedScript);
    } catch (err) {
      console.error('Error fetching API key:', err);
      setError('Failed to fetch API key. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate new API key
  const generateApiKey = async () => {
    if (!selectedChatbot) {
      setError('Please select a chatbot first');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    setCopied(false);
    
    try {
      const response = await fetch(`/api/chatbots/${selectedChatbot}/apikey`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate API key');
      }
      
      const data = await response.json();
      setApiKey(data.apiKey);
      setEmbedScript(data.embedScript);
      setSuccess('API key generated successfully!');
    } catch (err) {
      console.error('Error generating API key:', err);
      setError('Failed to generate API key. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete API key
  const deleteApiKey = async () => {
    if (!selectedChatbot || !apiKey) {
      return;
    }
    
    if (!confirm('Are you sure you want to delete this API key? This will disable any embedded chatbots using this key.')) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/chatbots/${selectedChatbot}/apikey`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }
      
      setApiKey(null);
      setEmbedScript(null);
      setSuccess('API key deleted successfully!');
    } catch (err) {
      console.error('Error deleting API key:', err);
      setError('Failed to delete API key. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy embed script to clipboard
  const copyEmbedScript = () => {
    if (embedScript) {
      navigator.clipboard.writeText(embedScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 text-gray-700">
      <div>
        <label htmlFor="chatbot-select" className="block text-sm font-medium text-gray-700">
          Select Chatbot
        </label>
        <select
          id="chatbot-select"
          className="mt-1 block w-full p-2 text-base border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={selectedChatbot}
          onChange={(e) => setSelectedChatbot(e.target.value)}
          disabled={isLoading}
        >
          <option value="">Select a chatbot</option>
          {chatbots.map((chatbot) => (
            <option key={chatbot.id} value={chatbot.id}>
              {chatbot.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={generateApiKey}
          disabled={!selectedChatbot || isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : apiKey ? 'Regenerate API Key' : 'Generate API Key'}
        </button>

        {apiKey && (
          <button
            type="button"
            onClick={deleteApiKey}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete API Key
          </button>
        )}
      </div>

      {apiKey && (
        <div className="mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">API Key</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <div className="relative flex items-stretch flex-grow focus-within:z-10">
                <input
                  type="text"
                  value={apiKey}
                  readOnly
                  className="focus:ring-blue-500 p-2 focus:border-blue-500 block w-full rounded-md sm:text-sm border-gray-300 bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Embed Script</label>
            <div className="mt-1">
              <div className="bg-gray-50 rounded-md p-3 font-mono text-sm overflow-x-auto border border-gray-300">
                {embedScript}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Add this script to your website's body section to display the chatbot.
              </p>
            </div>
            <div className="mt-2">
              <button
                type="button"
                onClick={copyEmbedScript}
                className="inline-flex items-center p-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}