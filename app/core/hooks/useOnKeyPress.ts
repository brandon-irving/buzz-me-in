import { useEffect } from "react";

type Options = {
  key: string;
  onPress: () => void;
  skip?: any;
};

const useOnKeyPress = (options: Options) => {
  const { key, onPress, skip } = options;

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === key && !skip) {
        onPress();
      }
    };

    window.addEventListener("keydown", handler);

    // cleanup the effect
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [key, onPress]); // rerun the effect if key or onPress change
};

export default useOnKeyPress;
