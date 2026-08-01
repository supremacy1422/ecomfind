import re

with open(r"src\app\leads\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Robust CSV parser that handles quoted fields with commas inside
new_parse_csv = '''const parseCSV = (text: string) => {
  const lines = text.trim().split(/\\\\r?\\\\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse a CSV row respecting quoted fields
  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const prev = line[i - 1];
      if (char === '"' && prev !== '\\\\') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current);
    return result.map((v) => v.replace(/^"|"$/g, "").replace(/""/g, '"').trim());
  };

  const headers = parseRow(lines[0]).map((h) => h.toLowerCase().replace(/\\\\s+/g, "_"));
  const getCol = (row: string[], ...names: string[]) => {
    for (const name of names) {
      const idx = headers.indexOf(name.toLowerCase().replace(/\\\\s+/g, "_"));
      if (idx >= 0 && row[idx] && row[idx].trim().length > 0) return row[idx].trim();
    }
    return "";
  };

  return lines.slice(1).map((line) => {
    const vals = parseRow(line);
    const domain = getCol(vals, "domain");
    const email = getCol(vals, "validatedemail1", "email1", "validatedemailfromurl1", "emailfromurl1");
    const country = getCol(vals, "language");
    const industryRaw = getCol(vals, "maincategories", "name");
    let industry = industryRaw;
    try {
      if (industryRaw.startsWith("[")) {
        const parsed = JSON.parse(industryRaw.replace(/""/g, '"'));
        if (Array.isArray(parsed) && parsed.length > 0) industry = parsed[0];
      }
    } catch { /* keep raw */ }
    
    return {
      domain,
      shopifyDomain: domain,
      email: email || undefined,
      country: country || undefined,
      industry: industry || undefined,
    };
  }).filter((r) => r.domain && r.domain.length > 0);
};'''

# Find and replace the existing parseCSV function
pattern = r'const parseCSV = \(text: string\)[\s\S]*?return[\s\S]*?};'
if re.search(pattern, content):
    content = re.sub(pattern, new_parse_csv.strip(), content)
    print("✅ Replaced parseCSV with robust quoted-field parser")
else:
    print("⚠️  parseCSV function not found — may need manual insertion")

# Also fix the error message
content = content.replace(
    '"CSV needs header + data row."',
    '"CSV needs at least a header row + one data row. Make sure your file has column names on the first line."'
)

with open(r"src\app\leads\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done!")