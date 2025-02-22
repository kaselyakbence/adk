import ReactCountdown from "react-countdown";

const Countdown = ({ time }: { time: string | undefined }): JSX.Element => {
  const now = new Date();

  if (!time) return <span>Loading</span>;

  const date = new Date(time);

  if (now > date) return <span>Available</span>;

  return (
    <ReactCountdown
      date={date}
      renderer={({ hours, minutes, seconds }) => (
        <span>
          {hours}:{minutes}:{seconds}
        </span>
      )}
    />
  );
};

export default Countdown;
