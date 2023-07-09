import { useState, useEffect, useRef } from "react";

export function useGameTimer({ time }: { time: number }) {
  const [isPaused, setIsPaused] = useState(true);
  const [timer, setTimer] = useState<number>(time);
  const [hasStarted, setHasStarted] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimer(time);
  }, [time]);

  useEffect(() => {
    if (!hasStarted || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            return 0;
          }
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, hasStarted]);

  const pauseTime = () => {
    setIsPaused(true);
  };

  const resumeTime = () => {
    setIsPaused(false);
  };

  const startTimer = () => {
    setHasStarted(true);
    setIsPaused(false);
  };

  const restartTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setHasStarted(false);
    setIsPaused(true);
    setTimer(time);
  };

  return {
    timer,
    pauseTime,
    resumeTime,
    startTimer,
    restartTimer,
  };
}
