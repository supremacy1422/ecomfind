"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="container flex h-14 items-center">
        <Link href="/" className="font-bold text-lg">ecomfind</Link>
        <div className="ml-auto flex gap-4">
          <Link href="/discover" className="text-sm font-medium hover:underline">Discover</Link>
          <Link href="/leads" className="text-sm font-medium hover:underline">Leads</Link>
        </div>
      </div>
    </nav>
  )
}