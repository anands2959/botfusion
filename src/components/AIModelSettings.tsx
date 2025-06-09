'use client';

import { useState } from 'react';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  apiKeyRequired: boolean;
}

export default function AIModelSettings() {
  const [selectedModel, setSelectedModel] = useState<string>('gpt-3.5-turbo');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    'openai': '',
    'anthropic': '',
    'google': '',
    'mistral': '',
    'llama': ''
  });

  const models: AIModel[] = [
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'openai',
      description: 'Good balance of capabilities and performance',
      apiKeyRequired: true
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'openai',
      description: 'Advanced reasoning and broader knowledge',
      apiKeyRequired: true
    },
    {
      id: 'claude-2',
      name: 'Claude 2',
      provider: 'anthropic',
      description: 'Strong reasoning and thoughtful responses',
      apiKeyRequired: true
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'google',
      description: 'Google\'s multimodal AI model',
      apiKeyRequired: true
    },
    {
      id: 'mistral-medium',
      name: 'Mistral Medium',
      provider: 'mistral',
      description: 'Efficient open-source model',
      apiKeyRequired: true
    },
    {
      id: 'llama-2-70b',
      name: 'Llama 2 (70B)',
      provider: 'llama',
      description: 'Meta\'s powerful open-source model',
      apiKeyRequired: true
    }
  ];

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const handleApiKeyChange = (provider: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save the settings to your backend
    alert('Settings saved successfully!');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
      <h2 className="text-lg font-medium text-gray-900 mb-4">AI Model Settings</h2>
      <p className="text-sm text-gray-500 mb-6">
        Configure which AI models to use with your chatbots and provide the necessary API keys.
      </p>

      <form onSubmit={handleSaveSettings}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Default AI Model</label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => (
              <div 
                key={model.id} 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedModel === model.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                onClick={() => handleModelChange(model.id)}
              >
                <div className="font-medium text-gray-900">{model.name}</div>
                <div className="text-xs text-gray-500 mt-1">Provider: {model.provider}</div>
                <div className="text-sm text-gray-600 mt-2">{model.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-900 mb-3">API Keys</h3>
          <p className="text-sm text-gray-500 mb-4">
            Enter your API keys for the AI providers you want to use. Your keys are securely stored and never shared.
          </p>
          
          <div className="space-y-4">
            {Object.keys(apiKeys).map((provider) => (
              <div key={provider} className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{provider} API Key</label>
                <input
                  type="password"
                  value={apiKeys[provider]}
                  onChange={(e) => handleApiKeyChange(provider, e.target.value)}
                  className="border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Enter your ${provider} API key`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}