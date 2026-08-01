import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body, smtp } = await req.json();

    if (!to || !subject || !body || !smtp) {
      return NextResponse.json(
        { error: "Missing fields. Connect your email first." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });

    await transporter.sendMail({
      from: `"${smtp.fromName || "EcomFind"}" <${smtp.fromEmail || smtp.user}>`,
      to,
      subject,
      text: body,
      html: body.replace(/\n/g, "<br>"),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("SMTP error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to send email" },
      { status: 500 }
    );
  }
}