"use client";

import { AnswerKey } from "@/app/components/AnswerKey";
import { initialState } from "@/app/components/TriviaBoard/reducer";
import useCachedState from "@/app/core/hooks/useCachedState";

export default function Answers() {
  const [trivia] = useCachedState('appState', initialState)
  return (
    <>
      <AnswerKey trivia={trivia} />
    </>
  );
}
