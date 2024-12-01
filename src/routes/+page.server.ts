export async function load({ fetch }) {
  const response = await fetch("/api/scores");
  const scores = await response.json();
  return {
    topScores: scores ?? [],
  };
}
