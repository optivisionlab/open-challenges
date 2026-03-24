"use client";

import Image from "next/image";
import Link from "next/link";
import { Challenge, LeaderboardEntry } from "@/types";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import {
  formatDate,
  getDaysRemaining,
  getDifficultyColor,
  getStatusColor,
  formatCurrency,
} from "@/utils/formatters";

interface ChallengeDetailProps {
  challenge: Challenge;
  relatedChallenges?: Challenge[];
  leaderboardEntries?: LeaderboardEntry[];
}

export default function ChallengeDetail({
  challenge,
  relatedChallenges = [],
  leaderboardEntries = [],
}: ChallengeDetailProps) {
  const daysRemaining = getDaysRemaining(challenge.end_date);
  const isEnded = daysRemaining < 0;
  const isActive = challenge.status === "ACTIVE";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb & Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/challenges" className="hover:text-blue-600">
              Challenges
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{challenge.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section with Image */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image */}
            <div className="lg:col-span-2">
              <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
                {challenge.image_url ? (
                  <Image
                    src={challenge.image_url}
                    alt={challenge.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                    <svg
                      className="w-24 h-24 text-white opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Challenge Info
                </h3>

                {/* Badges */}
                <div className="mb-6 flex flex-wrap gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(challenge.status)}`}
                  >
                    {challenge.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(challenge.difficulty_level)}`}
                  >
                    {challenge.difficulty_level}
                  </span>
                </div>

                {/* Info Items */}
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-sm text-gray-600">Prize Pool</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {challenge.prize_pool
                        ? formatCurrency(challenge.prize_pool)
                        : "N/A"}
                    </p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-base font-semibold text-gray-900">
                      {isEnded ? "Ended" : isActive ? "Active" : "Coming Soon"}
                    </p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-sm text-gray-600">Participants</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {challenge.participant_count}
                    </p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-sm text-gray-600">Submissions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {challenge.submission_count}
                    </p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-sm text-gray-600">Difficulty</p>
                    <p className="text-base font-semibold text-gray-900">
                      {challenge.difficulty_level}
                    </p>
                  </div>

                  <div className="pb-4">
                    <p className="text-sm text-gray-600">Time Remaining</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isEnded ? (
                        <span className="text-red-600">Ended</span>
                      ) : (
                        `${daysRemaining} days`
                      )}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    disabled={!isActive}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Join Challenge
                  </button>
                  <Link
                    href={`/challenges/${challenge.id}/submit`}
                    className={`block w-full py-2 px-4 rounded-lg font-semibold transition-colors text-center ${
                      isActive
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
                    }`}
                  >
                    Submit Solution
                  </Link>
                  <button className="w-full py-2 px-4 rounded-lg font-semibold bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors">
                    Download Dataset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Title & Description */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {challenge.title}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{challenge.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Problem Statement */}
            <section className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Problem Statement
              </h2>
              <div className="max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
                {challenge.problem_statement}
              </div>
            </section>

            {/* Timeline Section */}
            <section className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Timeline</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="border-l-4 border-blue-600 pl-4">
                  <p className="text-sm text-gray-600 mb-1">Start Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(challenge.start_date)}
                  </p>
                </div>
                <div className="border-l-4 border-red-600 pl-4">
                  <p className="text-sm text-gray-600 mb-1">End Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(challenge.end_date)}
                  </p>
                </div>
              </div>

              {/* Countdown */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600">Time Remaining</p>
                {isEnded ? (
                  <p className="text-3xl font-bold text-red-600">
                    Challenge Ended
                  </p>
                ) : (
                  <p className="text-3xl font-bold text-blue-600">
                    {daysRemaining} days
                  </p>
                )}
              </div>
            </section>

            {/* Resources Section */}
            <section className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resources</h2>
              <div className="space-y-3">
                {challenge.dataset_url && (
                  <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 21l-8-8m8 8l8-8m-8 8V3"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Dataset</p>
                      <p className="text-sm text-gray-600">
                        Download the challenge dataset
                      </p>
                    </div>
                    <a
                      href={challenge.dataset_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Download
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Documentation</p>
                    <p className="text-sm text-gray-600">
                      Read challenge guidelines and rules
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Challenge Stats Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Participants</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {challenge.participant_count}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <span className="text-gray-600">Submissions</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {challenge.submission_count}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <span className="text-gray-600">Submission Rate</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {challenge.participant_count > 0
                      ? (
                          (challenge.submission_count /
                            challenge.participant_count) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Challenge Created Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Challenge Info
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(challenge.created_at)}
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-gray-600">Last Updated</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(challenge.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      {leaderboardEntries.length > 0 && (
        <div className="bg-white border-t border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Leaderboard
            </h2>
            <LeaderboardTable entries={leaderboardEntries} />
          </div>
        </div>
      )}

      {/* Related Challenges */}
      {relatedChallenges.length > 0 && (
        <div className="bg-white border-t border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Related Challenges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedChallenges.map((relChallenge) => (
                <Link
                  key={relChallenge.id}
                  href={`/challenges/${relChallenge.id}`}
                >
                  <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="flex gap-2 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(relChallenge.status)}`}
                      >
                        {relChallenge.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(relChallenge.difficulty_level)}`}
                      >
                        {relChallenge.difficulty_level}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      {relChallenge.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {relChallenge.description}
                    </p>
                    <p className="text-sm font-semibold text-blue-600">
                      View Details →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
