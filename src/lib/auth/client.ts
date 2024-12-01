import type { Provider } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";

export async function signInWith(provider: Provider | null = null) {
  // Sign in anonymously, or with a third-party provider (discord)
  const { data, error } = await (async () => {
    if (!provider) {
      return await supabase.auth.signInAnonymously();
    }

    return await supabase.auth.signInWithOAuth({
      provider,
    });
  })();

  if (error) {
    console.log("Error signing in:", error);
  }
  
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log("Error signing out:", error);
  }
}
