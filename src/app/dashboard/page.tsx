'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import AIModelSettings from '@/components/AIModelSettings';
import ChatbotEditor from '@/components/ChatbotEditor';
import ApiKeyGenerator from '@/components/ApiKeyGenerator';
import { TrainingSource, Chatbot } from '@/types/chatbot';

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  // Define the ChatMessage type
  type ChatMessage = {
    role: string;
    content: string;
    isTyping?: boolean;
  };

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    settings: {
      phone: ''
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [selectedChatbotId, setSelectedChatbotId] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Redirect if not authenticated and handle tab parameter
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    } else if (status === 'authenticated') {
      // Check for tab parameter in URL
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab');
      if (tabParam && ['dashboard', 'chatbots', 'aimodels', 'settings'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, [status, router]);

  // Fetch user data when session is available
  useEffect(() => {
    if (session?.user) {
      // Initialize with session data
      setUserData({
        name: session.user.name || '',
        email: session.user.email || '',
        settings: {
          phone: ''
        }
      });

      // Fetch complete user data from API
      fetchUserData();
      // Fetch chatbots data
      fetchChatbots();
    }
  }, [session]);

  const fetchChatbots = async () => {
    if (!session?.user) return;

    try {
      const response = await fetch('/api/chatbots');

      if (!response.ok) {
        throw new Error('Failed to fetch chatbots');
      }

      const data = await response.json();
      setChatbots(data.chatbots || []);

      // Set the first chatbot as selected if available and has API key
      if (data.chatbots && data.chatbots.length > 0) {
        const chatbotsWithApiKey = data.chatbots.filter((bot: Chatbot) => bot.apiKey);
        if (chatbotsWithApiKey.length > 0) {
          setSelectedChatbotId(chatbotsWithApiKey[0].id);
        } else if (data.chatbots.length > 0) {
          setSelectedChatbotId(data.chatbots[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching chatbots:', err);
    }
  };
  const fetchUserData = async () => {
    if (!session?.user) return;

    // setIsLoading(true);
    // setError('');

    try {
      const response = await fetch('/api/user');

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      const user = data.user;

      setUserData({
        name: user.name || '',
        email: user.email || '',
        settings: {
          phone: user.settings?.phone || ''
        }
      });
    } catch (err) {
      console.error('Error fetching user data:', err);
      // setError('Failed to load user data. Please try again.');
    } 
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleSaveSettings = async (e: any) => {
    e.preventDefault();
    setIsSaving(true);
    // setError('');

    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.settings.phone,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update user data');
      }

      // Show success message
      setSuccessMessage('Settings saved successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      console.error('Error updating user data:', err);
      // setError(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // If loading session or not authenticated yet, show loading state
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Function to handle chat submission
  const handleChatSubmit = async (e: any) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message to chat
    const newMessages = [
      ...chatMessages,
      { role: 'user', content: chatInput },
    ];
    setChatMessages(newMessages);

    const userMessage = chatInput;
    setChatInput('');

    // Get the selected chatbot
    const selectedChatbot = chatbots.find((bot: Chatbot) => bot.id === selectedChatbotId);
    if (!selectedChatbot || !selectedChatbot.apiKey) {
      // Add error message if no chatbot is selected or it has no API key
      setChatMessages([
        ...newMessages,
        { role: 'system', content: 'Error: No chatbot selected or chatbot has no API key. Please generate an API key for this chatbot first.' },
      ]);
      return;
    }

    try {
      // Show typing indicator
      setChatMessages([
        ...newMessages,
        { role: 'system', content: '...', isTyping: true },
      ]);

      // Call the actual chatbot API
      const response = await fetch(`/api/embed/${selectedChatbot.apiKey}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();

      // Replace typing indicator with actual response
      setChatMessages([
        ...newMessages,
        { role: 'system', content: data.response },
      ]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      // Replace typing indicator with error message
      setChatMessages([
        ...newMessages,
        { role: 'system', content: 'Sorry, there was an error processing your request. Please try again.' },
      ]);
    }
  };

  const handleChangePassword = async (e: any) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordError('');

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      setIsChangingPassword(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      setIsChangingPassword(false);
      return;
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to change password');
      }

      // Reset form and show success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordModal(false);
      setSuccessMessage('Password changed successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      console.error('Error changing password:', err);
      setPasswordError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Calculate dashboard stats from actual data
  const calculateStats = () => {
    // Count active chatbots (those with at least one completed training source)
    const activeChatbots = chatbots.filter((chatbot: Chatbot) =>
      chatbot.trainingSources?.some((source: TrainingSource) => source.status === 'completed')
    );

    // Count total training sources
    const totalTrainingSources = chatbots.reduce((total, chatbot: Chatbot) =>
      total + (chatbot.trainingSources?.length || 0), 0
    );

    // Count completed training sources
    const completedTrainingSources = chatbots.reduce((total, chatbot: Chatbot) =>
      total + (chatbot.trainingSources?.filter((source: TrainingSource) => source.status === 'completed').length || 0), 0
    );

    return [
      {
        name: 'Total Chatbots',
        value: chatbots.length.toString(),
        icon: (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )
      },
      {
        name: 'Active Chatbots',
        value: activeChatbots.length.toString(),
        icon: (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        name: 'Training Sources',
        value: totalTrainingSources.toString(),
        icon: (
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )
      },
      {
        name: 'Completed Sources',
        value: completedTrainingSources.toString(),
        icon: (
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        )
      },
    ];
  };

  const stats = calculateStats();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get chatbot status
  const getChatbotStatus = (chatbot: Chatbot) => {
    if (chatbot.trainingSources?.some((source: TrainingSource) => source.status === 'completed')) {
      return { status: 'active', className: 'bg-green-100 text-green-800' };
    } else if (chatbot.trainingSources?.some((source: TrainingSource) => source.status === 'processing')) {
      return { status: 'training', className: 'bg-yellow-100 text-yellow-800' };
    } else if (chatbot.trainingSources?.some((source: TrainingSource) => source.status === 'failed')) {
      return { status: 'failed', className: 'bg-red-100 text-red-800' };
    } else {
      return { status: 'inactive', className: 'bg-gray-100 text-gray-800' };
    }
  };


  // Password change modal
  const PasswordChangeModal = () => {
    if (!showPasswordModal) return null;

    return (
      <div className="fixed inset-0 bg-gray-200/80 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordError('');
                setPasswordData({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                });
              }}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {passwordError && (
            <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded">
              {passwordError}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isChangingPassword}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
            <div className="w-30 h-10">
              <Image
                src="/botfusion-short.png"
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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-300">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-semibold">
                {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : '?'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{session?.user?.name || 'User'}</p>
                {/* <p className="text-xs font-medium text-gray-500">Pro Plan</p> */}
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
              <button
                onClick={() => setShowDeveloperModal(true)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                title="About Developer"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <div className="relative">
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium text-white bg-red-600 p-2 rounded-md hover:red-400 hover:text-white focus:outline-none"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Success message */}
        {successMessage && (
          <div className="m-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {successMessage}
            </div>
            <button onClick={() => setSuccessMessage('')} className="text-green-700 hover:text-green-900">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Developer Modal */}
        {showDeveloperModal && (
          <div className="fixed inset-0 bg-gray-600/40 backdrop-blur-[4px] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">About the Developer</h3>
                <button
                  onClick={() => setShowDeveloperModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-blue-100/80 flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
                    <Image
                      src="/developer.jpg"
                      alt="Anand Sharma"
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                    {/* AS */}
                  </div>
                  <div>
                    <h4 className="text-2xl text-blue-900 font-semibold">Anand Kumar Sharma</h4>
                    <p className="text-gray-600">Full Stack Developer | MERN Stack Expert</p>
                  </div>
                </div>

                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 mr-3 text-justify">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Anand is a skilled full stack developer with expertise in the MERN stack (MongoDB, Express.js, React.js, Node.js), NextJS and mobile app design. He specializes in building secure, scalable applications and solving complex technical problems.
                  </p>
                  <p className="mb-4 mr-3 text-justify">
                    With a passion for creating intuitive user experiences and robust backend systems, Anand has developed numerous web applications including BotFusion, an AI-powered chatbot platform that helps businesses enhance customer engagement through intelligent conversation interfaces.
                  </p>
                  <p className="mb-4 mr-3 text-justify">
                    Anand is constantly learning new technologies and approaches to stay at the forefront of web development, and is eager to take on new challenges that push the boundaries of what's possible on the web.
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Connect with Anand</h4>
                <div className="flex space-x-4">
                  <a
                    href="https://anandsharma.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.163 1.362.367 1.999.597-.931.903-2.034 1.625-3.257 2.116.489-.832.915-1.737 1.258-2.713zm.553-1.917c.27-1.163.442-2.386.501-3.651h3.934c-.167 1.672-.748 3.223-1.638 4.551-.877-.358-1.81-.664-2.797-.9zm.501-5.651c-.058-1.251-.229-2.46-.492-3.611.992-.237 1.929-.546 2.809-.907.877 1.321 1.451 2.86 1.616 4.518h-3.933z" />
                    </svg>
                    Portfolio
                  </a>
                  <a
                    href="https://github.com/anands2959"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>

                  <a
                    href="https://linkedin.com/in/anands2959"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

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
                              Last Updated
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Training Sources
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {chatbots.length > 0 ? (
                            chatbots.map((chatbot) => {
                              const statusInfo = getChatbotStatus(chatbot);
                              return (
                                <tr key={chatbot.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{chatbot.name}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.className}`}>
                                      {statusInfo.status}
                                    </span>
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {chatbot.updatedAt ? formatDate(chatbot.updatedAt) : 'N/A'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {chatbot.trainingSources?.length || 0} sources
                                    {chatbot.trainingSources?.length > 0 && (
                                      <div className="mt-1">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                          <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{
                                              width: `${(chatbot.trainingSources.filter(s => s.status === 'completed').length / chatbot.trainingSources.length) * 100}%`
                                            }}
                                          ></div>
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                <div className="flex flex-col items-center justify-center">
                                  <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                  </svg>
                                  <p className="text-gray-500 mb-2">No chatbots found</p>
                                  <p className="text-gray-400 text-xs">Create your first chatbot to get started</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Activity Chart */}
                  <div className="mt-6 bg-white p-6 shadow-md rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-900">Activity Overview</h2>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-xs font-medium rounded-md bg-primary-100 text-primary-700">Monthly</button>
                      </div>
                    </div>
                    {chatbots.length > 0 ? (
                      <>
                        <div className="space-y-4">

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h3>
                            <div className="space-y-2">
                              {chatbots.slice(0, 3).map((chatbot) => (
                                <div key={chatbot.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                      {chatbot.name.substring(0, 1).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-700">{chatbot.name}</p>
                                      <p className="text-xs text-gray-500">
                                        {chatbot.trainingSources?.length || 0} sources •
                                        {chatbot.trainingSources?.filter(s => s.status === 'completed').length || 0} completed
                                      </p>
                                    </div>
                                  </div>
                                  <span className="text-xs text-gray-500">{chatbot.updatedAt ? formatDate(chatbot.updatedAt) : 'N/A'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                        <div className="text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">Create chatbots to see activity data</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Chatbot Demo */}
                <div className="lg:col-span-1 h-[30rem]">
                  <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 flex flex-col h-full">
                    {/* <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                      <h3 className="text-lg font-medium text-gray-900">Website Assistant</h3>
                      <p className="mt-1 text-sm text-gray-500">Test your chatbot responses</p>
                    </div> */}

                    {chatbots.length > 0 ? (
                      <>
                        <div className="p-4 border-b border-gray-200">
                          <label htmlFor="chatbot-select" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Chatbot to Test
                          </label>
                          <select
                            id="chatbot-select"
                            value={selectedChatbotId}
                            onChange={(e) => setSelectedChatbotId(e.target.value)}
                            className="block text-gray-700 w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="">Select a chatbot...</option>
                            {chatbots.map((bot) => (
                              <option key={bot.id} value={bot.id}>
                                {bot.name} {bot.apiKey ? '(API Key Ready)' : '(No API Key)'}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4" style={{ maxHeight: '400px' }}>
                          {chatMessages.map((message, index) => (
                            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-800'}`}>
                                {message.isTyping ? (
                                  <div className="flex space-x-1 items-center">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                  </div>
                                ) : (
                                  message.content
                                )}
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
                              className="flex-1 focus:ring-blue-500 pl-2 text-gray-700 focus:border-blue-500 block w-full rounded-md sm:text-sm border-gray-300"
                            />
                            <button
                              type="submit"
                              className="inline-flex items-center p-3 rounded-full border border-transparent text-sm leading-4 font-medium shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <svg className="h-5 w-5 rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          </form>
                          {/* <div className="mt-2 text-xs text-gray-500 flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                            <span>Using: {
                              selectedChatbotId 
                                ? chatbots.find(bot => bot.id === selectedChatbotId)?.name || 'Unknown Chatbot'
                                : 'No chatbot selected'
                            }</span>
                          </div> */}
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center p-6">
                        <div className="text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">No chatbots available</p>
                          <p className="mt-1 text-xs text-gray-400">Create a chatbot to test responses</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chatbots' && (
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Chatbot Editor</h2>
              <ChatbotEditor />
            </div>
          )}

          {activeTab === 'aimodels' && <AIModelSettings onSettingsSaved={() => {
            setSuccessMessage('AI model settings saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
          }} />}

          {activeTab === 'settings' && (
            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Account Settings</h3>
                <div className="mt-5 grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="mt-1 p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Your name"
                      value={userData?.name || ''}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="mt-1 p-2 text-gray-700 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="you@example.com"
                      value={userData?.email || ''}
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      className="mt-1 p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="+1 (555) 987-6543"
                      value={userData?.settings?.phone || ''}
                      onChange={(e) => setUserData({
                        ...userData,
                        settings: { ...userData?.settings, phone: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      Change Password
                    </button>
                    {showPasswordModal && (
                      <PasswordChangeModal />
                    )}
                  </div>
                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Chatbot Embed</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Generate an API key and embed script to add your chatbot to any website.</p>
                </div>
                <div className="mt-5">
                  <ApiKeyGenerator chatbots={chatbots} />
                </div>
              </div>
              <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Account</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Permanently delete your account and all of your content.</p>
                </div>

                {!showDeleteConfirm ? (
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete Account
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 bg-red-50 p-4 rounded-md">
                    <p className="text-sm text-red-700 mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={async () => {
                          setIsDeleting(true);
                          try {
                            const response = await fetch('/api/user', {
                              method: 'DELETE',
                            });

                            if (!response.ok) {
                              throw new Error('Failed to delete account');
                            }

                            // Sign out and redirect to home page
                            await signOut({ redirect: false });
                            router.push('/');
                          } catch (err) {
                            console.error('Error deleting account:', err);
                            // setError('Failed to delete account. Please try again.');
                            setShowDeleteConfirm(false);
                          } finally {
                            setIsDeleting(false);
                          }
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? 'Deleting...' : 'Yes, Delete Account'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}