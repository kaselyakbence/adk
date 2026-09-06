"use client";
import { useContext } from "react";
import styles from "./page.module.css";
import welcomeImg from "../../../assets/pictures/welcome.png";
import Navbar from "../../../components/navbar/NavBar";
import Astronaut from "../../../components/astronaut/Astronaut";
import Carousel from "../../../components/carousel/Carousel";
import { LocaleContext } from "../../../context/LocaleContext";

export default function Page() {
  const { t } = useContext(LocaleContext);

  const images = Array.from({ length: 10 }, (_, index) => ({
    src: welcomeImg.src,
    alt: `${t("gallery.imageAlt")} ${index + 1}`,
  }));

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
