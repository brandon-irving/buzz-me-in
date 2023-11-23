"use strict";

export type LocalStorageKeys = "appState" | "teamState";

const LocalStorage = {
  setValues: (key: string, values: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, values);
    }
  },
  getValues: (key: string) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },

  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  },
};

export default LocalStorage;
