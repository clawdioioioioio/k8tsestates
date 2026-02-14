"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Menu, X, Phone, ArrowRight } from "lucide-react";

const navigation = [
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus trap & escape key handling for mobile menu
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setMobileMenuOpen(false);
      menuButtonRef.current?.focus();
      return;
    }

    if (e.key === "Tab" && menuRef.current) {
      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Focus first link when menu opens
      requestAnimationFrame(() => {
        const firstLink = menuRef.current?.querySelector<HTMLElement>("a[href]");
        firstLink?.focus();
      });
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen, handleKeyDown]);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "glass py-3 shadow-sm border-b border-brand-100/50"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-900 flex items-center justify-center group-hover:bg-brand-800 transition-colors">
              <span className="text-white font-bold text-base tracking-tight">K8</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-brand-900 tracking-tight">Estates</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-brand-700 hover:text-brand-900 font-medium transition-colors text-sm"
              >
                {item.name}
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
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-brand-900 text-white font-semibold text-sm rounded-full hover:bg-brand-800 transition-colors btn-hover"
            >
              Get in Touch
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            ref={menuButtonRef}
            className="md:hidden p-3 -m-1 text-brand-700 hover:text-brand-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" ref={menuRef} className="md:hidden mt-4 pb-4 border-t border-brand-100" role="menu">
            <div className="flex flex-col gap-1 pt-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-brand-800 hover:text-brand-900 font-semibold py-3 px-4 rounded-xl hover:bg-brand-50 transition-colors text-lg"
                  onClick={closeMenu}
                  role="menuitem"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="tel:+14168167850"
                className="flex items-center gap-3 text-brand-700 font-medium py-3 px-4 rounded-xl hover:bg-brand-50 transition-colors"
                role="menuitem"
              >
                <Phone className="h-5 w-5 text-accent-500" />
                (416) 816-7850
              </a>
              <a
                href="#contact"
                className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-4 bg-brand-900 text-white font-semibold rounded-xl"
                onClick={closeMenu}
                role="menuitem"
              >
                Get in Touch
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
