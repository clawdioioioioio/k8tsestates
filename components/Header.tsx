"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone, ArrowUpRight } from "lucide-react";
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "glass py-3 shadow-lg shadow-brand-900/5 border-b border-white/10"
          : "bg-transparent py-5"
      )}
    >
      <nav className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center shadow-lg shadow-accent-400/30 group-hover:shadow-accent-400/50 transition-shadow">
              <span className="text-white font-bold text-lg">K8</span>
            </div>
            <span className="text-xl font-bold text-brand-900 hidden sm:block">
              Estates
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative text-brand-600 hover:text-brand-900 font-medium transition-colors text-sm group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
          
          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+14168167850"
              className="flex items-center gap-2 text-brand-700 hover:text-brand-900 font-medium text-sm transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden lg:inline">(416) 816-7850</span>
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-brand-900 text-white font-semibold text-sm rounded-full hover:bg-brand-800 transition-all btn-magnetic"
            >
              Get Started
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-brand-700 hover:text-brand-900 transition-colors"
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
            "md:hidden overflow-hidden transition-all duration-500",
            mobileMenuOpen ? "max-h-[400px] opacity-100 mt-6" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex flex-col gap-2 py-6 border-t border-brand-200">
            {navigation.map((item, i) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "text-brand-800 hover:text-brand-900 font-semibold py-3 px-4 rounded-xl hover:bg-brand-100 transition-all text-lg",
                  mobileMenuOpen && "animate-slide-up",
                  mobileMenuOpen && `animation-delay-${(i + 1) * 100}`
                )}
                style={{ opacity: 0, animationFillMode: 'forwards' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="tel:+14168167850"
              className={cn(
                "flex items-center gap-3 text-brand-700 font-medium py-3 px-4 rounded-xl hover:bg-brand-100 transition-all",
                mobileMenuOpen && "animate-slide-up animation-delay-400"
              )}
              style={{ opacity: 0, animationFillMode: 'forwards' }}
            >
              <Phone className="h-5 w-5 text-accent-500" />
              (416) 816-7850
            </a>
            <a
              href="#contact"
              className={cn(
                "mt-2 inline-flex items-center justify-center gap-2 px-6 py-4 bg-brand-900 text-white font-semibold rounded-xl",
                mobileMenuOpen && "animate-slide-up animation-delay-500"
              )}
              style={{ opacity: 0, animationFillMode: 'forwards' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
