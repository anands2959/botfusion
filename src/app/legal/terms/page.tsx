import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-6 md:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </section>
        
        {/* Terms Content */}
        <section className="py-16 px-6 md:px-12 bg-white text-gray-700">
          <div className="max-w-4xl mx-auto">
            <div className="prose max-w-none">
              <h2>1. Introduction</h2>
              <p>
                Welcome to BotFusion ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your access to and use of the BotFusion platform, including any associated websites, software, and services (collectively, the "Service").
              </p>
              <p>
                By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.
              </p>
              
              <h2>2. Definitions</h2>
              <p>For the purpose of these Terms:</p>
              <ul>
                <li><strong>"Account"</strong> means a unique account created for you to access our Service.</li>
                <li><strong>"Content"</strong> means any information, data, text, software, graphics, messages, or other materials that can be accessed through the Service.</li>
                <li><strong>"User Content"</strong> means Content that you provide to be processed, stored, or displayed through the Service.</li>
                <li><strong>"Chatbot"</strong> means an AI-powered conversational interface created using our Service.</li>
              </ul>
              
              <h2>3. Account Registration</h2>
              <p>
                To use certain features of the Service, you must register for an Account. You must provide accurate, current, and complete information during the registration process and keep your Account information up-to-date.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your Account. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your Account.
              </p>
              
              <h2>4. Self-Hosted Service</h2>
              <p>
                BotFusion is a self-hosted platform. This means you are responsible for:
              </p>
              <ul>
                <li>Deploying and maintaining the software on your own infrastructure</li>
                <li>Securing your deployment and protecting user data</li>
                <li>Complying with all applicable laws and regulations regarding data collection, processing, and storage</li>
                <li>Obtaining and maintaining any necessary API keys from third-party services</li>
                <li>Regularly updating the software to the latest version</li>
              </ul>
              
              <h2>5. License and Service Use</h2>
              <p>
                Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, and revocable license to use the Service for your personal or business purposes.
              </p>
              <p>
                You may not:
              </p>
              <ul>
                <li>Modify, disassemble, decompile, or reverse engineer any part of the Service</li>
                <li>Use the Service to violate any applicable laws or regulations</li>
                <li>Use the Service to infringe upon intellectual property rights</li>
                <li>Use the Service to distribute malware or other harmful code</li>
                <li>Use the Service to generate content that is illegal, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, or otherwise objectionable</li>
                <li>Interfere with or disrupt the integrity or performance of the Service</li>
                <li>Attempt to gain unauthorized access to the Service or related systems</li>
              </ul>
              
              <h2>6. User Content</h2>
              <p>
                You retain all rights to your User Content. By uploading or sharing User Content through the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, modify, and display your User Content solely for the purpose of providing and improving the Service.
              </p>
              <p>
                You are solely responsible for your User Content and the consequences of sharing it through the Service. You represent and warrant that:
              </p>
              <ul>
                <li>You own or have obtained all necessary rights and permissions to share your User Content</li>
                <li>Your User Content does not violate any third-party rights, including intellectual property rights and privacy rights</li>
                <li>Your User Content complies with these Terms and all applicable laws and regulations</li>
              </ul>
              
              <h2>7. AI Models and Third-Party Services</h2>
              <p>
                The Service may integrate with third-party AI models and services. Your use of these integrations is subject to the respective terms and conditions of those third parties. We are not responsible for the content, privacy policies, or practices of any third-party services.
              </p>
              <p>
                You are responsible for obtaining and maintaining any necessary API keys or credentials for third-party services that you choose to integrate with the Service.
              </p>
              
              <h2>8. Intellectual Property</h2>
              <p>
                The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of BotFusion and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of BotFusion.
              </p>
              
              <h2>9. Termination</h2>
              <p>
                We may terminate or suspend your Account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p>
                Upon termination, your right to use the Service will immediately cease. If you wish to terminate your Account, you may simply discontinue using the Service or delete your Account through the settings.
              </p>
              
              <h2>10. Limitation of Liability</h2>
              <p>
                In no event shall BotFusion, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul>
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
              
              <h2>11. Disclaimer</h2>
              <p>
                Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
              </p>
              
              <h2>12. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
              </p>
              <p>
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
              </p>
              
              <h2>13. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              <p>
                By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
              </p>
              
              <h2>14. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <ul>
                <li>Email: support@botfusion.com</li>
                <li>Website: <Link href="/contact" className="text-blue-600 hover:text-blue-800">Contact Form</Link></li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* Related Legal Documents */}
        <section className="py-16 px-6 md:px-12 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Related Legal Documents</h2>
            
            <div className="gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy Policy</h3>
                <p className="text-gray-600 mb-4">
                  Learn how we collect, use, and protect your personal information.
                </p>
                <Link 
                  href="/legal/privacy-policy" 
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Read Privacy Policy
                </Link>
              </div>
              
             
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}