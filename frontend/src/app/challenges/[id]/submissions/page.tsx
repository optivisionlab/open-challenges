import { notFound } from "next/navigation";
import Link from "next/link";
import { ChallengeService } from "@/utils/challenges";
import { SubmissionService } from "@/utils/submissionService";
import { formatDate } from "@/utils/formatters";

interface SubmissionsPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: SubmissionsPageProps) {
  const challenge = await ChallengeService.getChallengeById(params.id);

  if (!challenge) {
    return {
      title: "Challenge Not Found - Open Challenges",
    };
  }

  return {
    title: `Submissions - ${challenge.title} - Open Challenges`,
    description: `View your submissions for ${challenge.title}`,
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

export default async function SubmissionsPage({ params }: SubmissionsPageProps) {
  const challenge = await ChallengeService.getChallengeById(params.id);

  if (!challenge) {
    notFound();
  }

  const submissions = await SubmissionService.getSubmissionsByChallenge(
    params.id,
    20
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/challenges" className="hover:text-blue-600">
              Challenges
            </Link>
            <span>/</span>
            <Link href={`/challenges/${challenge.id}`} className="hover:text-blue-600">
              {challenge.title}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Submissions</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Submissions
            </h1>
            <p className="text-gray-600">
              View all submissions for <span className="font-semibold">{challenge.title}</span>
            </p>
          </div>
          <Link
            href={`/challenges/${challenge.id}/submit`}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Submit New Solution
          </Link>
        </div>

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No submissions yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't submitted any solutions for this challenge yet.
            </p>
            <Link
              href={`/challenges/${challenge.id}/submit`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Your First Solution
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left Side - Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(
                            submission.status
                          )}`}
                        >
                          <span>{getStatusIcon(submission.status)}</span>
                          {submission.status}
                        </span>
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          {submission.submission_format}
                        </span>
                        {submission.is_latest && (
                          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                            Latest
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">ID:</span>{" "}
                          <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                            {submission.id.slice(0, 12)}...
                          </code>
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Submitted:</span>{" "}
                          {formatDate(submission.submitted_at)}
                        </p>
                        {submission.processed_at && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Processed:</span>{" "}
                            {formatDate(submission.processed_at)}
                          </p>
                        )}
                        {submission.error_message && (
                          <p className="text-sm text-red-600 mt-2">
                            <span className="font-medium">Error:</span>{" "}
                            {submission.error_message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex gap-2 md:flex-col">
                      <Link
                        href={`/challenges/${challenge.id}/submissions/${submission.id}`}
                        className="flex-1 px-4 py-2 text-center text-blue-600 font-semibold rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors text-sm"
                      >
                        View Details
                      </Link>
                      {submission.status === "SUCCESS" && (
                        <button
                          className="flex-1 px-4 py-2 text-center text-gray-600 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
                          onClick={() => {
                            // Copy to clipboard functionality
                            navigator.clipboard.writeText(submission.id);
                            alert("Submission ID copied!");
                          }}
                        >
                          Copy ID
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Challenge */}
        <div className="mt-8 flex justify-center">
          <Link
            href={`/challenges/${challenge.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Challenge Details
          </Link>
        </div>
      </div>
    </div>
  );
}
