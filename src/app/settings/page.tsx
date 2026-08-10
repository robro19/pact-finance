import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ProfileSettingsForm } from "@/components/profile-settings-form";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-cream-50 text-ink-900">
      <header className="border-b border-cream-200 bg-white/85">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" aria-label="Pact home">
            <BrandLogo className="h-11 w-28" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-cream-300 bg-white px-4 py-2.5 text-sm font-bold text-ink-700 transition hover:border-teal-300 hover:text-teal-700"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
        <ProfileSettingsForm />
      </section>
    </main>
  );
}