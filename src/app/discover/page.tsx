"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Search,
  Download,
  Globe,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Mail,
  ArrowRight,
  BarChart3,
  Shield,
  Cpu,
  Clock,
  Target,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

// ─── PREMIUM EXECUTIVE AUDIT REPORT GENERATOR ───
function generateReportHTML(data: any) {
  const {
    url,
    summary,
    metrics,
    issues,
    opportunities,
    revenueImpact,
    competitorAnalysis,
    aiReadiness,
    techStack,
    actionPlan,
    timestamp,
  } = data;

  const score = metrics?.score ?? 0;
  const scoreColor = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const scoreLabel = score >= 80 ? "Excellent" : score >= 50 ? "Needs Improvement" : "Critical";

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val || 0);

  const formatNumber = (val: number) =>
    new Intl.NumberFormat("en-US").format(val || 0);

  const monthlyRevenue = metrics?.monthlyRevenue ?? 0;
  const recoveryRate = opportunities?.reduce((acc: number, o: any) => acc + (o.impactValue || 0), 0) ?? 0;
  const annualOpportunity = recoveryRate * 12;
  const criticalCount = issues?.filter((i: any) => i.severity === "critical").length ?? 0;
  const warningCount = issues?.filter((i: any) => i.severity === "warning").length ?? 0;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EcomFind Executive Audit Report — ${url}</title>
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937; line-height: 1.6; background: #f3f4f6; }
    .page { width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto 10mm; background: #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); page-break-after: always; position: relative; }
    .page:last-child { page-break-after: auto; }

    .cover { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; min-height: 257mm; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #fff; }
    .cover-badge { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 8px 20px; border-radius: 999px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 40px; }
    .cover h1 { font-size: 42px; font-weight: 800; margin-bottom: 16px; line-height: 1.2; }
    .cover-url { font-size: 18px; color: #94a3b8; margin-bottom: 60px; word-break: break-all; max-width: 80%; }
    .cover-meta { display: flex; gap: 40px; margin-top: 40px; }
    .cover-meta-item { text-align: center; }
    .cover-meta-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 4px; }
    .cover-meta-value { font-size: 20px; font-weight: 700; }
    .cover-score { width: 140px; height: 140px; border-radius: 50%; border: 8px solid ${scoreColor}; display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 30px 0; }
    .cover-score-num { font-size: 48px; font-weight: 800; color: ${scoreColor}; }
    .cover-score-label { font-size: 14px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }

    .section-header { border-bottom: 3px solid #0f172a; padding-bottom: 12px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
    .section-header h2 { font-size: 24px; font-weight: 700; color: #0f172a; }
    .section-num { width: 36px; height: 36px; background: #0f172a; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }

    .dashboard-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
    .dash-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; }
    .dash-card-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px; }
    .dash-card-value { font-size: 28px; font-weight: 800; color: #0f172a; }
    .dash-card-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
    .dash-card.positive { border-top: 4px solid #10b981; }
    .dash-card.negative { border-top: 4px solid #ef4444; }
    .dash-card.warning { border-top: 4px solid #f59e0b; }

    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
    th { background: #0f172a; color: #fff; text-align: left; padding: 12px; font-weight: 600; }
    td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) { background: #f8fafc; }
    .tag { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .tag-critical { background: #fee2e2; color: #991b1b; }
    .tag-warning { background: #fef3c7; color: #92400e; }
    .tag-success { background: #d1fae5; color: #065f46; }
    .tag-info { background: #dbeafe; color: #1e40af; }

    .opp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }
    .opp-card { background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #10b981; }
    .opp-card h4 { font-size: 14px; font-weight: 700; margin-bottom: 8px; color: #0f172a; }
    .opp-card p { font-size: 12px; color: #475569; margin-bottom: 12px; }
    .opp-card .value { font-size: 20px; font-weight: 800; color: #10b981; }

    .competitor-row { display: flex; align-items: center; gap: 16px; padding: 16px; background: #f8fafc; border-radius: 8px; margin-bottom: 12px; }
    .competitor-rank { width: 32px; height: 32px; background: #0f172a; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
    .competitor-info { flex: 1; }
    .competitor-info h4 { font-size: 14px; font-weight: 700; }
    .competitor-info span { font-size: 12px; color: #64748b; }
    .competitor-score { font-size: 20px; font-weight: 800; color: #0f172a; }

    .timeline { position: relative; padding-left: 30px; }
    .timeline::before { content: ''; position: absolute; left: 8px; top: 0; bottom: 0; width: 2px; background: #e2e8f0; }
    .timeline-item { position: relative; margin-bottom: 24px; }
    .timeline-dot { position: absolute; left: -26px; top: 4px; width: 16px; height: 16px; background: #0f172a; border-radius: 50%; border: 3px solid #fff; }
    .timeline-content { background: #f8fafc; padding: 16px; border-radius: 8px; }
    .timeline-content h4 { font-size: 14px; font-weight: 700; margin-bottom: 6px; }
    .timeline-content p { font-size: 12px; color: #475569; }
    .timeline-tag { display: inline-block; margin-top: 8px; padding: 2px 8px; background: #dbeafe; color: #1e40af; border-radius: 4px; font-size: 11px; font-weight: 600; }

    .business-box { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #fff; padding: 32px; border-radius: 16px; margin: 24px 0; }
    .business-box h3 { font-size: 20px; font-weight: 700; margin-bottom: 16px; }
    .business-box ul { list-style: none; }
    .business-box li { padding: 8px 0; padding-left: 24px; position: relative; font-size: 14px; }
    .business-box li::before { content: '→'; position: absolute; left: 0; color: #10b981; font-weight: 700; }

    .tech-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .tech-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center; font-size: 12px; }
    .tech-item strong { display: block; font-size: 13px; margin-bottom: 4px; color: #0f172a; }

    .page-footer { position: absolute; bottom: 10mm; left: 20mm; right: 20mm; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; display: flex; justify-content: space-between; }

    @media print {
      body { background: #fff; }
      .page { box-shadow: none; margin: 0; page-break-after: always; }
    }
  </style>
</head>
<body>

<!-- PAGE 1: COVER -->
<div class="page cover">
  <div class="cover-badge">Confidential Executive Report</div>
  <h1>E-Commerce Revenue<br>Recovery Audit</h1>
  <div class="cover-url">${url}</div>
  <div class="cover-score">
    <div class="cover-score-num">${score}</div>
    <div class="cover-score-label">${scoreLabel}</div>
  </div>
  <div class="cover-meta">
    <div class="cover-meta-item">
      <div class="cover-meta-label">Prepared By</div>
      <div class="cover-meta-value">EcomFind AI</div>
    </div>
    <div class="cover-meta-item">
      <div class="cover-meta-label">Date</div>
      <div class="cover-meta-value">${new Date(timestamp || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
    </div>
    <div class="cover-meta-item">
      <div class="cover-meta-label">Pages</div>
      <div class="cover-meta-value">10</div>
    </div>
  </div>
</div>

<!-- PAGE 2: EXECUTIVE DASHBOARD -->
<div class="page">
  <div class="section-header">
    <div class="section-num">01</div>
    <h2>Executive Dashboard</h2>
  </div>
  <p style="margin-bottom:24px; color:#475569; font-size:14px;">
    This audit analyzed <strong>${url}</strong> across 47 revenue-critical data points. 
    The site scored <strong style="color:${scoreColor}">${score}/100</strong> — ${scoreLabel.toLowerCase()}.
  </p>
  <div class="dashboard-grid">
    <div class="dash-card ${score >= 50 ? "positive" : "negative"}">
      <div class="dash-card-label">Audit Score</div>
      <div class="dash-card-value" style="color:${scoreColor}">${score}</div>
      <div class="dash-card-sub">out of 100</div>
    </div>
    <div class="dash-card warning">
      <div class="dash-card-label">Issues Found</div>
      <div class="dash-card-value">${issues?.length ?? 0}</div>
      <div class="dash-card-sub">${criticalCount} critical</div>
    </div>
    <div class="dash-card positive">
      <div class="dash-card-label">Opportunities</div>
      <div class="dash-card-value">${opportunities?.length ?? 0}</div>
      <div class="dash-card-sub">revenue recovery</div>
    </div>
  </div>
  <div class="dashboard-grid" style="margin-top:16px;">
    <div class="dash-card">
      <div class="dash-card-label">Est. Monthly Revenue</div>
      <div class="dash-card-value">${formatCurrency(monthlyRevenue)}</div>
      <div class="dash-card-sub">based on traffic & niche</div>
    </div>
    <div class="dash-card">
      <div class="dash-card-label">Annual Opportunity</div>
      <div class="dash-card-value" style="color:#10b981;">${formatCurrency(annualOpportunity)}</div>
      <div class="dash-card-sub">if all fixes applied</div>
    </div>
    <div class="dash-card">
      <div class="dash-card-label">AI Readiness</div>
      <div class="dash-card-value">${aiReadiness?.score ?? "N/A"}</div>
      <div class="dash-card-sub">out of 100</div>
    </div>
  </div>
  <div class="page-footer"><span>EcomFind Executive Audit</span><span>Page 2 of 10</span></div>
</div>

<!-- PAGE 3: REVENUE OPPORTUNITIES -->
<div class="page">
  <div class="section-header"><div class="section-num">02</div><h2>Revenue Recovery Opportunities</h2></div>
  <p style="margin-bottom:24px; color:#475569; font-size:14px;">The following opportunities represent recoverable revenue. Each is ranked by impact and implementation difficulty.</p>
  <div class="opp-grid">
    ${opportunities?.map((opp: any, idx: number) => `
    <div class="opp-card">
      <h4>${idx + 1}. ${opp.title}</h4>
      <p>${opp.description}</p>
      <div class="value">${opp.impactValue ? formatCurrency(opp.impactValue) + "/mo" : "High Impact"}</div>
    </div>
    `).join("") || '<div class="opp-card"><h4>No opportunities detected</h4><p>The audit did not identify specific revenue opportunities. This may indicate limited data availability.</p></div>'}
  </div>
  <table>
    <thead><tr><th>Opportunity</th><th>Category</th><th>Impact</th><th>Effort</th></tr></thead>
    <tbody>
      ${opportunities?.map((opp: any) => `
      <tr>
        <td><strong>${opp.title}</strong></td>
        <td><span class="tag tag-info">${opp.category || "General"}</span></td>
        <td><span class="tag ${(opp.impact || "").toLowerCase() === "high" ? "tag-critical" : "tag-warning"}">${opp.impact || "Medium"}</span></td>
        <td><span class="tag tag-success">${opp.effort || "Medium"}</span></td>
      </tr>
      `).join("") || '<tr><td colspan="4">No data available</td></tr>'}
    </tbody>
  </table>
  <div class="page-footer"><span>EcomFind Executive Audit</span><span>Page 3 of 10</span></div>
</div>

<!-- PAGE 4: CRITICAL ISSUES -->
<div class="page">
  <div class="section-header"><div class="section-num">03</div><h2>Critical Issues & Fixes</h2></div>
  <p style="margin-bottom:24px; color:#475569; font-size:14px;">Issues are ranked by severity: Critical (revenue-blocking), Warning (growth-limiting), and Info (optimization).</p>
  <table>
    <thead><tr><th style="width:40px">#</th><th>Issue</th><th>Severity</th><th>Category</th></tr></thead>
    <tbody>
      ${issues?.map((issue: any, idx: number) => `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${issue.title}</strong><br><span style="color:#64748b; font-size:12px;">${issue.description || ""}</span></td>
        <td><span class="tag ${issue.severity === "critical" ? "tag-critical" : issue.severity === "warning" ? "tag-warning" : "tag-info"}">${issue.severity}</span></td>
        <td><span class="tag tag-info">${issue.category || "General"}</span></td>
      </tr>
      `).join("") || '<tr><td colspan="4">No issues detected</td></tr>'}
    </tbody>
  </table>
  <div class="page-footer"><span>EcomFind Executive Audit</span><span>Page 4 of 10</span></div>
</div>

<!-- PAGE 5: COMPETITIVE ANALYSIS -->
<div class="page">
  <div class="section-header"><div class="section-num">04</div><h2>Competitive Landscape</h2></div>
  <p style="margin-bottom:24px; color:#475569; font-size:14px;">Benchmarking ${url} against top-performing competitors in the same niche.</p>
  ${competitorAnalysis?.map((comp: any, idx: number) => `
  <div class="competitor-row">
    <div class="competitor-rank">${idx + 1}</div>
    <div class="competitor-info">
      <h4>${comp.name || comp.domain || "Competitor " + (idx + 1)}</h4>
      <span>${comp.strengths ? "Strengths: " + comp.strengths.join(", ") : "Top performer in niche"}</span>
    </div>
    <div class="competitor-score">${comp.score || "—"}</div>
  </div>
  `).join("") || '<p style="color:#64748b;">Competitor data unavailable for this audit.</p>'}
  <div style="margin-top:32px; padding:20px; background:#f8fafc; border-radius:12px;">
    <h4 style="margin-bottom:12px; font-size:16px;">Strategic Recommendations</h4>
    <ul style="padding-left:20px; color:#475569; font-size:13px; line-height:2;">
      <li>Analyze competitor pricing strategies and adjust your value proposition</li>
      <li>Identify content gaps where competitors rank but you do not</li>
      <li>Benchmark page speed and mobile experience against top 3 competitors</li>
      <li>Monitor competitor ad copy and landing page changes monthly</li>
    </ul>
  </div>
  <div class="page-footer"><span>EcomFind Executive Audit</span><span>Page 5 of 10</span></div>
</div>

<!-- PAGE 6: AI READINESS -->
<div class="page">
  <div class="section-header"><div class="section-num">05</div><h2>AI & Automation Readiness</h2></div>
  <div class="dashboard-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom:24px;">
    <div class="dash-card"><div class="dash-card-label">Overall Score</div><div class="dash-card-value">${aiReadiness?.score ?? "N/A"}</div><div class="dash-card-sub">out of 100</div></div>
    <div class="dash-card"><div class="dash-card-label">Automation Level</div><div class="dash-card-value">${aiReadiness?.automationLevel || "Basic"}</div><div class="dash-card-sub">current capability</div></div>
    <div class="dash-card"><div class="dash-card-label">Data Quality</div><div class="dash-card-value">${aiReadiness?.dataQuality || "Fair"}</div><div class="dash-card-sub">for AI training</div></div>
  </div>
  <h4 style="margin:24px 0 12px; font-size:16px;">AI Implementation Roadmap</h4>
  <table>
    <thead><tr><th>Initiative</th><th>Impact</th><th>Complexity</th><th>Timeline</th></tr></thead>
    <tbody>
      <tr><td><strong>Personalized Product Recommendations</strong></td><td><span class="tag tag-critical">High</span></td><td><span class="tag tag-success">Low</span></td><td>2–4 weeks</td></tr>
      <tr><td><strong>AI Chatbot for Customer Support</strong></td><td><span class="tag tag-critical">High</span></td><td><span class="tag tag-warning">Medium</span></td><td>4–6 weeks</td></tr>
      <tr><td><strong>Dynamic Pricing Optimization</strong></td><td><span class="tag tag-critical">High</span></td><td><span class="tag tag-critical">High</span></td><td>8–12 weeks</td></tr>
      <tr><td><strong>Predictive Inventory Management</strong></td><td><span class="tag tag-warning">Medium</span></td><td><span class="tag tag-critical">High</span></td><td>12+ weeks</td></tr>
    </tbody>
  </table>
  <div class="page-footer"><span>EcomFind Executive Audit</span><span>Page 6 of 10</span></div>
</div>

<!-- PAGE 7: TECH STACK -->
<div class="page">
  <div class="section-header"><div class="section-num">06</div><h2>Technology Stack Detected</h2></div>
  <p style="margin-bottom:24px; color:#475569; font-size:14px;">Technologies detected on ${url}. Missing critical tools represent immediate upgrade opportunities.</p>
  <div class="tech-grid">
    ${techStack?.map((tech: any) => `
    <div class="tech-item"><strong>${tech.name}</strong><span style="color:#64748b;">${tech.category || "Tool"}</span></div>
    `).join("") || '<div class="tech-item"><strong>Limited data</strong><span>Could not detect full stack</span></div>'}
  </div>
  <div style="margin-top:32px; padding:20px; background:#fef3c7; border-radius:12px; border-left:4px solid #f59e0b;">
    <h4 style="margin-bottom:8px; font-size:16px;">⚠️ Missing Revenue-Critical Tools</h4>
    <p style="font-size:13px; color:#475569;">Based on your niche and traffic, the following tools are commonly used by top performers but were not detected: Email marketing automation (Klaviyo/Attentive), SMS recovery (Postscript), Reviews (Yotpo/Judge.me), and Subscription management (Recharge/Ordergroove).</p>
  </div>
  <div class="page-footer"><span>EcomFind Executive Audit</span><span>Page 7 of 10</span></div>
</div>

<!-- PAGE 8: 90-DAY ACTION PLAN -->
<div class="page">
  <div class="section-header"><div class="section-num">07</div><h2>90-Day Revenue Recovery Plan</h2></div>
  <div class="timeline">
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <h4>Days 1–30: Quick Wins</h4>
        <p>Fix critical technical issues (page speed, mobile responsiveness, broken checkout flows). Implement abandoned cart recovery. Add trust signals (reviews, guarantees, secure checkout badges). Expected impact: +10–15% conversion rate.</p>
        <span class="timeline-tag">High Priority</span>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <h4>Days 31–60: Growth Infrastructure</h4>
        <p>Launch email marketing sequences (welcome, abandoned cart, post-purchase). Install live chat or AI chatbot. Optimize product pages with A/B testing. Set up retargeting pixels. Expected impact: +20% customer lifetime value.</p>
        <span class="timeline-tag">High Priority</span>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <h4>Days 61–90: Scale & Automate</h4>
        <p>Implement loyalty/referral program. Launch subscription or reorder automation. Add personalized product recommendations. Expand to new channels (SMS, push notifications). Expected impact: +25% repeat purchase rate.</p>
        <span class="timeline-tag">Medium Priority</span>
      </div>
    </div>
  </div>
  <div class="page-footer"><span>EcomFind Executive Audit</span><span>Page 8 of 10</span></div>
</div>

<!-- PAGE 9: IF THIS WERE MY BUSINESS -->
<div class="page">
  <div class="section-header"><div class="section-num">08</div><h2>If This Were My Business</h2></div>
  <p style="margin-bottom:24px; color:#475569; font-size:14px;">A candid CEO-level perspective on exactly what I would do in the next 90 days if I acquired or operated this store.</p>
  <div class="business-box">
    <h3>Immediate Actions (Week 1)</h3>
    <ul>
      <li>Audit and fix the top 3 conversion blockers identified in this report</li>
      <li>Set up proper analytics and event tracking if not already in place</li>
      <li>Implement a single abandoned cart email sequence (minimum viable recovery)</li>
      <li>Review and optimize the top 5 landing pages for mobile experience</li>
    </ul>
  </div>
  <div class="business-box" style="background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);">
    <h3>Strategic Moves (Month 1–2)</h3>
    <ul>
      <li>Negotiate better payment processing rates to improve margins by 0.5–1%</li>
      <li>Launch a customer win-back campaign for lapsed buyers (90+ days)</li>
      <li>Add subscription or auto-replenish options for consumable products</li>
      <li>Build an email list capture strategy with lead magnets or quizzes</li>
    </ul>
  </div>
  <div class="business-box" style="background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);">
    <h3>Scale Decisions (Month 3)</h3>
    <ul>
      <li>Evaluate wholesale/B2B channel if product margins support it</li>
      <li>Test one new paid channel (TikTok, Pinterest, or YouTube ads)</li>
      <li>Implement a referral program with meaningful incentives (15–20% credit)</li>
      <li>Hire a part-time email specialist or automate with AI tools</li>
    </ul>
  </div>
  <div class="page-footer"><span>EcomFind Executive Audit</span><span>Page 9 of 10</span></div>
</div>

<!-- PAGE 10: SUMMARY & NEXT STEPS -->
<div class="page">
  <div class="section-header"><div class="section-num">09</div><h2>Summary & Next Steps</h2></div>
  <div style="background:#f8fafc; padding:24px; border-radius:12px; margin-bottom:24px;">
    <h4 style="margin-bottom:12px;">Audit Summary</h4>
    <p style="color:#475569; font-size:14px; line-height:1.8;">
      <strong>${url}</strong> was audited on ${new Date(timestamp || Date.now()).toLocaleDateString()}.
      The site scored <strong>${score}/100</strong> with <strong>${issues?.length ?? 0} issues</strong> identified
      and <strong>${opportunities?.length ?? 0} revenue opportunities</strong> mapped.
      Estimated annual revenue recovery potential is <strong style="color:#10b981;">${formatCurrency(annualOpportunity)}</strong>
      if all recommended fixes are implemented within 90 days.
    </p>
  </div>
  <h4 style="margin-bottom:16px;">Priority Matrix</h4>
  <table>
    <thead><tr><th>Priority</th><th>Action</th><th>Expected Impact</th></tr></thead>
    <tbody>
      <tr><td><span class="tag tag-critical">P0 — Critical</span></td><td>Fix checkout friction and mobile UX issues</td><td>+15% conversion rate</td></tr>
      <tr><td><span class="tag tag-warning">P1 — High</span></td><td>Implement email/SMS abandoned cart recovery</td><td>+20% revenue recovery</td></tr>
      <tr><td><span class="tag tag-warning">P1 — High</span></td><td>Add social proof and review widgets</td><td>+12% trust conversion</td></tr>
      <tr><td><span class="tag tag-success">P2 — Medium</span></td><td>Launch loyalty/referral program</td><td>+25% repeat purchases</td></tr>
      <tr><td><span class="tag tag-info">P3 — Low</span></td><td>AI chatbot and personalization engine</td><td>+18% AOV increase</td></tr>
    </tbody>
  </table>
  <div style="margin-top:32px; padding:24px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#fff; border-radius:12px; text-align:center;">
    <h4 style="margin-bottom:8px;">Ready to Recover Revenue?</h4>
    <p style="font-size:14px; color:#94a3b8;">Contact EcomFind to implement these recommendations and start seeing results in 30 days.</p>
  </div>
  <div class="page-footer"><span>EcomFind Executive Audit</span><span>Page 10 of 10</span></div>
</div>

</body>
</html>
  `;
}

// ─── MAIN PAGE COMPONENT ───
export default function DiscoverPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const runAudit = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Audit failed");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!result) return;
    setDownloading(true);
    const html = generateReportHTML(result);
    const blob = new Blob([html], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `EcomFind-Audit-${result.url.replace(/[^a-z0-9]/gi, "_")}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    setDownloading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-3">E-Commerce Store Audit</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Enter any Shopify or e-commerce store URL to generate a comprehensive revenue recovery audit with actionable insights.
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-10"
        >
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && runAudit()}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button
                  onClick={runAudit}
                  disabled={loading || !url.trim()}
                  className="h-12 px-6 bg-slate-900 hover:bg-slate-800"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5 mr-2" />}
                  {loading ? "Auditing..." : "Audit Store"}
                </Button>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Score Overview */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-3 gap-0">
                    <div className="p-8 bg-slate-900 text-white flex flex-col items-center justify-center">
                      <div className="text-sm uppercase tracking-wider text-slate-400 mb-2">Audit Score</div>
                      <div className={`text-6xl font-bold ${getScoreColor(result.metrics?.score || 0)}`}>
                        {result.metrics?.score || 0}
                      </div>
                      <div className="text-slate-400 mt-1">out of 100</div>
                      <Progress
                        value={result.metrics?.score || 0}
                        className="w-48 mt-4 h-2 bg-slate-700"
                      />
                    </div>
                    <div className="p-8 col-span-2">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{result.url}</h3>
                      <p className="text-slate-600 mb-6">{result.summary}</p>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-slate-50 rounded-xl">
                          <div className="text-2xl font-bold text-slate-900">{result.issues?.length || 0}</div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Issues Found</div>
                        </div>
                        <div className="text-center p-4 bg-slate-50 rounded-xl">
                          <div className="text-2xl font-bold text-emerald-600">{result.opportunities?.length || 0}</div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Opportunities</div>
                        </div>
                        <div className="text-center p-4 bg-slate-50 rounded-xl">
                          <div className="text-2xl font-bold text-blue-600">
                            {result.metrics?.monthlyRevenue
                              ? new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                  maximumFractionDigits: 0,
                                }).format(result.metrics.monthlyRevenue)
                              : "N/A"}
                          </div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Est. Monthly Revenue</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Issues & Opportunities Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Issues */}
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Critical Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {result.issues?.slice(0, 5).map((issue: any, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                              issue.severity === "critical"
                                ? "bg-red-500"
                                : issue.severity === "warning"
                                ? "bg-amber-500"
                                : "bg-blue-500"
                            }`}
                          />
                          <div>
                            <div className="font-medium text-sm text-slate-900">{issue.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{issue.description}</div>
                          </div>
                        </div>
                      )) || <p className="text-slate-500 text-sm">No issues detected</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Opportunities */}
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                      Revenue Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {result.opportunities?.slice(0, 5).map((opp: any, i: number) => (
                        <div key={i} className="p-3 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
                          <div className="font-medium text-sm text-slate-900">{opp.title}</div>
                          <div className="text-xs text-slate-600 mt-0.5">{opp.description}</div>
                          {opp.impactValue && (
                            <div className="text-xs font-semibold text-emerald-700 mt-1">
                              +{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(opp.impactValue)}/mo
                            </div>
                          )}
                        </div>
                      )) || <p className="text-slate-500 text-sm">No opportunities detected</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tech Stack */}
              {result.techStack && result.techStack.length > 0 && (
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Layers className="h-5 w-5 text-blue-500" />
                      Technology Stack
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {result.techStack.map((tech: any, i: number) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">
                          {tech.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Download Report Button */}
              <div className="flex justify-center pt-4 pb-8">
                <Button
                  onClick={downloadReport}
                  disabled={downloading}
                  size="lg"
                  className="bg-slate-900 hover:bg-slate-800 px-8"
                >
                  {downloading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Download className="h-5 w-5 mr-2" />}
                  {downloading ? "Generating..." : "Download Full Audit Report"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}