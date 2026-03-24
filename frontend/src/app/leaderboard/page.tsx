"use client";

import { useState, useEffect } from "react";
import GlobalLeaderboardTable from "@/components/leaderboard/GlobalLeaderboardTable";
import { GlobalLeaderboardService, GlobalLeaderboardEntry } from "@/utils/globalLeaderboardService";
import Link from "next/link";

type TimePeriod = "all_time" | "this_month" | "this_week";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<GlobalLeaderboardEntry[]>([]);
  const [trendingTeams, setTrendingTeams] = useState<GlobalLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("all_time");
  const [stats, setStats] = useState({
    total_teams: 0,
    total_submissions: 0,
    total_participants: 0,
    average_score: 0,
    total_challenges: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [leaderboardRes, statsRes, trendingRes] = await Promise.all([
          GlobalLeaderboardService.getGlobalLeaderboard(1, 20),
          GlobalLeaderboardService.getGlobalStats(),
          GlobalLeaderboardService.getTrendingTeams(5),
        ]);

        setEntries(leaderboardRes.entries);
        setStats(statsRes);
        setTrendingTeams(trendingRes);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [timePeriod]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Global Leaderboard
          </h1>
          <p className="text-lg text-gray-600">
            See where your team ranks among all participants
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">Total Teams</div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.total_teams}
            </div>
            <div className="text-xs text-gray-500 mt-2">Actively competing</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">
              Total Submissions
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.total_submissions.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-2">Across all challenges</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">
              Participants
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.total_participants}
            </div>
            <div className="text-xs text-gray-500 mt-2">Individual members</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">Avg Score</div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.average_score.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-2">Across all teams</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">
              Active Challenges
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.total_challenges}
            </div>
            <div className="text-xs text-gray-500 mt-2">Total available</div>
          </div>
        </div>

        {/* Trending Teams */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🔥 Trending Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingTeams.map((team, idx) => (
              <div key={team.team_name} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-600 font-medium mb-1">
                      #{team.rank}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {idx === 0 ? "🏆" : ""} {team.team_name}
                    </h3>
                  </div>
                  <div className="flex gap-1">
                    {team.badges.map((badge, i) => (
                      <span key={i} className="text-2xl">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Score</span>
                    <span className="font-bold text-gray-900">
                      {team.total_score.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submissions</span>
                    <span className="font-semibold text-gray-900">
                      {team.submissions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Active</span>
                    <span className="text-sm text-gray-700">
                      {team.last_submission}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        👥 {team.team_member_count} members
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {team.challenges_completed} challenges
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Period Filter */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Teams</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setTimePeriod("this_week")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timePeriod === "this_week"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimePeriod("this_month")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timePeriod === "this_month"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimePeriod("all_time")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timePeriod === "all_time"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="inline-block">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <p className="text-gray-600 font-medium">Loading leaderboard...</p>
            </div>
          </div>
        ) : (
          /* Main Leaderboard Table */
          <GlobalLeaderboardTable entries={entries} />
        )}

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">💡 How Scores Work</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✓ Each challenge has multiple evaluation metrics</li>
              <li>✓ Your best submission is ranked on the leaderboard</li>
              <li>✓ Scores are calculated in real-time</li>
              <li>✓ Ties are ranked by submission time (earliest wins)</li>
              <li>✓ Only the latest submission counts towards your final rank</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">🏅 Team Ranking Rules</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✓ Teams are ranked by highest average score</li>
              <li>✓ Minimum 1 submission to appear on leaderboard</li>
              <li>✓ Score is weighted by challenge difficulty</li>
              <li>✓ Bonus points for completing challenges</li>
              <li>✓ Teams earn badges for exceptional performance</li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Join the Competition?</h3>
          <p className="text-lg mb-6 text-blue-100">
            Form a team and start competing in challenges to climb the leaderboard
          </p>
          <Link
            href="/challenges"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Explore Challenges →
          </Link>
        </div>
      </div>
    </div>
  );
}
