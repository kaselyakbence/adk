import { useContext, useEffect, useMemo, useState } from "react";
import { DevicesContext } from "../../context/DevicesContext";
import styles from "./washingpage.module.css";
import Countdown from "../countdown/Countdown";
import { MdCameraswitch, MdSync } from "react-icons/md";
import TimerModal from "../../modals/timer/TimerModal";
import CustomSnackbar from "../snackbar/CustomSnackbar";
import QRScanner from "../qrscanner/QRScanner";
import InfoModal from "../../modals/info/InfoModal";
import Navbar from "../navbar/NavBar";
import InstructionsCard from "./InstructionsCard";
import { getPendingUpdates, subscribeToQueueChanges } from "../../lib/offlineQueue";
import InstallNudge from "../InstallNudge";

interface MainPageProps {
  refresh: () => Promise<void>;
}

const MainPage = ({ refresh }: MainPageProps) => {
  const [updateDevice, setUpdateDevice] = useState<number | null>(null);
  const [infoDevice, setInfoDevice] = useState<number | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const devices = useContext(DevicesContext);
  const [pendingDeviceIds, setPendingDeviceIds] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    const refreshPending = () => {
      getPendingUpdates().then((updates) =>
        setPendingDeviceIds(new Set(updates.map((u) => u.deviceId))),
      );
    };

    refreshPending();
    return subscribeToQueueChanges(refreshPending);
  }, []);

  const freeDevices = useMemo(() => {
    const now = new Date();
    const washers = devices
      .filter((d) => d.type === "washer")
      .filter((d) => d.end_date && new Date(d.end_date) < now).length;

    const dryers = devices
      .filter((d) => d.type === "dryer")
      .filter((d) => d.end_date && new Date(d.end_date) < now).length;

    return {
      washers,
      dryers,
    };
  }, [devices]);

  return (
    <>
      <Navbar />
      <button
        className={styles.fab}
        onClick={() => setCameraOpen(true)}
        aria-label="Scan QR code"
      >
        <MdCameraswitch className={styles.fabIcon} />
      </button>
      <div className={styles.layout}>
        <div className={styles.body}>
          <div className={styles.washers}>
            <div className={styles.washer_header}>
              <p className={styles.washer_header_left}>Washing machines</p>
              <p className={styles.washer_header_right}>
                {freeDevices.washers}/5
              </p>
            </div>
            {devices &&
              devices
                .filter((d) => d.type == "washer")
                .sort((a, b) => a.id - b.id)
                .map((d) => (
                  <div
                    className={styles.item}
                    key={d.id}
                    onClick={() => setInfoDevice(d.id)}
                  >
                    <div className={styles.itemLabel}>
                      <span>Washer {d.number}</span>
                      {pendingDeviceIds.has(d.id) && (
                        <span className={styles.pendingBadge}>
                          <MdSync className={styles.pendingIcon} />
                          Pending sync
                        </span>
                      )}
                    </div>
                    <Countdown time={d.end_date} />
                  </div>
                ))}
          </div>
          <div className={styles.dryers}>
            <div className={styles.washer_header}>
              <p className={styles.washer_header_left}>Dryers</p>
              <p className={styles.washer_header_right}>
                {freeDevices.dryers}/3
              </p>
            </div>
            {devices &&
              devices
                .filter((d) => d.type == "dryer")
                .sort((a, b) => a.id - b.id)
                .map((d) => (
                  <div
                    className={styles.item}
                    key={d.id}
                    onClick={() => setInfoDevice(d.id)}
                  >
                    <div className={styles.itemLabel}>
                      <span>Dryer {d.number}</span>
                      {pendingDeviceIds.has(d.id) && (
                        <span className={styles.pendingBadge}>
                          <MdSync className={styles.pendingIcon} />
                          Pending sync
                        </span>
                      )}
                    </div>
                    <Countdown time={d.end_date} />
                  </div>
                ))}
          </div>
        </div>
        <InstructionsCard />
      </div>
      <TimerModal
        deviceID={updateDevice}
        setIsOpen={setUpdateDevice}
        refresh={refresh}
      />
      <InfoModal deviceID={infoDevice} setIsOpen={setInfoDevice} />
      <CustomSnackbar />
      <InstallNudge />
      <QRScanner
        isOpen={cameraOpen}
        setIsOpen={setCameraOpen}
        setChosenDevice={setUpdateDevice}
      />
    </>
  );
};

export default MainPage;
