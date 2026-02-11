"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl md:text-3xl font-display font-medium text-brand-900">
              K8ts<span className="text-gold-500">Estates</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-brand-600 hover:text-brand-900 font-medium transition text-sm tracking-wide"
              >
                {item.name}
              </a>
            ))}
            <a
              href="tel:+14168167850"
              className="flex items-center gap-2 text-brand-900 font-medium"
            >
              <Phone className="h-4 w-4 text-gold-500" />
              (416) 816-7850
            </a>
            <Button variant="primary" size="sm">
              Book Consultation
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-brand-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-96 mt-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-4 py-6 border-t border-brand-100">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-brand-700 hover:text-brand-900 font-medium py-2 text-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="tel:+14168167850"
              className="flex items-center gap-2 text-brand-900 font-medium py-2"
            >
              <Phone className="h-5 w-5 text-gold-500" />
              (416) 816-7850
            </a>
            <Button variant="primary" className="w-full mt-2">
              Book Consultation
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
