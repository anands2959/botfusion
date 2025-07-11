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
  const [selectedModel, setSelectedModel] = useState<string>('chatgpt-pro');
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    google: '',
    openrouter: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Training state
  const [activeTab, setActiveTab] = useState<'models' | 'training'>('models');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [isAddingWebsite, setIsAddingWebsite] = useState(false);
  const [trainingSources, setTrainingSources] = useState<TrainingSource[]>([]);
  const [expandedSources, setExpandedSources] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedChatbot, setSelectedChatbot] = useState<string>('');
  const [chatbots, setChatbots] = useState<any[]>([]);
  const [isLoadingChatbots, setIsLoadingChatbots] = useState(false);

  // Toggle source details visibility
  const toggleSourceDetails = (sourceId: string) => {
    setExpandedSources(prev =>
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  // List of available AI models
  const availableModels: AIModel[] = [
    {
      id: 'gemini-pro',
      name: 'Google Gemini',
      provider: 'google',
      description: 'Google\'s Gemini with enhanced web search integration and real-time data access',
      apiKeyRequired: true
    }, {
      id: 'chatgpt-pro',
      name: 'OpenAI ChatGPT',
      provider: 'chatgpt',
      description: 'OpenAI\'s ChatGPT with web search capabilities and real-time information access',
      apiKeyRequired: true
    },
    {
      id: 'openrouter-pro',
      name: 'OpenRouter DeepSeek R1',
      provider: 'openrouter',
      description: 'DeepSeek R1 0528 (free) via OpenRouter with advanced reasoning capabilities',
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
          setSelectedModel(data.settings.defaultAIModel || 'chatgpt-pro');
          setApiKeys({
            openai: data.settings.openaiApiKey || '',
            google: data.settings.googleApiKey || '',
            openrouter: data.settings.openrouterApiKey || ''
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
          await fetchTrainingSources(data.chatbots[0].id);
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
    if (!chatbotId) return [];

    try {
      const response = await fetch(`/api/chatbots/${chatbotId}/train`);
      if (!response.ok) throw new Error('Failed to fetch training sources');

      const data = await response.json();
      const sources = data.trainingSources || [];
      setTrainingSources(sources);
      return sources;
    } catch (err) {
      console.error('Error fetching training sources:', err);
      setError('Failed to load training sources. Please try again.');
      return [];
    }
  };

  // Handle chatbot selection change
  const handleChatbotChange = async (chatbotId: string) => {
    setSelectedChatbot(chatbotId);
    setError(''); // Clear any previous errors
    await fetchTrainingSources(chatbotId);
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
          googleApiKey: apiKeys.google,
          openrouterApiKey: apiKeys.openrouter
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }

      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
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

    // Basic URL validation
    try {
      new URL(websiteUrl);
    } catch (e) {
      setError('Please enter a valid URL (including http:// or https://)');
      return;
    }

    setIsAddingWebsite(true);
    setError('');
    setSuccessMessage('Adding website for training...');

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
      const addedSourceUrl = websiteUrl; // Store URL for later reference
      // Update the training sources state with the new source
      setTrainingSources(prev => [data.trainingSource, ...prev]);
      setWebsiteUrl('');
      setSuccessMessage('Website added successfully! The crawler will begin extracting content shortly.');

      // Set up polling to show progress updates during crawling
      const pollInterval = setInterval(async () => {
        const updatedSources = await fetchTrainingSources(selectedChatbot);

        // Find the source we just added
        const addedSource = updatedSources.find(source =>
          source.type === 'website' && source.url === addedSourceUrl
        );

        if (addedSource) {
          // Update progress message based on current status
          if (addedSource.status === 'processing') {
            if (addedSource.filename) {
              setSuccessMessage(`Extracting content: ${addedSource.filename} (${addedSource.progress}% complete)`);
            } else {
              setSuccessMessage(`Extracting content from website (${addedSource.progress}% complete)`);
            }
          }

          // If source is completed or failed, stop polling
          if (addedSource.status === 'completed' || addedSource.status === 'failed') {
            clearInterval(pollInterval);

            if (addedSource.status === 'completed') {
              setSuccessMessage('Website content extracted successfully! Click "Start Training" to process with your selected AI model.');
              setTimeout(() => setSuccessMessage(''), 5000);
            } else {
              setError(`Failed to extract content from ${addedSourceUrl}. Please check the URL and try again.`);
            }
          }
        }
      }, 2000); // Poll every 2 seconds for responsive updates

      // Safety timeout after 2 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
      }, 120000);

      // Refresh the training sources to ensure we have the latest data
      await fetchTrainingSources(selectedChatbot);
    } catch (err: any) {
      console.error('Error adding website:', err);
      setError(err.message || 'Failed to add website. Please try again.');
    } finally {
      setIsAddingWebsite(false);
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
    setIsAddingWebsite(true); // Use existing state variable for loading indicator
    setError('');
    setSuccessMessage(`Uploading ${file.name}...`);

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
      const uploadedFileName = file.name; // Store filename for later reference
      // Update the training sources state with the new source
      setTrainingSources(prev => [data.trainingSource, ...prev]);
      setSuccessMessage(`PDF ${uploadedFileName} uploaded successfully! Processing will begin shortly.`);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Set up polling to show progress updates during PDF processing
      const pollInterval = setInterval(async () => {
        const updatedSources = await fetchTrainingSources(selectedChatbot);

        // Find the source we just added (match by filename)
        const addedSource = updatedSources.find(source =>
          source.type === 'pdf' && source.filename && source.filename.includes(uploadedFileName)
        );

        if (addedSource) {
          // Update progress message based on current status
          if (addedSource.status === 'processing') {
            setSuccessMessage(`Processing PDF: ${uploadedFileName} (${addedSource.progress}% complete)`);
          }

          // If source is completed or failed, stop polling
          if (addedSource.status === 'completed' || addedSource.status === 'failed') {
            clearInterval(pollInterval);

            if (addedSource.status === 'completed') {
              setSuccessMessage(`PDF ${uploadedFileName} processed successfully! Click "Start Training" to process with your selected AI model.`);
              setTimeout(() => setSuccessMessage(''), 5000);
            } else {
              setError(`Failed to process PDF ${uploadedFileName}. Please check the file and try again.`);
            }
          }
        }
      }, 2000); // Poll every 2 seconds for responsive updates

      // Safety timeout after 2 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
      }, 120000);

      // Refresh the training sources to ensure we have the latest data
      await fetchTrainingSources(selectedChatbot);
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError(err.message || 'Failed to upload file. Please try again.');
    } finally {
      setIsAddingWebsite(false); // Use existing state variable for loading indicator
    }
  };

  // Start training process
  const handleStartTraining = async () => {
    if (!selectedChatbot) {
      setError('Please select a chatbot to train');
      return;
    }

    // Fetch the latest training sources first
    const currentSources = await fetchTrainingSources(selectedChatbot);

    if (currentSources.length === 0) {
      setError('Please add at least one website or PDF document for training');
      return;
    }

    // Check if there are any pending or processing sources to train
    const pendingSources = currentSources.filter(source => source.status === 'pending' || source.status === 'processing');
    if (pendingSources.length === 0) {
      setError('No sources available for training. Please add new sources or check if all sources are already completed.');
      return;
    }

    setIsTraining(true);
    setError('');
    setSuccessMessage('Initializing training process...');

    try {
      const response = await fetch(`/api/chatbots/${selectedChatbot}/train`, {
        method: 'PUT'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start training');
      }

      setSuccessMessage('Training process started! Crawling websites and processing documents...');

      // Poll for updates more frequently during active training
      const pollInterval = setInterval(async () => {
        const updatedSources = await fetchTrainingSources(selectedChatbot);

        // Calculate overall progress
        const totalProgress = updatedSources.reduce((sum, source) => sum + source.progress, 0) / updatedSources.length;

        // Update success message based on progress
        if (totalProgress < 30) {
          setSuccessMessage(`Training in progress: Initializing content extraction (${Math.round(totalProgress)}%)`);
        } else if (totalProgress < 70) {
          setSuccessMessage(`Training in progress: Extracting content from sources (${Math.round(totalProgress)}%)`);
        } else if (totalProgress < 90) {
          setSuccessMessage(`Training in progress: Processing content (${Math.round(totalProgress)}%)`);
        } else if (totalProgress < 100) {
          setSuccessMessage(`Training in progress: Generating AI model embeddings (${Math.round(totalProgress)}%)`);
        }

        // Check if all sources are completed or failed
        const allDone = updatedSources.every(source =>
          source.status === 'completed' || source.status === 'failed'
        );

        if (allDone) {
          clearInterval(pollInterval);
          setIsTraining(false);

          // Count completed and failed sources
          const completedCount = updatedSources.filter(source => source.status === 'completed').length;
          const failedCount = updatedSources.filter(source => source.status === 'failed').length;

          if (failedCount === 0) {
            setSuccessMessage(`AI model trained successfully with your content! ${completedCount} source(s) processed.`);
          } else if (completedCount === 0) {
            setError(`Training failed for all ${failedCount} source(s). Please check your content and try again.`);
            setSuccessMessage('');
          } else {
            setSuccessMessage(`AI model training completed with mixed results: ${completedCount} source(s) successful, ${failedCount} source(s) failed.`);
          }

          // Clear success message after a delay
          setTimeout(() => setSuccessMessage(''), 5000);
        }
      }, 3000); // Poll every 3 seconds for more responsive updates

      // Stop polling after 5 minutes as a safety measure
      setTimeout(() => {
        clearInterval(pollInterval);
        setIsTraining(false);
        setSuccessMessage('');
        setError('Training process timed out. Please check your sources and try again if needed.');
      }, 300000); // 5 minutes timeout

    } catch (err: any) {
      console.error('Error starting training:', err);
      setError(err.message || 'Failed to start training. Please try again.');
      setIsTraining(false);
    }
  };

  // Remove training source
  const handleRemoveSource = async (sourceId: string) => {
    if (!selectedChatbot) return;

    try {
      // Update the UI immediately for better user experience
      setTrainingSources(prev => prev.filter(source => source.id !== sourceId));

      // Make an API call to remove the source from the database
      const response = await fetch(`/api/chatbots/${selectedChatbot}/train/${sourceId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete training source');
      }

      setSuccessMessage('Source removed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Refresh the training sources to ensure we have the latest data
      await fetchTrainingSources(selectedChatbot);
    } catch (err: any) {
      console.error('Error removing source:', err);
      setError(err.message || 'Failed to remove source. Please try again.');
      // Refresh the training sources to ensure UI is in sync with the database
      await fetchTrainingSources(selectedChatbot);
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Premium AI Model with Web Search</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Choose from our premium AI models that can search the web for real-time information and provide up-to-date responses to user queries.
                </p>
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
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{model.name}</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                            </svg>
                            Web Search
                          </span>
                        </div>
                        <span className="block text-sm text-gray-500 mt-1">{model.description}</span>
                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                          Provider: {model.provider.charAt(0).toUpperCase() + model.provider.slice(1)}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">API Keys</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Enter your API keys for the AI providers you want to use. These premium models offer web search capabilities and access to real-time information. Your keys are securely stored and never shared.
                </p>
                <div className="p-3 bg-blue-50 text-blue-700 rounded-md mb-4">
                  <p className="text-sm font-medium">Web Search Capability</p>
                  <p className="text-xs mt-1">The selected models can search the web for real-time information, enhancing your chatbot's knowledge with up-to-date data beyond its training.</p>
                </div>

                <div className="space-y-4">
                <div>
                    <label htmlFor="google-key" className="block text-sm font-medium text-gray-700 mb-1">
                      Google API Key (for Gemini model)
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
                    <label htmlFor="openai-key" className="block text-sm font-medium text-gray-700 mb-1">
                      OpenAI API Key (for GPT model)
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
                    <label htmlFor="openrouter-key" className="block text-sm font-medium text-gray-700 mb-1">
                      OpenRouter API Key (for DeepSeek R1 model)
                    </label>
                    <input
                      type="password"
                      id="openrouter-key"
                      value={apiKeys.openrouter}
                      onChange={(e) => handleApiKeyChange('openrouter', e.target.value)}
                      className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="sk_or_..."
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
                                {source.status === 'completed' && (
                                  <button
                                    onClick={() => toggleSourceDetails(source.id)}
                                    className="ml-2 text-xs text-blue-600 hover:text-blue-800 underline"
                                  >
                                    {expandedSources.includes(source.id) ? 'Hide Details' : 'Show Details'}
                                  </button>
                                )}
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
                                className={`h-2.5 rounded-full ${source.status === 'failed' ? 'bg-red-600' : 'bg-blue-600'
                                  }`}
                                style={{ width: `${source.progress}%` }}
                              ></div>
                            </div>
                            {source.filename && source.status === 'processing' && (
                              <div className="mt-1 text-xs text-gray-500">{source.filename}</div>
                            )}
                          </div>

                          {/* Show extracted data for completed sources */}
                          {source.status === 'completed' && expandedSources.includes(source.id) && (
                            <div className="mt-3 p-2 bg-gray-50 rounded border border-gray-200 text-sm">
                              <h5 className="font-medium mb-1">Training Details:</h5>
                              <p className="text-gray-700 mb-2">{source.filename || source.url}</p>

                              {source.type === 'website' && source.url && (
                                <div>
                                  <p className="text-gray-600 text-xs mb-1">Source website:</p>
                                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                                    {source.url}
                                  </a>

                                  {/* Display crawled URLs */}
                                  {source.extractedUrls && source.extractedUrls.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-gray-600 text-xs mb-1">Crawled pages ({source.extractedUrls.length}):</p>
                                      <div className="max-h-32 overflow-y-auto text-xs">
                                        {source.extractedUrls.map((url, index) => (
                                          <a
                                            key={index}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-blue-600 hover:underline truncate mb-1"
                                          >
                                            {url}
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {source.type === 'pdf' && source.filename && (
                                <p className="text-gray-600 text-xs">Extracted from PDF: {source.filename}</p>
                              )}

                              {/* Display extracted content preview */}
                              {source.extractedContent && (
                                <div className="mt-2">
                                  <p className="text-gray-600 text-xs mb-1">Content preview:</p>
                                  <div className="max-h-32 overflow-y-auto p-2 bg-white border border-gray-200 rounded text-xs">
                                    {source.extractedContent.length > 500
                                      ? source.extractedContent.substring(0, 500) + '...'
                                      : source.extractedContent
                                    }
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Start training button */}
                {/* <div className="flex justify-end">
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
                </div> */}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}