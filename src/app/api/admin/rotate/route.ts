import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest, unauthorized } from '@/lib/server-auth';
import { promisify } from 'util';
import zlib from 'zlib';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const gunzip = promisify(zlib.gunzip);

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user || user.email !== process.env.ADMIN_EMAIL) return unauthorized();

  const { data: state } = await supabase.from('rotation_state').select('*').single();
  const totalBatches = state?.total_batches || 0;
  if (totalBatches === 0) {
    return NextResponse.json({ error: 'No chunks uploaded yet' }, { status: 400 });
  }

  const currentNum = parseInt((state?.current_batch || 'batch_000').replace('batch_', ''));
  const nextNum = currentNum >= totalBatches ? 1 : currentNum + 1;
  const nextBatch = `batch_${String(nextNum).padStart(3, '0')}.csv.gz`;

  const { data: fileData, error: fileError } = await supabase.storage
    .from('store-chunks')
    .download(nextBatch);

  if (fileError || !fileData) {
    return NextResponse.json({ error: `Chunk ${nextBatch} not found in Storage` }, { status: 404 });
  }

  const buffer = Buffer.from(await fileData.arrayBuffer());
  const decompressed = await gunzip(buffer);
  const csvText = decompressed.toString('utf8');

  const lines = csvText.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    const obj: any = {};
    headers.forEach((h, i) => obj[h] = cols[i] || null);
    return obj;
  }).filter(r => r.store_url && r.store_url.includes('.'));

  await supabase.rpc('clean_old_pool');

  const CHUNK_SIZE = 1000;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE).map(r => ({
      store_url: r.store_url,
      store_name: r.store_name || r.store_url.replace(/^https?:\/\//, '').split('/')[0],
      email: r.email && r.email.includes('@') ? r.email : null,
      niche: (r.niche || 'general').toLowerCase(),
      category: r.category || r.niche || 'general',
      quality_score: parseInt(r.quality_score) || 50,
      email_valid: r.email && r.email.includes('@') ? true : false,
      batch_id: nextBatch.replace('.csv.gz', ''),
    }));

    const { error } = await supabase.from('store_pool').insert(chunk);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    inserted += chunk.length;
  }

  await supabase.from('rotation_state').update({
    current_batch: nextBatch.replace('.csv.gz', ''),
    last_rotated: new Date().toISOString()
  }).eq('id', 1);

  return NextResponse.json({ success: true, batch: nextBatch, inserted });
}