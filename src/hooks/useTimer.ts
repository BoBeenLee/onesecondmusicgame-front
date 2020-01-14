import { useState, useEffect } from "react";

function useTimer({
  seconds,
  onTimeEnd
}: {
  seconds: number;
  onTimeEnd?: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (!timeLeft) {
      onTimeEnd && onTimeEnd();
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [onTimeEnd, timeLeft]);

  return { timeLeft };
}

export default useTimer;
