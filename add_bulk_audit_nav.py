import os

files = [
    r"src\app\page.tsx",
    r"src\app\discover\page.tsx",
    r"src\app\leads\page.tsx",
    r"src\app\outreach\page.tsx",
    r"src\app\dashboard\page.tsx",
    r"src\app\about\page.tsx",
    r"src\app\founder\page.tsx",
    r"src\app\bulk-outreach\page.tsx",
]

bulk_audit_link = '            <a href="/bulk-audit" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Bulk Audit</a>'

for f in files:
    if not os.path.exists(f):
        print(f"Missing: {f}")
        continue
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    if "/bulk-audit" in content:
        print(f"Skipped: {f}")
        continue
    old = '<a href="/discover" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Audit</a>'
    if old in content:
        new = old + "\n" + bulk_audit_link
        content = content.replace(old, new)
        with open(f, "w", encoding="utf-8") as file:
            file.write(content)
        print(f"Updated: {f}")
    else:
        print(f"Audit link not found: {f}")

print("Done!")