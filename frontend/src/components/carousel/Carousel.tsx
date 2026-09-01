"use client";
import { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./carousel.module.css";

const SWIPE_THRESHOLD = 40;

interface CarouselImage {
  src: string;
  alt: string;
}

interface CarouselProps {
  images: CarouselImage[];
}

const Carousel = ({ images }: CarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const count = images.length;

  const goTo = (index: number, dir: 1 | -1) => {
    setDirection(dir);
    setActiveIndex(((index % count) + count) % count);
  };

  const prevIndex = (activeIndex - 1 + count) % count;
  const nextIndex = (activeIndex + 1) % count;
  const directionClass = direction === 1 ? styles.slideNext : styles.slidePrev;

  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = event.changedTouches[0].clientY - touchStartY.current;
    touchStartY.current = null;

    if (deltaY < -SWIPE_THRESHOLD) {
      goTo(activeIndex + 1, 1);
    } else if (deltaY > SWIPE_THRESHOLD) {
      goTo(activeIndex - 1, -1);
    }
  };

  return (
    <div className={styles.carousel}>
      <div className={styles.stage}>
        <button
          className={`${styles.nav} ${styles.prev}`}
          onClick={() => goTo(activeIndex - 1, -1)}
          aria-label="Previous photo"
        >
          <FaChevronLeft />
        </button>

        <div
          className={styles.track}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.sideSlide} onClick={() => goTo(prevIndex, -1)}>
            <img
              key={prevIndex}
              src={images[prevIndex].src}
              alt={images[prevIndex].alt}
              className={`${styles.sideImage} ${directionClass}`}
            />
          </div>

          <div className={styles.mainSlide}>
            <img
              key={activeIndex}
              src={images[activeIndex].src}
              alt={images[activeIndex].alt}
              className={`${styles.mainImage} ${directionClass}`}
            />
          </div>

          <div className={styles.sideSlide} onClick={() => goTo(nextIndex, 1)}>
            <img
              key={nextIndex}
              src={images[nextIndex].src}
              alt={images[nextIndex].alt}
              className={`${styles.sideImage} ${directionClass}`}
            />
          </div>
        </div>

        <button
          className={`${styles.nav} ${styles.next}`}
          onClick={() => goTo(activeIndex + 1, 1)}
          aria-label="Next photo"
        >
          <FaChevronRight />
        </button>
      </div>

      <div className={styles.dots}>
        {images.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
            onClick={() => goTo(index, index > activeIndex ? 1 : -1)}
            aria-label={`Go to photo ${index + 1}`}
            aria-current={index === activeIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
