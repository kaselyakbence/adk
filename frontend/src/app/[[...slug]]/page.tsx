import styles from "./page.module.css";
import welcomeImg from "../../assets/pictures/welcome.png";
import Navbar from "../../components/navbar/NavBar";
import Astronaut from "../../components/astronaut/Astronaut";

// This page never reads `params.slug` - the catch-all only exists so this
// content renders at "/". Static export needs the exact path list, so only
// the root (empty slug) is pre-rendered.
export function generateStaticParams() {
  return [{ slug: [] }];
}

export default function Page() {
  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.content}>
        <h1 className={styles.welcomeHeader}>Welcome to ADK</h1>
        <p className={styles.welcomeText}>
          Welcome to the new homepage of the SSV of Allee der Kosmonauten 20!
          Here you can find information about the dormitory and of course
          about the offers of the SSV.
        </p>
        <img
          src={welcomeImg.src}
          alt="Welcome"
          className={styles.welcomeImage}
        />
      </div>
      <Astronaut />
    </main>
  );
}
