with open(r"src\app\leads\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace literal \n\n with actual newlines
content = content.replace(r"};\n\nconst downloadCSV", "};\n\nconst downloadCSV")

with open(r"src\app\leads\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed newline escape issue!")