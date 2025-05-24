import { useContext, useMemo } from "react";
import ReactModal from "react-modal";
import styles from "./infomodal.module.css";
import { DevicesContext } from "../../context/DevicesContext";
import Countdown from "../../components/countdown/Countdown";

interface InfoModalProps {
  deviceID: number | null;
  setIsOpen: React.Dispatch<React.SetStateAction<number | null>>;
}

const InfoModal = ({ deviceID, setIsOpen }: InfoModalProps) => {
  const device = useContext(DevicesContext).find((d) => d.id == deviceID);

  const isAvailable = useMemo(() => {
    if (!device) return false;
    const now = new Date();
    return !!device.end_date && new Date(device.end_date) < now;
  }, [device]);

  return (
    <ReactModal
      isOpen={!!device}
      onRequestClose={() => setIsOpen(null)}
      contentLabel="Info Modal"
      ariaHideApp={false}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {device ? (
        <>
          <div className={styles.header}>
            <h2 className={isAvailable ? styles.available : ""}>
              {device?.type === "washer" ? "Washer" : "Dryer"} {device.number}
            </h2>
            <Countdown time={device.end_date} />
          </div>
          <p>
            Last started:{" "}
            {device.start_date &&
              new Date(device.start_date).toLocaleTimeString()}
          </p>
          <p>
            Ended:{" "}
            {device.end_date && new Date(device.end_date).toLocaleTimeString()}
          </p>
          <p>Started by: {device.owner ? device.owner : "Unknown"}</p>
          <p></p>
        </>
      ) : (
        <></>
      )}
    </ReactModal>
  );
};

export default InfoModal;
