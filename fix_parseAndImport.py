import re

with open(r"src\app\leads\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# New parseAndImport function
new_func = '''const parseAndImport = async (text: string) => {
  setImportError("");
  const parsed = parseCSV(text);
  if (parsed.length < 2) {
    setImportError("CSV needs at least a header row + one data row. Make sure your file has column names on the first line.");
    return;
  }

  const headers = parsed[0].map((h) => h.toLowerCase().trim().replace(/^["']|["']$/g, ""));
  const getCol = (names: string[]) => {
    for (const n of names) {
      const i = headers.indexOf(n.toLowerCase());
      if (i !== -1) return i;
    }
    return -1;
  };

  const domainIdx = getCol(["domain", "store_name", "store name", "name", "url", "website", "site", "store_url"]);
  const emailIdx = getCol([
    "validatedemail1", "validatedemail2", "validatedemail3",
    "email1", "email2", "email3",
    "validatedemailfromurl1", "validatedemailfromurl2", "validatedemailfromurl3",
    "emailfromurl1", "emailfromurl2", "emailfromurl3",
    "email", "e-mail", "contact_email", "contact email"
  ]);
  const countryIdx = getCol(["language", "country"]);
  const industryIdx = getCol(["maincategories", "main_categories", "category", "industry"]);
  const nameIdx = getCol(["name", "store_name", "store name", "storename", "domain"]);
  const activityIdx = getCol(["productschangeactivity", "activity"]);
  const phone1Idx = getCol(["phone1"]);
  const phone2Idx = getCol(["phone2"]);
  const fbIdx = getCol(["facebook"]);
  const igIdx = getCol(["instagram"]);
  const twIdx = getCol(["twitter"]);
  const ytIdx = getCol(["youtube"]);
  const ttIdx = getCol(["tiktok"]);
  const ptIdx = getCol(["pinterest"]);
  const liIdx = getCol(["linkedin"]);
  const addrIdx = getCol(["address"]);
  const addrPageIdx = getCol(["addressfrompage"]);

  if (domainIdx === -1 && emailIdx === -1) {
    setImportError("Need domain/store_name or email column.");
    return;
  }

  let imported = 0;
  for (let i = 1; i < parsed.length; i++) {
    const vals = parsed[i];
    const domain = domainIdx !== -1 ? vals[domainIdx]?.trim() : "";
    let email = emailIdx !== -1 ? vals[emailIdx]?.trim() : "";
    const country = countryIdx !== -1 ? vals[countryIdx]?.trim() : "";
    let industry = industryIdx !== -1 ? vals[industryIdx]?.trim() : "";
    const name = nameIdx !== -1 ? vals[nameIdx]?.trim() : "";
    const activity = activityIdx !== -1 ? vals[activityIdx]?.trim() : "";
    const phone1 = phone1Idx !== -1 ? vals[phone1Idx]?.trim() : "";
    const phone2 = phone2Idx !== -1 ? vals[phone2Idx]?.trim() : "";

    // Parse mainCategories JSON array
    if (industry && industry.startsWith("[")) {
      try {
        const parsedCats = JSON.parse(industry.replace(/""/g, '"'));
        if (Array.isArray(parsedCats) && parsedCats.length > 0) {
          industry = parsedCats[0];
        }
      } catch {
        // keep raw
      }
    }

    if (!domain && !email) continue;

    const storeName = name || domain || "Unknown";
    const storeUrl = domain ? (domain.startsWith("http") ? domain : `https://${domain}`) : "";

    // Build rich notes
    const extraNotes: string[] = [];
    if (country) extraNotes.push(`Country: ${country}`);
    if (industry) extraNotes.push(`Industry: ${industry}`);
    if (activity) extraNotes.push(`Activity: ${activity}`);
    if (phone1) extraNotes.push(`Phone: ${phone1}`);
    if (phone2) extraNotes.push(`Phone 2: ${phone2}`);
    if (fbIdx !== -1 && vals[fbIdx]?.trim()) extraNotes.push(`Facebook: ${vals[fbIdx].trim()}`);
    if (igIdx !== -1 && vals[igIdx]?.trim()) extraNotes.push(`Instagram: ${vals[igIdx].trim()}`);
    if (twIdx !== -1 && vals[twIdx]?.trim()) extraNotes.push(`Twitter: ${vals[twIdx].trim()}`);
    if (ytIdx !== -1 && vals[ytIdx]?.trim()) extraNotes.push(`YouTube: ${vals[ytIdx].trim()}`);
    if (ttIdx !== -1 && vals[ttIdx]?.trim()) extraNotes.push(`TikTok: ${vals[ttIdx].trim()}`);
    if (ptIdx !== -1 && vals[ptIdx]?.trim()) extraNotes.push(`Pinterest: ${vals[ptIdx].trim()}`);
    if (liIdx !== -1 && vals[liIdx]?.trim()) extraNotes.push(`LinkedIn: ${vals[liIdx].trim()}`);
    if (addrIdx !== -1 && vals[addrIdx]?.trim()) extraNotes.push(`Address: ${vals[addrIdx].trim()}`);
    if (addrPageIdx !== -1 && vals[addrPageIdx]?.trim()) extraNotes.push(`Address Page: ${vals[addrPageIdx].trim()}`);

    const row: any = {
      store_name: storeName,
      store_url: storeUrl,
      email: email || null,
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Uncomment these two lines if your Supabase table has country & industry columns:
    // if (country) row.country = country;
    // if (industry) row.industry = industry;

    const { data: existing } = await supabase.from("leads").select("id,notes").eq("store_url", row.store_url).maybeSingle();
    if (existing) {
      const existingNotes = existing.notes || "";
      const newNoteLines = extraNotes.filter((line) => !existingNotes.includes(line));
      const mergedNotes = newNoteLines.length > 0
        ? [existingNotes, ...newNoteLines].filter(Boolean).join("\\n")
        : existingNotes;
      await supabase.from("leads").update({ ...row, notes: mergedNotes, updated_at: new Date().toISOString() }).eq("id", existing.id);
      imported++;
    } else {
      if (extraNotes.length > 0) row.notes = extraNotes.join("\\n");
      const { error } = await supabase.from("leads").insert(row);
      if (!error) imported++;
    }
  }

  if (imported === 0) {
    setImportError("No valid rows imported. Check that your CSV has expected columns (domain, name, email1, validatedEmail1, mainCategories, language).");
    return;
  }
  setShowImport(false);
  setImportText("");
  fetchLeads();
};'''

# Find and replace the existing parseAndImport function
# Strategy: replace from "const parseAndImport = async" to "const downloadCSV = () => {"
start_marker = "const parseAndImport = async (text: string) => {"
end_marker = "const downloadCSV = () => {"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1:
    print("ERROR: Could not find 'const parseAndImport = async (text: string) => {'")
    print("Make sure you're in the right directory and the file hasn't been renamed.")
elif end_idx == -1:
    print("ERROR: Could not find 'const downloadCSV = () => {'")
else:
    # Replace everything from start_marker to just before end_marker
    new_content = content[:start_idx] + new_func + "\\n\\n" + content[end_idx:]
    with open(r"src\app\leads\page.tsx", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("SUCCESS: parseAndImport replaced!")
    print("If your Supabase leads table has 'country' and 'industry' columns,")
    print("uncomment the two lines in the script (marked with 'Uncomment these').")