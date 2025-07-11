'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Chatbot {
  id: string;
  name: string;
  welcomeMessage: string;
  logoUrl: string | null;
  colorScheme: string;
  widgetPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function ChatbotEditor() {
  // Chatbot state
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [colorScheme, setColorScheme] = useState('#3B82F6'); // Default blue
  const [customColor, setCustomColor] = useState('');
  const [isCustomColor, setIsCustomColor] = useState(false);
  const [widgetPosition, setWidgetPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const welcomeMessageRef = useRef<HTMLTextAreaElement>(null);
  
  // Color scheme options
  const colorOptions = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Pink', value: '#EC4899' },
  ];

  // Fetch chatbots on component mount
  useEffect(() => {
    fetchChatbots();
  }, []);

  // Fetch all chatbots
  const fetchChatbots = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chatbots');
      if (!response.ok) throw new Error('Failed to fetch chatbots');
      
      const data = await response.json();
      setChatbots(data.chatbots || []);
      
      // Select the first chatbot by default if available
      if (data.chatbots && data.chatbots.length > 0) {
        selectChatbot(data.chatbots[0]);
      }
    } catch (err) {
      console.error('Error fetching chatbots:', err);
      setError('Failed to load chatbots. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Select a chatbot to edit
  const selectChatbot = (chatbot: Chatbot) => {
    setSelectedChatbot(chatbot);
    setName(chatbot.name);
    setWelcomeMessage(chatbot.welcomeMessage);
    
    // Check if the color is one of the predefined options or custom
    const isPresetColor = colorOptions.some(option => option.value === chatbot.colorScheme);
    if (isPresetColor) {
      setColorScheme(chatbot.colorScheme);
      setIsCustomColor(false);
    } else {
      setCustomColor(chatbot.colorScheme);
      setColorScheme('');
      setIsCustomColor(true);
    }
    
    setWidgetPosition(chatbot.widgetPosition);
    setLogoPreview(chatbot.logoUrl.startsWith('mongodb-image-') 
    ? `/uploads/${chatbot.userId}/${chatbot.logoUrl}` 
    : chatbot.logoUrl);
    setIsCreatingNew(false);
  };

  // Start creating a new chatbot
  const startNewChatbot = () => {
    setSelectedChatbot(null);
    setName('');
    setWelcomeMessage('Hi there! How can I help you today?');
    setColorScheme('#3B82F6');
    setCustomColor('');
    setIsCustomColor(false);
    setWidgetPosition('bottom-right');
    setLogoPreview(null);
    setLogoFile(null);
    setIsCreatingNew(true);
  };

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Save chatbot settings
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      // Prepare form data for file upload
      const formData = new FormData();
      formData.append('name', name);
      formData.append('welcomeMessage', welcomeMessage);
      formData.append('colorScheme', isCustomColor ? customColor : colorScheme);
      formData.append('widgetPosition', widgetPosition);
      
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      let response;
      if (isCreatingNew) {
        // Create new chatbot
        response = await fetch('/api/chatbots', {
          method: 'POST',
          body: formData
        });
      } else if (selectedChatbot) {
        // Update existing chatbot
        response = await fetch(`/api/chatbots/${selectedChatbot.id}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        throw new Error('No chatbot selected');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save chatbot');
      }

      const data = await response.json();
      
      // Refresh the chatbot list
      await fetchChatbots();
      
      // Select the newly created or updated chatbot
      if (data.chatbot) {
        selectChatbot(data.chatbot);
      }
      
      setSuccessMessage(isCreatingNew ? 'Chatbot created successfully!' : 'Chatbot updated successfully!');
      setIsCreatingNew(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err : any) {
      console.error('Error saving chatbot:', err);
      setError(err.message || 'Failed to save chatbot. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete chatbot
  const handleDelete = async () => {
    if (!selectedChatbot || !confirm('Are you sure you want to delete this chatbot?')) {
      return;
    }

    try {
      const response = await fetch(`/api/chatbots/${selectedChatbot.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete chatbot');
      }

      // Refresh the chatbot list
      await fetchChatbots();
      
      setSuccessMessage('Chatbot deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reset form if there are no more chatbots
      if (chatbots.length === 0) {
        startNewChatbot();
      }
    } catch (err : any) {
      console.error('Error deleting chatbot:', err);
      setError(err.message || 'Failed to delete chatbot. Please try again.');
    }
  };

  // Function to format message with line breaks and markdown-like formatting
  const formatMessage = (message: string) => {
    if (!message) return '';
    
    // Replace line breaks with <br> tags
    let formatted = message.replace(/\n/g, '<br>');
    
    // Replace markdown-style formatting
    // Bold: **text** -> <strong>text</strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic: *text* -> <em>text</em> (but not if it's part of **text**)
    // Using a more compatible approach without lookbehind/lookahead
    formatted = formatted.replace(/\b\*([^\*\n]+)\*\b/g, '<em>$1</em>');
    
    // Underline: __text__ -> <u>text</u>
    formatted = formatted.replace(/__(.*?)__/g, '<u>$1</u>');
    
    // Bullet points: * item -> • item (with proper spacing)
    // Process each line separately to handle bullet points correctly
    formatted = formatted.split('<br>').map(line => {
      // Convert bullet points at the beginning of lines
      return line.replace(/^\s*\*\s(.+)$/, '• $1');
    }).join('<br>');
    
    // Return as HTML
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <div className="bg-white rounded-lg">
      {/* <h2 className="text-xl font-semibold text-gray-900 mb-6">Chatbot Editor</h2> */}
      
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
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Chatbot list sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Your Chatbots</h3>
              <button
                type="button"
                onClick={startNewChatbot}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New
              </button>
            </div>
            
            {chatbots.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">No chatbots yet</p>
                <button
                  type="button"
                  onClick={startNewChatbot}
                  className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create your first chatbot
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {chatbots.map((chatbot) => (
                  <div 
                    key={chatbot.id} 
                    onClick={() => selectChatbot(chatbot)}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedChatbot?.id === chatbot.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <div className="flex items-center">
                      {chatbot.logoUrl ? (
                        <div className="h-8 w-8 mr-3 rounded-full overflow-hidden bg-gray-100">
                          <Image 
                            src={chatbot.logoUrl.startsWith('mongodb-image-') 
                              ? `/uploads/${chatbot.userId}/${chatbot.logoUrl}` 
                              : chatbot.logoUrl} 
                            alt={chatbot.name} 
                            width={32} 
                            height={32} 
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-8 w-8 mr-3 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{chatbot.name}</div>
                        <div className="text-xs text-gray-500">
                          Last updated: {new Date(chatbot.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Chatbot editor form */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Chatbot Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value )}
                    className="mt-1 block text-gray-700 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="My Awesome Chatbot"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="welcome-message" className="block text-sm font-medium text-gray-700">
                    Welcome Message
                  </label>
                  <div className="mt-1 relative">
                    <textarea
                      id="welcome-message"
                      ref={welcomeMessageRef}
                      value={welcomeMessage}
                      onChange={(e) => setWelcomeMessage(e.target.value || 'Hi there! How can I help you today?')}
                      rows={5}
                      className="resize-none block text-gray-700 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Hi there! How can I help you today?"
                      required
                    />
                    <div className="absolute right-2 bottom-2 flex space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = welcomeMessageRef.current;
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const value = textarea.value;
                            const newValue = value.substring(0, start) + '\n' + value.substring(end);
                            setWelcomeMessage(newValue);
                            // Set cursor position after the inserted line break
                            setTimeout(() => {
                              textarea.selectionStart = textarea.selectionEnd = start + 1;
                              textarea.focus();
                            }, 0);
                          }
                        }}
                        className="p-1 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Insert line break"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = welcomeMessageRef.current;
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const value = textarea.value;
                            const newValue = value.substring(0, start) + '\n\n' + value.substring(end);
                            setWelcomeMessage(newValue);
                            // Set cursor position after the inserted paragraph break
                            setTimeout(() => {
                              textarea.selectionStart = textarea.selectionEnd = start + 2;
                              textarea.focus();
                            }, 0);
                          }
                        }}
                        className="p-1 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Insert paragraph break"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Use the buttons to add line breaks or paragraph spacing</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                      ) : (
                        <svg className="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="logo-upload"
                        ref={fileInputRef}
                        onChange={handleLogoChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Upload Logo
                      </button>
                      <p className="text-xs text-gray-500 mt-1">Recommended: 512x512px square image</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Scheme
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
                    {colorOptions.map((color) => (
                      <div key={color.value} className="relative">
                        <input
                          type="radio"
                          id={`color-${color.value}`}
                          name="colorScheme"
                          value={color.value}
                          checked={!isCustomColor && colorScheme === color.value}
                          onChange={() => {
                            setColorScheme(color.value);
                            setIsCustomColor(false);
                          }}
                          className="sr-only text-gray-700"
                        />
                        <label
                          htmlFor={`color-${color.value}`}
                          className={`block w-full p-2 border rounded-md cursor-pointer focus:outline-none ${!isCustomColor && colorScheme === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : 'border-gray-200'}`}
                        >
                          <span className="flex items-center justify-center">
                            <span 
                              className="h-8 w-8 rounded-full border border-gray-200" 
                              style={{ backgroundColor: color.value }}
                            />
                          </span>
                          <span className="block text-gray-700 text-xs text-center mt-1">{color.name}</span>
                        </label>
                      </div>
                    ))}
                    <div className="relative">
                      <input
                        type="radio"
                        id="color-custom"
                        name="colorScheme"
                        checked={isCustomColor}
                        onChange={() => {
                          setIsCustomColor(true);
                          if (!customColor) setCustomColor('#000000');
                        }}
                        className="sr-only "
                      />
                      <label
                        htmlFor="color-custom"
                        className={`block w-full p-2 border rounded-md cursor-pointer focus:outline-none ${isCustomColor ? 'ring-2 ring-offset-2 ring-blue-500' : 'border-gray-200'}`}
                      >
                        <span className="flex items-center justify-center">
                          <span 
                            className="h-8 w-8 rounded-full border border-gray-200 overflow-hidden" 
                            style={{ backgroundColor: customColor || '#FFFFFF' }}
                          >
                            {!customColor && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                              </svg>
                            )}
                          </span>
                        </span>
                        <span className="block text-gray-700 text-xs text-center mt-1">Custom</span>
                      </label>
                    </div>
                  </div>
                  
                  {isCustomColor && (
                    <div className=" flex items-center space-x-3">
                      <div>
                        <label htmlFor="custom-color" className="sr-only">Custom Color</label>
                        <input
                          type="color"
                          id="custom-color"
                          value={customColor || '#000000'}
                          onChange={(e) => setCustomColor(e.target.value)}
                          className="h-10 w-10 border-0 rounded-md cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={customColor || ''}
                          onChange={(e) => setCustomColor(e.target.value)}
                          placeholder="#RRGGBB"
                          className="block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Widget Position
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { value: 'bottom-right', label: 'Bottom Right' },
                      { value: 'bottom-left', label: 'Bottom Left' },
                      { value: 'top-right', label: 'Top Right' },
                      { value: 'top-left', label: 'Top Left' }
                    ].map((position) => (
                      <div key={position.value} className="relative">
                        <input
                          type="radio"
                          id={`position-${position.value}`}
                          name="widgetPosition"
                          value={position.value}
                          checked={widgetPosition === position.value}
                          onChange={() => setWidgetPosition(position.value as any)}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`position-${position.value}`}
                          className={`block w-full p-2 border rounded-md cursor-pointer focus:outline-none ${widgetPosition === position.value ? 'ring-2 ring-offset-2 ring-blue-500 border-blue-500' : 'border-gray-200'}`}
                        >
                          <div className="h-16 bg-gray-100 rounded-md relative">
                            <div 
                              className={`absolute h-6 w-6 rounded-full bg-blue-500 ${{
                                'bottom-right': 'bottom-1 right-1',
                                'bottom-left': 'bottom-1 left-1',
                                'top-right': 'top-1 right-1',
                                'top-left': 'top-1 left-1'
                              }[position.value]}`}
                            />
                          </div>
                          <span className="block text-gray-700 text-xs text-center mt-1">{position.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                {selectedChatbot && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete Chatbot
                  </button>
                )}
                <div className="flex space-x-3">
                  {isCreatingNew && chatbots.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (chatbots.length > 0) {
                          selectChatbot(chatbots[0]);
                        }
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : isCreatingNew ? 'Create Chatbot' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
            
            {/* Chatbot preview */}
            {(name || selectedChatbot) && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
                <div className="bg-gray-100 p-4 rounded-lg relative h-96">
                  {/* Widget button */}
                  <div 
                    className={`absolute h-14 w-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer ${{
                      'bottom-right': 'bottom-4 right-4',
                      'bottom-left': 'bottom-4 left-4',
                      'top-right': 'top-4 right-4',
                      'top-left': 'top-4 left-4'
                    }[widgetPosition]}`}
                    style={{ backgroundColor: isCustomColor ? customColor : colorScheme }}
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Chatbot logo" className="h-8 w-8 rounded-full object-cover" />
                    ) : selectedChatbot?.logoUrl ? (
                      <Image 
                        src={selectedChatbot.logoUrl.startsWith('mongodb-image-') 
                          ? `/uploads/${selectedChatbot.userId}/${selectedChatbot.logoUrl}` 
                          : selectedChatbot.logoUrl} 
                        alt="Chatbot logo" 
                        className="h-8 w-8 rounded-full object-cover" 
                      />
                    ) : (
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Chat window */}
                  <div 
                    className={`absolute w-80 bg-white rounded-lg shadow-xl overflow-hidden ${{
                      'bottom-right': 'bottom-20 right-4',
                      'bottom-left': 'bottom-20 left-4',
                      'top-right': 'top-20 right-4',
                      'top-left': 'top-20 left-4'
                    }[widgetPosition]}`}
                  >
                    {/* Chat header */}
                    <div className="p-4" style={{ backgroundColor: isCustomColor ? customColor : colorScheme }}>
                      <div className="flex items-center">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Chatbot logo" className="h-8 w-8 rounded-full mr-3 object-cover" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-white bg-opacity-20 mr-3 flex items-center justify-center">
                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                        )}
                        <div className="text-white font-medium">{name || 'Chatbot'}</div>
                      </div>
                    </div>
                    
                    {/* Chat messages */}
                    <div className="p-4 h-64 overflow-y-auto bg-gray-50">
                      <div className="flex mb-4">
                        <div className="flex-shrink-0 mr-3">
                          {logoPreview ? (
                            <img src={logoPreview} alt="Chatbot logo" className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            <div className="h-8 w-8 rounded-full" style={{ backgroundColor: isCustomColor ? customColor : colorScheme }}>
                              <svg className="h-8 w-8 text-white p-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">
                            {formatMessage(welcomeMessage || 'Hi there! How can I help you today?')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Chat input */}
                    <div className="p-3 border-t border-gray-200">
                      <div className="flex rounded-md shadow-sm">
                        <input
                          type="text"
                          className="flex-1 p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-full sm:text-sm border-gray-300"
                          placeholder="Type your message..."
                          disabled
                        />
                        <button
                          type="button"
                          className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white"
                          style={{ backgroundColor: isCustomColor ? customColor : colorScheme }}
                          disabled
                        >
                           <svg className="h-5 w-3 rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}