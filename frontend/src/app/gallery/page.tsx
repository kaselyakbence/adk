import styles from "./page.module.css";
import welcomeImg from "../../assets/pictures/welcome.png";
import Navbar from "../../components/navbar/NavBar";
import Astronaut from "../../components/astronaut/Astronaut";
import Carousel from "../../components/carousel/Carousel";

const images = Array.from({ length: 10 }, (_, index) => ({
  src: welcomeImg.src,
  alt: `Dormitory photo ${index + 1}`,
}));

export default function Page() {
  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.carouselWrapper}>
          <Carousel images={images} />
        </div>
      </div>
      <Astronaut />
    </main>
  );
}
