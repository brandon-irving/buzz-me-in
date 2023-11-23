import { useState, useEffect } from "react";
import LocalStorage, { LocalStorageKeys } from "../LocalStorage";

function useCachedState<T>(
  key: LocalStorageKeys,
  initialValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = LocalStorage.getValues(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Failed to retrieve state from local storage: ", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      LocalStorage.setValues(key, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to set state in local storage: ", error);
    }
  }, [state, key]);

  return [state, setState];
}

export default useCachedState;
