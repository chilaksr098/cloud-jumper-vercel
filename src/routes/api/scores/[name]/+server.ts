import {
  getSupabaseClientWithBearerToken,
  supabase,
} from "$lib/supabaseClient";
import { json } from "@sveltejs/kit";
import { GET as GET_Scores } from "../+server";

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
  const accessToken = request.headers
    .get("Authorization")
    ?.replace("Bearer ", "");

  if (!accessToken) {
    return json({ error: "User not authenticated" }, { status: 401 });
  }

  // Initialize Supabase client with the user's access token
  const supabase = getSupabaseClientWithBearerToken(accessToken);

  // Optional: Verify the user's authentication
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return json({ error: "User not authenticated" }, { status: 401 });
  }

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

  return await GET_Scores();
}
