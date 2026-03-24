"use client";

import { useState, useMemo } from "react";
import { GlobalLeaderboardEntry } from "@/utils/globalLeaderboardService";

interface GlobalLeaderboardTableProps {
  entries: GlobalLeaderboardEntry[];
  onSort?: (sortBy: "score" | "submissions" | "recent") => void;
}

type SortType = "score" | "submissions" | "recent";

export default function GlobalLeaderboardTable({
  entries,
  onSort,
}: GlobalLeaderboardTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("score");

  const filteredAndSorted = useMemo(() => {
    let filtered = entries.filter((entry) =>
      entry.team_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.total_score - a.total_score;
        case "submissions":
          return b.submissions - a.submissions;
        case "recent":
          return new Date(b.recent_submission).getTime() -
            new Date(a.recent_submission).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [entries, searchQuery, sortBy]);

  const handleSort = (newSort: SortType) => {
    setSortBy(newSort);
    onSort?.(newSort);
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "";
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Search Bar */}
      <div className="p-6 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search teams by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Sort Buttons */}
      <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap gap-2">
        <button
          onClick={() => handleSort("score")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            sortBy === "score"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          By Score
        </button>
        <button
          onClick={() => handleSort("submissions")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            sortBy === "submissions"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          By Submissions
        </button>
        <button
          onClick={() => handleSort("recent")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            sortBy === "recent"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Most Recent
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Team
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                Members
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                Total Score
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                Submissions
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                Challenges
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                Last Activity
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No teams found matching your search
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((entry) => (
                <tr
                  key={entry.team_name}
                  className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                    entry.rank <= 3 ? "bg-yellow-50" : ""
                  }`}
                >
                  {/* Rank */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getMedalEmoji(entry.rank)}</span>
                      <span className="font-bold text-gray-900">{entry.rank}</span>
                    </div>
                  </td>

                  {/* Team Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-semibold text-gray-900">{entry.team_name}</p>
                      <div className="flex gap-1 mt-1">
                        {entry.badges.map((badge, i) => (
                          <span key={i} className="text-lg">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Members */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      👥 {entry.team_member_count}
                    </span>
                  </td>

                  {/* Total Score */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="font-bold text-gray-900 text-lg">
                      {entry.total_score.toLocaleString()}
                    </span>
                  </td>

                  {/* Submissions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-gray-700 font-medium">
                      {entry.submissions}
                    </span>
                  </td>

                  {/* Challenges Completed */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {entry.challenges_completed}
                    </span>
                  </td>

                  {/* Last Activity */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                    {entry.last_submission}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredAndSorted.length}</span> of{" "}
          <span className="font-semibold">{entries.length}</span> teams
        </p>
      </div>
    </div>
  );
}
