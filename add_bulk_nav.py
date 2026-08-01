import os

files = [
    r"src\app\page.tsx",
    r"src\app\discover\page.tsx",
    r"src\app\leads\page.tsx",
    r"src\app\outreach\page.tsx",
    r"src\app\dashboard\page.tsx",
    r"src\app\about\page.tsx",
    r"src\app\founder\page.tsx",
    r"src\app\login\page.tsx",
]

bulk_link = '            <a href="/bulk-outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Bulk</a>'

for f in files:
    if not os.path.exists(f):
        print(f"Missing: {f}")
        continue
        
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    if "/bulk-outreach" in content:
        print(f"Skipped (already has Bulk): {f}")
        continue
    
    old = '<a href="/outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Outreach</a>'
    
    if old in content:
        new = old + "\n" + bulk_link
        content = content.replace(old, new)
        with open(f, "w", encoding="utf-8") as file:
            file.write(content)
        print(f"Updated: {f}")
    else:
        print(f"Outreach link not found in: {f}")

print("Done!")