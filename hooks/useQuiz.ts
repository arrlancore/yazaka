import { useEffect, useState } from "react";
import type { Question } from "@/types/quiz";

interface UseQuizProps {
  questions: Question[];
  disableTimer: boolean;
}

export function useQuiz({ questions, disableTimer }: UseQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(disableTimer ? 0 : 30);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!disableTimer) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, disableTimer]);

  useEffect(() => {
    if (!disableTimer && timeRemaining === 0) {
      handleAnswer("");
    }
  }, [timeRemaining, disableTimer]);

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    const questionPoints = calculateQuestionPoints(isCorrect);

    setPoints((prev) => prev + questionPoints);
    setStreak((prev) => (isCorrect ? prev + 1 : 0));
    setAnswers([...answers, answer]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetTimer();
    } else {
      setIsCompleted(true);
    }
  };

  const calculateQuestionPoints = (isCorrect: boolean): number => {
    if (!isCorrect) return 0;
    if (disableTimer) return 1; // 1 point per correct answer when timer is disabled
    return Math.round(timeRemaining * 10 * (1 + streak * 0.1));
  };

  const resetTimer = () => {
    if (!disableTimer) {
      const nextQuestion = questions[currentQuestionIndex + 1];
      setTimeRemaining(nextQuestion?.timeLimit || 30);
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
    setPoints(0);
    setStreak(0);
    resetTimer();
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
    timeRemaining: disableTimer ? null : timeRemaining,
    points,
  };
}
