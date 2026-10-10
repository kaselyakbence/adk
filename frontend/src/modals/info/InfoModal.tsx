import { useContext, useMemo } from "react";
import ReactModal from "react-modal";
import styles from "./infomodal.module.css";
import { DevicesContext } from "../../context/DevicesContext";
import Countdown from "../../components/countdown/Countdown";
import { LocaleContext } from "../../context/LocaleContext";
import { MdBuild } from "react-icons/md";
import { formatTimeAgo } from "../../lib/relativeTime";

interface InfoModalProps {
  deviceID: number | null;
  setIsOpen: React.Dispatch<React.SetStateAction<number | null>>;
}

const InfoModal = ({ deviceID, setIsOpen }: InfoModalProps) => {
  const device = useContext(DevicesContext).find((d) => d.id == deviceID);
  const { locale, t } = useContext(LocaleContext);

  const isAvailable = useMemo(() => {
    if (!device) return false;
    const now = new Date();
    return (
      !device.broken && !!device.end_date && new Date(device.end_date) < now
    );
  }, [device]);

  return (
    <ReactModal
      isOpen={!!device}
      onRequestClose={() => setIsOpen(null)}
      contentLabel="Info Modal"
      ariaHideApp={false}
      closeTimeoutMS={200}
      className={{
        base: styles.modalBox,
        afterOpen: styles.modalBoxAfterOpen,
        beforeClose: styles.modalBoxBeforeClose,
      }}
      overlayClassName={{
        base: styles.overlay,
        afterOpen: styles.overlayAfterOpen,
        beforeClose: styles.overlayBeforeClose,
      }}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {device ? (
        <>
          <div className={styles.header}>
            <h2 className={isAvailable ? styles.available : ""}>
              {device?.type === "washer" ? t("infoModal.washer") : t("infoModal.dryer")}{" "}
              {device.number}
            </h2>
            {/* Broken replaces the countdown/availability display. */}
            {device.broken ? (
              <span className={styles.brokenBadge}>
                <MdBuild aria-hidden />
                {t("washing.brokenBadge")}
              </span>
            ) : (
              <Countdown time={device.end_date} />
            )}
          </div>
          {/* The headline when broken - but the booking rows below stay, as
              secondary context: a machine can break mid-cycle, and whoever's
              load it is still needs to know when it was due to finish. */}
          {device.broken && (
            <div className={styles.brokenNotice}>
              <p className={styles.brokenHeadline}>
                {t("infoModal.brokenHeadline")}
                {device.brokenAt &&
                  ` ${formatTimeAgo(device.brokenAt, locale)}`}
              </p>
              <p className={styles.brokenReason}>
                {device.brokenReason ? (
                  <>
                    {t("infoModal.brokenReason")} {device.brokenReason}
                  </>
                ) : (
                  t("infoModal.noReason")
                )}
              </p>
            </div>
          )}
          <p>
            {t("infoModal.lastStarted")}{" "}
            {device.start_date &&
              new Date(device.start_date).toLocaleTimeString()}
          </p>
          <p>
            {isAvailable ? t("infoModal.ended") : t("infoModal.endsAt")}{" "}
            {device.end_date && new Date(device.end_date).toLocaleTimeString()}
          </p>
          <p>
            {t("infoModal.startedBy")}{" "}
            {device.owner ? device.owner : t("infoModal.unknown")}
          </p>
          <p></p>
        </>
      ) : (
        <></>
      )}
    </ReactModal>
  );
};

export default InfoModal;
