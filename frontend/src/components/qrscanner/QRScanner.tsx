import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import styles from "./qrscanner.module.css";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useContext } from "react";
import { SnackbarContext } from "../../context/SnackbarContext";
import { LocaleContext } from "../../context/LocaleContext";

interface QRCodeScanner {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setChosenDevice: React.Dispatch<React.SetStateAction<null | number>>;
}

const QRScanner = ({ isOpen, setIsOpen, setChosenDevice }: QRCodeScanner) => {
  const { messages, setMessages } = useContext(SnackbarContext);
  const { t } = useContext(LocaleContext);

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
          { status: "error", message: t("snackbar.scanError") },
        ]);
    }
  };

  if (isOpen)
    return (
      <>
        <button
          type="button"
          className={styles.circle}
          onClick={() => setIsOpen(false)}
          aria-label={t("qrscanner.closeAria")}
        >
          <IoMdCloseCircleOutline className={styles.icon} />
        </button>
        <div className={styles.scannerwrapper} onClick={() => setIsOpen(false)}>
          <div>
            <Scanner onScan={handleScan} scanDelay={1000} />
          </div>
        </div>
      </>
    );
};

export default QRScanner;
