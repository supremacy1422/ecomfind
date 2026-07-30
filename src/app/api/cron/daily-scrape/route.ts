import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const niches = ['fashion', 'jewelry', 'home', 'beauty', 'fitness'];
    const results = [];
    
    for (const niche of niches) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/discover/engine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, limit: 10 })
      });
      const data = await res.json();
      results.push({ niche, ...data });
      await new Promise(r => setTimeout(r, 2000));
    }
    
    return NextResponse.json({
      success: true,
      completed: new Date().toISOString(),
      results
    });
    
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}