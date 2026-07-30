import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest, unauthorized } from '@/lib/server-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map(c => c.replace(/^"|"$/g, '').trim());
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorized();

    const contentType = req.headers.get('content-type') || '';

    // Reject if too large (Vercel limit is 4.5MB)
    const contentLength = parseInt(req.headers.get('content-length') || '0');
    if (contentLength > 4 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 4MB.' }, { status: 413 });
    }

    let csvText = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }
      csvText = await file.text();
    } else {
      try {
        const body = await req.json();
        csvText = body.csv || '';
      } catch {
        return NextResponse.json(
          { error: 'Invalid body. Send multipart/form-data with a file, or JSON with {csv: "..."}' },
          { status: 400 }
        );
      }
    }

    if (!csvText.trim()) {
      return NextResponse.json({ error: 'Empty CSV' }, { status: 400 });
    }

    const lines = csvText.split('\n').filter(l => l.trim());
    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV needs header + at least 1 data row' }, { status: 400 });
    }

    let uploaded = 0;
    let new_stores = 0;
    const errors: string[] = [];

    for (const line of lines.slice(1)) {
      const cols = parseCSVLine(line);
      const storeUrl = cols[0] || '';
      const storeName = cols[1] || '';
      const email = cols[2] || '';
      const niche = cols[3] || 'general';

      if (!storeUrl || !storeUrl.includes('.')) {
        errors.push(`Row ${uploaded + 1}: Invalid URL "${storeUrl}"`);
        continue;
      }

      const cleanUrl = storeUrl.startsWith('http') ? storeUrl : `https://${storeUrl}`;
      const cleanEmail = email.includes('@') ? email : null;
      uploaded++;

      const { data: existing } = await supabase
        .from('store_leads')
        .select('id')
        .eq('store_url', cleanUrl)
        .eq('user_id', user.id)
        .single();

      if (!existing) {
        const { error } = await supabase.from('store_leads').insert({
          user_id: user.id,
          store_url: cleanUrl,
          store_name: storeName || cleanUrl.replace(/^https?:\/\//, '').split('/')[0],
          email: cleanEmail,
          niche: niche || 'general',
          status: 'new',
          times_contacted: 0,
          quality_score: cleanEmail ? 75 : 50,
          email_valid: !!cleanEmail,
        });
        if (error) errors.push(`Row ${uploaded}: ${error.message}`);
        else new_stores++;
      }
    }

    return NextResponse.json({
      success: true,
      uploaded,
      new_stores,
      skipped: uploaded - new_stores,
      errors: errors.slice(0, 20),
    });
  } catch (err: any) {
    console.error('IMPORT ERROR:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}