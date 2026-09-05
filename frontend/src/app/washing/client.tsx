"use client";
import { useCallback, useEffect, useState } from "react";
import MainPage from "../../components/washing/WashingPage";
import Astronaut from "../../components/astronaut/Astronaut";
import { baseDevices, DevicesContext } from "../../context/DevicesContext";
import { Device, SnackbarItem } from "../../types/types";
import { API_URL } from "../../secrets";
import { SnackbarContext } from "../../context/SnackbarContext";

const DEVICE_POLL_INTERVAL_MS = 30_000;

function App() {
  const [deviceContext, setDeviceContext] = useState<Device[]>(baseDevices);
  const [snackbarMessages, setSnackbarMessages] = useState<SnackbarItem[]>([]);

  const fetchDevices = useCallback(async () => {
    try {
      const fetchData = await fetch(`${API_URL}/device/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await fetchData.json();
      setDeviceContext(data);
    } catch (_) {
      setSnackbarMessages((prev) => [
        ...prev,
        { status: "error", message: "Connection error" },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, DEVICE_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchDevices]);

  return (
    <DevicesContext.Provider value={deviceContext}>
      <SnackbarContext.Provider
        value={{ messages: snackbarMessages, setMessages: setSnackbarMessages }}
      >
        <MainPage refresh={fetchDevices} />
        <Astronaut />
      </SnackbarContext.Provider>
    </DevicesContext.Provider>
  );
}

export function ClientOnly() {
  return <App />;
}
