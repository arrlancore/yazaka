// components/quiz/QuizUI.tsx
import { Award, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import type { Question } from "@/types/quiz";
import { useQuiz } from "@/hooks/useQuiz";
import { QuizQuestion } from "./QuizQuestion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizUIProps {
  questions: Question[];
  title?: string;
  disableTimer?: boolean;
}

export function QuizUI({ questions, title, disableTimer }: QuizUIProps) {
  const {
    currentQuestion,
    progress,
    handleAnswer,
    calculateScore,
    isCompleted,
    resetQuiz,
    timeRemaining,
    points,
  } = useQuiz({ questions, disableTimer: disableTimer ?? false });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 md:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-32 sm:w-60 h-32 sm:h-60 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-32 sm:w-60 h-32 sm:h-60 bg-primary-light/20 rounded-full blur-[100px] animate-pulse delay-1000" />

      <div className="w-full max-w-3xl relative z-10">
        {!isCompleted ? (
          <>
            <div className="mb-6 sm:mb-12 space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent text-center leading-tight">
                {title ?? "Kuis Pengetahuan Umum"}
              </h1>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-full shadow-neumorphic">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                    {points} pts
                  </span>
                </div>

                <div className="px-4 py-2 rounded-full bg-card shadow-neumorphic">
                  <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                    {progress.current} / {progress.total}
                  </span>
                </div>

                <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-full shadow-neumorphic">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                    {timeRemaining}s
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full h-2 bg-card rounded-full shadow-neumorphic overflow-hidden mb-6">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary-light"
                initial={{ width: 0 }}
                animate={{
                  width: `${((progress.current - 1) / progress.total) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <QuizQuestion
                  question={currentQuestion}
                  onAnswer={handleAnswer}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            {disableTimer && (
              <div className="mt-6 sm:mt-8 flex justify-between items-center">
                <button
                  onClick={() =>
                    setCurrentQuestionIndex(
                      Math.max(0, currentQuestionIndex - 1)
                    )
                  }
                  disabled={progress.current === 1}
                  className={cn(
                    "p-3 sm:p-4 rounded-full bg-card border border-border transition-all duration-300",
                    "hover:shadow-neumorphic active:shadow-neumorphic-inset",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  aria-label="Previous question"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </button>

                <button
                  onClick={() =>
                    setCurrentQuestionIndex(
                      Math.min(questions.length - 1, currentQuestionIndex + 1)
                    )
                  }
                  disabled={progress.current === progress.total}
                  className={cn(
                    "p-3 sm:p-4 rounded-full bg-card border border-border transition-all duration-300",
                    "hover:shadow-neumorphic active:shadow-neumorphic-inset",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  aria-label="Next question"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="relative bg-card p-6 sm:p-8 md:p-12 rounded-2xl shadow-neumorphic text-center mx-4 sm:mx-0">
            {/* Score Circle */}
            <div className="absolute -top-16 sm:-top-20 left-1/2 -translate-x-1/2 w-32 sm:w-40 h-32 sm:h-40">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary-light animate-spin-slow" />
              <div className="absolute inset-2 rounded-full bg-card" />
              <div className="absolute inset-0 flex items-center justify-center text-3xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                {calculateScore()}%
              </div>
            </div>

            <div className="mt-20 sm:mt-24">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Quiz Completed!
              </h2>
              <p className="text-lg sm:text-xl mb-6 text-muted-foreground">
                Total Points: {points}
              </p>
              <button
                onClick={resetQuiz}
                className={cn(
                  "px-6 sm:px-8 py-3 sm:py-4 rounded-xl",
                  "bg-gradient-to-r from-primary to-primary-light",
                  "text-primary-foreground font-bold tracking-wider",
                  "shadow-neon transition-all duration-300",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  "text-sm sm:text-base"
                )}
              >
                Retry Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
