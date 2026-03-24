"use client";

import Link from "next/link";
import Image from "next/image";
import { Challenge } from "@/types";
import {
  formatDate,
  getDaysRemaining,
  getDifficultyColor,
  getStatusColor,
  formatNumber,
} from "@/utils/formatters";

interface ChallengeCardProps {
  challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const daysRemaining = getDaysRemaining(challenge.end_date);
  const isEnded = daysRemaining < 0;

  return (
    <Link href={`/challenges/${challenge.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Challenge Image */}
        <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
          {challenge.image_url ? (
            <Image
              src={challenge.image_url}
              alt={challenge.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                challenge.status
              )}`}
            >
              {challenge.status}
            </span>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                challenge.difficulty_level
              )}`}
            >
              {challenge.difficulty_level}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-grow flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {challenge.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {challenge.description}
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="bg-blue-50 rounded p-2">
              <div className="text-gray-600 text-xs">Participants</div>
              <div className="font-bold text-gray-900">{formatNumber(challenge.participant_count)}</div>
            </div>
            <div className="bg-green-50 rounded p-2">
              <div className="text-gray-600 text-xs">Submissions</div>
              <div className="font-bold text-gray-900">{formatNumber(challenge.submission_count)}</div>
            </div>
          </div>

          {/* Prize and Dates */}
          {challenge.prize_pool && (
            <div className="mb-3 text-sm">
              <span className="font-semibold text-gray-900">Prize:</span>
              <span className="text-gray-600 ml-2">${formatNumber(challenge.prize_pool)}</span>
            </div>
          )}

          {/* Timeline */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            {isEnded ? (
              <div className="text-xs text-gray-500">
                <span className="font-semibold text-red-600">Challenge Ended</span>
                <br />
                {formatDate(challenge.end_date)}
              </div>
            ) : (
              <div className="text-xs text-gray-600">
                <span className="font-semibold text-blue-600">
                  {Math.max(daysRemaining, 0)} days remaining
                </span>
                <br />
                Ends: {formatDate(challenge.end_date)}
              </div>
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              // Will navigate via Link
            }}
            className={`mt-4 w-full py-2 rounded-lg font-semibold transition-colors text-sm ${
              isEnded
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : challenge.status === "ACTIVE"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-600 cursor-not-allowed"
            }`}
            disabled={isEnded || challenge.status !== "ACTIVE"}
          >
            {challenge.status === "ACTIVE" ? "View Details" : "Learn More"}
          </button>
        </div>
      </div>
    </Link>
  );
}
