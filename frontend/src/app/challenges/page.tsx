import ChallengeList from "@/components/challenges/ChallengeList";
import { ChallengeService } from "@/utils/challenges";

export const metadata = {
  title: "All Challenges - Open Challenges",
  description: "Browse all AI and ML challenges on the Open Challenges platform",
};

export default async function ChallengesPage() {
  // Fetch all challenges
  const result = await ChallengeService.getChallenges();
  const challenges = result.items;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            All Challenges
          </h1>
          <p className="text-lg text-gray-600">
            Explore and participate in machine learning competitions
          </p>
        </div>
      </div>

      {/* Challenge List with Filters */}
      <ChallengeList initialChallenges={challenges} showFilters={true} />
    </div>
  );
}
