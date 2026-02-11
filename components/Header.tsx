"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "#" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-100">
      {/* Top bar */}
      <div className="hidden md:block bg-brand-800 text-white text-sm py-2">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+14165551234" className="flex items-center gap-2 hover:text-gold-400 transition">
              <Phone className="h-4 w-4" />
              <span>(416) 555-1234</span>
            </a>
            <a href="mailto:kate@k8tsestates.com" className="flex items-center gap-2 hover:text-gold-400 transition">
              <Mail className="h-4 w-4" />
              <span>kate@k8tsestates.com</span>
            </a>
          </div>
          <div className="text-brand-200">
            RE/MAX Your Community Realty | Broker
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-display font-bold text-brand-800">
              K8ts<span className="text-gold-500">Estates</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-brand-700 hover:text-brand-900 font-medium transition"
              >
                {item.name}
              </a>
            ))}
            <Button variant="primary" size="sm">
              Book Consultation
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-brand-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-96 mt-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-4 py-4 border-t border-brand-100">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-brand-700 hover:text-brand-900 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <Button variant="primary" className="w-full mt-2">
              Book Consultation
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
