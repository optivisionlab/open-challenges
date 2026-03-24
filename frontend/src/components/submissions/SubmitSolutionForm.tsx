"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { SubmissionService } from "@/utils/submissionService";

interface SubmitSolutionFormProps {
  challengeId: string;
  challengeTitle: string;
}

type SubmissionType = "CODE" | "FILE" | "LINK";

export default function SubmitSolutionForm({
  challengeId,
  challengeTitle,
}: SubmitSolutionFormProps) {
  const router = useRouter();
  const [submissionType, setSubmissionType] = useState<SubmissionType>("CODE");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [file, setFile] = useState<File | null>(null);
  const [githubLink, setGithubLink] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const languages = [
    "python",
    "javascript",
    "java",
    "cpp",
    "csharp",
    "go",
    "rust",
    "r",
  ];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrors([]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);

    // Validate
    const validation = SubmissionService.validateSubmission({
      submission_type: submissionType,
      code: submissionType === "CODE" ? code : undefined,
      file: submissionType === "FILE" ? file || undefined : undefined,
      github_link: submissionType === "LINK" ? githubLink : undefined,
      description,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      const submission = await SubmissionService.submitSolution(challengeId, {
        submission_type: submissionType,
        code: submissionType === "CODE" ? code : undefined,
        file: submissionType === "FILE" ? file || undefined : undefined,
        github_link: submissionType === "LINK" ? githubLink : undefined,
        language: submissionType === "CODE" ? language : undefined,
        description,
      });

      setSuccessMessage(
        `Solution submitted successfully! Submission ID: ${submission.id.slice(0, 8)}...`
      );
      setSuccess(true);

      // Reset form
      setCode("");
      setFile(null);
      setGithubLink("");
      setDescription("");

      // Redirect to submissions history after 2 seconds
      setTimeout(() => {
        router.push(`/challenges/${challengeId}/submissions`);
      }, 2000);
    } catch (error) {
      setErrors([
        error instanceof Error ? error.message : "Failed to submit solution",
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Submit Your Solution
        </h2>
        <p className="text-gray-600">
          Submit your solution for <span className="font-semibold">{challengeTitle}</span>
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">✓ {successMessage}</p>
          <p className="text-green-700 text-sm mt-1">
            Redirecting to submission history...
          </p>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium mb-2">Please fix the following errors:</p>
          <ul className="space-y-1">
            {errors.map((error, idx) => (
              <li key={idx} className="text-red-700 text-sm">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Submission Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            How do you want to submit?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["CODE", "FILE", "LINK"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setSubmissionType(type);
                  setErrors([]);
                }}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  submissionType === type
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="font-semibold text-gray-900">
                  {type === "CODE"
                    ? "💻 Write Code"
                    : type === "FILE"
                      ? "📁 Upload File"
                      : "🔗 GitHub Link"}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {type === "CODE"
                    ? "Paste or type your code"
                    : type === "FILE"
                      ? "Upload solution file"
                      : "Link to repository"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Code Submission */}
        {submissionType === "CODE" && (
          <div className="space-y-4">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Programming Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Code Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Your Code
              </label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here... (Max 100KB)"
                className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                {code.length} / 100,000 characters
              </p>
            </div>
          </div>
        )}

        {/* File Upload */}
        {submissionType === "FILE" && (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Upload File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".zip,.tar,.gz,.py,.java,.js,.cpp,.cs,.go,.rs,.r,.ipynb,.csv,.xlsx,.json"
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <div className="text-4xl mb-2">📤</div>
                <p className="text-gray-900 font-medium">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  ZIP, TAR, code files, notebooks, or data files (Max 50MB)
                </p>
              </label>
            </div>
            {file && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: <span className="font-medium">{file.name}</span> (
                {(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        )}

        {/* GitHub Link */}
        {submissionType === "LINK" && (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              GitHub Repository URL
            </label>
            <input
              type="url"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-2">
              Make sure the repository is public or accessible
            </p>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Solution Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain your approach, key insights, or any notes about your solution..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            {description.length} / 5,000 characters
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Submitting...
              </span>
            ) : (
              "Submit Solution"
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setCode("");
              setFile(null);
              setGithubLink("");
              setDescription("");
              setErrors([]);
            }}
            className="px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Tips Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">💡 Submission Tips</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Ensure your code is properly formatted and commented</li>
          <li>• Test your solution locally before submitting</li>
          <li>• If uploading files, please use ZIP format for multiple files</li>
          <li>• If submitting a GitHub link, make sure the repo is public</li>
          <li>• You can submit multiple times - only your latest submission counts</li>
          <li>• Submissions are processed automatically - results appear in the leaderboard</li>
        </ul>
      </div>
    </div>
  );
}
