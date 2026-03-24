import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login - Open Challenges",
  description: "Login to your Open Challenges account",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Don't have account link */}
        <div className="mt-6 text-center text-gray-600">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 font-semibold hover:text-blue-700">
              Register here
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
