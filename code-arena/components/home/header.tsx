"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 py-9 mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              className="h-6 w-6 text-teal-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="font-bold text-lg">CodeArena</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="text-sm font-medium">
            <Link href="/explore">Explore</Link>
          </Button>
          <Button variant="ghost" className="text-sm font-medium">
            <Link href="/product">Product</Link>
          </Button>
          <Button variant="ghost" className="text-sm font-medium">
            <Link href="/developer">Developer</Link>
          </Button>
          <Button variant="outline" className="text-sm font-medium">
            <Link href="/signin">Sign In</Link>
          </Button>
        </nav>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-14 left-0 w-full h-screen bg-background/95 z-40 p-6 space-y-4">
          <Link
            href="/explore"
            className="block text-base font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Explore
          </Link>
          <Link
            href="/product"
            className="block text-base font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Product
          </Link>
          <Link
            href="/developer"
            className="block text-base font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Developer
          </Link>
          <Link
            href="/signin"
            className="inline-block border rounded px-4 py-2 text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
}
