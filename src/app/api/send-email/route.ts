import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body, fromName } = await req.json();
    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const token = req.headers.get("x-supabase-token");
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error("getUser failed:", userError);
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: conn } = await supabase
      .from("gmail_connections")
      .select("email, refresh_token")
      .eq("user_id", user.id)
      .single();

    if (!conn) {
      return NextResponse.json(
        { error: "Connect your Gmail first" },
        { status: 400 }
      );
    }

    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ refresh_token: conn.refresh_token });
    const { token: accessToken } = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: conn.email,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: conn.refresh_token,
        accessToken: accessToken || undefined,
      },
    });

    await transporter.sendMail({
      from: `"${fromName || "EcomFind"}" <${conn.email}>`,
      to,
      subject,
      text: body,
      html: body.replace(/\n/g, "<br>"),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Send error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to send" },
      { status: 500 }
    );
  }
}