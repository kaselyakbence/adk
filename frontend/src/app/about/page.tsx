import {
  FaClock,
  FaInfoCircle,
  FaRegCalendarAlt,
  FaUsers,
} from "react-icons/fa";
import Astronaut from "../../components/astronaut/Astronaut";
import Navbar from "../../components/navbar/NavBar";
import shared from "../../styles/shared.module.css";
import styles from "./page.module.css";

export default function Page() {
  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.container}>
        <section className={styles.card}>
          <h1 className={shared.heading}>
            <FaInfoCircle /> About the SSV
          </h1>
          <p className={shared.text}>
            SSV is ADKs self-administration that exists to improve the
            student life in the dormitory. We are using our means to
            organize parties in the dormitory, video evenings, sports, trips
            and cultural offers. In addition, we are running the laundry and
            selling the necessary cards, renting out games and providing a
            possiblity for guests to stay in our guest rooms.
          </p>

          <h2 className={shared.subheading}>
            <FaUsers /> How can I participate?
          </h2>
          <p className={shared.text}>
            You can join us by just coming to the next SSV meeting! There are
            lots of ways how you can participate.
          </p>

          <h2 className={shared.subheading}>
            <FaRegCalendarAlt /> SSV meetings and minutes
          </h2>
          <p className={shared.text}>
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
          <h1 className={shared.heading}>
            <FaClock /> Office Hours
          </h1>

          <div className={styles.hours}>
            <div className={shared.infoBox}>
              <FaClock className={shared.infoBoxIcon} />
              <div>
                <p className={shared.infoBoxLabel}>Tuesday</p>
                <p className={shared.infoBoxSub}>9 PM &ndash; 10 PM</p>
              </div>
            </div>
            <div className={shared.infoBox}>
              <FaClock className={shared.infoBoxIcon} />
              <div>
                <p className={shared.infoBoxLabel}>Thursday</p>
                <p className={shared.infoBoxSub}>9 PM &ndash; 10 PM</p>
              </div>
            </div>
          </div>

          <p className={shared.text}>In the office of the SSV, you can</p>
          <ul className={styles.list}>
            <li>
              get a card for the washing machines, recharge it or give it back
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

          <p className={shared.text}>
            Just visit us in the SSV office at these hours. It is situated in
            house 15, floor 0.
          </p>
          <p className={shared.text}>
            For changes, please check our{" "}
            <span className={shared.link}>facebook page</span> regularly.
          </p>
        </section>
      </div>
      <Astronaut />
    </main>
  );
}
