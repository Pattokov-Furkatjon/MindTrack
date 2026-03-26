import React, { useState, useEffect } from "react";
import { calculateTimeSpent, generateSessionId } from "../utils/logic";
import "../styles/form.css";

/**
 * Enhanced Question Form Component
 * Collects comprehensive daily tracking data including category and sessions
 */
function QuestionForm({ onSubmit, isDarkMode }) {
  const [formData, setFormData] = useState({
    study: "",
    exercise: "",
    goal: "",
    category: "Study",
    startTime: "",
    endTime: "",
    focusLevel: 5,
    distraction: "",
    notes: "",
  });

  const categories = ["Study", "Work", "Fitness", "Project", "Other"];

  const [totalTime, setTotalTime] = useState(0);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [formStep, setFormStep] = useState("basic"); // basic or advanced

  // Auto-calculate total time when start/end times change
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const calculated = calculateTimeSpent(formData.startTime, formData.endTime);
      setTotalTime(calculated);
      // Auto-fill study field with calculated time
      setFormData((prev) => ({
        ...prev,
        study: calculated || "",
      }));
    }
  }, [formData.startTime, formData.endTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSliderChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      focusLevel: parseInt(e.target.value),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate goal
    if (!formData.goal || formData.goal.trim() === "") {
      newErrors.goal = "Please enter your main goal";
    } else if (formData.goal.trim().length < 5) {
      newErrors.goal = "Goal must be at least 5 characters";
    }

    // Validate start time if provided
    if (formData.startTime && !formData.endTime) {
      newErrors.endTime = "End time is required when start time is set";
    }

    // Validate end time if provided
    if (formData.endTime && !formData.startTime) {
      newErrors.startTime = "Start time is required when end time is set";
    }

    // Validate exercise hours
    if (formData.exercise && isNaN(formData.exercise)) {
      newErrors.exercise = "Exercise must be a valid number";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccessMessage("");
      return;
    }

    // Prepare data for submission
    const today = new Date().toISOString().split("T")[0];
    const dataToSubmit = {
      sessionId: generateSessionId(),
      date: today,
      goal: formData.goal.trim(),
      category: formData.category,
      startTime: formData.startTime || null,
      endTime: formData.endTime || null,
      totalTime: totalTime || parseFloat(formData.study) || 0,
      study: totalTime || parseFloat(formData.study) || 0,
      exercise: formData.exercise ? parseFloat(formData.exercise) : 0,
      focusLevel: formData.focusLevel,
      distraction: formData.distraction.trim(),
      notes: formData.notes.trim(),
    };

    // Call parent onSubmit
    onSubmit(dataToSubmit);

    // Clear form and show success message
    setFormData({
      study: "",
      exercise: "",
      goal: "",
      category: "Study",
      startTime: "",
      endTime: "",
      focusLevel: 5,
      distraction: "",
      notes: "",
    });
    setTotalTime(0);
    setErrors({});
    setFormStep("basic");
    setSuccessMessage("✅ Your entry has been saved successfully! 🎉");

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <form
      className={`form-container ${isDarkMode ? "form-container-dark" : ""}`}
      onSubmit={handleSubmit}
    >
      <h2 className="form-title">📋 Today's Entry</h2>

      {successMessage && (
        <div className="form-success">{successMessage}</div>
      )}

      {/* Form Tabs */}
      <div className="form-tabs">
        <button
          type="button"
          className={`tab-button ${formStep === "basic" ? "active" : ""}`}
          onClick={() => setFormStep("basic")}
        >
          📊 Basics
        </button>
        <button
          type="button"
          className={`tab-button ${formStep === "advanced" ? "active" : ""}`}
          onClick={() => setFormStep("advanced")}
        >
          ⚡ Details
        </button>
      </div>

      {/* Basic Section */}
      {formStep === "basic" && (
        <div className="form-section">
          {/* Main Goal */}
          <div className="form-group">
            <label htmlFor="goal" className="form-label">
              🎯 What's Your Main Goal Today?
            </label>
            <textarea
              id="goal"
              name="goal"
              className="form-textarea"
              placeholder="e.g., Complete React project, Review algorithms, Practice coding..."
              value={formData.goal}
              onChange={handleChange}
            />
            {errors.goal && <span className="form-error">{errors.goal}</span>}
          </div>

          {/* Category Selection */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              🏷️ Category
            </label>
            <select
              id="category"
              name="category"
              className="form-input form-select"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Time Tracking */}
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="startTime" className="form-label">
                ⏰ Start Time
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                className="form-input"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="endTime" className="form-label">
                🛑 End Time
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                className="form-input"
                value={formData.endTime}
                onChange={handleChange}
              />
              {errors.endTime && (
                <span className="form-error">{errors.endTime}</span>
              )}
            </div>
          </div>

          {/* Study Hours Display */}
          {totalTime > 0 && (
            <div className="time-display">
              <div className="time-box">
                <span className="time-label">📚 Total Time</span>
                <span className="time-value">{totalTime}h</span>
              </div>
            </div>
          )}

          {/* Manual Study Hours Input */}
          {!formData.startTime && !formData.endTime && (
            <div className="form-group">
              <label htmlFor="study" className="form-label">
                📚 Study Hours (Manual)
              </label>
              <input
                type="number"
                id="study"
                name="study"
                className="form-input"
                placeholder="Enter hours (e.g., 2.5)"
                value={formData.study}
                onChange={handleChange}
                step="0.5"
                min="0"
              />
            </div>
          )}

          {/* Exercise Hours */}
          <div className="form-group">
            <label htmlFor="exercise" className="form-label">
              💪 Exercise Hours
            </label>
            <input
              type="number"
              id="exercise"
              name="exercise"
              className="form-input"
              placeholder="Enter hours (e.g., 1)"
              value={formData.exercise}
              onChange={handleChange}
              step="0.5"
              min="0"
            />
            {errors.exercise && (
              <span className="form-error">{errors.exercise}</span>
            )}
          </div>

          <button
            type="button"
            className="form-button-secondary"
            onClick={() => setFormStep("advanced")}
          >
            Next → View Details
          </button>
        </div>
      )}

      {/* Advanced Section */}
      {formStep === "advanced" && (
        <div className="form-section">
          {/* Focus Level Slider */}
          <div className="form-group">
            <label htmlFor="focusLevel" className="form-label">
              🎯 Focus Level Today
            </label>
            <div className="slider-container">
              <input
                type="range"
                id="focusLevel"
                name="focusLevel"
                className="form-slider"
                min="1"
                max="10"
                value={formData.focusLevel}
                onChange={handleSliderChange}
              />
              <div className="slider-labels">
                <span>Poor</span>
                <span className="slider-value">{formData.focusLevel}/10</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          {/* Distractions */}
          <div className="form-group">
            <label htmlFor="distraction" className="form-label">
              🚫 What Distracted You?
            </label>
            <textarea
              id="distraction"
              name="distraction"
              className="form-textarea"
              placeholder="e.g., Social media, Notifications, Fatigue..."
              value={formData.distraction}
              onChange={handleChange}
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              📝 Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-textarea"
              placeholder="Any reflections or observations about your day..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons-group">
            <button
              type="button"
              className="form-button-secondary"
              onClick={() => setFormStep("basic")}
            >
              ← Back
            </button>
            <button type="submit" className="form-button">
              ✨ Save Entry
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export default QuestionForm;
