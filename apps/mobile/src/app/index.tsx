import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { databaseService } from '@services/db.service';
import { demoMatchService } from '@services/demo-match.service';
import { quickMatchService } from '@services/quick-match.service';

type RecentMatch = {
  id: string;
  status: string;
  teamAName: string;
  teamBName: string;
};

type QuickFormState = {
  teamAName: string;
  teamBName: string;
  overs: string;
  players: string;
};

const INITIAL_FORM: QuickFormState = {
  teamAName: 'Team A',
  teamBName: 'Team B',
  overs: '5',
  players: '3',
};

export default function HomeScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [form, setForm] = useState<QuickFormState>(INITIAL_FORM);
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);

  const loadRecentMatches = useCallback(async () => {
    const matches = await databaseService.getRecentMatches(10);
    setRecentMatches(
      matches.map((match) => ({
        id: match.id,
        status: match.status,
        teamAName: match.teamAName,
        teamBName: match.teamBName,
      })),
    );
  }, []);

  useEffect(() => {
    void loadRecentMatches();
  }, [loadRecentMatches]);

  const handleQuickMatch = useCallback(async () => {
    try {
      setIsLoading(true);
      const matchId = await quickMatchService.createQuickMatch({
        teamAName: form.teamAName,
        teamBName: form.teamBName,
        oversPerInnings: Number(form.overs),
        playersPerTeam: Number(form.players),
      });

      setShowQuickForm(false);
      await loadRecentMatches();
      router.push(`/scoring/${matchId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start quick match';
      Alert.alert('Quick Match Error', message);
    } finally {
      setIsLoading(false);
    }
  }, [form.overs, form.players, form.teamAName, form.teamBName, loadRecentMatches, router]);

  const handleDemoMatch = useCallback(async () => {
    try {
      setIsLoading(true);
      const matchId = await demoMatchService.loadDemoMatch();
      await loadRecentMatches();
      router.push(`/scoring/${matchId}/summary`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load demo match';
      Alert.alert('Demo Match Error', message);
    } finally {
      setIsLoading(false);
    }
  }, [loadRecentMatches, router]);

  return (
    <ScrollView
      className="flex-1 bg-zinc-100 px-4 pt-12 dark:bg-black"
      contentContainerClassName="gap-4 pb-10"
    >
      <Text className="text-3xl font-black text-zinc-900 dark:text-zinc-100">Innings Pro</Text>

      <Pressable
        className="h-12 items-center justify-center rounded-2xl bg-emerald-500"
        disabled={isLoading}
      >
        <Text className="text-base font-semibold text-white">Start Tournament</Text>
      </Pressable>

      <Pressable
        onPress={() => setShowQuickForm((value) => !value)}
        className="h-12 items-center justify-center rounded-2xl bg-sky-500"
        disabled={isLoading}
      >
        <Text className="text-base font-semibold text-white">Quick Match</Text>
      </Pressable>

      {showQuickForm ? (
        <View className="gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            Team A Name
          </Text>
          <TextInput
            value={form.teamAName}
            onChangeText={(teamAName) => setForm((current) => ({ ...current, teamAName }))}
            className="rounded-xl border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
          />

          <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            Team B Name
          </Text>
          <TextInput
            value={form.teamBName}
            onChangeText={(teamBName) => setForm((current) => ({ ...current, teamBName }))}
            className="rounded-xl border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
          />

          <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Overs</Text>
          <TextInput
            keyboardType="numeric"
            value={form.overs}
            onChangeText={(overs) => setForm((current) => ({ ...current, overs }))}
            className="rounded-xl border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
          />

          <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            Players per Team
          </Text>
          <TextInput
            keyboardType="numeric"
            value={form.players}
            onChangeText={(players) => setForm((current) => ({ ...current, players }))}
            className="rounded-xl border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
          />

          <Pressable
            onPress={() => {
              void handleQuickMatch();
            }}
            className="mt-1 h-11 items-center justify-center rounded-xl bg-emerald-500"
            disabled={isLoading}
          >
            <Text className="font-semibold text-white">Start Scoring</Text>
          </Pressable>
        </View>
      ) : null}

      <Pressable
        onPress={() => {
          void handleDemoMatch();
        }}
        className="h-12 items-center justify-center rounded-2xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"
        disabled={isLoading}
      >
        <Text className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Try Demo Match
        </Text>
      </Pressable>

      <View className="mt-2 gap-3">
        <Text className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Recent Matches</Text>
        {recentMatches.length === 0 ? (
          <Text className="text-zinc-600 dark:text-zinc-300">No matches yet.</Text>
        ) : (
          recentMatches.map((match) => (
            <Pressable
              key={match.id}
              onPress={() => router.push(`/scoring/${match.id}/summary`)}
              className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <Text className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {match.teamAName} vs {match.teamBName}
              </Text>
              <Text className="mt-1 text-sm capitalize text-zinc-500 dark:text-zinc-400">
                {match.status}
              </Text>
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  );
}
