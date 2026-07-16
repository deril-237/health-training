import { useCallback, useState } from "react";

export function useCounter(defaultValue = 0) {
  const [counter, setCounter] = useState(defaultValue);

  return {
    counter,
    increment: useCallback(() => setCounter(counter + 1), [counter]),
    decrement: useCallback(() => setCounter(counter - 1), [counter]),
    initialize: useCallback(
      (value = defaultValue) => setCounter(value),
      [counter],
    ),
  };
}
