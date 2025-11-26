import { useEffect, useRef, useState } from "react";

interface UseCarouselProps {
  children: React.ReactNode[];
  autoSlide: boolean;
  autoSlideInterval: number;
  onSlideChangeEnd?: () => void;
}

export const useCarousel = ({ children, autoSlide, autoSlideInterval, onSlideChangeEnd }: UseCarouselProps) => {
  const length = children.length;
  const extendedSlides = [children[length - 1], ...children, children[0]];

  const [current, setCurrent] = useState(1);
  const [transition, setTransition] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearExistingInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startAutoSlide = () => {
    if (!autoSlide) return;
    clearExistingInterval();
    intervalRef.current = setInterval(() => {
      if (transition) {
        next();
      }
    }, autoSlideInterval);
  };

  const next = () => {
    setCurrent((prev) => {
      const nextIndex = prev + 1;
      return nextIndex > length + 1 ? length + 1 : nextIndex;
    });
    startAutoSlide();
  };

  const prev = () => {
    setCurrent((prev) => {
      const nextIndex = prev - 1;
      return nextIndex < 0 ? 0 : nextIndex;
    });
    startAutoSlide();
  };

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(length + 1, index + 1));
    setCurrent(clamped);
    startAutoSlide();
  };

  const handleTransitionEnd = () => {
    if (current === extendedSlides.length - 1) {
      setTransition(false);
      setCurrent(1);
    } else if (current === 0) {
      setTransition(false);
      setCurrent(extendedSlides.length - 2);
    }
    onSlideChangeEnd?.();
  };

  useEffect(() => {
    startAutoSlide();
    return () => clearExistingInterval();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSlide, autoSlideInterval]);

  useEffect(() => {
    if (!transition) {
      const frame = requestAnimationFrame(() => {
        const timeout = setTimeout(() => {
          setTransition(true);
        }, 32); // 1 frame 정도의 여유

        return () => {
          clearTimeout(timeout);
        };
      });

      return () => {
        cancelAnimationFrame(frame);
      };
    }
  }, [transition]);

  return {
    current,
    transition,
    extendedSlides,
    next,
    prev,
    goTo,
    handleTransitionEnd,
    length,
  };
};
