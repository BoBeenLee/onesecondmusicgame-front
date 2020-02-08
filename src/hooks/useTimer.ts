import { useState, useEffect, useCallback } from "react";

function useTimer({
  seconds,
  defaultTimeLeft,
  onTimeEnd
}: {
  seconds: number;
  defaultTimeLeft?: number;
  onTimeEnd?: (timeLeft: number) => void;
}) {
  const [timeLeft, setTimeLeft] = useState(defaultTimeLeft ?? seconds);
  const [status, setStatus] = useState<"start" | "stop">("stop");

  const start = useCallback(() => {
    setStatus("start");
  }, []);

  const stop = useCallback(() => {
    setStatus("stop");
  }, []);

  useEffect(() => {
    if (status === "stop") {
      return;
    }
    if (timeLeft === 0) {
      onTimeEnd?.(0);
      stop();
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onTimeEnd, timeLeft, status]);

  return { start, stop, timeLeft, status };
}

export default useTimer;
