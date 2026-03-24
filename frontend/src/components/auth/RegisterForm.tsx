"use client";

import { useState, FormEvent } from "react";
import { AuthService } from "@/utils/authService";
import type { RegistrationType } from "@/types";

export default function RegisterForm() {
  const [registrationType, setRegistrationType] = useState<RegistrationType>("INDIVIDUAL");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Individual fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Team fields
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");

  const handleIndividualSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validation
      if (!firstName || !lastName || !username || !email || !password || !passwordConfirm) {
        throw new Error("Please fill in all fields");
      }

      if (!AuthService.validateEmail(email)) {
        throw new Error("Please enter a valid email");
      }

      const { valid, errors } = AuthService.validatePassword(password);
      if (!valid) {
        throw new Error(errors[0]);
      }

      // Register
      await AuthService.registerIndividual({
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        password,
        password_confirm: passwordConfirm,
      });

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validation
      if (!firstName || !lastName || !username || !email || !password || !passwordConfirm || !teamName) {
        throw new Error("Please fill in all fields");
      }

      if (!AuthService.validateEmail(email)) {
        throw new Error("Please enter a valid email");
      }

      const { valid, errors } = AuthService.validatePassword(password);
      if (!valid) {
        throw new Error(errors[0]);
      }

      // Register with team
      await AuthService.registerWithTeam({
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        password,
        password_confirm: passwordConfirm,
        team_name: teamName,
        team_description: teamDescription,
      });

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Team creation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = registrationType === "INDIVIDUAL" ? handleIndividualSubmit : handleTeamSubmit;

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-8 bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setRegistrationType("INDIVIDUAL")}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
            registrationType === "INDIVIDUAL"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Individual
        </button>
        <button
          type="button"
          onClick={() => setRegistrationType("TEAM")}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
            registrationType === "TEAM"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Team
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600">✓ Registration successful! Redirecting...</p>
          </div>
        )}

        {/* Name Fields Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John"
              disabled={isLoading || success}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Doe"
              disabled={isLoading || success}
            />
          </div>
        </div>

        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="johndoe"
            disabled={isLoading || success}
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john@example.com"
            disabled={isLoading || success}
          />
        </div>

        {/* Team Fields (shown when TEAM is selected) */}
        {registrationType === "TEAM" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="AI Legends"
                disabled={isLoading || success}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Team Description (Optional)
              </label>
              <textarea
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe your team..."
                disabled={isLoading || success}
              />
            </div>
          </>
        )}

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              disabled={isLoading || success}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Must be 8+ chars, include uppercase & number
          </p>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Confirm Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            disabled={isLoading || success}
          />
        </div>

        {/* Terms & Conditions */}
        <label className="flex items-start gap-2 text-xs text-gray-600 mb-4">
          <input type="checkbox" className="mt-1" defaultChecked disabled={isLoading || success} />
          <span>
            I agree to the{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || success}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
            isLoading || success
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
          }`}
        >
          {isLoading
            ? "Creating account..."
            : success
            ? "✓ Success!"
            : `Register as ${registrationType === "INDIVIDUAL" ? "Individual" : "Team"}`}
        </button>
      </form>
    </div>
  );
}
