import { notFound } from "next/navigation";
import ChallengeDetail from "@/components/challenges/ChallengeDetail";
import { ChallengeService } from "@/utils/challenges";
import { LeaderboardService } from "@/utils/leaderboard";

interface ChallengePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ChallengePageProps) {
  const challenge = await ChallengeService.getChallengeById(params.id);

  if (!challenge) {
    return {
      title: "Challenge Not Found - Open Challenges",
    };
  }

  return {
    title: `${challenge.title} - Open Challenges`,
    description: challenge.description,
  };
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const challenge = await ChallengeService.getChallengeById(params.id);

  if (!challenge) {
    notFound();
  }

  // Get related challenges (same difficulty or similar)
  const allChallenges = await ChallengeService.getChallenges();
  const relatedChallenges = allChallenges.items
    .filter(
      (c) =>
        c.id !== challenge.id &&
        c.difficulty_level === challenge.difficulty_level &&
        c.status !== "ARCHIVED"
    )
    .slice(0, 3);

  // Get leaderboard data
  const leaderboardData = await LeaderboardService.getLeaderboard(params.id);

  return (
    <ChallengeDetail
      challenge={challenge}
      relatedChallenges={relatedChallenges}
      leaderboardEntries={leaderboardData.entries}
    />
  );
}
