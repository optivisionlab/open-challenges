import { notFound } from "next/navigation";
import SubmitSolutionForm from "@/components/submissions/SubmitSolutionForm";
import { ChallengeService } from "@/utils/challenges";
import Link from "next/link";

interface SubmitPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: SubmitPageProps) {
  const challenge = await ChallengeService.getChallengeById(params.id);

  if (!challenge) {
    return {
      title: "Challenge Not Found - Open Challenges",
    };
  }

  return {
    title: `Submit Solution - ${challenge.title} - Open Challenges`,
    description: `Submit your solution for ${challenge.title}`,
  };
}

export default async function SubmitPage({ params }: SubmitPageProps) {
  const challenge = await ChallengeService.getChallengeById(params.id);

  if (!challenge) {
    notFound();
  }

  const isActive = challenge.status === "ACTIVE";

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
            <span className="text-gray-900 font-medium">Submit Solution</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Challenge Status Info */}
        {!isActive && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium">
              ⚠️ This challenge is {challenge.status.toLowerCase()}
            </p>
            <p className="text-yellow-700 text-sm mt-1">
              {challenge.status === "CLOSED"
                ? "This challenge has ended. You can still submit, but it will not be ranked."
                : "This challenge is not yet active. Please check back later."}
            </p>
          </div>
        )}

        {/* Submit Form */}
        <SubmitSolutionForm
          challengeId={challenge.id}
          challengeTitle={challenge.title}
        />

        {/* Challenge Info Card */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            About This Challenge
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Difficulty Level</p>
              <p className="font-semibold text-gray-900">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    challenge.difficulty_level === "EASY"
                      ? "bg-green-100 text-green-800"
                      : challenge.difficulty_level === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {challenge.difficulty_level}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="font-semibold text-gray-900">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    challenge.status === "ACTIVE"
                      ? "bg-blue-100 text-blue-800"
                      : challenge.status === "DRAFT"
                        ? "bg-gray-100 text-gray-800"
                        : challenge.status === "CLOSED"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {challenge.status}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Prize Pool</p>
              <p className="font-semibold text-gray-900">
                ${(challenge.prize_pool || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Participants</p>
              <p className="font-semibold text-gray-900">
                {challenge.participant_count.toLocaleString()} participants
              </p>
            </div>
          </div>
        </div>

        {/* Back to Challenge Link */}
        <div className="mt-6 flex justify-center">
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
