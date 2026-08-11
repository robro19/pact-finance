import { BankConnectionForm } from "@/components/bank-connection-form";

export default function BankConnectionPage() {
  return (
    <main className="min-h-screen bg-cream-50 px-5 py-10 text-ink-900 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <BankConnectionForm />
      </div>
    </main>
  );
}