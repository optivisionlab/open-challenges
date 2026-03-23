"use client";

import { useState, useEffect } from "react";
import ChallengeCard from "./ChallengeCard";
import { Challenge, ChallengeDifficulty, ChallengeStatus } from "@/types";
import { ChallengeService } from "@/utils/challenges";

interface ChallengeListProps {
  initialChallenges?: Challenge[];
  showFilters?: boolean;
}

export default function ChallengeList({
  initialChallenges = [],
  showFilters = true,
}: ChallengeListProps) {
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>(initialChallenges);
  const [isLoading, setIsLoading] = useState(!initialChallenges.length);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);

  // Filters
  const [statusFilter, setStatusFilter] = useState<ChallengeStatus | "ALL">("ALL");
  const [difficultyFilter, setDifficultyFilter] = useState<ChallengeDifficulty | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch challenges on mount
  useEffect(() => {
    if (!initialChallenges.length) {
      loadChallenges();
    }
  }, [initialChallenges]);

  // Apply filters
  useEffect(() => {
    let filtered = challenges;

    // Apply status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Apply difficulty filter
    if (difficultyFilter !== "ALL") {
      filtered = filtered.filter((c) => c.difficulty_level === difficultyFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredChallenges(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [challenges, statusFilter, difficultyFilter, searchTerm]);

  const loadChallenges = async () => {
    try {
      setIsLoading(true);
      const result = await ChallengeService.getChallenges();
      setChallenges(result.items);
    } catch (error) {
      console.error("Failed to load challenges:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredChallenges.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedChallenges = filteredChallenges.slice(startIndex, endIndex);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Filters Header */}
      {showFilters && (
        <div className="mb-8">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search challenges by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Badges */}
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-medium text-gray-600">Filters:</span>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ChallengeStatus | "ALL")}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as ChallengeDifficulty | "ALL")}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Difficulty</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>

            {/* Results count */}
            <div className="ml-auto text-sm text-gray-600">
              {filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading challenges...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredChallenges.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No challenges found</h3>
          <p className="mt-2 text-gray-600">
            Try adjusting your filters or check back later for new challenges.
          </p>
        </div>
      )}

      {/* Challenges Grid */}
      {!isLoading && filteredChallenges.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
