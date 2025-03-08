import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import styles from "./qrscanner.module.css";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useContext } from "react";
import { SnackbarContext } from "../../context/SnackbarContext";

interface QRCodeScanner {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setChosenDevice: React.Dispatch<React.SetStateAction<null | number>>;
}

const QRScanner = ({ isOpen, setIsOpen, setChosenDevice }: QRCodeScanner) => {
  const { messages, setMessages } = useContext(SnackbarContext);

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    try {
      const val = JSON.parse(detectedCodes[0].rawValue);
      if (val.id) {
        setChosenDevice(val.id);
        setIsOpen(false);
      }
    } catch (_) {
      if (setMessages)
        setMessages([
          ...messages,
          { status: "error", message: "Unsuccessfull scan" },
        ]);
    }
  };

  if (isOpen)
    return (
      <>
        <div className={styles.circle} onClick={() => setIsOpen(false)}>
          <IoMdCloseCircleOutline className={styles.icon} />
        </div>
        <div className={styles.scannerwrapper} onClick={() => setIsOpen(false)}>
          <div>
            <Scanner onScan={handleScan} scanDelay={1000} />
          </div>
        </div>
      </>
    );
};

export default QRScanner;
