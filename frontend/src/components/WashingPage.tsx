import { useContext, useMemo, useState } from "react";
import { DevicesContext } from "../context/DevicesContext";
import styles from "./washingpage.module.css";
import Countdown from "./countdown/Countdown";
import { MdCameraswitch } from "react-icons/md";
import TimerModal from "../modals/timer/TimerModal";
import CustomSnackbar from "./snackbar/CustomSnackbar";
import QRScanner from "./qrscanner/QRScanner";
import InfoModal from "../modals/info/InfoModal";

interface MainPageProps {
  refresh: () => Promise<void>;
}

const MainPage = ({ refresh }: MainPageProps) => {
  const [updateDevice, setUpdateDevice] = useState<number | null>(null);
  const [infoDevice, setInfoDevice] = useState<number | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const devices = useContext(DevicesContext);

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
      <div className={styles.header}>
        <p className={styles.header_text}>ADK Washing</p>
        <div className={styles.circle} onClick={() => setCameraOpen(true)}>
          <MdCameraswitch className={styles.icon} />
        </div>
      </div>
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
                  <div>Washer {d.number}</div>
                  <Countdown time={d.end_date} />
                </div>
              ))}
        </div>
        <div className={styles.dryers}>
          <div className={styles.washer_header}>
            <p className={styles.washer_header_left}>Dryers</p>
            <p className={styles.washer_header_right}>{freeDevices.dryers}/3</p>
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
                  <div>Dryer {d.number}</div>
                  <Countdown time={d.end_date} />
                </div>
              ))}
        </div>
      </div>
      <TimerModal
        deviceID={updateDevice}
        setIsOpen={setUpdateDevice}
        refresh={refresh}
      />
      <InfoModal deviceID={infoDevice} setIsOpen={setInfoDevice} />
      <CustomSnackbar />
      <QRScanner
        isOpen={cameraOpen}
        setIsOpen={setCameraOpen}
        setChosenDevice={setUpdateDevice}
      />
    </>
  );
};

export default MainPage;
