with open(r"src\app\outreach\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add smtp states if missing
if "smtpConfig" not in content:
    content = content.replace(
        'const [sending, setSending] = useState(false);',
        'const [sending, setSending] = useState(false);\n  const [smtpConfig, setSmtpConfig] = useState<any>(null);\n  const [showSmtpModal, setShowSmtpModal] = useState(false);'
    )

# Replace any existing API call block with SMTP version
old_patterns = [
    '''      // Send via Resend API
      setSending(true);
      try {
        const res = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: recipientEmail,
            subject,
            body: generatedBody,
            fromName: user?.email?.split("@")[0] || "EcomFind",
          }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Failed to send");
      } catch (err: any) {
        setSending(false);
        setSendStatus(`✗ Failed: ${err.message}`);
        return;
      }
      setSending(false);''',
    '''      setSending(true);
      try {
        const res = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: recipientEmail,
            subject,
            body: generatedBody,
            fromName: user?.email?.split("@")[0] || "EcomFind",
            fromEmail: user?.email || "supremacy1422@gmail.com",
          }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Failed to send");
      } catch (err: any) {
        setSending(false);
        setSendStatus(`✗ Failed: ${err.message}`);
        return;
      }
      setSending(false);'''
]

new_block = '''      if (!smtpConfig) {
        setSendStatus("✗ Connect your email account first");
        setShowSmtpModal(true);
        return;
      }

      setSending(true);
      try {
        const res = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: recipientEmail,
            subject,
            body: generatedBody,
            smtp: smtpConfig,
          }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Failed to send");
      } catch (err: any) {
        setSending(false);
        setSendStatus(`✗ Failed: ${err.message}`);
        return;
      }
      setSending(false);'''

for old in old_patterns:
    if old in content:
        content = content.replace(old, new_block)
        break

# Fix send button
content = content.replace(
    'disabled={sending || !recipientEmail}',
    'disabled={sending || !recipientEmail || !smtpConfig}'
)

# Add connect button before send button if not present
if "Connect Your Email" not in content:
    old_btn = '''            <button
              onClick={handleSend}
              disabled={sending || !recipientEmail || !smtpConfig}'''
    new_btn = '''            {!smtpConfig ? (
              <button
                onClick={() => setShowSmtpModal(true)}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm transition-colors"
              >
                Connect Your Email Account to Send
              </button>
            ) : (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-3">
                <span className="text-xs text-emerald-400">Connected: {smtpConfig.fromEmail || smtpConfig.user}</span>
                <button onClick={() => setShowSmtpModal(true)} className="text-xs text-emerald-400 underline">Change</button>
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={sending || !recipientEmail || !smtpConfig}'''
    content = content.replace(old_btn, new_btn)

# Add modal at end if missing
modal_code = '''
      {/* SMTP Modal */}
      {showSmtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Connect Your Email</h3>
            <p className="text-xs text-slate-400 mb-6">We send emails through YOUR account. We never store your password.</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">SMTP Host</label>
                <input id="smtp-host" defaultValue="smtp.gmail.com" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Port</label>
                  <input id="smtp-port" defaultValue="465" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Secure (SSL)</label>
                  <select id="smtp-secure" defaultValue="true" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500">
                    <option value="true">Yes (SSL)</option>
                    <option value="false">No (TLS)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Email / Username</label>
                <input id="smtp-user" type="email" placeholder="you@gmail.com" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">App Password</label>
                <input id="smtp-pass" type="password" placeholder="16-character code" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500" />
                <p className="text-[10px] text-slate-500 mt-1">Use the 16-character App Password from Google, not your regular password.</p>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">From Name</label>
                <input id="smtp-fromName" placeholder="Your Name" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">From Email</label>
                <input id="smtp-fromEmail" placeholder="you@gmail.com" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowSmtpModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors">Cancel</button>
              <button onClick={() => {
                const host = (document.getElementById("smtp-host") as HTMLInputElement)?.value;
                const port = parseInt((document.getElementById("smtp-port") as HTMLInputElement)?.value);
                const secure = (document.getElementById("smtp-secure") as HTMLSelectElement)?.value === "true";
                const user = (document.getElementById("smtp-user") as HTMLInputElement)?.value;
                const pass = (document.getElementById("smtp-pass") as HTMLInputElement)?.value;
                const fromName = (document.getElementById("smtp-fromName") as HTMLInputElement)?.value;
                const fromEmail = (document.getElementById("smtp-fromEmail") as HTMLInputElement)?.value;
                if (!host || !port || !user || !pass) { alert("Fill in all required fields"); return; }
                setSmtpConfig({ host, port, secure, user, pass, fromName, fromEmail });
                setShowSmtpModal(false);
                setSendStatus("✓ Email account connected");
              }} className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors">Connect</button>
            </div>
          </div>
        </div>
      )}'''

if "SMTP Modal" not in content:
    # Insert before final closing divs
    content = content.rstrip()
    if content.endswith(")"):
        content = content[:-1] + modal_code + "\n  );\n}"

with open(r"src\app\outreach\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("✓ outreach/page.tsx patched for SMTP")