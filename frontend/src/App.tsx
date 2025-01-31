import MainPage from "./components/MainPage";
import SpaceshipSVG from "./assets/logo.svg";
import styles from "./app.module.css";

function App() {
  return (
    <>
      <MainPage />
      <img src={SpaceshipSVG} className={styles.img} alt="Spaceship SVG" />
    </>
  );
}

export default App;
