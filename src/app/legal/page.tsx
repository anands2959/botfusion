import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LegalPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6 md:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Legal Information</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Important information about how we handle your data and the terms of using our services.
            </p>
          </div>
        </section>
        
        {/* Legal Documents Navigation */}
        <section className="py-16 px-6 md:px-12 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Privacy Policy Card */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-6 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
                <p className="text-gray-600 mb-6">
                  Learn how we collect, use, and protect your personal information when you use our services.
                </p>
                <Link 
                  href="/legal/privacy-policy" 
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Read our Privacy Policy
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
              
              {/* Terms and Conditions Card */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-6 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms and Conditions</h2>
                <p className="text-gray-600 mb-6">
                  The rules, guidelines, and agreements that govern the use of our platform and services.
                </p>
                <Link 
                  href="/legal/terms" 
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Read our Terms and Conditions
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Additional Legal Documents */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Legal Information</h2>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Cookie Policy */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Cookie Policy</h3>
                    <p className="text-gray-600 mb-4">
                      Information about how we use cookies and similar technologies on our website.
                    </p>
                    <Link 
                      href="/legal/cookie-policy" 
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      Read Cookie Policy
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                  
                  {/* Data Processing Agreement */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Data Processing Agreement</h3>
                    <p className="text-gray-600 mb-4">
                      Details on how we process data on behalf of our business customers in compliance with GDPR.
                    </p>
                    <Link 
                      href="/legal/data-processing" 
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      Read Data Processing Agreement
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                  
                  {/* Service Level Agreement */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Service Level Agreement</h3>
                    <p className="text-gray-600 mb-4">
                      Our commitments regarding service availability, performance, and support response times.
                    </p>
                    <Link 
                      href="/legal/sla" 
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      Read Service Level Agreement
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                  
                  {/* Acceptable Use Policy */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Acceptable Use Policy</h3>
                    <p className="text-gray-600 mb-4">
                      Guidelines on the acceptable use of our platform and prohibited activities.
                    </p>
                    <Link 
                      href="/legal/acceptable-use" 
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      Read Acceptable Use Policy
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-16 px-6 md:px-12 bg-gray-50">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Have Questions About Our Policies?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our team is here to help you understand our legal documents and answer any questions you may have.
            </p>
            <Link 
              href="/contact" 
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors inline-block"
            >
              Contact Our Legal Team
            </Link>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}