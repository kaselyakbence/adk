"use client";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Astronaut from "../../../components/astronaut/Astronaut";
import Navbar from "../../../components/navbar/NavBar";
import EventPost from "../../../components/events/EventPost";
import EventCarousel from "../../../components/events/EventCarousel";
import CustomSnackbar from "../../../components/snackbar/CustomSnackbar";
import { LocaleContext } from "../../../context/LocaleContext";
import { SnackbarContext } from "../../../context/SnackbarContext";
import {
  getStoredReminders,
  setStoredReminders,
} from "../../../lib/eventReminders";
import {
  subscribeToEventReminder,
  unsubscribeFromEventReminder,
} from "../../../lib/push";
import { API_URL } from "../../../secrets";
import { EventItem, SnackbarItem } from "../../../types/types";
import styles from "./page.module.css";

export default function Page() {
  const { t } = useContext(LocaleContext);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [fetchedAt, setFetchedAt] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pastOpen, setPastOpen] = useState(false);
  const [reminders, setReminders] = useState<Set<number>>(new Set());
  const [busyId, setBusyId] = useState<number | null>(null);
  const [snackbarMessages, setSnackbarMessages] = useState<SnackbarItem[]>([]);

  const notify = useCallback(
    (status: SnackbarItem["status"], key: string) =>
      setSnackbarMessages((prev) => [...prev, { status, message: t(key) }]),
    [t],
  );

  useEffect(() => {
    // localStorage only exists client-side - read after mount so the first
    // render matches the statically exported HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReminders(getStoredReminders());

    fetch(`${API_URL}/event/all`)
      .then((res) => res.json())
      .then((data: EventItem[]) => {
        setEvents(data);
        setFetchedAt(Date.now());
      })
      .catch(() => notify("error", "snackbar.connectionError"))
      .finally(() => setLoading(false));
  }, [notify]);

  // Grouped against the moment the list arrived rather than "now" at render
  // time, which keeps render pure; a page left open for hours just groups
  // slightly stale until the next visit.
  const groups = useMemo(() => {
    const now = fetchedAt;
    const upcoming: EventItem[] = [];
    const past: EventItem[] = [];

    for (const event of events) {
      const start = new Date(event.startDate).getTime();
      // No end date = counts as over once it's started.
      const end = event.endDate ? new Date(event.endDate).getTime() : start;

      if (end < now) past.push(event);
      else upcoming.push(event);
    }

    // Backend sorts ascending; most recent first reads better for past ones.
    past.reverse();
    return { upcoming, past };
  }, [events, fetchedAt]);

  const toggleReminder = useCallback(
    async (event: EventItem) => {
      setBusyId(event.id);
      const next = new Set(reminders);

      if (reminders.has(event.id)) {
        if (await unsubscribeFromEventReminder(event.id)) {
          next.delete(event.id);
          notify("info", "events.reminderRemoved");
        } else {
          notify("error", "events.reminderError");
        }
      } else {
        const result = await subscribeToEventReminder(event.id);
        if (result === "ok") {
          next.add(event.id);
          notify("success", "events.reminderSet");
        } else if (result === "unsupported") {
          notify("info", "events.reminderUnsupported");
        } else if (result === "denied") {
          notify("info", "events.reminderDenied");
        } else {
          notify("error", "events.reminderError");
        }
      }

      setReminders(next);
      setStoredReminders(next);
      setBusyId(null);
    },
    [reminders, notify],
  );

  const renderPosts = (list: EventItem[], past: boolean) =>
    list.map((event) => (
      <EventPost
        key={event.id}
        event={event}
        past={past}
        fill={!past}
        reminded={reminders.has(event.id)}
        reminderBusy={busyId === event.id}
        onToggleReminder={toggleReminder}
      />
    ));

  return (
    <SnackbarContext.Provider
      value={{ messages: snackbarMessages, setMessages: setSnackbarMessages }}
    >
      <main className={styles.main}>
        <Navbar />
        <div className={styles.feed}>
          {/* Upcoming is a horizontal carousel, Past a vertical list that
              scrolls on its own. Narrow screens: Past is a collapsible bar,
              and opening it gives it the whole screen (upcoming hides - not
              unmounted, so the carousel keeps its position). Wide screens:
              both side by side, Past always expanded. */}
          <section
            className={`${styles.panel} ${styles.upcomingPanel} ${pastOpen ? styles.hiddenNarrow : ""}`}
          >
            <h1 className={styles.panelTitle}>
              {t("events.upcoming")}
              {!loading && ` (${groups.upcoming.length})`}
            </h1>
            <div className={styles.upcomingArea}>
              {loading ? (
                <div className={styles.skeleton} />
              ) : groups.upcoming.length > 0 ? (
                <EventCarousel slides={renderPosts(groups.upcoming, false)} />
              ) : (
                <p className={styles.empty}>{t("events.noUpcoming")}</p>
              )}
            </div>
          </section>

          {!loading && groups.past.length > 0 && (
            <section
              className={`${styles.panel} ${pastOpen ? styles.pastPanelOpen : ""}`}
            >
              <h2 className={`${styles.panelTitle} ${styles.wideOnly}`}>
                {t("events.past")} ({groups.past.length})
              </h2>
              <button
                type="button"
                className={`${styles.panelHeader} ${styles.pastToggle} ${styles.narrowOnly} ${pastOpen ? styles.pastToggleOpen : ""}`}
                onClick={() => setPastOpen((open) => !open)}
                aria-expanded={pastOpen}
              >
                <span>
                  {t("events.past")} ({groups.past.length})
                </span>
                <FaChevronDown className={styles.chevron} aria-hidden />
              </button>
              <div
                className={`${styles.scroll} ${pastOpen ? "" : styles.pastCollapsed}`}
              >
                {renderPosts(groups.past, true)}
              </div>
            </section>
          )}
        </div>
        <CustomSnackbar />
        <Astronaut />
      </main>
    </SnackbarContext.Provider>
  );
}
