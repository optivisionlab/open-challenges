"use client";

import { useState } from "react";
import { LeaderboardEntry } from "@/types";
import { formatDate } from "@/utils/formatters";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export default function LeaderboardTable({
  entries,
}: LeaderboardTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "submissions" | "date">(
    "score"
  );

  // Filter entries by search query
  const filteredEntries = entries.filter((entry) =>
    entry.team_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort entries
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    switch (sortBy) {
      case "submissions":
        return b.submission_count - a.submission_count;
      case "date":
        return (
          new Date(b.last_submission_at).getTime() -
          new Date(a.last_submission_at).getTime()
        );
      case "score":
      default:
        return b.overall_score - a.overall_score;
    }
  });

  // Get medal emoji for top 3
  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "";
    }
  };

  // Get row background color based on rank
  const getRowColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-50 hover:bg-yellow-100";
      case 2:
        return "bg-gray-100 hover:bg-gray-150";
      case 3:
        return "bg-orange-50 hover:bg-orange-100";
      default:
        return "hover:bg-gray-50";
    }
  };

  return (
    <div className="w-full">
      {/* Header with Search and Sort */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search team name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "score" | "submissions" | "date")
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="score">Sort by Score</option>
          <option value="submissions">Sort by Submissions</option>
          <option value="date">Sort by Latest</option>
        </select>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">
                Rank
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">
                Team
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900">
                Members
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900">
                Overall Score
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900">
                Primary Metric
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900">
                Submissions
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">
                Last Submission
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No teams found
                </td>
              </tr>
            ) : (
              sortedEntries.map((entry) => (
                <tr
                  key={entry.team_id}
                  className={`border-b border-gray-200 transition-colors ${getRowColor(entry.rank)}`}
                >
                  {/* Rank */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {entry.rank}
                      </span>
                      {getMedalEmoji(entry.rank) && (
                        <span className="text-xl">
                          {getMedalEmoji(entry.rank)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Team Name */}
                  <td className="px-4 py-4">
                    <span className="font-semibold text-gray-900">
                      {entry.team_name}
                    </span>
                  </td>

                  {/* Members Count */}
                  <td className="px-4 py-4 text-center">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {entry.team_member_count || 1}
                    </span>
                  </td>

                  {/* Overall Score */}
                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-bold text-gray-900">
                        {entry.overall_score.toFixed(2)}
                      </span>
                      {entry.rank === 1 && (
                        <span className="text-xs text-green-600 font-medium">
                          Leading
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Primary Metric Score */}
                  <td className="px-4 py-4 text-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium">
                      {entry.primary_metric_score.toFixed(2)}
                    </span>
                  </td>

                  {/* Submissions Count */}
                  <td className="px-4 py-4 text-center">
                    <span className="font-semibold text-gray-700">
                      {entry.submission_count}
                    </span>
                  </td>

                  {/* Last Submission */}
                  <td className="px-4 py-4">
                    <span className="text-gray-600 text-xs">
                      {formatDate(entry.last_submission_at)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Leaderboard Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Teams</p>
          <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Avg Score</p>
          <p className="text-2xl font-bold text-gray-900">
            {(
              entries.reduce((sum, e) => sum + e.overall_score, 0) /
              entries.length
            ).toFixed(2)}
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Submissions</p>
          <p className="text-2xl font-bold text-gray-900">
            {entries.reduce((sum, e) => sum + e.submission_count, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
