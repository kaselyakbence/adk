import { useContext } from "react";
import {
  FaBell,
  FaMapMarkerAlt,
  FaRegBell,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { LocaleContext } from "../../context/LocaleContext";
import { EventItem } from "../../types/types";
import styles from "./eventpost.module.css";

// Rotated by event id so neighbouring placeholder posters don't all look
// identical.
const POSTER_VARIANTS = [
  styles.posterBlue,
  styles.posterPurple,
  styles.posterGreen,
  styles.posterCoral,
];

interface EventPostProps {
  event: EventItem;
  past: boolean;
  reminded: boolean;
  reminderBusy: boolean;
  onToggleReminder: (event: EventItem) => void;
  // Stretch to the parent's height (poster takes the slack) - used by the
  // upcoming carousel. See .fill in eventpost.module.css.
  fill?: boolean;
}

// Laid out like a post in the dorm's Instagram feed (which this page is
// meant to extend/replace): square poster, then title + reminder, the
// details and the caption.
const EventPost = ({
  event,
  past,
  reminded,
  reminderBusy,
  onToggleReminder,
  fill = false,
}: EventPostProps) => {
  const { locale, t } = useContext(LocaleContext);
  const intlLocale = locale === "de" ? "de-DE" : "en-GB";

  const start = new Date(event.startDate);
  const showYear = start.getFullYear() !== new Date().getFullYear();

  const dateLabel = start.toLocaleDateString(intlLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: showYear ? "numeric" : undefined,
  });
  const timeLabel = start.toLocaleTimeString(intlLocale, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const postedLabel = new Date(event.createdAt).toLocaleDateString(intlLocale, {
    day: "numeric",
    month: "long",
  });

  const variant = POSTER_VARIANTS[event.id % POSTER_VARIANTS.length];

  return (
    <article
      className={`${styles.post} ${past ? styles.past : ""} ${fill ? styles.fill : ""}`}
    >
      {event.imageUrl ? (
        <img src={event.imageUrl} alt={event.title} className={styles.poster} />
      ) : (
        <div
          className={`${styles.poster} ${styles.placeholder} ${variant}`}
          role="img"
          aria-label={event.title}
        >
          <span className={styles.posterDate}>
            <span className={styles.posterDay}>{start.getDate()}</span>
            <span className={styles.posterMonth}>
              {start.toLocaleDateString(intlLocale, { month: "short" })}
            </span>
          </span>
          <span className={styles.posterTitle}>{event.title}</span>
          <span className={styles.posterTag}>{t("events.placeholderImage")}</span>
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{event.title}</h3>
          {!past && (
            <button
              type="button"
              className={`${styles.remindButton} ${reminded ? styles.reminded : ""}`}
              onClick={() => onToggleReminder(event)}
              disabled={reminderBusy}
              aria-pressed={reminded}
            >
              {reminded ? <FaBell aria-hidden /> : <FaRegBell aria-hidden />}
              {reminded ? t("events.reminderOn") : t("events.remindMe")}
            </button>
          )}
        </div>

        <p className={styles.meta}>
          <FaRegCalendarAlt className={styles.metaIcon} aria-hidden />
          <span>
            {dateLabel} · {timeLabel}
          </span>
        </p>
        {event.location && (
          <p className={styles.meta}>
            <FaMapMarkerAlt className={styles.metaIcon} aria-hidden />
            <span>{event.location}</span>
          </p>
        )}

        {event.description && (
          <p className={styles.caption}>
            <span className={styles.captionAccount}>ADK 20</span>{" "}
            {event.description}
          </p>
        )}

        <p className={styles.posted}>{postedLabel}</p>
      </div>
    </article>
  );
};

export default EventPost;
