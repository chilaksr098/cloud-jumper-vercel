import { supabase } from "$lib/supabaseClient";
import type { Provider } from "@supabase/supabase-js";
import { redirect } from "@sveltejs/kit";

export async function signInWith(provider: Provider, options: any) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options,
  });
  if (data.url) {
    redirect(303, data.url); // use the redirect API for your server framework
  }
}
