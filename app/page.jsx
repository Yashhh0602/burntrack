"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Exercise Data ───────────────────────────────────────── */
const EXERCISES = [
  { name: "Running", met: 9.8, icon: "🏃", desc: "Outdoor / Treadmill" },
  { name: "Cycling", met: 7.5, icon: "🚴", desc: "Road / Stationary" },
  { name: "Swimming", met: 8.0, icon: "🏊", desc: "Laps / Open Water" },
  { name: "HIIT", met: 8.0, icon: "⚡", desc: "High Intensity" },
  { name: "Yoga", met: 3.0, icon: "🧘", desc: "Flow / Power" },
  { name: "Walking", met: 3.5, icon: "🚶", desc: "Brisk / Incline" },
  { name: "Weightlifting", met: 5.0, icon: "🏋️", desc: "Strength Training" },
  { name: "Boxing", met: 9.0, icon: "🥊", desc: "Bag / Sparring" },
];

/* ─── Food Equivalents ────────────────────────────────────── */
const FOOD_EQUIVALENTS = [
  { name: "samosas", cal: 150, emoji: "🥟" },
  { name: "slices of pizza", cal: 285, emoji: "🍕" },
  { name: "scoops of ice cream", cal: 140, emoji: "🍦" },
  { name: "chocolate chip cookies", cal: 80, emoji: "🍪" },
  { name: "bananas", cal: 105, emoji: "🍌" },
  { name: "cups of chai", cal: 70, emoji: "☕" },
  { name: "peanut butter toasts", cal: 190, emoji: "🍞" },
  { name: "gulab jamuns", cal: 150, emoji: "🍩" },
];

/* ─── Count-Up Hook ───────────────────────────────────────── */
function useCountUp(target, duration = 1500, active = false) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!active || target <= 0) {
      setValue(0);
      return;
    }

    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, active]);

  return value;
}

/* ─── Header ──────────────────────────────────────────────── */
function Header() {
  return (
    <header className="w-full border-b border-[var(--color-border)] bg-[rgba(15,15,15,0.8)] backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
            <span className="text-lg font-bold text-[var(--color-bg)]">B</span>
          </div>
          <div>
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Burn<span className="text-[var(--color-accent)]">Track</span>
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] leading-none">
              by{" "}
              <span className="text-[var(--color-text)]">
                Yashvardhan Khanduja
              </span>{" "}
              ·{" "}
              <a
                href="mailto:vardhan.yash265@gmail.com"
                className="text-[var(--color-accent)] hover:underline"
              >
                vardhan.yash265@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* CTA */}
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-badge"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Built for Digital Heroes
        </a>
      </div>
    </header>
  );
}

/* ─── Exercise Selector ───────────────────────────────────── */
function ExerciseSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {EXERCISES.map((ex) => (
        <button
          key={ex.name}
          id={`exercise-${ex.name.toLowerCase()}`}
          onClick={() => onSelect(ex)}
          className={`exercise-option ${
            selected?.name === ex.name ? "selected" : ""
          }`}
        >
          <div className="text-2xl mb-2">{ex.icon}</div>
          <div
            className="text-sm font-semibold text-[var(--color-text)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {ex.name}
          </div>
          <div className="text-xs text-[var(--color-text-muted)] mt-1">
            MET {ex.met}
          </div>
          <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
            {ex.desc}
          </div>
        </button>
      ))}
    </div>
  );
}

/* ─── Results Panel ───────────────────────────────────────── */
function ResultsPanel({ calories, exercise, duration, weight, isVisible }) {
  const displayCalories = useCountUp(Math.round(calories), 1800, isVisible);
  const [tip, setTip] = useState("");
  const [loadingTip, setLoadingTip] = useState(false);
  const [foodEquivalent, setFoodEquivalent] = useState(null);

  useEffect(() => {
    if (!isVisible || calories <= 0) return;

    // Pick a random food equivalent
    const food =
      FOOD_EQUIVALENTS[Math.floor(Math.random() * FOOD_EQUIVALENTS.length)];
    const count = Math.max(1, Math.round(calories / food.cal * 10) / 10);
    setFoodEquivalent({ ...food, count });

    // Fetch AI tip
    setLoadingTip(true);
    setTip("");
    fetch("/api/tip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exercise: exercise.name,
        duration,
        weight,
        calories: Math.round(calories),
      }),
    })
      .then((res) => res.json())
      .then((data) => setTip(data.tip))
      .catch(() =>
        setTip(
          "Stay consistent — that's the biggest factor in long-term fitness success!"
        )
      )
      .finally(() => setLoadingTip(false));
  }, [isVisible, calories, exercise, duration, weight]);

  if (!isVisible) return null;

  return (
    <div className="animate-result-reveal space-y-5">
      {/* Calorie Result */}
      <div className="card p-8 text-center glow-accent">
        <p
          className="text-sm text-[var(--color-text-secondary)] mb-2 uppercase tracking-widest"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Calories Burned
        </p>
        <div className="flex items-baseline justify-center gap-2">
          <span
            className="text-7xl sm:text-8xl font-bold gradient-text text-glow"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {displayCalories}
          </span>
          <span className="text-2xl text-[var(--color-text-muted)]">kcal</span>
        </div>
        <p className="text-sm text-[var(--color-text-muted)] mt-3">
          {exercise.icon} {exercise.name} · {duration} min · {weight} kg
        </p>
      </div>

      {/* Food Equivalent */}
      {foodEquivalent && (
        <div
          className="food-card animate-fade-in-up text-center"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        >
          <p className="text-3xl mb-2">{foodEquivalent.emoji}</p>
          <p className="text-base text-[var(--color-text)]">
            That&apos;s roughly{" "}
            <span className="font-bold text-[#FFA500]">
              ~{foodEquivalent.count} {foodEquivalent.name}
            </span>
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            ({foodEquivalent.cal} kcal each)
          </p>
        </div>
      )}

      {/* AI Coaching Tip */}
      <div
        className="tip-card animate-fade-in-up"
        style={{ animationDelay: "0.4s", opacity: 0 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">🤖</span>
          <p
            className="text-sm font-semibold text-[var(--color-accent)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            AI Coaching Tip
          </p>
        </div>
        {loadingTip ? (
          <div className="flex items-center gap-3">
            <div className="spinner"></div>
            <p className="text-sm text-[var(--color-text-muted)]">
              Generating your personalized tip...
            </p>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {tip}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export default function Home() {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [weight, setWeight] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef(null);

  const canCalculate =
    selectedExercise && weight > 0 && duration > 0;

  const handleCalculate = useCallback(() => {
    if (!canCalculate) return;

    const cal =
      selectedExercise.met * parseFloat(weight) * (parseFloat(duration) / 60);
    setCalories(cal);
    setShowResult(true);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }, [canCalculate, selectedExercise, weight, duration]);

  const handleReset = () => {
    setSelectedExercise(null);
    setWeight("");
    setDuration("");
    setCalories(0);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-grid">
      <Header />

      <main className="mx-auto px-4 sm:px-6 py-10 sm:py-16" style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-[rgba(200,255,0,0.08)] border border-[rgba(200,255,0,0.15)] rounded-full px-4 py-1.5 text-xs text-[var(--color-accent)] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
            Powered by AI
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Track Your{" "}
            <span className="gradient-text">Burn</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] text-base sm:text-lg max-w-md mx-auto">
            Select your workout, enter your stats, and get instant calorie
            insights with AI-powered coaching tips.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="card p-6 sm:p-8 space-y-8 mb-8">
          {/* Step 1: Exercise */}
          <div>
            <label
              className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] text-xs font-bold flex items-center justify-center">
                1
              </span>
              Choose Exercise
            </label>
            <ExerciseSelector
              selected={selectedExercise}
              onSelect={setSelectedExercise}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--color-border)]" />

          {/* Step 2: Details */}
          <div>
            <label
              className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] text-xs font-bold flex items-center justify-center">
                2
              </span>
              Your Details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--color-text-muted)] mb-2 ml-1">
                  Weight (kg)
                </label>
                <input
                  id="weight-input"
                  type="number"
                  min="1"
                  max="300"
                  step="0.1"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    setShowResult(false);
                  }}
                  placeholder="e.g. 70"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--color-text-muted)] mb-2 ml-1">
                  Duration (minutes)
                </label>
                <input
                  id="duration-input"
                  type="number"
                  min="1"
                  max="600"
                  step="1"
                  value={duration}
                  onChange={(e) => {
                    setDuration(e.target.value);
                    setShowResult(false);
                  }}
                  placeholder="e.g. 30"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--color-border)]" />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="calculate-btn"
              onClick={handleCalculate}
              disabled={!canCalculate}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Calculate Burn
            </button>
            {showResult && (
              <button
                id="reset-btn"
                onClick={handleReset}
                className="px-6 py-4 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-all text-sm font-medium"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div ref={resultRef}>
          <ResultsPanel
            calories={calories}
            exercise={selectedExercise}
            duration={parseFloat(duration)}
            weight={parseFloat(weight)}
            isVisible={showResult}
          />
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pb-8 space-y-3">
          <p className="text-xs text-[var(--color-text-muted)]">
            Calorie estimates use MET (Metabolic Equivalent of Task) values ·
            Results are approximate
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} BurnTrack · Built by Yashvardhan
            Khanduja
          </p>
        </footer>
      </main>
    </div>
  );
}
