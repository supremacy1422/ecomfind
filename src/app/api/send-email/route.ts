import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body, fromName } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: "Missing to, subject, or body" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: fromName
        ? `${fromName} <onboarding@resend.dev>`
        : "EcomFind <onboarding@resend.dev>",
      to: [to],
      subject,
      html: body.replace(/\n/g, "<br>"),
      text: body,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: error.message || "Send failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err: any) {
    console.error("Send email error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}