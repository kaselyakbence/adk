import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import styles from "./qrscanner.module.css";
import { IoMdCheckmarkCircle, IoMdCloseCircleOutline } from "react-icons/io";
import { useContext, useState } from "react";
import { SnackbarContext } from "../../context/SnackbarContext";
import { LocaleContext } from "../../context/LocaleContext";

const CONFIRM_DISPLAY_MS = 500;

interface QRCodeScanner {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setChosenDevice: React.Dispatch<React.SetStateAction<null | number>>;
}

const QRScanner = ({ isOpen, setIsOpen, setChosenDevice }: QRCodeScanner) => {
  const { messages, setMessages } = useContext(SnackbarContext);
  const { t } = useContext(LocaleContext);
  const [confirmed, setConfirmed] = useState(false);

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (confirmed) return;

    try {
      const val = JSON.parse(detectedCodes[0].rawValue);
      if (val.id) {
        setConfirmed(true);
        setTimeout(() => {
          setChosenDevice(val.id);
          setIsOpen(false);
          setConfirmed(false);
        }, CONFIRM_DISPLAY_MS);
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
        {confirmed && (
          <div className={styles.confirmOverlay}>
            <IoMdCheckmarkCircle className={styles.confirmIcon} />
          </div>
        )}
      </>
    );
};

export default QRScanner;
