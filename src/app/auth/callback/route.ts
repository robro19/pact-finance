import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requestedPath = getSafeNextPath(requestUrl.searchParams.get("next"));
  const response = NextResponse.redirect(new URL("/dashboard", requestUrl));

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=oauth_callback", requestUrl));
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
      "https://tjaxqguzkczllkurpthp.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      "sb_publishable_xEjh1HLWZQdoY1P6fZwHjQ_J7U9VhXK",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(new URL("/login?error=oauth_callback", requestUrl));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  const role = profile?.role ?? data.user.user_metadata.role ?? "renter";
  const defaultPath = role === "landlord" ? "/landlord-dashboard" : "/dashboard";
  const destination = requestedPath ?? defaultPath;

  response.headers.set("Location", new URL(destination, requestUrl).toString());
  return response;
}