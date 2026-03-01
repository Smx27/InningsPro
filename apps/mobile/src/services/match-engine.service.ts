export type MatchState = {
  runs: number;
  wickets: number;
  balls: number;
};

export const matchEngineService = {
  initialState(): MatchState {
    return { runs: 0, wickets: 0, balls: 0 };
  },

  addBall(state: MatchState, runsScored: number, wicket = false): MatchState {
    return {
      runs: state.runs + runsScored,
      wickets: wicket ? state.wickets + 1 : state.wickets,
      balls: state.balls + 1
    };
  }
};
