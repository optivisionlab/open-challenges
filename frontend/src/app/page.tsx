import Link from "next/link";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import { ChallengeService } from "@/utils/challenges";

export const metadata = {
  title: "Open Challenges - AI/ML Competition Platform",
  description: "Join AI competitions, submit solutions, and compete on leaderboards",
};

export default async function HomePage() {
  // Fetch featured challenges (active challenges)
  const activeChallenges = await ChallengeService.getActiveChallenges();
  const featuredChallenges = activeChallenges.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Compete in AI & ML Challenges
              </h1>
              <p className="text-lg text-blue-100 mb-8">
                Join a global community of data scientists and machine learning engineers.
                Participate in cutting-edge competitions, showcase your skills, and win prizes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/challenges"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors text-center"
                >
                  Explore Challenges
                </Link>
                <Link
                  href="/auth/register"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Right side - Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-500 bg-opacity-50 backdrop-blur p-6 rounded-lg">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-blue-100">Active Challenges</div>
              </div>
              <div className="bg-blue-500 bg-opacity-50 backdrop-blur p-6 rounded-lg">
                <div className="text-4xl font-bold mb-2">5K+</div>
                <div className="text-blue-100">Participants</div>
              </div>
              <div className="bg-blue-500 bg-opacity-50 backdrop-blur p-6 rounded-lg">
                <div className="text-4xl font-bold mb-2">$500K+</div>
                <div className="text-blue-100">Total Prizes</div>
              </div>
              <div className="bg-blue-500 bg-opacity-50 backdrop-blur p-6 rounded-lg">
                <div className="text-4xl font-bold mb-2">100+</div>
                <div className="text-blue-100">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Challenges Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Challenges
          </h2>
          <p className="text-lg text-gray-600">
            Check out some of our most popular ongoing challenges right now.
          </p>
        </div>

        {/* Featured Cards */}
        {featuredChallenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No active challenges at the moment. Check back soon!</p>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/challenges"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            View All Challenges →
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mb-4 text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Browse Challenges</h3>
              <p className="text-gray-600 text-sm">
                Explore our curated list of AI/ML challenges and find one that interests you.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mb-4 text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Join a Team</h3>
              <p className="text-gray-600 text-sm">
                Create or join a team with other participants to collaborate and compete together.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mb-4 text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Build & Submit</h3>
              <p className="text-gray-600 text-sm">
                Develop your solution and submit your predictions. Get instant feedback on your score.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mb-4 text-lg">
                4
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Compete & Win</h3>
              <p className="text-gray-600 text-sm">
                Climb the leaderboard and compete with participants worldwide. Win prizes!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
          Why Choose Open Challenges?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div>
            <div className="bg-blue-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Real-time Leaderboards</h3>
            <p className="text-gray-600">
              See live rankings as teams submit their solutions. Compete in real-time with global participants.
            </p>
          </div>

          {/* Feature 2 */}
          <div>
            <div className="bg-green-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Flexible Metrics</h3>
            <p className="text-gray-600">
              Challenges can use standard metrics or custom scoring functions. Get evaluated fairly with transparent scoring.
            </p>
          </div>

          {/* Feature 3 */}
          <div>
            <div className="bg-purple-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Prize Pools</h3>
            <p className="text-gray-600">
              Compete for substantial prizes and recognition. Top performers are rewarded for their achievements.
            </p>
          </div>

          {/* Feature 4 */}
          <div>
            <div className="bg-orange-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Easy Configuration</h3>
            <p className="text-gray-600">
              Simple dashboard to configure metrics, set rules, and manage your challenges without coding.
            </p>
          </div>

          {/* Feature 5 */}
          <div>
            <div className="bg-red-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Global Community</h3>
            <p className="text-gray-600">
              Connect with thousands of data scientists and ML engineers from around the world.
            </p>
          </div>

          {/* Feature 6 */}
          <div>
            <div className="bg-indigo-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Trusted Platform</h3>
            <p className="text-gray-600">
              Built with security and transparency in mind. Fair evaluations and verified results.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of talented data scientists and machine learning engineers in solving real-world problems.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/challenges"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Browse Challenges
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
