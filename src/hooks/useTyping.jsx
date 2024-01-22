import { useCallback, useEffect, useRef, useState } from "react";
import { isKeyboardCodeAllowed } from "../utils/helpers";
import _ from "lodash";

const useTypings = (enabled) => {
  const [cursor, setCursor] = useState(0);
  const [typed, setTyped] = useState([]);
  const totalTyped = useRef(0);
  const worker = useRef(null);
  const keydownHandler = useCallback(
    ({ key, code }) => {
      if (!enabled || !isKeyboardCodeAllowed(code)) {
        return;
      }

      switch (key) {
        case "Backspace":
          setTyped((prev) => prev.lenght!==0?prev.slice(0, -1):prev);
          setCursor((cursor) => cursor - 1);
          totalTyped.current -= 1;
          break;
        default:
          setTyped((prev) => _.concat(prev, key));
          setCursor((cursor) => cursor + 1);
          totalTyped.current += 1;
      }

      worker.current.postMessage({
        text: _.join(typed, ""),
      })
    },
    [enabled]
  );

  const clearTyped = useCallback(() => {
    setTyped("");
    setCursor(0);
  }, []);

  const resetTotalTyped = useCallback(() => {
    totalTyped.current = 0;
  }, []);

  // attach the keydown event listener to record keystrokes
  useEffect(() => {
    window.addEventListener("keydown", keydownHandler);

    // Remove event listeners on cleanup
    return () => {
        window.removeEventListener("keydown", keydownHandler);
    };
  }, [keydownHandler]);

  return {
    typed,
    cursor,
    clearTyped,
    resetTotalTyped,
    totalTyped: totalTyped.current,
  };
};

export default useTypings;