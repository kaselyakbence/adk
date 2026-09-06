import { useContext } from "react";
import type { ReactElement } from "react";
import ReactCountdown from "react-countdown";
import styles from "./countdown.module.css";
import { LocaleContext } from "../../context/LocaleContext";

const Countdown = ({ time }: { time: string | undefined }): ReactElement => {
  const { t } = useContext(LocaleContext);
  const now = new Date();

  if (!time)
    return (
      <div className={styles.loading}>
        {t("countdown.loading")
          .split("")
          .map((char, index) => (
            <span key={index}>{char}</span>
          ))}
      </div>
    );

  const date = new Date(time);

  if (now > date)
    return <span className={styles.available}>{t("countdown.available")}</span>;

  return <ReactCountdown date={date} daysInHours />;
};

export default Countdown;
