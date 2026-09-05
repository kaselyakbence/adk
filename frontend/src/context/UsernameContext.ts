import { createContext, Dispatch, SetStateAction } from "react";

interface UsernameContextType {
  username: string | null;
  setUsername: Dispatch<SetStateAction<string | null>>;
  loaded: boolean;
}

export const UsernameContext = createContext<UsernameContextType>({
  username: null,
  setUsername: () => {},
  loaded: false,
});

// A saved name lives in localStorage and is remembered forever. A guest
// name lives in sessionStorage, so it's forgotten once the tab/browser
// closes and the prompt naturally returns next visit.
export function getStoredUsername(): string | null {
  return localStorage.getItem("username") || sessionStorage.getItem("username");
}
