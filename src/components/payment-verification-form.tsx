"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, FileCheck2, Handshake, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

type LeaseOption = {
  id: string;
  address: string;
  monthly_rent_amount: number;
};

const verificationSchema = z
  .object({
    leaseId: z.string().min(1, "Choose a lease."),
    month: z.string().min(1, "Choose the payment month."),
    amount: z
      .string()
      .min(1, "Enter the payment amount.")
      .refine((value) => Number(value) > 0, "Amount must be greater than zero."),
    method: z.enum(["bank", "landlord", "manual"]),
    landlordEmail: z.string().email("Enter a valid landlord email.").optional().or(z.literal("")),
    proofUrl: z.string().url("Enter a valid proof link.").optional().or(z.literal("")),
  })
  .refine((values) => values.method !== "landlord" || Boolean(values.landlordEmail), {
    message: "Add your landlord’s email address.",
    path: ["landlordEmail"],
  })
  .refine((values) => values.method !== "manual" || Boolean(values.proofUrl), {
    message: "Add a link to your payment proof.",
    path: ["proofUrl"],
  });

type VerificationFormValues = z.infer<typeof verificationSchema>;

type PaymentVerificationFormProps = {
  leases: LeaseOption[];
  userId: string;
  onCreated: () => void;
};

const methods = [
  {
    value: "bank" as const,
    label: "Bank verification",
    description: "Submit your payment for bank review.",
    icon: Banknote,
  },
  {
    value: "landlord" as const,
    label: "Landlord confirmation",
    description: "Ask your landlord to confirm rent received.",
    icon: Handshake,
  },
  {
    value: "manual" as const,
    label: "Manual proof",
    description: "Share a secure link to your receipt or statement.",
    icon: FileCheck2,
  },
];

export function PaymentVerificationForm({
  leases,
  userId,
  onCreated,
}: PaymentVerificationFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      leaseId: leases[0]?.id ?? "",
      month: new Date().toISOString().slice(0, 7),
      amount: leases[0]?.monthly_rent_amount?.toString() ?? "",
      method: "bank",
      landlordEmail: "",
      proofUrl: "",
    },
  });

  const selectedMethod = watch("method");

  async function onSubmit(values: VerificationFormValues) {
    if (!userId) {
      toast.error("Your session has expired. Please sign in again.");
      return;
    }

    const { error: paymentError } = await supabase.from("payment_records").insert({
      lease_id: values.leaseId,
      month: `${values.month}-01`,
      verification_method: values.method,
      status: "pending",
      amount: Number(values.amount),
      proof_url: values.proofUrl || null,
    });

    if (paymentError) {
      toast.error("We couldn’t submit this payment. Please try again.");
      return;
    }

    if (values.method === "landlord" && values.landlordEmail) {
      const { error: inviteError } = await supabase.from("landlord_invites").insert({
        lease_id: values.leaseId,
        invited_email: values.landlordEmail.trim().toLowerCase(),
        status: "pending",
      });

      if (inviteError) {
        toast.error("Payment submitted, but we couldn’t create the landlord invitation.");
        onCreated();
        return;
      }

      toast.success("Payment submitted and landlord invitation created.");
    } else {
      toast.success("Payment submitted for verification.");
    }

    onCreated();
  }

  if (leases.length === 0) {
    return (
      <div className="rounded-2xl bg-cream-50 p-5 text-sm leading-6 text-ink-600">
        Add a lease before submitting a payment for verification.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="leaseId" className="mb-2 block text-sm font-bold text-ink-800">
          Lease
        </label>
        <select
          id="leaseId"
          {...register("leaseId")}
          className="w-full rounded-2xl border border-cream-300 bg-white px-4 py-3.5 text-ink-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        >
          {leases.map((lease) => (
            <option key={lease.id} value={lease.id}>
              {lease.address}
            </option>
          ))}
        </select>
        {errors.leaseId && <p className="mt-2 text-sm text-coral-600">{errors.leaseId.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="month" className="mb-2 block text-sm font-bold text-ink-800">
            Payment month
          </label>
          <input
            id="month"
            type="month"
            {...register("month")}
            className="w-full rounded-2xl border border-cream-300 bg-white px-4 py-3.5 text-ink-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
          {errors.month && <p className="mt-2 text-sm text-coral-600">{errors.month.message}</p>}
        </div>

        <div>
          <label htmlFor="amount" className="mb-2 block text-sm font-bold text-ink-800">
            Amount paid
          </label>
          <input
            id="amount"
            type="number"
            min="1"
            step="0.01"
            {...register("amount")}
            className="w-full rounded-2xl border border-cream-300 bg-white px-4 py-3.5 text-ink-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
          {errors.amount && <p className="mt-2 text-sm text-coral-600">{errors.amount.message}</p>}
        </div>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-bold text-ink-800">Verification method</legend>
        <div className="grid gap-3">
          {methods.map(({ value, label, description, icon: Icon }) => (
            <label
              key={value}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-cream-200 bg-white p-4 transition has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50"
            >
              <input
                type="radio"
                value={value}
                {...register("method")}
                className="mt-1 accent-teal-600"
              />
              <Icon size={19} className="mt-0.5 shrink-0 text-teal-600" />
              <span>
                <span className="block font-bold text-ink-900">{label}</span>
                <span className="mt-1 block text-sm leading-5 text-ink-600">{description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {selectedMethod === "landlord" && (
        <div>
          <label htmlFor="landlordEmail" className="mb-2 block text-sm font-bold text-ink-800">
            Landlord email
          </label>
          <input
            id="landlordEmail"
            type="email"
            {...register("landlordEmail")}
            placeholder="landlord@example.com"
            className="w-full rounded-2xl border border-cream-300 bg-white px-4 py-3.5 text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
          {errors.landlordEmail && (
            <p className="mt-2 text-sm text-coral-600">{errors.landlordEmail.message}</p>
          )}
        </div>
      )}

      {selectedMethod === "manual" && (
        <div>
          <label htmlFor="proofUrl" className="mb-2 block text-sm font-bold text-ink-800">
            Payment proof link
          </label>
          <input
            id="proofUrl"
            type="url"
            {...register("proofUrl")}
            placeholder="https://example.com/your-receipt"
            className="w-full rounded-2xl border border-cream-300 bg-white px-4 py-3.5 text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
          {errors.proofUrl && <p className="mt-2 text-sm text-coral-600">{errors.proofUrl.message}</p>}
        </div>
      )}

      <div className="rounded-2xl bg-teal-50 p-4 text-sm leading-6 text-teal-950">
        Your payment will remain pending until the selected verification path is completed.
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3.5 font-bold text-white shadow-[0_8px_24px_rgba(21,154,140,0.2)] transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && <Loader2 size={18} className="animate-spin" />}
        {isSubmitting ? "Submitting payment..." : "Submit for verification"}
      </button>
    </form>
  );
}