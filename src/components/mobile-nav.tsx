"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Home, Menu, UsersRound, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const navigation = [
  { href: "/", label: "Home", icon: Home },
  { href: "/how-it-works", label: "How it works", icon: ArrowRight },
  { href: "/landlords", label: "For landlords", icon: UsersRound },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="md:hidden">
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-ink-900/25 backdrop-blur-[2px]"
        />
      )}

      <div className="fixed bottom-5 right-5 z-50">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((open) => !open)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-[0_12px_30px_rgba(21,154,140,0.3)] transition hover:bg-teal-700"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="fixed inset-x-5 bottom-24 z-50 rounded-[2rem] border border-cream-200 bg-white p-5 shadow-[0_24px_70px_rgba(44,54,48,0.18)]"
        >
          <div className="mb-5 flex items-center justify-between border-b border-cream-200 pb-4">
            <Link href="/" onClick={closeMenu} aria-label="Pact home">
              <BrandLogo className="h-10 w-24" />
            </Link>
            <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800">
              Built for Canada
            </span>
          </div>

          <div className="space-y-2">
            {navigation.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-2xl px-4 py-3.5 font-bold text-ink-800 transition hover:bg-cream-50 hover:text-teal-700"
              >
                <Icon size={18} className="text-teal-600" />
                {label}
              </Link>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-cream-200 pt-4">
            <Link
              href="/login"
              onClick={closeMenu}
              className="rounded-full border border-cream-300 px-4 py-3 text-center text-sm font-bold text-ink-800 transition hover:border-teal-300 hover:text-teal-700"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={closeMenu}
              className="rounded-full bg-teal-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-teal-700"
            >
              Get started
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}