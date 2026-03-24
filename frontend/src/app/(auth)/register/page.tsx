import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Register - Open Challenges",
  description: "Create your Open Challenges account",
};

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join as an individual or create a team</p>
        </div>

        {/* Register Form */}
        <RegisterForm />

        {/* Already have account link */}
        <div className="mt-6 text-center text-gray-600">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-semibold hover:text-blue-700">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
