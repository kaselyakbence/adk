import { useContext, useEffect, useState } from "react";
import type { ReactElement } from "react";
import ReactCountdown from "react-countdown";
import styles from "./countdown.module.css";
import { LocaleContext } from "../../context/LocaleContext";

const Countdown = ({ time }: { time: string | undefined }): ReactElement => {
  const { t } = useContext(LocaleContext);
  // ReactCountdown ticks internally on its own clock, but nothing told this
  // component to re-render once it reached zero - it'd just sit there
  // showing zero until the parent happened to re-render for an unrelated
  // reason (the 30s device poll). onComplete lets it flip to "Available"
  // itself, the moment it's actually done, independent of that poll.
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(false);
  }, [time]);

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

  if (completed || new Date() > date)
    return <span className={styles.available}>{t("countdown.available")}</span>;

  return (
    <ReactCountdown date={date} daysInHours onComplete={() => setCompleted(true)} />
  );
};

export default Countdown;
