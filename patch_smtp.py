with open(r"src\app\outreach\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add SMTP state after other useState
old_state = 'const [sending, setSending] = useState(false);'
new_state = '''const [sending, setSending] = useState(false);
  const [smtpConfig, setSmtpConfig] = useState<any>(null);
  const [showSmtpModal, setShowSmtpModal] = useState(false);'''
content = content.replace(old_state, new_state)

# 2. Add SMTP send logic inside handleSend (replace the fetch block)
old_fetch = '''      // Send via Resend API
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
      setSending(false);'''

new_fetch = '''      if (!smtpConfig) {
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

content = content.replace(old_fetch, new_fetch)

# 3. Add SMTP connect button before the send button area
# Find the send button section and add "Connect Email" button above it
old_send_area = '''            <button
              onClick={handleSend}
              disabled={sending || !recipientEmail}'''

new_send_area = '''            {!smtpConfig ? (
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

content = content.replace(old_send_area, new_send_area)

with open(r"src\app\outreach\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("✓ outreach/page.tsx patched for SMTP")