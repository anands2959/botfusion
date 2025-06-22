import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6 md:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About BotFusion</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to make AI-powered chatbots accessible to everyone, helping businesses transform their digital presence.
            </p>
          </div>
        </section>
        
        {/* Mission & Vision */}
        <section className="py-16 px-6 md:px-12 bg-gray-100">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600">
                  To democratize AI technology by providing powerful, easy-to-use tools that enable businesses of all sizes to create intelligent chatbots without technical expertise.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-600">
                  A world where every business can leverage the power of AI to enhance customer experiences, streamline operations, and unlock new possibilities through natural conversation.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16 px-6 md:px-12 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-600 mb-4">
                BotFusion was born from a simple observation: while AI technology was advancing rapidly, the tools to implement it remained complex and inaccessible to most businesses.
              </p>
              <p className="text-gray-600 mb-4">
                Our founders, a team of AI specialists and business strategists, set out to bridge this gap by creating a platform that would make it easy for anyone to build sophisticated AI chatbots without coding knowledge.
              </p>
              <p className="text-gray-600">
                Since our launch, we've helped thousands of businesses across various industries transform their customer engagement strategies with AI-powered conversations that feel natural and helpful.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 px-6 md:px-12 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We constantly push the boundaries of what's possible with AI technology.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Accessibility</h3>
                <p className="text-gray-600">
                  We believe powerful technology should be accessible to everyone, regardless of technical background.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Trust</h3>
                <p className="text-gray-600">
                  We prioritize security, privacy, and transparency in everything we do.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 px-6 md:px-12 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Sarah Johnson</h3>
                <p className="text-blue-600 mb-3">CEO & Co-Founder</p>
                <p className="text-gray-600 text-sm">
                  Former AI research lead with 15+ years of experience in machine learning and natural language processing.
                </p>
              </div>
              
              {/* Team Member 2 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Michael Chen</h3>
                <p className="text-blue-600 mb-3">CTO & Co-Founder</p>
                <p className="text-gray-600 text-sm">
                  Pioneered several breakthrough technologies in conversational AI and led engineering teams at top tech companies.
                </p>
              </div>
              
              {/* Team Member 3 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Emily Rodriguez</h3>
                <p className="text-blue-600 mb-3">Chief Product Officer</p>
                <p className="text-gray-600 text-sm">
                  Product visionary with expertise in UX design and a passion for creating intuitive, powerful software solutions.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-6 md:px-12 bg-blue-600 text-white">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Us on Our Mission</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Ready to transform your customer engagement with AI? Get started with BotFusion today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup" className="px-8 py-3 bg-white text-blue-600 font-medium rounded-full hover:bg-blue-50 transition-colors">
                Get Started Free
              </Link>
              <Link href="/contact" className="px-8 py-3 bg-blue-700 text-white font-medium rounded-full hover:bg-blue-800 transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}