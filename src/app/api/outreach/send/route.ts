import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { to, from, subject, body, domain, scheduledFor } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Demo mode: simulate send delay
    await new Promise((r) => setTimeout(r, 1200));

    // If you have Resend/SendGrid configured, replace this block:
    // const res = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ from, to, subject, text: body })
    // });

    return NextResponse.json({
      success: true,
      message: scheduledFor ? `Email scheduled for ${scheduledFor}` : "Email sent",
      id: Math.random().toString(36).substring(2, 10),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Send failed" }, { status: 500 });
  }
}