import { useEffect, useState } from "react";

function AnimatedCounter({ value, duration = 800, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;

    if (end === 0) {
      setCount(0);
      return;
    }

    const incrementTime = 16;
    const totalSteps = Math.max(1, Math.floor(duration / incrementTime));
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default AnimatedCounter;