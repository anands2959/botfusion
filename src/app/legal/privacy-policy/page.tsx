import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-6 md:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </section>
        
        {/* Privacy Policy Content */}
        <section className="py-16 px-6 md:px-12 bg-white text-gray-700">
          <div className="max-w-4xl mx-auto">
            <div className="prose max-w-none">
              <h2>1. Introduction</h2>
              <p>
                At BotFusion ("we," "our," or "us"), we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our self-hosted AI chatbot platform ("Service").
              </p>
              <p>
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Service.
              </p>
              
              <h2>2. Self-Hosted Nature of BotFusion</h2>
              <p>
                BotFusion is a self-hosted platform, which means that you or your organization is responsible for deploying and maintaining the software on your own infrastructure. As a result:
              </p>
              <ul>
                <li>You are the data controller for any personal data processed through your deployment of BotFusion</li>
                <li>You are responsible for ensuring that your use of BotFusion complies with applicable data protection laws</li>
                <li>You should provide your own privacy policy to end users of your chatbots</li>
              </ul>
              <p>
                This Privacy Policy primarily covers how we handle data in relation to your use of our website, documentation, and support services. For guidance on privacy considerations for your own deployment, please see our <Link href="/documentation/security" className="text-blue-600 hover:text-blue-800">Security Best Practices</Link> documentation.
              </p>
              
              <h2>3. Information We Collect</h2>
              
              <h3>3.1 Information You Provide to Us</h3>
              <p>We may collect the following types of information when you interact with our website or services:</p>
              <ul>
                <li><strong>Account Information:</strong> When you register for an account, we collect your name, email address, and password.</li>
                <li><strong>Profile Information:</strong> Information you provide in your user profile, such as your organization name, job title, and profile picture.</li>
                <li><strong>Payment Information:</strong> If you purchase a premium plan, we collect payment details, billing address, and transaction information. Note that payment processing is handled by our third-party payment processors, and we do not store your full credit card details.</li>
                <li><strong>Communications:</strong> Information you provide when you contact us for support, respond to surveys, or communicate with us in any way.</li>
              </ul>
              
              <h3>3.2 Information We Collect Automatically</h3>
              <p>When you visit our website, we may automatically collect certain information about your device and usage, including:</p>
              <ul>
                <li><strong>Device Information:</strong> IP address, browser type and version, operating system, and other technical information.</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent on pages, links clicked, and other actions taken on our website.</li>
                <li><strong>Cookies and Similar Technologies:</strong> We use cookies and similar tracking technologies to collect information about your browsing activities. For more information, please see our <Link href="/legal/cookie-policy" className="text-blue-600 hover:text-blue-800">Cookie Policy</Link>.</li>
              </ul>
              
              <h2>4. How We Use Your Information</h2>
              <p>We use the information we collect for various purposes, including:</p>
              <ul>
                <li>Providing, maintaining, and improving our Service</li>
                <li>Processing your transactions and managing your account</li>
                <li>Responding to your inquiries and providing customer support</li>
                <li>Sending you technical notices, updates, security alerts, and administrative messages</li>
                <li>Communicating with you about products, services, offers, and events, and providing news and information we think will be of interest to you</li>
                <li>Monitoring and analyzing trends, usage, and activities in connection with our Service</li>
                <li>Detecting, preventing, and addressing technical issues, fraud, and other illegal activities</li>
                <li>Complying with legal obligations</li>
              </ul>
              
              <h2>5. How We Share Your Information</h2>
              <p>We may share your information in the following circumstances:</p>
              <ul>
                <li><strong>Service Providers:</strong> We may share your information with third-party vendors, service providers, and contractors who perform services for us or on our behalf.</li>
                <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
                <li><strong>With Your Consent:</strong> We may share your information with your consent or at your direction.</li>
              </ul>
              <p>
                We do not sell your personal information to third parties.
              </p>
              
              <h2>6. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
              </p>
              
              <h2>7. Your Data Protection Rights</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information, such as:</p>
              <ul>
                <li><strong>Access:</strong> You have the right to request copies of your personal information.</li>
                <li><strong>Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
                <li><strong>Erasure:</strong> You have the right to request that we erase your personal information, under certain conditions.</li>
                <li><strong>Restriction of Processing:</strong> You have the right to request that we restrict the processing of your personal information, under certain conditions.</li>
                <li><strong>Object to Processing:</strong> You have the right to object to our processing of your personal information, under certain conditions.</li>
                <li><strong>Data Portability:</strong> You have the right to request that we transfer the data we have collected to another organization, or directly to you, under certain conditions.</li>
              </ul>
              <p>
                If you would like to exercise any of these rights, please contact us using the information provided in the "Contact Us" section below.
              </p>
              
              <h2>8. Children's Privacy</h2>
              <p>
                Our Service is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13, we will promptly delete that information. If you believe we have collected personal information from a child under 13, please contact us.
              </p>
              
              <h2>9. International Data Transfers</h2>
              <p>
                Your information may be transferred to, and maintained on, computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction.
              </p>
              <p>
                If you are located outside the United States and choose to provide information to us, please note that we may transfer the information, including personal information, to the United States and process it there.
              </p>
              
              <h2>10. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
              
              <h2>11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <ul>
                <li>Email: privacy@botfusion.com</li>
                <li>Website: <Link href="/contact" className="text-blue-600 hover:text-blue-800">Contact Form</Link></li>
              </ul>
              
              <h2>12. Data Protection Officer</h2>
              <p>
                If you have any concerns about how we handle your data, you can contact our Data Protection Officer at dpo@botfusion.com.
              </p>
            </div>
          </div>
        </section>
        
        {/* Related Legal Documents */}
        <section className="py-16 px-6 md:px-12 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Related Legal Documents</h2>
            
            <div className=" gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Terms and Conditions</h3>
                <p className="text-gray-600 mb-4">
                  The rules, guidelines, and agreements that govern the use of our platform.
                </p>
                <Link 
                  href="/legal/terms" 
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Read Terms and Conditions
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