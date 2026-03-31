'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { MatchList } from './MatchList';
import { PlayerLeaderboard } from './PlayerLeaderboard';
import { TeamLeaderboard } from './TeamLeaderboard';
import { TournamentSummary } from './TournamentSummary';
import {
  computeTeamLeaderboard,
  computeTopRunScorers,
} from '../../lib/analytics/tournamentAnalytics';
import { useReportStore } from '../../lib/store';

import type { MatchItem, PlayerStanding, TeamStanding, TournamentSummaryData } from './types';

function formatMatchResult(
  teamAName: string,
  teamBName: string,
  teamARuns?: number,
  teamBRuns?: number,
) {
  if (teamARuns == null || teamBRuns == null) {
    return 'Result unavailable';
  }

  if (teamARuns === teamBRuns) {
    return 'Match tied';
  }

  return teamARuns > teamBRuns ? `${teamAName} won` : `${teamBName} won`;
}

export function TournamentAnalyticsPage() {
  const tournamentReport = useReportStore((state) => state.tournamentReport);

  const matches = useMemo(() => tournamentReport?.matches ?? [], [tournamentReport?.matches]);

  const computed = useMemo(() => {
    const players = computeTopRunScorers(matches);
    const teams = computeTeamLeaderboard(matches);

    const playerLeaderboard: PlayerStanding[] = players.slice(0, 10).map((player) => ({
      player: player.playerName,
      team: player.teamName,
      runs: player.runs,
      wickets: player.wickets,
      strikeRate: player.ballsFaced > 0 ? (player.runs / player.ballsFaced) * 100 : 0,
    }));

    const teamLeaderboard: TeamStanding[] = teams.map((team) => ({
      team: team.teamName,
      played: team.matches,
      won: team.wins,
      lost: team.losses,
      points: team.points,
      netRunRate: Number(team.netRunRate.toFixed(2)),
    }));

    const recentMatches: MatchItem[] = matches.slice(0, 6).map((match) => {
      const inningsA = match.innings.find((innings) => innings.teamId === match.teamA.id);
      const inningsB = match.innings.find((innings) => innings.teamId === match.teamB.id);

      return {
        id: match.id,
        date: match.date ?? '-',
        teamA: match.teamA.name,
        teamB: match.teamB.name,
        scoreSummary: `${match.teamA.name} ${inningsA?.totalRuns ?? 0}/${inningsA?.totalWickets ?? 0} · ${match.teamB.name} ${inningsB?.totalRuns ?? 0}/${inningsB?.totalWickets ?? 0}`,
        result: formatMatchResult(
          match.teamA.name,
          match.teamB.name,
          inningsA?.totalRuns,
          inningsB?.totalRuns,
        ),
        reportHref: '/reports',
      };
    });

    const summary: TournamentSummaryData = {
      title: tournamentReport?.tournamentName ?? '',
      stage: 'Tournament Analytics',
      totalMatches: matches.length,
      teams: teams.length,
      totalRuns: teams.reduce((acc, team) => acc + team.runsScored, 0),
      totalWickets: players.reduce((acc, player) => acc + player.wickets, 0),
    };

    return {
      playerLeaderboard,
      teamLeaderboard,
      recentMatches,
      summary,
    };
  }, [matches, tournamentReport?.tournamentName]);

  if (!tournamentReport) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 p-4 text-center md:p-8">
        <h1 className="text-2xl font-semibold">No tournament report loaded</h1>
        <p className="max-w-2xl text-muted-foreground">
          Upload your Innings Pro JSON on the home page to generate a tournament report with
          standings, leaderboards, and match summaries.
        </p>
        <Link
          href="/"
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Go to upload page
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-8">
      <TournamentSummary summary={computed.summary} />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <PlayerLeaderboard players={computed.playerLeaderboard} />
        <TeamLeaderboard teams={computed.teamLeaderboard} />
      </div>

      <MatchList matches={computed.recentMatches} />
    </main>
  );
}
