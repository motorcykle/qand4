"use client";

import { useEffect, useState } from "react";
import QuestionItem from "./QuestionItem";
import { fetchQuestions } from "@/lib/actions";

interface Question {
  id: string;
  question: string;
  to: string;
  fromEmail: string;
}

export default function QuestionsTab() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [refetch, setRefetch] = useState<boolean>(false);

  const handleFetch = async () => {
    try {
      const fetchedQuestions = await fetchQuestions();
      setQuestions(fetchedQuestions);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setError("Failed to load questions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
    setRefetch(false)
  }, [refetch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (questions.length === 0) {
    return <div>No questions found!</div>;
  }

  return (
    <div className="flex items-center flex-col justify-center mx-auto max-w-sm gap-3">
      {questions.map((question) => (
        <QuestionItem key={question.id} question={question} setRefetch={setRefetch} />
      ))}
    </div>
  );
}
