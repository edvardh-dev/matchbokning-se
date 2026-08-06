export const supabaseProjectUrl = "https://lnytfcuuidccmfnrgibc.supabase.co";

export function getSupabaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return configuredUrl?.match(/https:\/\/[a-z0-9]+\.supabase\.co/)?.[0] || supabaseProjectUrl;
}

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}
