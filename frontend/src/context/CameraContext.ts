import { createContext, Dispatch, SetStateAction } from "react";

interface CameraContextType {
  cameraOpen: boolean;
  setCameraOpen: Dispatch<SetStateAction<boolean>>;
}

export const CameraContext = createContext<CameraContextType>({
  cameraOpen: false,
  setCameraOpen: () => {},
});
