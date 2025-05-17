import { useContext, useMemo } from "react";
import ReactModal from "react-modal";
import styles from "./infomodal.module.css";
import { DevicesContext } from "../../context/DevicesContext";

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
      <h2 className={isAvailable ? styles.available : ""}>
        {device?.type === "washer" ? "Washer" : "Dryer"} {device?.number}
      </h2>
      <p>This is a basic modal component.</p>
    </ReactModal>
  );
};

export default InfoModal;
