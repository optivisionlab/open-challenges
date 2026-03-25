
import CreateChallengeForm from "@/components/challenges/CreateChallengeForm";
import { ChallengeService } from "@/utils/challenges";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create Challenge - Open Challenges",
  description: "Create a new AI/ML challenge",
};

export default function CreateChallengePage() {
  const handleSubmit = async (formData: any) => {
    "use server";

    try {
      const challenge = await ChallengeService.createChallenge(formData);
      redirect(`/challenges/${challenge.id}`);
    } catch (error) {
      throw new Error("Failed to create challenge");
    }
  };

  return (
    <CreateChallengeForm
      onSubmit={handleSubmit}
    />
  );
}
