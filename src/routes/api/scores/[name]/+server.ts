import { supabase } from "$lib/supabaseClient";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  console.log("Params:", params);
  const { data } = await supabase
    .from("top_scores")
    .select("*")
    .eq("name", params.name)
    .order("score", { ascending: false })
    .limit(10);

  return json(data ?? []);
}

export async function POST({ request, params }) {
  const requestBody = await request.json();
  const score = requestBody.score;
  const name = params.name;
  const { data, error } = await supabase
    .from("top_scores")
    .insert([{ name, score }])
    .single();

  if (error) {
    return json(error);
  }
  return json(data);
}
