"use client";
import { useCallback, useContext, useEffect, useState } from "react";
import MainPage from "../../../components/washing/WashingPage";
import Astronaut from "../../../components/astronaut/Astronaut";
import { baseDevices, DevicesContext } from "../../../context/DevicesContext";
import { Device, SnackbarItem } from "../../../types/types";
import { API_URL } from "../../../secrets";
import { SnackbarContext } from "../../../context/SnackbarContext";
import { LocaleContext } from "../../../context/LocaleContext";

const DEVICE_POLL_INTERVAL_MS = 30_000;

function App() {
  const [deviceContext, setDeviceContext] = useState<Device[]>(baseDevices);
  const [snackbarMessages, setSnackbarMessages] = useState<SnackbarItem[]>([]);
  // Only distinguishes the very first fetch (baseDevices is a hardcoded
  // placeholder, not real data) - later polling refreshes shouldn't
  // re-trigger a skeleton flash every 30s.
  const [initialLoading, setInitialLoading] = useState(true);
  const { t } = useContext(LocaleContext);

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
        { status: "error", message: t("snackbar.connectionError") },
      ]);
    } finally {
      setInitialLoading(false);
    }
  }, [t]);

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
        <MainPage refresh={fetchDevices} loading={initialLoading} />
        <Astronaut />
      </SnackbarContext.Provider>
    </DevicesContext.Provider>
  );
}

export function ClientOnly() {
  return <App />;
}
