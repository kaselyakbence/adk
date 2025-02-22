import ReactCountdown from "react-countdown";
import styles from "./countdown.module.css";

const Countdown = ({ time }: { time: string | undefined }): JSX.Element => {
  const now = new Date();

  if (!time)
    return (
      <div className={styles.loading}>
        <span>L</span>
        <span>o</span>
        <span>a</span>
        <span>d</span>
        <span>i</span>
        <span>n</span>
        <span>g</span>
      </div>
    );

  const date = new Date(time);

  if (now > date) return <span className={styles.available}>Available</span>;

  return <ReactCountdown date={date} daysInHours />;
};

export default Countdown;
