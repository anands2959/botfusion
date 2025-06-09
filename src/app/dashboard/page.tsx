'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AIModelSettings from '@/components/AIModelSettings';

// Icons for the sidebar
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ChatbotIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

const AIModelIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', content: 'Welcome to BotFusion! How can I help you today?' },
  ]);

  // Function to handle chat submission
  const handleChatSubmit = (e:any) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message
    setChatMessages([...chatMessages, { role: 'user', content: chatInput }]);
    
    // Simulate bot response based on input
    setTimeout(() => {
      let botResponse = "I'm sorry, I don't have an answer for that yet. Our team is constantly improving my knowledge base.";
      
      // Simple response logic based on keywords
      const input = chatInput.toLowerCase();
      if (input.includes('pricing') || input.includes('plan') || input.includes('cost')) {
        botResponse = "We offer flexible pricing plans starting with a free tier. Our Pro plan is $29/month and includes 5 chatbots and 5,000 messages. For enterprise needs, our Business plan at $99/month offers unlimited chatbots.";
      } else if (input.includes('integrate') || input.includes('website') || input.includes('add')) {
        botResponse = "Integrating BotFusion with your website is simple! Just add our JavaScript snippet to your site, and your AI chatbot will be live. You can customize its appearance and behavior from your dashboard.";
      } else if (input.includes('customize') || input.includes('style') || input.includes('design')) {
        botResponse = "You can fully customize your chatbot's appearance to match your brand. Change colors, fonts, position, and even the chat bubble icon. All customizations can be done through our user-friendly interface without coding.";
      } else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
        botResponse = "Hello! I'm your BotFusion assistant. I can help answer questions about our platform, pricing, integration, and more. What would you like to know?";
      } else if (input.includes('feature') || input.includes('capability')) {
        botResponse = "BotFusion offers powerful features including website and PDF analysis, custom styling, one-line integration, and detailed analytics. Our AI understands context and can provide accurate responses to your visitors' questions.";
      }
      
      setChatMessages(prev => [...prev, { role: 'system', content: botResponse }]);
    }, 1000);
    
    // Clear input
    setChatInput('');
  };

  // Sample data for the dashboard
  const stats = [
    { name: 'Total Chatbots', value: '12', icon: (
      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ) },
    { name: 'Active Users', value: '2,543', icon: (
      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ) },
    { name: 'Messages Processed', value: '45,678', icon: (
      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ) },
    { name: 'Avg. Response Time', value: '1.2s', icon: (
      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) },
  ];

  const recentChatbots = [
    { id: 1, name: 'Website Assistant', status: 'active', interactions: 1243, lastUpdated: '2 hours ago' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-md transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen ? (
            <Link href="/">
              <Image
                src="/botfusion-logo.png"
                alt="BotFusion Logo"
                width={140}
                height={32}
                priority
              />
            </Link>
          ) : (
            <div className="w-10 h-10 mx-auto">
              <Image
                src="/botfusion-logo.png"
                alt="BF"
                width={40}
                height={40}
                priority
              />
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              )}
            </svg>
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-1 ">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center w-full px-4 py-4  text-sm font-medium rounded-md ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <DashboardIcon />
              {sidebarOpen && <span className="ml-3">Dashboard</span>}
            </button>

            <button
              onClick={() => setActiveTab('chatbots')}
              className={`flex items-center w-full p-4 text-sm font-medium rounded-md ${activeTab === 'chatbots' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <ChatbotIcon />
              {sidebarOpen && <span className="ml-3">Chatbot Edit</span>}
            </button>

            <button
              onClick={() => setActiveTab('aimodels')}
              className={`flex items-center w-full p-4 text-sm font-medium rounded-md ${activeTab === 'aimodels' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <AIModelIcon />
              {sidebarOpen && <span className="ml-3">AI Models</span>}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center w-full p-4 text-sm font-medium rounded-md ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <SettingsIcon />
              {sidebarOpen && <span className="ml-3">Settings</span>}
            </button>
          </div>
        </nav>

        {sidebarOpen && (
          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-semibold">
                AS
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Anand Sharma</p>
                <p className="text-xs font-medium text-gray-500">Pro Plan</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'chatbots' && 'Chatbot Edit'}
              {activeTab === 'aimodels' && 'AI Model Settings'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <div className="relative">
                <button className="flex items-center text-sm font-medium text-white bg-red-600 p-2 rounded-md hover:bg-red-400 hover:text-white hover:text-gray-800 focus:outline-none">
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {activeTab === 'dashboard' && (
            <div>
              {/* Stats */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.name} className="bg-white overflow-hidden shadow-md rounded-lg border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="px-4 py-5 sm:p-6 flex items-center">
                      <div className="flex-shrink-0 bg-primary-50 rounded-md p-3 mr-4">
                        {stat.icon}
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</dd>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Dashboard Content */}
              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column - Recent Chatbots */}
                <div className="lg:col-span-2">
                  <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Recent Chatbots</h3>
                      
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Interactions
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Last Updated
                            </th>
                           
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {recentChatbots.map((chatbot) => (
                            <tr key={chatbot.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{chatbot.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${chatbot.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {chatbot.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {chatbot.interactions.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {chatbot.lastUpdated}
                              </td>
                             
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Activity Chart */}
                  <div className="mt-6 bg-white p-6 shadow-md rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-900">Activity Overview</h2>
                      <div className="flex space-x-2">
                        {/* <button className="px-3 py-1 text-xs font-medium rounded-md bg-primary-100 text-primary-700">Daily</button>
                        <button className="px-3 py-1 text-xs font-medium rounded-md text-gray-500 hover:bg-gray-100">Weekly</button> */}
                        <button className="px-3 py-1 text-xs font-medium rounded-md text-gray-500 hover:bg-gray-100">Monthly</button>
                      </div>
                    </div>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">Activity chart would be displayed here</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Chatbot Demo */}
                <div className="lg:col-span-1">
                  <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 flex flex-col h-full">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                      <h3 className="text-lg font-medium text-gray-900">Website Assistant</h3>
                      <p className="mt-1 text-sm text-gray-500">Test your chatbot responses</p>
                    </div>
                    
                    <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4" style={{ maxHeight: '400px' }}>
                      {chatMessages.map((message, index) => (
                        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-800'}`}>
                            {message.content}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 p-4">
                      <form onSubmit={handleChatSubmit} className="flex space-x-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 focus:ring-blue-500 text-gray-700 focus:border-blue-500 block w-full rounded-md sm:text-sm border-gray-300"
                        />
                        <button
                          type="submit"
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chatbots' && (
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Chatbot Editor</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No chatbot selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a chatbot from the list to edit or create a new one.</p>
                <div className="mt-6">
                  <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create New Chatbot
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'aimodels' && <AIModelSettings />}

          {activeTab === 'settings' && (
            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Account Settings</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Update your account information and preferences.</p>
                </div>
                <form className="mt-5 space-y-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                      <input type="text" name="first-name" id="first-name" defaultValue="Anand" className="mt-1 block text-gray-700 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                      <input type="text" name="last-name" id="last-name" defaultValue="Sharma" className="mt-1 block text-gray-700 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Email address</label>
                      <input type="text" disabled name="email-address" id="email-address" defaultValue="anand@example.com" className="mt-1 block text-gray-700 w-full border bg-gray-100 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input type="number" name="phone-number" id="phone-number" defaultValue="+91-1234567890" className="mt-1 block text-gray-700 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      Cancel
                    </button>
                    <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      Save
                    </button>
                  </div>
                </form>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">API Keys</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Manage your API keys for integrating BotFusion with your applications.</p>
                </div>
                <div className="mt-5">
                  <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Generate New API Key
                  </button>
                </div>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Account</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Permanently delete your account and all of your content.</p>
                </div>
                <div className="mt-5">
                  <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}