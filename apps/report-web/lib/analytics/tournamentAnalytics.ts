import type { MatchReport } from '../../types/report.types';

export interface PlayerAggregate {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  matches: number;
  runs: number;
  ballsFaced: number;
  wickets: number;
  ballsBowled: number;
  runsConceded: number;
}

export interface TeamAggregate {
  teamId: string;
  teamName: string;
  matches: number;
  wins: number;
  losses: number;
  points: number;
  runsScored: number;
  runsConceded: number;
  ballsFaced: number;
  ballsBowled: number;
  netRunRate: number;
}

function oversToBalls(overs: number): number {
  const wholeOvers = Math.trunc(overs);
  const partialOvers = Math.round((overs - wholeOvers) * 10);

  return wholeOvers * 6 + Math.min(Math.max(partialOvers, 0), 5);
}

function safeRate(numerator: number, denominator: number, scale = 1): number {
  if (denominator <= 0) {
    return 0;
  }

  return (numerator / denominator) * scale;
}

function buildMatchIndex(match: MatchReport) {
  const playerNameById = new Map<string, string>();
  const playerTeamIdById = new Map<string, string>();
  const teamNameById = new Map<string, string>([
    [match.teamA.id, match.teamA.name],
    [match.teamB.id, match.teamB.name],
  ]);

  for (const team of [match.teamA, match.teamB]) {
    for (const player of team.players) {
      playerNameById.set(player.id, player.name);
      playerTeamIdById.set(player.id, team.id);
    }
  }

  return { playerNameById, playerTeamIdById, teamNameById };
}

function getOrCreatePlayerAggregate(
  playerMap: Map<string, PlayerAggregate>,
  playerId: string,
  playerName: string,
  teamId: string,
  teamName: string,
): PlayerAggregate {
  const existing = playerMap.get(playerId);

  if (existing) {
    return existing;
  }

  const created: PlayerAggregate = {
    playerId,
    playerName,
    teamId,
    teamName,
    matches: 0,
    runs: 0,
    ballsFaced: 0,
    wickets: 0,
    ballsBowled: 0,
    runsConceded: 0,
  };

  playerMap.set(playerId, created);
  return created;
}

function getOrCreateTeamAggregate(
  teamMap: Map<string, TeamAggregate>,
  teamId: string,
  teamName: string,
): TeamAggregate {
  const existing = teamMap.get(teamId);

  if (existing) {
    return existing;
  }

  const created: TeamAggregate = {
    teamId,
    teamName,
    matches: 0,
    wins: 0,
    losses: 0,
    points: 0,
    runsScored: 0,
    runsConceded: 0,
    ballsFaced: 0,
    ballsBowled: 0,
    netRunRate: 0,
  };

  teamMap.set(teamId, created);
  return created;
}

function aggregatePlayers(matches: MatchReport[]): PlayerAggregate[] {
  const playerMap = new Map<string, PlayerAggregate>();

  for (const match of matches) {
    const { playerNameById, playerTeamIdById, teamNameById } = buildMatchIndex(match);
    const seenInMatch = new Set<string>();

    for (const innings of match.innings) {
      const battingTeamId = innings.teamId;
      const battingTeamName = teamNameById.get(battingTeamId) ?? battingTeamId;

      for (const row of innings.battingScorecard) {
        const playerId = row.playerId;
        const playerName = playerNameById.get(playerId) ?? playerId;
        const teamId = playerTeamIdById.get(playerId) ?? battingTeamId;
        const teamName = teamNameById.get(teamId) ?? battingTeamName;
        const aggregate = getOrCreatePlayerAggregate(
          playerMap,
          playerId,
          playerName,
          teamId,
          teamName,
        );

        aggregate.runs += row.runs;
        aggregate.ballsFaced += row.balls;
        seenInMatch.add(playerId);
      }

      const bowlingTeamId = battingTeamId === match.teamA.id ? match.teamB.id : match.teamA.id;
      const bowlingTeamName = teamNameById.get(bowlingTeamId) ?? bowlingTeamId;

      for (const row of innings.bowlingScorecard) {
        const playerId = row.playerId;
        const playerName = playerNameById.get(playerId) ?? playerId;
        const teamId = playerTeamIdById.get(playerId) ?? bowlingTeamId;
        const teamName = teamNameById.get(teamId) ?? bowlingTeamName;
        const aggregate = getOrCreatePlayerAggregate(
          playerMap,
          playerId,
          playerName,
          teamId,
          teamName,
        );

        aggregate.wickets += row.wickets;
        aggregate.runsConceded += row.runs;
        aggregate.ballsBowled += oversToBalls(row.overs);
        seenInMatch.add(playerId);
      }
    }

    for (const playerId of seenInMatch) {
      const aggregate = playerMap.get(playerId);
      if (aggregate) {
        aggregate.matches += 1;
      }
    }
  }

  return [...playerMap.values()];
}

export function computeTopRunScorers(matches: MatchReport[]): PlayerAggregate[] {
  return aggregatePlayers(matches).sort((a, b) => b.runs - a.runs);
}

export function computeTopWicketTakers(matches: MatchReport[]): PlayerAggregate[] {
  return aggregatePlayers(matches).sort((a, b) => b.wickets - a.wickets);
}

export function computeStrikeRateLeaders(matches: MatchReport[]): PlayerAggregate[] {
  return aggregatePlayers(matches)
    .filter((player) => player.ballsFaced >= 10)
    .sort((a, b) => safeRate(b.runs, b.ballsFaced, 100) - safeRate(a.runs, a.ballsFaced, 100));
}

export function computeEconomyLeaders(matches: MatchReport[]): PlayerAggregate[] {
  const minimumBallsBowled = 12;

  return aggregatePlayers(matches)
    .filter((player) => player.ballsBowled >= minimumBallsBowled)
    .sort(
      (a, b) =>
        safeRate(a.runsConceded, a.ballsBowled, 6) - safeRate(b.runsConceded, b.ballsBowled, 6),
    );
}

export function computeTeamLeaderboard(matches: MatchReport[]): TeamAggregate[] {
  const teamMap = new Map<string, TeamAggregate>();

  for (const match of matches) {
    const teamNameById = new Map<string, string>([
      [match.teamA.id, match.teamA.name],
      [match.teamB.id, match.teamB.name],
    ]);

    const teamA = getOrCreateTeamAggregate(teamMap, match.teamA.id, match.teamA.name);
    const teamB = getOrCreateTeamAggregate(teamMap, match.teamB.id, match.teamB.name);

    teamA.matches += 1;
    teamB.matches += 1;

    for (const innings of match.innings) {
      const battingTeam = getOrCreateTeamAggregate(
        teamMap,
        innings.teamId,
        teamNameById.get(innings.teamId) ?? innings.teamId,
      );

      const bowlingTeamId = innings.teamId === match.teamA.id ? match.teamB.id : match.teamA.id;
      const bowlingTeam = getOrCreateTeamAggregate(
        teamMap,
        bowlingTeamId,
        teamNameById.get(bowlingTeamId) ?? bowlingTeamId,
      );

      battingTeam.runsScored += innings.totalRuns;
      battingTeam.ballsFaced += oversToBalls(innings.totalOvers);
      bowlingTeam.runsConceded += innings.totalRuns;
      bowlingTeam.ballsBowled += oversToBalls(innings.totalOvers);
    }

    const inningsA = match.innings.find((innings) => innings.teamId === match.teamA.id);
    const inningsB = match.innings.find((innings) => innings.teamId === match.teamB.id);

    if (inningsA && inningsB) {
      if (inningsA.totalRuns > inningsB.totalRuns) {
        teamA.wins += 1;
        teamB.losses += 1;
      } else if (inningsB.totalRuns > inningsA.totalRuns) {
        teamB.wins += 1;
        teamA.losses += 1;
      }
    }
  }

  return [...teamMap.values()]
    .map((team) => ({
      ...team,
      points: team.wins * 2,
      netRunRate:
        safeRate(team.runsScored, team.ballsFaced, 6) -
        safeRate(team.runsConceded, team.ballsBowled, 6),
    }))
    .sort((a, b) => b.points - a.points || b.netRunRate - a.netRunRate);
}
