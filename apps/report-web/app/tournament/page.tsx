'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { MatchList } from '../../components/tournament/MatchList';
import { PlayerLeaderboard } from '../../components/tournament/PlayerLeaderboard';
import { PlayerStatsTable } from '../../components/tournament/PlayerStatsTable';
import { TeamLeaderboard } from '../../components/tournament/TeamLeaderboard';
import { TeamStatsTable } from '../../components/tournament/TeamStatsTable';
import { TournamentSummary } from '../../components/tournament/TournamentSummary';
import { useReportStore } from '../../lib/store';

import type { MatchItem, PlayerStanding, PlayerStatsRow, TeamStanding, TeamStatsRow, TournamentSummaryData } from '../../components/tournament/types';

export default function TournamentPage() {
  const router = useRouter();
  const tournamentReport = useReportStore((state) => state.tournamentReport);

  useEffect(() => {
    if (!tournamentReport) {
      router.push('/');
    }
  }, [router, tournamentReport]);

  const summary = useMemo<TournamentSummaryData>(() => {
    if (!tournamentReport) {
      return {
        title: '',
        stage: 'Tournament',
        teams: 0,
        matchesCompleted: 0,
        totalMatches: 0,
        totalRuns: 0,
        totalWickets: 0
      };
    }

    return {
      title: tournamentReport.tournamentName,
      stage: 'Tournament',
      teams: tournamentReport.teams.length,
      matchesCompleted: tournamentReport.matches.length,
      totalMatches: tournamentReport.totals.matches,
      totalRuns: tournamentReport.totals.runs,
      totalWickets: tournamentReport.totals.wickets
    };
  }, [tournamentReport]);

  const teamLeaderboard = useMemo<TeamStanding[]>(() => {
    if (!tournamentReport) {
      return [];
    }

    return tournamentReport.teams
      .map((team) => ({
        team: team.teamName,
        played: team.matches,
        won: team.wins,
        lost: team.losses,
        points: team.wins * 2,
        netRunRate: team.economy > 0 ? Number(((team.strikeRate / 100) * 6 - team.economy).toFixed(2)) : 0
      }))
      .sort((a, b) => b.points - a.points || b.netRunRate - a.netRunRate);
  }, [tournamentReport]);

  const playerLeaderboard = useMemo<PlayerStanding[]>(() => {
    if (!tournamentReport) {
      return [];
    }

    return [...tournamentReport.players]
      .map((player) => ({
        player: player.playerName,
        team: player.teamName,
        runs: player.runs,
        wickets: player.wickets,
        strikeRate: Number(player.strikeRate.toFixed(1))
      }))
      .sort((a, b) => b.runs - a.runs || b.wickets - a.wickets)
      .slice(0, 5);
  }, [tournamentReport]);

  const recentMatches = useMemo<MatchItem[]>(() => {
    if (!tournamentReport) {
      return [];
    }

    return tournamentReport.matches.slice(0, 3).map((match) => {
      const inningsA = match.innings.find((innings) => innings.teamId === match.teamA.id);
      const inningsB = match.innings.find((innings) => innings.teamId === match.teamB.id);

      const result = inningsA && inningsB
        ? inningsA.totalRuns > inningsB.totalRuns
          ? `${match.teamA.name} won`
          : inningsB.totalRuns > inningsA.totalRuns
            ? `${match.teamB.name} won`
            : 'Match tied'
        : 'Result unavailable';

      return {
        id: match.id,
        date: match.date ?? '-',
        venue: '-',
        teamA: match.teamA.name,
        teamB: match.teamB.name,
        result
      };
    });
  }, [tournamentReport]);

  const teamStats = useMemo<TeamStatsRow[]>(() => {
    if (!tournamentReport) {
      return [];
    }

    return tournamentReport.teams.map((team) => ({
      team: team.teamName,
      matches: team.matches,
      wins: team.wins,
      losses: team.losses,
      runsScored: team.runs,
      runsConceded: Math.round(team.economy * team.overs),
      netRunRate: Number(((team.strikeRate / 100) * 6 - team.economy).toFixed(2))
    }));
  }, [tournamentReport]);

  const playerStats = useMemo<PlayerStatsRow[]>(() => {
    if (!tournamentReport) {
      return [];
    }

    return tournamentReport.players.map((player) => ({
      player: player.playerName,
      team: player.teamName,
      matches: player.matches,
      runs: player.runs,
      average: Number((player.matches > 0 ? player.runs / player.matches : 0).toFixed(1)),
      strikeRate: Number(player.strikeRate.toFixed(1)),
      wickets: player.wickets
    }));
  }, [tournamentReport]);

  if (!tournamentReport) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-8">
      <TournamentSummary summary={summary} />

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TeamLeaderboard teams={teamLeaderboard} />
        </div>
        <MatchList matches={recentMatches} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <PlayerLeaderboard players={playerLeaderboard} />
        <TeamStatsTable rows={teamStats} />
      </section>

      <section>
        <PlayerStatsTable rows={playerStats} />
      </section>
    </main>
  );
}
