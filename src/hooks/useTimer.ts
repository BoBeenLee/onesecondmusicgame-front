import { useState, useEffect } from "react";

function useTimer({
  seconds,
  onTimeEnd
}: {
  seconds: number;
  onTimeEnd?: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [status, setStatus] = useState<"start" | "stop">("start");

  const start = () => {
    setStatus("start");
  };

  const stop = () => {
    setStatus("stop");
  };

  useEffect(() => {
    if (!timeLeft) {
      onTimeEnd && onTimeEnd();
      return;
    }
    if (status === "stop") {
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [onTimeEnd, timeLeft, status]);

  return { start, stop, timeLeft };
}

export default useTimer;
