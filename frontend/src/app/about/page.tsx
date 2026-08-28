import {
  FaClock,
  FaInfoCircle,
  FaRegCalendarAlt,
  FaUsers,
} from "react-icons/fa";
import Astronaut from "../../components/astronaut/Astronaut";
import Navbar from "../../components/navbar/NavBar";
import styles from "./page.module.css";

export default function Page() {
  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.container}>
        <section className={styles.card}>
          <h1 className={`${styles.heading} ${styles.headingGreen}`}>
            <FaInfoCircle /> About the SSV
          </h1>
          <p className={styles.text}>
            SSV is an abbreviation for &quot;Studentische
            Selbstverwaltung&quot;, that means student self-administration.
            The SSV of the AdK 20 exists to improve the student life in the
            dormitory.
          </p>
          <p className={styles.text}>
            We are using our means to organize parties in the dormitory,
            video evenings, sports (like swimming and fitness), trips and
            cultural offers. In addition, we are running the laundry and
            selling the necessary cards, renting out games and providing a
            possiblity for guests to stay in our guest rooms.
          </p>

          <h2 className={`${styles.subheading} ${styles.headingCyan}`}>
            <FaUsers /> How can I participate?
          </h2>
          <p className={styles.text}>
            You can join us by just coming to the next SSV meeting! There are
            lots of ways how you can participate.
          </p>

          <h2 className={`${styles.subheading} ${styles.headingCyan}`}>
            <FaRegCalendarAlt /> SSV meetings and minutes
          </h2>
          <p className={styles.text}>
            You can have a look at the minutes of the last meeting in the SSV
            office at the office opening hours.
          </p>
          <p className={styles.callout}>
            The meetings always take place on the first Monday of every
            month, at 8 PM in the Keller (house 15 in the basement). You are
            invited to come and join us!
          </p>
        </section>

        <section className={styles.card}>
          <h1 className={`${styles.heading} ${styles.headingGreen}`}>
            <FaClock /> Office Hours
          </h1>

          <div className={styles.hours}>
            <div className={styles.hoursItem}>
              <span className={styles.hoursDay}>Tuesday</span>
              <span className={styles.hoursTime}>9 PM &ndash; 10 PM</span>
            </div>
            <div className={styles.hoursItem}>
              <span className={styles.hoursDay}>Thursday</span>
              <span className={styles.hoursTime}>9 PM &ndash; 10 PM</span>
            </div>
          </div>

          <p className={styles.text}>In the office of the SSV, you can</p>
          <ul className={styles.list}>
            <li>
              get a card for the washing machines, recharge it or give it
              back
            </li>
            <li>rent a guest room</li>
            <li>get a key for the sports room</li>
            <li>lend out games</li>
            <li>ask any questions concerning the SSV</li>
            <li>
              find a contact person for problems you might encounter in the
              dormitory
            </li>
            <li>and much more :)</li>
          </ul>

          <p className={styles.text}>
            Just visit us in the SSV office at these hours. It is situated in
            house 15, floor 0.
          </p>
          <p className={styles.text}>
            For changes, please check our{" "}
            <span className={styles.link}>facebook page</span> regularly.
          </p>
        </section>
      </div>
      <Astronaut />
    </main>
  );
}
