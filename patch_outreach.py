import re

with open(r"src\app\outreach\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add sending state after other useState hooks
content = content.replace(
    'const [sendStatus, setSendStatus] = useState("");',
    'const [sendStatus, setSendStatus] = useState("");\n  const [sending, setSending] = useState(false);'
)

# 2. Add API call inside handleSend, before persistLogs
old_block = "      persistLogs([newLog, ...logs]);"
new_block = '''      // Send via Resend API
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
        setSendStatus(\`✗ Failed: \${err.message}\`);
        return;
      }
      setSending(false);

      persistLogs([newLog, ...logs]);'''

content = content.replace(old_block, new_block)

# 3. Update the send button to show loading state
content = content.replace(
    'onClick={handleSend}\n                disabled={!recipientEmail}',
    'onClick={handleSend}\n                disabled={sending || !recipientEmail}'
)
content = content.replace(
    '{scheduleMode ? "Schedule Email" : "Send Email"}',
    '{sending ? "Sending..." : scheduleMode ? "Schedule Email" : "Send Email"}'
)

with open(r"src\app\outreach\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("✓ outreach/page.tsx patched")