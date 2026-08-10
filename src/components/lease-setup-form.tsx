"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, CalendarDays, CheckCircle2, DollarSign, Loader2, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const leaseSchema = z.object({
  address: z.string().trim().min(5, "Enter the full rental address."),
  monthlyRentAmount: z
    .string()
    .min(1, "Enter your monthly rent.")
    .refine((value) => Number(value) > 0, "Rent must be greater than zero."),
  startDate: z.string().min(1, "Choose the lease start date."),
});

type LeaseFormValues = z.infer<typeof leaseSchema>;

type LeaseSetupFormProps = {
  userId: string;
  onCreated: () => void;
};

export function LeaseSetupForm({ userId, onCreated }: LeaseSetupFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeaseFormValues>({
    resolver: zodResolver(leaseSchema),
    defaultValues: {
      address: "",
      monthlyRentAmount: "",
      startDate: "",
    },
  });

  async function onSubmit(values: LeaseFormValues) {
    const { error } = await supabase.from("leases").insert({
      tenant_id: userId,
      address: values.address,
      monthly_rent_amount: Number(values.monthlyRentAmount),
      start_date: values.startDate,
      status: "active",
    });

    if (error) {
      toast.error("We couldn’t save your lease. Please try again.");
      return;
    }

    reset();
    toast.success("Your lease has been added.");
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="address" className="mb-2 block text-sm font-bold text-ink-800">
          Rental address
        </label>
        <div className="relative">
          <MapPin
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600"
          />
          <input
            id="address"
            {...register("address")}
            placeholder="123 Main Street, Toronto, ON"
            className="w-full rounded-2xl border border-cream-300 bg-white px-11 py-3.5 text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
        {errors.address && (
          <p className="mt-2 text-sm font-medium text-coral-600">{errors.address.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="monthlyRentAmount" className="mb-2 block text-sm font-bold text-ink-800">
            Monthly rent
          </label>
          <div className="relative">
            <DollarSign
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600"
            />
            <input
              id="monthlyRentAmount"
              {...register("monthlyRentAmount")}
              type="number"
              min="1"
              step="0.01"
              placeholder="2,100"
              className="w-full rounded-2xl border border-cream-300 bg-white px-11 py-3.5 text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>
          {errors.monthlyRentAmount && (
            <p className="mt-2 text-sm font-medium text-coral-600">
              {errors.monthlyRentAmount.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="startDate" className="mb-2 block text-sm font-bold text-ink-800">
            Lease start date
          </label>
          <div className="relative">
            <CalendarDays
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600"
            />
            <input
              id="startDate"
              {...register("startDate")}
              type="date"
              className="w-full rounded-2xl border border-cream-300 bg-white px-11 py-3.5 text-ink-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>
          {errors.startDate && (
            <p className="mt-2 text-sm font-medium text-coral-600">{errors.startDate.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-teal-50 p-4 text-sm leading-6 text-teal-950">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-teal-600" />
        <p>
          Your lease details help Pact match and verify your rent payments. You can update them
          later if anything changes.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3.5 font-bold text-white shadow-[0_8px_24px_rgba(21,154,140,0.2)] transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && <Loader2 size={18} className="animate-spin" />}
        {isSubmitting ? "Saving lease..." : "Save rental details"}
      </button>
    </form>
  );
}