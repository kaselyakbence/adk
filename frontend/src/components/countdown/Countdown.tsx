import ReactCountdown from "react-countdown";

const Countdown = () => {
  return (
    <ReactCountdown
      date={Date.now() + 10000000}
      renderer={({ hours, minutes, seconds }) => (
        <span>
          {hours}:{minutes}:{seconds}
        </span>
      )}
    />
  );
};

export default Countdown;
