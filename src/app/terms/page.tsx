export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
        <p className="text-slate-400 text-sm mb-8">Last updated: August 1, 2026</p>

        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using EcomFind, you agree to be bound by these Terms of Service. If you do not agree, you may not use the service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Description of Service</h2>
            <p>EcomFind provides Shopify store auditing, lead management, and email outreach tools. We do not guarantee specific results, revenue increases, or email delivery rates.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years old to use this service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Acceptable Use</h2>
            <p>You agree not to use EcomFind for spam, harassment, or any illegal activity. You are solely responsible for the content of emails sent through the platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Gmail Integration</h2>
            <p>By connecting your Gmail account, you authorize EcomFind to send emails on your behalf. You may revoke this access at any time by disconnecting your account in-app or via your Google Account settings.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Limitation of Liability</h2>
            <p>EcomFind is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Termination</h2>
            <p>We reserve the right to suspend or terminate your account for violations of these terms or for any reason at our sole discretion.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">8. Changes to Terms</h2>
            <p>We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">9. Contact</h2>
            <p>For questions about these terms, contact: <a href="mailto:supremacy1422@gmail.com" className="text-violet-400 hover:underline">supremacy1422@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}