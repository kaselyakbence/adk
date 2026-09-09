"use client";
import { useState } from "react";
import { CameraContext } from "./CameraContext";

const CameraProvider = ({ children }: { children: React.ReactNode }) => {
  const [cameraOpen, setCameraOpen] = useState(false);

  return (
    <CameraContext.Provider value={{ cameraOpen, setCameraOpen }}>
      {children}
    </CameraContext.Provider>
  );
};

export default CameraProvider;
