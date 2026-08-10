"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Loader2, MapPin, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  country: z.string().min(1, "Choose your country."),
  region: z.string().min(1, "Choose your province or territory."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const provinces = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Northwest Territories",
  "Nunavut",
  "Yukon",
];

export function ProfileSettingsForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("renter");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      country: "CA",
      region: "",
    },
  });

  useEffect(() => {
    async function loadProfile() {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        toast.error("We couldn’t load your account details.");
        setIsLoading(false);
        return;
      }

      const user = userData.user;
      setUserId(user.id);
      setEmail(user.email ?? "");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, country, region, role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        toast.error("We couldn’t load your profile.");
      } else if (profile) {
        setRole(profile.role ?? "renter");
        reset({
          fullName: profile.full_name ?? user.user_metadata.full_name ?? "",
          country: profile.country ?? "CA",
          region: profile.region ?? "",
        });
      } else {
        reset({
          fullName: user.user_metadata.full_name ?? "",
          country: "CA",
          region: "",
        });
      }

      setIsLoading(false);
    }

    loadProfile();
  }, [reset]);

  async function onSubmit(values: ProfileFormValues) {
    if (!userId) {
      toast.error("Your account session has expired. Please sign in again.");
      return;
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        id: userId,
        full_name: values.fullName,
        country: values.country,
        region: values.region,
        role,
      },
      { onConflict: "id" },
    );

    if (error) {
      toast.error("We couldn’t save your profile. Please try again.");
      return;
    }

    toast.success("Your profile has been updated.");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[2rem] border border-cream-200 bg-white">
        <div className="flex items-center gap-3 text-sm font-bold text-teal-700">
          <Loader2 size={18} className="animate-spin" />
          Loading your profile...
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
      <aside className="rounded-[2rem] bg-teal-900 p-7 text-white shadow-[0_18px_50px_rgba(44,54,48,0.12)] sm:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-700 text-teal-50">
          <UserRound size={26} />
        </div>
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.16em] text-mustard-300">
          Account settings
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em]">
          Keep your Pact details current.
        </h2>
        <p className="mt-4 leading-7 text-teal-50/75">
          Your profile helps keep your lease and payment verification details connected to the
          right person.
        </p>

        <div className="mt-8 space-y-3 border-t border-white/15 pt-6 text-sm">
          <div>
            <p className="text-teal-100/55">Email address</p>
            <p className="mt-1 break-words font-bold text-white">{email || "Not available"}</p>
          </div>
          <div>
            <p className="text-teal-100/55">Account type</p>
            <p className="mt-1 font-bold capitalize text-white">{role}</p>
          </div>
        </div>
      </aside>

      <section className="rounded-[2rem] border border-cream-200 bg-white p-6 shadow-[0_16px_45px_rgba(44,54,48,0.06)] sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral-500">
            Personal details
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.05em]">Your profile</h1>
          <p className="mt-2 leading-7 text-ink-600">
            Update the details we use to personalize your Pact experience.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-bold text-ink-800">
              Full name
            </label>
            <div className="relative">
              <UserRound
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600"
              />
              <input
                id="fullName"
                {...register("fullName")}
                className="w-full rounded-2xl border border-cream-300 bg-white px-11 py-3.5 text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                placeholder="Your full name"
              />
            </div>
            {errors.fullName && (
              <p className="mt-2 text-sm font-medium text-coral-600">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-bold text-ink-800">
              Email address
            </label>
            <input
              id="email"
              value={email}
              readOnly
              className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3.5 text-ink-500 outline-none"
            />
            <p className="mt-2 text-xs text-ink-500">Email changes are managed through account authentication.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="country" className="mb-2 block text-sm font-bold text-ink-800">
                Country
              </label>
              <select
                id="country"
                {...register("country")}
                className="w-full appearance-none rounded-2xl border border-cream-300 bg-white px-4 py-3.5 text-ink-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                <option value="CA">Canada</option>
              </select>
              {errors.country && (
                <p className="mt-2 text-sm font-medium text-coral-600">{errors.country.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="region" className="mb-2 block text-sm font-bold text-ink-800">
                Province or territory
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600"
                />
                <select
                  id="region"
                  {...register("region")}
                  className="w-full appearance-none rounded-2xl border border-cream-300 bg-white px-11 py-3.5 text-ink-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                >
                  <option value="">Choose a province</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
              {errors.region && (
                <p className="mt-2 text-sm font-medium text-coral-600">{errors.region.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-teal-50 p-4 text-sm leading-6 text-teal-950">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-teal-600" />
            <p>Your profile details are private and only used to support your Pact account.</p>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-300 px-5 py-3 font-bold text-ink-700 transition hover:border-teal-300 hover:text-teal-700"
            >
              <ArrowLeft size={17} />
              Back to dashboard
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3 font-bold text-white shadow-[0_8px_24px_rgba(21,154,140,0.2)] transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              {isSubmitting ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}