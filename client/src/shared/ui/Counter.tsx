"use client";

import { useEffect, useState } from "react";

interface ICounterProps {
  end: number;
  suffix?: string;
}

export function Counter({ end, suffix = "" }: ICounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(end / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 24);
    return () => clearInterval(timer);
  }, [end]);

  return (
    <span>
      {count.toLocaleString("ru")}
      {suffix}
    </span>
  );
}
