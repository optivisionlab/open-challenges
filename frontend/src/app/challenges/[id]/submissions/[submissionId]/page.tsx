import { notFound } from "next/navigation";
import Link from "next/link";
import { ChallengeService } from "@/utils/challenges";
import { SubmissionService } from "@/utils/submissionService";
import { formatDate } from "@/utils/formatters";

interface SubmissionDetailPageProps {
  params: {
    id: string;
    submissionId: string;
  };
}

export async function generateMetadata({ params }: SubmissionDetailPageProps) {
  const challenge = await ChallengeService.getChallengeById(params.id);

  if (!challenge) {
    return {
      title: "Challenge Not Found - Open Challenges",
    };
  }

  return {
    title: `Submission Details - ${challenge.title} - Open Challenges`,
    description: `View submission details for ${challenge.title}`,
  };
}

function getStatusColor(status: string): string {
  switch (status) {
    case "SUCCESS":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-blue-100 text-blue-800";
    case "PROCESSING":
      return "bg-yellow-100 text-yellow-800";
    case "FAILED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusIcon(status: string): string {
  switch (status) {
    case "SUCCESS":
      return "✓";
    case "PENDING":
      return "⏳";
    case "PROCESSING":
      return "⚙️";
    case "FAILED":
      return "✕";
    default:
      return "•";
  }
}

export default async function SubmissionDetailPage({
  params,
}: SubmissionDetailPageProps) {
  const challenge = await ChallengeService.getChallengeById(params.id);

  if (!challenge) {
    notFound();
  }

  const submission = await SubmissionService.getSubmission(params.submissionId);

  if (!submission) {
    notFound();
  }

  const scores = await SubmissionService.getSubmissionScores(params.submissionId);
  const calculateFinalScore = (scores: any[]) => {
    const totalWeight = scores.reduce((sum, s) => sum + s.metric.weight, 0);
    const weightedSum = scores.reduce(
      (sum, s) => sum + s.score_value * s.metric.weight,
      0
    );
    return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(4) : "0";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 overflow-x-auto">
            <Link href="/challenges" className="hover:text-blue-600 whitespace-nowrap">
              Challenges
            </Link>
            <span>/</span>
            <Link
              href={`/challenges/${challenge.id}`}
              className="hover:text-blue-600 whitespace-nowrap"
            >
              {challenge.title}
            </Link>
            <span>/</span>
            <Link
              href={`/challenges/${challenge.id}/submissions`}
              className="hover:text-blue-600 whitespace-nowrap"
            >
              Submissions
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium whitespace-nowrap">
              {submission.id.slice(0, 8)}...
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Submission Details
          </h1>
          <p className="text-gray-600">
            Challenge: <span className="font-semibold">{challenge.title}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Status</h2>
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`px-4 py-2 rounded-full text-lg font-semibold flex items-center gap-2 ${getStatusColor(
                    submission.status
                  )}`}
                >
                  <span className="text-2xl">{getStatusIcon(submission.status)}</span>
                  {submission.status}
                </span>
              </div>

              {submission.status === "PROCESSING" && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    ⏳ Your submission is being evaluated. This may take a few moments...
                  </p>
                </div>
              )}

              {submission.status === "FAILED" && submission.error_message && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm font-medium mb-2">Error Details:</p>
                  <p className="text-red-700 text-sm">{submission.error_message}</p>
                </div>
              )}

              {submission.status === "SUCCESS" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    ✓ Your submission has been evaluated successfully!
                  </p>
                </div>
              )}
            </div>

            {/* Submission Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Submission Info</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    Submission ID
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded font-mono text-sm">
                      {submission.id}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(submission.id);
                        alert("Copied!");
                      }}
                      className="px-3 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 transition-colors text-sm font-medium"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">
                      Format
                    </p>
                    <p className="font-semibold text-gray-900">
                      {submission.submission_format}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">
                      Submitted
                    </p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(submission.submitted_at)}
                    </p>
                  </div>
                </div>

                {submission.processed_at && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">
                        Processed
                      </p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(submission.processed_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">
                        Processing Time
                      </p>
                      <p className="font-semibold text-gray-900">
                        ~{" "}
                        {Math.round(
                          (new Date(submission.processed_at).getTime() -
                            new Date(submission.submitted_at).getTime()) /
                            1000
                        )}{" "}
                        seconds
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Scores Card */}
            {submission.status === "SUCCESS" && scores.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Evaluation Scores</h2>

                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    Final Score
                  </p>
                  <p className="text-4xl font-bold text-blue-600">
                    {calculateFinalScore(scores)}
                  </p>
                </div>

                <div className="space-y-3">
                  {scores.map((score) => (
                    <div
                      key={score.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900">
                          {score.metric.name}
                        </p>
                        <span className="text-2xl font-bold text-blue-600">
                          {score.score_value.toFixed(4)}
                        </span>
                      </div>
                      {score.metric.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {score.metric.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>
                          Range: {score.metric.min_value} -{" "}
                          {score.metric.max_value}
                        </span>
                        <span>
                          {score.metric.direction === "HIGHER_IS_BETTER"
                            ? "↑ Higher is better"
                            : "↓ Lower is better"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Challenge Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Challenge Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Difficulty</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      challenge.difficulty_level === "EASY"
                        ? "bg-green-100 text-green-800"
                        : challenge.difficulty_level === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {challenge.difficulty_level}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Prize Pool</p>
                  <p className="font-semibold text-gray-900">
                    ${(challenge.prize_pool || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Participants</p>
                  <p className="font-semibold text-gray-900">
                    {challenge.participant_count}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href={`/challenges/${challenge.id}/submissions`}
                className="block w-full text-center px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                ← Back to Submissions
              </Link>
              <Link
                href={`/challenges/${challenge.id}/submit`}
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Another Solution
              </Link>
              <Link
                href={`/challenges/${challenge.id}`}
                className="block w-full text-center px-4 py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                View Challenge
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
