import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="text-blue-600 hover:underline mb-8 inline-block">← Back to Home</Link>
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose text-gray-700 space-y-4">
          <p><strong>Last updated:</strong> July 25, 2026</p>
          
          <h2 className="text-xl font-bold mt-6">1. Information We Collect</h2>
          <p>We collect your Gmail email address and OAuth tokens when you choose to connect your Gmail account. This is required to send outreach emails on your behalf.</p>
          
          <h2 className="text-xl font-bold mt-6">2. How We Use Your Information</h2>
          <p>Your Gmail access token is used solely to send emails you explicitly request through our platform. We do not read your emails, access your inbox, or use your data for any purpose other than sending the outreach emails you initiate.</p>
          
          <h2 className="text-xl font-bold mt-6">3. Data Storage</h2>
          <p>Your OAuth tokens are encrypted and stored securely in our database. You can revoke access at any time by clicking "Disconnect Gmail" in the app.</p>
          
          <h2 className="text-xl font-bold mt-6">4. Third Parties</h2>
          <p>We use Google's Gmail API to send emails. Your data is not shared with any other third parties.</p>
          
          <h2 className="text-xl font-bold mt-6">5. Your Rights</h2>
          <p>You can disconnect your Gmail account at any time. All your data will be permanently deleted upon request.</p>
          
          <h2 className="text-xl font-bold mt-6">6. Contact</h2>
          <p>For privacy concerns, contact us at supremacy1422@gmail.com</p>
        </div>
      </div>
    </main>
  );
}