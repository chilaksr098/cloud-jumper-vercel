import { supabase } from "$lib/supabaseClient";
import { json } from "@sveltejs/kit";

export async function GET() {
  const { data } = await supabase
    .from("top_scores")
    .select("*")
    .order("score", { ascending: false })
    .limit(10);

  return json(data ?? []);
}
