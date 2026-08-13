"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Banknote, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const connectionSchema = z.object({
  institutionName: z.string().min(1, "Choose your financial institution."),
});

type ConnectionFormValues = z.infer<typeof connectionSchema>;

type BankConnection = {
  id: string;
  institution_name: string;
  connection_status: string;
  last_synced_at: string | null;
};

const institutions = [
  "BMO",
  "CIBC",
  "Desjardins",
  "National Bank of Canada",
  "RBC",
  "Scotiabank",
  "TD Canada Trust",
  "Tangerine",
  "Other Canadian institution",
];

export function BankConnectionForm() {
  const [userId, setUserId] = useState("");
  const [connections, setConnections] = useState<BankConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConnectionFormValues>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      institutionName: "",
    },
  });

  useEffect(() => {
    async function loadConnections() {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        toast.error("Your session has expired. Please sign in again.");
        setIsLoading(false);
        return;
      }

      setUserId(userData.user.id);

      const { data, error } = await supabase
        .from("bank_connections")
        .select("id, institution_name, connection_status, last_synced_at")
        .eq("tenant_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("We couldn’t load your bank connections.");
      } else {
        setConnections(data ?? []);
      }

      setIsLoading(false);
    }

    loadConnections();
  }, []);

  async function onSubmit(values: ConnectionFormValues) {
    if (!userId) {
      toast.error("Your session has expired. Please sign in again.");
      return;
    }

    const syncedAt = new Date().toISOString();

    const { data, error } = await supabase
      .from("bank_connections")
      .insert({
        tenant_id: userId,
        institution_name: values.institutionName,
        connection_status: "connected",
        last_synced_at: syncedAt,
      })
      .select("id, institution_name, connection_status, last_synced_at")
      .single();

    if (error) {
      toast.error("We couldn’t create the mock bank connection. Please try again.");
      return;
    }

    setConnections((current) => [data, ...current]);
    reset();
    toast.success("Mock bank connection created. A sample rent transaction was detected.");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-[2rem] border border-cream-200 bg-white">
        <div className="flex items-center gap-3 text-sm font-bold text-teal-700">
          <Loader2 size={18} className="animate-spin" />
          Loading your bank connections...
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <aside className="rounded-[2rem] bg-teal-900 p-7 text-white shadow-[0_18px_50px_rgba(44,54,48,0.12)] sm:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-700 text-teal-50">
          <Banknote size={26} />
        </div>
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.16em] text-mustard-300">
          Mock bank verification
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.05em]">
          Preview how automatic rent matching will work.
        </h1>
        <p className="mt-4 leading-7 text-teal-50/75">
          This demo simulates a bank connection and creates a sample monthly rent transaction.
          No banking credentials are requested or transmitted.
        </p>
        <div className="mt-8 flex items-start gap-3 border-t border-white/15 pt-6 text-sm leading-6 text-teal-50/75">
          <ShieldCheck className="mt-0.5 shrink-0 text-mustard-300" size={18} />
          Mock matches still require landlord acceptance before a payment can be verified or reported.
        </div>
      </aside>

      <section className="rounded-[2rem] border border-cream-200 bg-white p-6 shadow-[0_16px_45px_rgba(44,54,48,0.06)] sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral-500">
            Demo connection
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em]">
            Connect a sample institution
          </h2>
          <p className="mt-2 leading-7 text-ink-600">
            Choose an institution to simulate a successful connection and transaction sync.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="institutionName"
              className="mb-2 block text-sm font-bold text-ink-800"
            >
              Financial institution
            </label>
            <select
              id="institutionName"
              {...register("institutionName")}
              className="w-full rounded-2xl border border-cream-300 bg-white px-4 py-3.5 text-ink-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="">Choose your institution</option>
              {institutions.map((institution) => (
                <option key={institution} value={institution}>
                  {institution}
                </option>
              ))}
            </select>
            {errors.institutionName && (
              <p className="mt-2 text-sm font-medium text-coral-600">
                {errors.institutionName.message}
              </p>
            )}
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-teal-50 p-4 text-sm leading-6 text-teal-950">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-teal-600" />
            <p>
              The mock sync will create a connected status with today’s sync time and display a
              sample rent payment ready for landlord review.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3.5 font-bold text-white shadow-[0_8px_24px_rgba(21,154,140,0.2)] transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={18} className="animate-spin" />}
            {isSubmitting ? "Creating mock connection..." : "Create mock connection"}
          </button>
        </form>

        {connections.length > 0 && (
          <div className="mt-10 border-t border-cream-200 pt-7">
            <h3 className="text-xl font-bold">Connected institutions</h3>
            <div className="mt-4 space-y-3">
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  className="rounded-2xl bg-cream-50 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700">
                        <Banknote size={19} />
                      </span>
                      <div>
                        <p className="font-bold">{connection.institution_name}</p>
                        <p className="text-sm text-ink-600">
                          Last synced{" "}
                          {connection.last_synced_at
                            ? new Date(connection.last_synced_at).toLocaleDateString("en-CA")
                            : "today"}
                        </p>
                      </div>
                    </div>
                    <span className="w-fit rounded-full bg-teal-100 px-3 py-1.5 text-xs font-bold capitalize text-teal-800">
                      {connection.connection_status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl border border-teal-100 bg-white px-4 py-3">
                    <div>
                      <p className="text-sm font-bold">Sample rent transaction detected</p>
                      <p className="mt-1 text-xs text-ink-600">Ready for landlord acceptance</p>
                    </div>
                    <CheckCircle2 size={20} className="text-teal-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link
          href="/dashboard"
          className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-ink-600 transition hover:text-teal-700"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
      </section>
    </div>
  );
}