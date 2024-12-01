type SELECT_ROW = { name: string; score: number };

let leaderboard: SELECT_ROW[] = $state([]);

export const setLeaderboard = (newLeaderboard: SELECT_ROW[]) => {
  leaderboard = newLeaderboard;
};

export const getLeaderboard = (): SELECT_ROW[] => {
  return leaderboard;
};
