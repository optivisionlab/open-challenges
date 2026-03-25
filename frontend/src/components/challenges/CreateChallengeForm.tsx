"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Challenge, ChallengeDifficulty, Metric } from "@/types";

// Step indicators
const FORM_STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Details" },
  { id: 3, label: "Timeline" },
  { id: 4, label: "Metrics" },
  { id: 5, label: "Resources" },
  { id: 6, label: "Review" },
];

interface CreateChallengeFormProps {
  initialData?: Partial<Challenge>;
  onSubmit: (data: Partial<Challenge>) => Promise<void>;
  isLoading?: boolean;
}

export default function CreateChallengeForm({
  initialData,
  onSubmit,
  isLoading = false,
}: CreateChallengeFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Challenge>>(
    initialData || {
      title: "",
      description: "",
      problem_statement: "",
      difficulty_level: "MEDIUM",
      prize_pool: 0,
      status: "DRAFT",
    }
  );
  const [metrics, setMetrics] = useState<Partial<Metric>[]>([]);
  const [error, setError] = useState<string>("");
  const [previewMode, setPreviewMode] = useState(false);

  // Update form data
  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setError("");
  };

  // Add metric
  const addMetric = () => {
    setMetrics((prev) => [
      ...prev,
      {
        name: "",
        description: "",
        metric_type: "SCORING_METRIC",
        weight: 1,
        is_primary: prev.length === 0,
        direction: "HIGHER_IS_BETTER",
        min_value: 0,
        max_value: 100,
      },
    ]);
  };

  // Update metric
  const updateMetric = (index: number, key: string, value: any) => {
    setMetrics((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  // Remove metric
  const removeMetric = (index: number) => {
    setMetrics((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.title?.trim()) {
          setError("Challenge title is required");
          return false;
        }
        if (!formData.description?.trim()) {
          setError("Description is required");
          return false;
        }
        return true;
      case 2:
        if (!formData.problem_statement?.trim()) {
          setError("Problem statement is required");
          return false;
        }
        if (!formData.difficulty_level) {
          setError("Difficulty level is required");
          return false;
        }
        return true;
      case 3:
        if (!formData.start_date) {
          setError("Start date is required");
          return false;
        }
        if (!formData.end_date) {
          setError("End date is required");
          return false;
        }
        if (new Date(formData.start_date) >= new Date(formData.end_date)) {
          setError("End date must be after start date");
          return false;
        }
        return true;
      case 4:
        if (metrics.length === 0) {
          setError("At least one metric is required");
          return false;
        }
        for (const metric of metrics) {
          if (!metric.name?.trim()) {
            setError("All metrics must have a name");
            return false;
          }
        }
        return true;
      default:
        return true;
    }
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, FORM_STEPS.length));
    }
  };

  // Handle previous step
  const handlePrev = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    try {
      setError("");
      const submitData = {
        ...formData,
        metrics,
      };
      await onSubmit(submitData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create challenge");
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Create Challenge</h1>
            <button
              onClick={togglePreview}
              className="text-sm px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {previewMode ? "Edit" : "Preview"}
            </button>
          </div>
          <p className="text-gray-600">
            Create a new AI/ML challenge for your community
          </p>
        </div>
      </div>

      {previewMode ? (
        // Preview Mode
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Preview Content */}
            <div className="p-8">
              <div className="mb-8">
                <div className="inline-block">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    {formData.difficulty_level}
                  </span>
                </div>
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {formData.title || "Challenge Title"}
              </h2>

              <p className="text-lg text-gray-600 mb-8">
                {formData.description || "Challenge description will appear here"}
              </p>

              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Problem Statement
                </h3>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {formData.problem_statement || "Problem statement will appear here"}
                </div>
              </div>

              {formData.prize_pool && (
                <div className="mb-8">
                  <p className="text-gray-600">Prize Pool</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${formData.prize_pool.toLocaleString()}
                  </p>
                </div>
              )}

              {metrics.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Metrics</h3>
                  <div className="space-y-3">
                    {metrics.map((metric, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-gray-900">{metric.name}</p>
                        <p className="text-sm text-gray-600">{metric.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Weight: {metric.weight} | Direction: {metric.direction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={togglePreview}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Edit
            </button>
          </div>
        </div>
      ) : (
        // Edit Mode
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {FORM_STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div
                    onClick={() => {
                      if (step.id < currentStep) setCurrentStep(step.id);
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold cursor-pointer transition-all ${
                      step.id < currentStep
                        ? "bg-green-600 text-white"
                        : step.id === currentStep
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.id < currentStep ? "✓" : step.id}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                    {step.label}
                  </span>
                  {index < FORM_STEPS.length - 1 && (
                    <div
                      className={`w-12 h-1 mx-1 ${
                        step.id < currentStep ? "bg-green-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Challenge Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    placeholder="e.g., Image Classification Challenge"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    placeholder="Brief description of the challenge"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url || ""}
                    onChange={(e) => updateFormData("image_url", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Problem Statement *
                  </label>
                  <textarea
                    value={formData.problem_statement || ""}
                    onChange={(e) => updateFormData("problem_statement", e.target.value)}
                    placeholder="Detailed problem statement..."
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Difficulty Level *
                    </label>
                    <select
                      value={formData.difficulty_level || "MEDIUM"}
                      onChange={(e) =>
                        updateFormData(
                          "difficulty_level",
                          e.target.value as ChallengeDifficulty
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Prize Pool
                    </label>
                    <input
                      type="number"
                      value={formData.prize_pool || 0}
                      onChange={(e) =>
                        updateFormData("prize_pool", parseFloat(e.target.value))
                      }
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Dataset URL
                  </label>
                  <input
                    type="url"
                    value={formData.dataset_url || ""}
                    onChange={(e) => updateFormData("dataset_url", e.target.value)}
                    placeholder="https://example.com/dataset.zip"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Timeline */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.start_date?.slice(0, 16) || ""}
                      onChange={(e) =>
                        updateFormData("start_date", new Date(e.target.value).toISOString())
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      End Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.end_date?.slice(0, 16) || ""}
                      onChange={(e) =>
                        updateFormData("end_date", new Date(e.target.value).toISOString())
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    💡 <strong>Tip:</strong> Set the timeline carefully. Challenges cannot
                    change dates after being published.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Metrics */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Evaluation Metrics *
                    </h3>
                    <button
                      type="button"
                      onClick={addMetric}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Add Metric
                    </button>
                  </div>

                  {metrics.length === 0 ? (
                    <p className="text-gray-600 text-sm">No metrics added yet</p>
                  ) : (
                    <div className="space-y-4">
                      {metrics.map((metric, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg space-y-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                  Metric Name *
                                </label>
                                <input
                                  type="text"
                                  value={metric.name || ""}
                                  onChange={(e) =>
                                    updateMetric(index, "name", e.target.value)
                                  }
                                  placeholder="e.g., Accuracy"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                  Weight
                                </label>
                                <input
                                  type="number"
                                  value={metric.weight || 1}
                                  onChange={(e) =>
                                    updateMetric(index, "weight", parseFloat(e.target.value))
                                  }
                                  min="0.1"
                                  step="0.1"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeMetric(index)}
                              className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-1">
                                Direction
                              </label>
                              <select
                                value={metric.direction || "HIGHER_IS_BETTER"}
                                onChange={(e) =>
                                  updateMetric(index, "direction", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                              >
                                <option value="HIGHER_IS_BETTER">Higher is Better</option>
                                <option value="LOWER_IS_BETTER">Lower is Better</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-1">
                                Primary Metric
                              </label>
                              <input
                                type="checkbox"
                                checked={metric.is_primary || false}
                                onChange={(e) =>
                                  updateMetric(index, "is_primary", e.target.checked)
                                }
                                className="w-4 h-4"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                              Description
                            </label>
                            <textarea
                              value={metric.description || ""}
                              onChange={(e) =>
                                updateMetric(index, "description", e.target.value)
                              }
                              placeholder="How this metric is calculated..."
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Resources */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Documentation/Rules
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Additional guidelines, rules, and documentation for participants..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Submission Format Requirements
                  </label>
                  <textarea
                    rows={4}
                    placeholder="e.g., CSV format with columns: id, prediction, confidence..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}

            {/* Step 6: Review */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    ✓ <strong>Ready to publish!</strong> Please review all information below
                    and click Submit to create the challenge.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Title</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formData.title || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Difficulty</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formData.difficulty_level || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Prize Pool</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${formData.prize_pool?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Duration</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formData.start_date && formData.end_date
                        ? `${Math.ceil(
                            (new Date(formData.end_date).getTime() -
                              new Date(formData.start_date).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )} days`
                        : "—"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Metrics</p>
                  <div className="space-y-2">
                    {metrics.map((m, i) => (
                      <p key={i} className="text-sm text-gray-700">
                        • {m.name}
                        {m.is_primary && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            Primary
                          </span>
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                {currentStep < FORM_STEPS.length && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                )}

                {currentStep === FORM_STEPS.length && (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Creating..." : "Create Challenge"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
