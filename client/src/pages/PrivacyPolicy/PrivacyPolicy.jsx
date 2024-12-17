import React from "react";
import { Lock, Users, Globe, UserCheck, FileLock, Link, ShieldCheck, Mail, Phone, File, Info } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 lg:px-24">
      <div className="bg-white shadow-lg rounded-lg p-6 lg:p-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-4 text-center">
          Last Revised: <strong>December 2024</strong>
        </p>

        {/* Introduction */}
        <section className="mb-8">
          <p className="text-gray-700">
            At <strong>Naideal.com</strong>, we are committed to safeguarding and preserving the privacy of our users. This Privacy Policy outlines the types of personal information we collect, how we use it, and the steps we take to protect your data. By using Naideal.com, you agree to the terms set forth in this policy.
          </p>
        </section>

        {/* Section 1: Information We Collect */}
        <section className="mb-8">
          <h2 className="flex items-center text-2xl font-semibold text-gray-700 mb-4">
      1. Information We Collect
          </h2>
          <p className="text-gray-700 mb-2">We collect both personal and non-personal information when you interact with our website:</p>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>Personal Information:
              <ul className="list-disc pl-5 mt-1">
                <li>Name</li>
                <li>Email address</li>
                <li>Contact number</li>
                <li>Payment information (via third-party gateways)</li>
                <li>Business details (if applicable)</li>
              </ul>
            </li>
            <li>Non-Personal Information:
              <ul className="list-disc pl-5 mt-1">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Pages viewed</li>
                <li>Referring/exit pages</li>
                <li>Time spent on each page</li>
                <li>Device information</li>
              </ul>
            </li>
          </ul>
        </section>

        {/* Section 2: How We Use Your Information */}
        <section className="mb-8">
          <h2 className="flex items-center text-2xl font-semibold text-gray-700 mb-4">
          2. How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-2">The information we collect is used for the following purposes:</p>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>To provide services like listing offers, brand building, and product promotions.</li>
            <li>To securely process payments through third-party gateways.</li>
            <li>To communicate updates, newsletters, or promotions.</li>
            <li>To improve website functionality and user experience.</li>
            <li>To ensure the security of the website and users.</li>
          </ul>
        </section>

        {/* Section 3: Payment Processing */}
        <section className="mb-8">
          <h2 className="flex items-center text-2xl font-semibold text-gray-700 mb-4">
            <ShieldCheck className="text-red-500 mr-2" /> 3. Payment Processing
          </h2>
          <p className="text-gray-700">
          Naideal.com accepts payments through secure third-party payment processors,  <b>Razorpay</b> and <b>CCAvenue</b>. These platforms are responsible for securely processing payments and storing sensitive payment information, including credit card details. We do not store any payment information on our servers. By using our website and making payments, you agree to the terms and privacy policies of these payment processors.
          </p>
          <ul className="mt-4">
            <li><b>Razorpay</b>:  A secure payment gateway for processing payments on our website.</li>
            <li><b>CCAvenue</b>: Another trusted and secure payment processor for transactions</li>
          </ul>
          <p>Both Razorpay and CCAvenue are responsible for their own privacy and security practices</p>
        </section>

        {/* Section 4: Cookies */}
        <section className="mb-8">
          <h2 className="flex items-center text-2xl font-semibold text-gray-700 mb-4">
            <File className="text-yellow-500 mr-2" /> 4. Cookies and Tracking Technologies
          </h2>
          <p className="text-gray-700">
          We use cookies, web beacons, and other tracking technologies to collect information about how you use our website. Cookies help us provide a personalized experience by remembering your preferences and improving website functionality. By using our website, you consent to the use of cookies as outlined in this policy.
          <br />
          You can manage cookie settings in your browser to control the collection of this information. However, disabling cookies may affect your experience on our website.
          </p>
        </section>

        {/* Section 5: Data Security */}
        <section className="mb-8">
          <h2 className="flex items-center text-2xl font-semibold text-gray-700 mb-4">
            <Lock className="text-indigo-500 mr-2" /> 5. Data Security
          </h2>
          <p className="text-gray-700">
          We take your privacy and the security of your personal information seriously. We employ industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. This includes the use of encryption technologies and secure server connections. <br />
However, while we strive to protect your information, please be aware that no data transmission over the internet is completely secure, and we cannot guarantee absolute security.

          </p>
        </section>

        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="text-blue-500 w-6 h-6" />
            <h2 className="text-2xl font-semibold text-gray-800">
              6. Sharing Your Information
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            We do not sell, rent, or lease your personal information to third
            parties. However, we may share your information with trusted
            third-party service providers and partners who assist in operating
            our website and providing services. These third parties are
            contractually obligated to maintain the confidentiality of your
            information and use it solely for the purpose of providing services
            on our behalf.
          </p>
          <p className="text-gray-600 mt-4">
            We may also share your information in the following cases:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-gray-600">
            <li>
              To comply with legal obligations, such as responding to subpoenas
              or court orders.
            </li>
            <li>
              To protect the rights, property, or safety of Naideal.com, our
              users, or others.
            </li>
            <li>
              In the event of a merger, acquisition, or sale of all or part of
              our business.
            </li>
          </ul>
        </div>

        {/* Section 7: Your Data Rights */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <UserCheck className="text-green-500 w-6 h-6" />
            <h2 className="text-2xl font-semibold text-gray-800">
              7. Your Data Rights
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            You have the following rights regarding your personal data:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-gray-600">
            <li>
              <strong>Access:</strong> You can request access to the personal
              information we hold about you.
            </li>
            <li>
              <strong>Correction:</strong> You can request the correction of any
              inaccurate or incomplete personal data.
            </li>
            <li>
              <strong>Deletion:</strong> You can request the deletion of your
              personal data, subject to legal requirements and business
              obligations.
            </li>
            <li>
              <strong>Opt-out of Communications:</strong> You can opt out of
              receiving marketing emails or newsletters by clicking the
              unsubscribe link in the email.
            </li>
          </ul>
          <p className="text-gray-600 mt-4">
            To exercise these rights, please contact us using the contact
            information below.
          </p>
        </div>

        {/* Section 8: Children's Privacy */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <FileLock className="text-red-500 w-6 h-6" />
            <h2 className="text-2xl font-semibold text-gray-800">
              8. Children's Privacy
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Naideal.com is not intended for children under the age of 13. We do
            not knowingly collect or solicit personal information from children.
            If we become aware that we have collected personal information from
            a child under 13, we will take steps to delete that information from
            our records.
          </p>
        </div>

        {/* Section 9: Links to Third-Party Websites */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Link className="text-purple-500 w-6 h-6" />
            <h2 className="text-2xl font-semibold text-gray-800">
              9. Links to Third-Party Websites
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Our website may contain links to third-party websites, including
            payment processors like Razorpay and CCAvenue. These external
            websites have their own privacy policies, and we encourage you to
            review them. We are not responsible for the content or privacy
            practices of third-party sites.
          </p>
        </div>

        {/* Section 10: Changes to Privacy Policy */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <FileLock className="text-yellow-500 w-6 h-6" />
            <h2 className="text-2xl font-semibold text-gray-800">
              10. Changes to This Privacy Policy
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Naideal.com reserves the right to update this Privacy Policy at any
            time. Any changes to the policy will be posted on this page with an
            updated "Last Revised" date. We encourage you to regularly check
            this page for updates to ensure you are aware of how we are
            protecting your information.
          </p>
        </div>
        {/* Section 11: Contact Us */}
        <section>
          <h2 className="flex items-center text-2xl font-semibold text-gray-700 mb-4">
            <Mail className="text-pink-500 mr-2" /> 11. Contact Us
          </h2>
          <p className="text-gray-700 mb-2">If you have any questions or concerns, please contact us:</p>
          <ul className="text-gray-600 space-y-2">
            <li><strong>Owner and Founder:</strong> Rajeev Dhingra</li>
            <li><strong>Email:</strong> <a href="mailto:care@naideal.com" className="text-blue-500 underline">care@naideal.com</a></li>
            <li><strong>Phone:</strong> 099-5382-5382</li>
          </ul>
        </section>

        {/* Acknowledgment */}
        <div className="mt-8 text-gray-600 text-center">
        By using Naideal.com, you acknowledge and agree to the terms outlined in this Privacy Policy. We are committed to protecting your privacy and providing a secure, transparent environment for all our users.
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
