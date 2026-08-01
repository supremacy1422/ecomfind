import os

files = [
    r"src\app\page.tsx",
    r"src\app\discover\page.tsx",
    r"src\app\leads\page.tsx",
    r"src\app\outreach\page.tsx",
    r"src\app\about\page.tsx",
    r"src\app\login\page.tsx",
]

founder_link = '            <a href="/founder" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Founder</a>'

for f in files:
    if os.path.exists(f):
        with open(f, "r", encoding="utf-8") as file:
            content = file.read()
        
        if "/founder" in content:
            print(f"Skipped (already has Founder): {f}")
            continue
        
        old = '<a href="/about" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">About</a>'
        new = old + "\n" + founder_link
        
        if old in content:
            content = content.replace(old, new)
            with open(f, "w", encoding="utf-8") as file:
                file.write(content)
            print(f"Updated: {f}")
        else:
            print(f"Pattern not found in: {f}")
    else:
        print(f"Missing: {f}")

print("Done!")