import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { LocaleContext } from "../../context/LocaleContext";
import styles from "./eventcarousel.module.css";

interface EventCarouselProps {
  slides: React.ReactNode[];
}

// Distance between two slides' left edges: one slide + the track's gap.
function slideStep(track: HTMLElement): number {
  const first = track.firstElementChild as HTMLElement | null;
  if (!first) return 0;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  return first.offsetWidth + gap;
}

// Horizontal, swipeable row of event cards. Built on native scrolling with
// scroll-snap (so touch swiping, momentum and trackpads all just work) -
// the arrows and dots only drive/follow that scroll position.
const EventCarousel = ({ slides }: EventCarouselProps) => {
  const { t } = useContext(LocaleContext);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const count = slides.length;

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const step = track ? slideStep(track) : 0;
      if (!track || !step) return;
      const clamped = Math.max(0, Math.min(index, count - 1));
      track.scrollTo({ left: clamped * step, behavior: "smooth" });
    },
    [count],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const step = slideStep(track);
      if (step) setActiveIndex(Math.round(track.scrollLeft / step));
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
    // count: the track only exists once there are slides (see the early
    // return below), so re-attach when that changes.
  }, [count]);

  if (count === 0) return null;

  return (
    <div className={styles.carousel}>
      <div className={styles.stage}>
        {/* Over the card's edges, vertically centred - same placement as the
            gallery carousel. Invisible at either end (nothing to go to). */}
        {count > 1 && (
          <button
            type="button"
            className={`${styles.nav} ${styles.prev}`}
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label={t("events.prevAria")}
          >
            <FaChevronLeft />
          </button>
        )}

        <div className={styles.track} ref={trackRef}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={styles.slide}
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${count}`}
            >
              {slide}
            </div>
          ))}
        </div>

        {count > 1 && (
          <button
            type="button"
            className={`${styles.nav} ${styles.next}`}
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === count - 1}
            aria-label={t("events.nextAria")}
          >
            <FaChevronRight />
          </button>
        )}
      </div>

      {count > 1 && (
        <div className={styles.dots}>
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
              onClick={() => goTo(index)}
              aria-label={`${t("events.goToAria")} ${index + 1}`}
              aria-current={index === activeIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventCarousel;
