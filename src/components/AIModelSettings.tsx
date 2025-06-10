'use client';

import { useState, useEffect, useRef } from 'react';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  apiKeyRequired: boolean;
}

interface TrainingSource {
  id: string;
  type: 'website' | 'pdf';
  url?: string;
  filename?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
}

export default function AIModelSettings() {
  // Model settings state
  const [selectedModel, setSelectedModel] = useState<string>('gpt-3.5-turbo');
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    google: '',
    mistral: '',
    llama: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Training state
  const [activeTab, setActiveTab] = useState<'models' | 'training'>('models');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingSources, setTrainingSources] = useState<TrainingSource[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedChatbot, setSelectedChatbot] = useState<string>('');
  const [chatbots, setChatbots] = useState<any[]>([]);
  const [isLoadingChatbots, setIsLoadingChatbots] = useState(false);

  // List of available AI models
  const availableModels: AIModel[] = [
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5',
      provider: 'openai',
      description: 'Good balance of capability and cost',
      apiKeyRequired: true
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'openai',
      description: 'Most capable OpenAI model',
      apiKeyRequired: true
    },
    {
      id: 'claude-2',
      name: 'Claude 2',
      provider: 'anthropic',
      description: 'Anthropic\'s advanced AI assistant',
      apiKeyRequired: true
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'google',
      description: 'Google\'s advanced AI model',
      apiKeyRequired: true
    },
    {
      id: 'mistral-medium',
      name: 'Mistral Medium',
      provider: 'mistral',
      description: 'Balanced performance from Mistral AI',
      apiKeyRequired: true
    },
    {
      id: 'llama-2',
      name: 'Llama 2',
      provider: 'llama',
      description: 'Open source model from Meta',
      apiKeyRequired: true
    }
  ];

  // Handle model selection change
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };

  // Handle API key input change
  const handleApiKeyChange = (provider: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };

  // Fetch existing settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) throw new Error('Failed to fetch settings');
        
        const data = await response.json();
        if (data.settings) {
          setSelectedModel(data.settings.defaultAIModel || 'gpt-3.5-turbo');
          setApiKeys({
            openai: data.settings.openaiApiKey || '',
            anthropic: data.settings.anthropicApiKey || '',
            google: data.settings.googleApiKey || '',
            mistral: data.settings.mistralApiKey || '',
            llama: data.settings.llamaApiKey || ''
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Fetch chatbots
  useEffect(() => {
    const fetchChatbots = async () => {
      setIsLoadingChatbots(true);
      try {
        const response = await fetch('/api/chatbots');
        if (!response.ok) throw new Error('Failed to fetch chatbots');
        
        const data = await response.json();
        setChatbots(data.chatbots || []);
        
        // Select the first chatbot by default if available
        if (data.chatbots && data.chatbots.length > 0) {
          setSelectedChatbot(data.chatbots[0].id);
          // Fetch training sources for the selected chatbot
          fetchTrainingSources(data.chatbots[0].id);
        }
      } catch (err) {
        console.error('Error fetching chatbots:', err);
        setError('Failed to load chatbots. Please try again.');
      } finally {
        setIsLoadingChatbots(false);
      }
    };

    if (activeTab === 'training') {
      fetchChatbots();
    }
  }, [activeTab]);

  // Fetch training sources for a chatbot
  const fetchTrainingSources = async (chatbotId: string) => {
    if (!chatbotId) return;
    
    try {
      const response = await fetch(`/api/chatbots/${chatbotId}/train`);
      if (!response.ok) throw new Error('Failed to fetch training sources');
      
      const data = await response.json();
      setTrainingSources(data.trainingSources || []);
    } catch (err) {
      console.error('Error fetching training sources:', err);
      setError('Failed to load training sources. Please try again.');
    }
  };

  // Handle chatbot selection change
  const handleChatbotChange = (chatbotId: string) => {
    setSelectedChatbot(chatbotId);
    fetchTrainingSources(chatbotId);
  };

  // Save settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          defaultAIModel: selectedModel,
          openaiApiKey: apiKeys.openai,
          anthropicApiKey: apiKeys.anthropic,
          googleApiKey: apiKeys.google,
          mistralApiKey: apiKeys.mistral,
          llamaApiKey: apiKeys.llama
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }

      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err :any) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Add website URL as training source
  const handleAddWebsite = async () => {
    if (!websiteUrl.trim() || !selectedChatbot) {
      setError('Please enter a valid website URL and select a chatbot');
      return;
    }

    try {
      const response = await fetch(`/api/chatbots/${selectedChatbot}/train`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'website',
          url: websiteUrl
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add website');
      }

      const data = await response.json();
      setTrainingSources(prev => [data.trainingSource, ...prev]);
      setWebsiteUrl('');
      setSuccessMessage('Website added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err :any) {
      console.error('Error adding website:', err);
      setError(err.message || 'Failed to add website. Please try again.');
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !selectedChatbot) {
      return;
    }

    const file = e.target.files[0];
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/chatbots/${selectedChatbot}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const data = await response.json();
      setTrainingSources(prev => [data.trainingSource, ...prev]);
      setSuccessMessage('File uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err :any) {
      console.error('Error uploading file:', err);
      setError(err.message || 'Failed to upload file. Please try again.');
    }
  };

  // Start training process
  const handleStartTraining = async () => {
    if (!selectedChatbot) {
      setError('Please select a chatbot');
      return;
    }
    
    if (trainingSources.length === 0) {
      setError('Please add at least one website or PDF document for training');
      return;
    }
    
    setIsTraining(true);
    setError('');
    
    try {
      const response = await fetch(`/api/chatbots/${selectedChatbot}/train`, {
        method: 'PUT'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start training');
      }

      setSuccessMessage('Training process started!');
      
      // Poll for updates
      const pollInterval = setInterval(async () => {
        await fetchTrainingSources(selectedChatbot);
        
        // Check if all sources are completed or failed
        const allDone = trainingSources.every(source => 
          source.status === 'completed' || source.status === 'failed'
        );
        
        if (allDone) {
          clearInterval(pollInterval);
          setIsTraining(false);
          setSuccessMessage('AI model trained successfully with your content!');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      }, 5000);
      
      // Stop polling after 2 minutes as a safety measure
      setTimeout(() => {
        clearInterval(pollInterval);
        setIsTraining(false);
      }, 120000);
      
    } catch (err :any) {
      console.error('Error starting training:', err);
      setError(err.message || 'Failed to start training. Please try again.');
      setIsTraining(false);
    }
  };

  // Remove training source
  const handleRemoveSource = async (sourceId: string) => {
    try {
      setTrainingSources(prev => prev.filter(source => source.id !== sourceId));
      setSuccessMessage('Source removed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error removing source:', err);
      setError('Failed to remove source. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Error and success messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Loading spinner */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Tab navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('models')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'models' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Model Selection
              </button>
              <button
                onClick={() => setActiveTab('training')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'training' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Content Training
              </button>
            </nav>
          </div>

          {/* Model Selection Tab */}
          {activeTab === 'models' && (
            <form>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Default AI Model</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableModels.map((model) => (
                    <div key={model.id} className="relative">
                      <input
                        type="radio"
                        id={model.id}
                        name="aiModel"
                        value={model.id}
                        checked={selectedModel === model.id}
                        onChange={() => handleModelChange(model.id)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={model.id}
                        className={`block p-4 border rounded-lg cursor-pointer hover:border-blue-500 ${selectedModel === model.id ? 'border-blue-600 ring-2 ring-blue-600' : 'border-gray-300'}`}
                      >
                        <span className="font-medium text-gray-900">{model.name}</span>
                        <span className="block text-sm text-gray-500 mt-1">{model.description}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">API Keys</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Enter your API keys for the AI providers you want to use. Your keys are securely stored and never shared.
                </p>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="openai-key" className="block text-sm font-medium text-gray-700 mb-1">
                      OpenAI API Key (for GPT models)
                    </label>
                    <input
                      type="password"
                      id="openai-key"
                      value={apiKeys.openai}
                      onChange={(e) => handleApiKeyChange('openai', e.target.value)}
                      className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="sk-..."
                    />
                  </div>

                  <div>
                    <label htmlFor="anthropic-key" className="block text-sm font-medium text-gray-700 mb-1">
                      Anthropic API Key (for Claude models)
                    </label>
                    <input
                      type="password"
                      id="anthropic-key"
                      value={apiKeys.anthropic}
                      onChange={(e) => handleApiKeyChange('anthropic', e.target.value)}
                      className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="sk-ant-..."
                    />
                  </div>

                  <div>
                    <label htmlFor="google-key" className="block text-sm font-medium text-gray-700 mb-1">
                      Google API Key (for Gemini models)
                    </label>
                    <input
                      type="password"
                      id="google-key"
                      value={apiKeys.google}
                      onChange={(e) => handleApiKeyChange('google', e.target.value)}
                      className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="AIza..."
                    />
                  </div>

                  <div>
                    <label htmlFor="mistral-key" className="block text-sm font-medium text-gray-700 mb-1">
                      Mistral API Key
                    </label>
                    <input
                      type="password"
                      id="mistral-key"
                      value={apiKeys.mistral}
                      onChange={(e) => handleApiKeyChange('mistral', e.target.value)}
                      className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="..."
                    />
                  </div>

                  <div>
                    <label htmlFor="llama-key" className="block text-sm font-medium text-gray-700 mb-1">
                      Llama API Key
                    </label>
                    <input
                      type="password"
                      id="llama-key"
                      value={apiKeys.llama}
                      onChange={(e) => handleApiKeyChange('llama', e.target.value)}
                      className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          )}

          {/* Content Training Tab */}
          {activeTab === 'training' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Train Your Chatbot</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Provide website URLs or upload PDF documents to train your chatbot with your content.
                </p>

                {/* Chatbot selection */}
                <div className="mb-4">
                  <label htmlFor="chatbot-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Chatbot to Train
                  </label>
                  {isLoadingChatbots ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-gray-500">Loading chatbots...</span>
                    </div>
                  ) : chatbots.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No chatbots found. Please create a chatbot first in the Chatbot Editor section.
                    </div>
                  ) : (
                    <select
                      id="chatbot-select"
                      value={selectedChatbot}
                      onChange={(e) => handleChatbotChange(e.target.value)}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {chatbots.map((chatbot) => (
                        <option key={chatbot.id} value={chatbot.id}>
                          {chatbot.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Website URL input */}
                <div className="mb-4">
                  <label htmlFor="website-url" className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      id="website-url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="flex-1 px-3 text-gray-700 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com"
                      disabled={!selectedChatbot || isLoadingChatbots}
                    />
                    <button
                      type="button"
                      onClick={handleAddWebsite}
                      disabled={!websiteUrl.trim() || !selectedChatbot || isLoadingChatbots}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Website
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    We'll crawl the website and extract content for training.
                  </p>
                </div>
                <h3 className='text-gray-700 text-center'>OR</h3>

                {/* PDF upload */}
                <div className="mb-6">
                  <label htmlFor="pdf-upload" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload PDF Document
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="file"
                      id="pdf-upload"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf"
                      className="flex-1 text-gray-700 p-2 border border-gray-300 rounded-md shadow-sm"
                      disabled={!selectedChatbot || isLoadingChatbots}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Only PDF files are supported (max 10MB).
                  </p>
                </div>

                {/* Training sources list */}
                <div className="mb-6 text-gray-700">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Training Sources</h4>
                  {trainingSources.length === 0 ? (
                    <p className="text-sm text-gray-500">No training sources added yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {trainingSources.map((source) => (
                        <div key={source.id} className="border border-gray-200 rounded-md p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">
                                {source.type === 'website' ? '🌐 Website' : '📄 PDF'}: {source.type === 'website' ? source.url : source.filename}
                              </div>
                              <div className="flex items-center mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${{
                                  'pending': 'bg-yellow-100 text-yellow-800',
                                  'processing': 'bg-blue-100 text-blue-800',
                                  'completed': 'bg-green-100 text-green-800',
                                  'failed': 'bg-red-100 text-red-800'
                                }[source.status]}`}>
                                  {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSource(source.id)}
                              className="text-gray-400 hover:text-red-500"
                              disabled={source.status === 'processing'}
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  source.status === 'failed' ? 'bg-red-600' : 'bg-blue-600'
                                }`}
                                style={{ width: `${source.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Start training button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleStartTraining}
                    disabled={isTraining || trainingSources.length === 0 || !selectedChatbot || isLoadingChatbots}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTraining ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Training...
                      </span>
                    ) : 'Start Training'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}