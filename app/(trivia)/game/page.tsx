"use client";
import { TriviaBoard } from "@/app/components/TriviaBoard";
import useOnKeyPress from "@/app/core/hooks/useOnKeyPress";
import useSound from "use-sound";

export default function Game() {
  const [playIncorrect, incorrectFx] = useSound("/sounds/spongebob-fail.mp3", {
    interrupt: false,
  });
  function onXPress() {
    playIncorrect();
    console.log("log: x");
  }
  useOnKeyPress({ key: "x", onPress: onXPress });
  return (
    <>
      <TriviaBoard />
    </>
  );
}
