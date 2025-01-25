import ReactCountdown from "react-countdown";

const Countdown = () => {
  return (
    <ReactCountdown
      date={Date.now() + 100000}
      renderer={({ hours, minutes, seconds }) => (
        <span>
          {hours}:{minutes}:{seconds}
        </span>
      )}
    />
  );
};

export default Countdown;
