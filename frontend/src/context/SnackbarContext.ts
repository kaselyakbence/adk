import { createContext, Dispatch, SetStateAction } from "react";
import { SnackbarItem } from "../types/types";

interface SnackbarContextType {
  messages: SnackbarItem[];
  setMessages?: Dispatch<SetStateAction<SnackbarItem[]>>;
}

export const SnackbarContext = createContext<SnackbarContextType>({
  messages: [],
});
