import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { BrandLogo } from "@/components/brand-logo";

type LoginPageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const role = params.role === "landlord" ? "landlord" : "renter";

  return (
    <main className="flex min-h-screen bg-cream-50">
      <section className="hidden flex-1 flex-col justify-between bg-teal-900 p-10 text-white lg:flex">
        <Link href="/" aria-label="Pact home">
          <BrandLogo className="h-14 w-32" />
        </Link>
        <div className="max-w-lg">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-mustard-300">
            Your rent has a story
          </p>
          <h2 className="text-5xl font-bold leading-[1.05] tracking-[-0.06em]">
            Keep building a future that counts.
          </h2>
          <p className="mt-6 max-w-md leading-7 text-teal-50/80">
            Pact helps turn verified rent payments into Canadian credit history.
          </p>
        </div>
        <p className="text-sm text-teal-100/60">Made for Canada.</p>
      </section>
      <section className="flex flex-1 items-center justify-center px-5 py-12">
        <div>
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-ink-600 hover:text-teal-700"
          >
            <ArrowLeft size={16} /> Back to Pact
          </Link>
          <AuthForm mode="login" role={role} />
        </div>
      </section>
    </main>
  );
}