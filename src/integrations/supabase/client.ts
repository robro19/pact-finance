import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://tjaxqguzkczllkurpthp.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_xEjh1HLWZQdoY1P6fZwHjQ_J7U9VhXK";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);