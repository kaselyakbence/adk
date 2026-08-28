import AstronautSVG from "../../assets/logo.svg";
import styles from "./astronaut.module.css";

const Astronaut = () => {
  return (
    <img src={AstronautSVG.src} className={styles.astronaut} alt="Astronaut" />
  );
};

export default Astronaut;
