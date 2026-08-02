export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
        <p className="text-slate-400 text-sm mb-8">Last updated: August 1, 2026</p>

        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Information We Collect</h2>
            <p>We collect your email address and basic profile information when you sign in via Google OAuth. We also store your Gmail refresh token securely to send emails on your behalf through our outreach feature.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. How We Use Your Information</h2>
            <p>Your information is used solely to provide the EcomFind service: auditing Shopify stores, managing leads, and sending outreach emails. We do not sell, rent, or share your data with third parties.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Gmail Access</h2>
            <p>When you connect your Gmail account, we request permission to send emails only. We cannot read, delete, or access your inbox. Your refresh token is encrypted and stored in our secure database.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Data Security</h2>
            <p>We use industry-standard encryption and secure databases (Supabase) to protect your data. All API communications are conducted over HTTPS.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Your Rights</h2>
            <p>You may disconnect your Gmail account or delete your account at any time. Upon deletion, all associated data including Gmail tokens and outreach logs are permanently removed.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Contact</h2>
            <p>For questions about this privacy policy, contact: <a href="mailto:supremacy1422@gmail.com" className="text-violet-400 hover:underline">supremacy1422@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}