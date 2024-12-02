// components/quiz/QuizQuestion.tsx
import { useEffect, useState } from "react";
import type { Question } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");

  const handleOnAnswer = (answer: string) => {
    onAnswer(answer);
    setSelectedOption(null);
    setTextAnswer("");
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleTextSubmit = () => {
    if (textAnswer.trim()) {
      handleOnAnswer(textAnswer.trim());
    }
  };

  const handleOptionSubmit = () => {
    if (selectedOption) {
      handleOnAnswer(selectedOption);
    }
  };

  return (
    <div className="relative p-4 sm:p-6 md:p-10 rounded-xl sm:rounded-2xl bg-card border border-border shadow-neumorphic transition-all duration-300 no-select no-copy">
      {/* Question Label */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-primary-light text-primary-foreground shadow-neon">
        QUESTION
      </div>

      {/* Question Text */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent pt-4">
        {question.text}
      </h2>

      {question.type === "multiple-choice" && question.options ? (
        <div className="flex flex-col gap-3 sm:gap-4">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionSelect(option)}
              className={cn(
                "w-full p-4 sm:p-6 rounded-lg transition-all duration-300",
                "flex items-center gap-3 sm:gap-4",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                "active:scale-[0.98]",
                selectedOption === option
                  ? "bg-gradient-to-r from-primary to-primary-light text-primary-foreground"
                  : "bg-card shadow-neumorphic hover:scale-[1.02]"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0",
                  selectedOption === option
                    ? "bg-primary-foreground"
                    : "bg-muted shadow-neumorphic-inset"
                )}
              >
                {selectedOption === option && (
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className="text-base sm:text-lg font-medium">{option}</span>
            </button>
          ))}

          {selectedOption !== null && (
            <>
              <div className="h-2" />
              <button
                onClick={handleOptionSubmit}
                className={cn(
                  "w-full p-4 sm:p-6 rounded-lg",
                  "bg-gradient-to-r from-primary to-primary-light",
                  "text-primary-foreground font-bold tracking-wider",
                  "shadow-neon transition-all duration-300",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  "text-base sm:text-lg"
                )}
              >
                Lanjutkan
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            className={cn(
              "w-full p-4 sm:p-6 rounded-lg",
              "bg-card border border-border shadow-neumorphic-inset",
              "text-base sm:text-lg",
              "outline-none focus:ring-2 focus:ring-primary/20",
              "placeholder:text-muted-foreground/60"
            )}
            placeholder="Type your answer here..."
          />
          {textAnswer && (
            <button
              onClick={handleTextSubmit}
              disabled={!textAnswer.trim()}
              className={cn(
                "w-full p-4 sm:p-6 rounded-lg",
                "bg-gradient-to-r from-primary to-primary-light",
                "text-primary-foreground font-bold tracking-wider",
                "shadow-neon transition-all duration-300",
                "hover:scale-[1.02] active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "text-base sm:text-lg"
              )}
            >
              Lanjutkan
            </button>
          )}
        </div>
      )}
    </div>
  );
}
