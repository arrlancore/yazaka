// hooks/useQuiz.ts
import { useState } from "react";
import type { Question } from "@/types/quiz";

interface UseQuizProps {
  questions: Question[];
}

export function useQuiz({ questions }: UseQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const calculateScore = (): number => {
    let score = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) score++;
    });
    return Math.round((score / questions.length) * 100);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsCompleted(false);
  };

  return {
    currentQuestion: questions[currentQuestionIndex],
    progress: {
      current: currentQuestionIndex + 1,
      total: questions.length,
    },
    handleAnswer,
    calculateScore,
    isCompleted,
    resetQuiz,
  };
}
