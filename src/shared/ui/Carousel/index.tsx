import React, { useEffect, useState } from "react";
import Icon from "../Icon";
import { activeDot, arrowButton, carouselContainer, carouselInner, carouselItem, dot, dotsContainer, dotsWrapper, noTransition } from "./carousel.css";
import { useCarousel } from "./useCarousel";
import { usePrevious } from "./usePrevious";

interface CarouselProps {
  children: React.ReactNode[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
  size?: "md" | "lg";
  color?: "brand" | "light" | "dark";
}

const iconColorMap = {
  dark: "#fff",
  brand: "#fff",
  light: "var(--color-gray-700)",
};

const Carousel = ({ children, autoSlide = false, autoSlideInterval = 3000, size = "md", color = "brand" }: CarouselProps) => {
  const { current, transition, extendedSlides, next, prev, goTo, handleTransitionEnd, length } = useCarousel({
    children,
    autoSlide,
    autoSlideInterval,
  });
  const prevIndex = usePrevious(current);

  const dotSize = size === "md" ? 8 : 10;
  const dotGap = size === "md" ? 12 : 16;

  const getDotIndex = (slideIndex: number) => {
    if (slideIndex === 0) return length - 1;
    if (slideIndex === extendedSlides.length - 1) return 0;
    return slideIndex - 1;
  };

  const currentDotIndex = getDotIndex(current);
  const initialDotX = currentDotIndex * (dotSize + dotGap) + dotSize / 2;

  const [dotStyle, setDotStyle] = useState({
    transform: `translateX(${initialDotX}px) translateY(-50%) translateX(-50%)`,
    width: dotSize,
  });

  useEffect(() => {
    if (!transition || prevIndex === undefined || prevIndex === current) return;

    const from = getDotIndex(prevIndex);
    const to = currentDotIndex;

    const isWrapping = (prevIndex === 0 && current === extendedSlides.length - 1) || (prevIndex === extendedSlides.length - 1 && current === 0);

    const startX = from * (dotSize + dotGap) + dotSize / 2;
    const endX = to * (dotSize + dotGap) + dotSize / 2;

    let stretchedWidth = Math.abs(endX - startX) + dotSize;

    if (isWrapping) {
      const totalWidth = length * (dotSize + dotGap) - dotGap;
      if (prevIndex === 0 && current === extendedSlides.length - 1) {
        stretchedWidth = totalWidth - startX + endX + dotSize;
      } else {
        stretchedWidth = startX + (totalWidth - endX) + dotSize;
      }
    }

    setDotStyle({
      transform: `translateX(${startX}px) translateY(-50%) translateX(-50%)`,
      width: stretchedWidth,
    });

    requestAnimationFrame(() => {
      setDotStyle({
        transform: `translateX(${endX}px) translateY(-50%) translateX(-50%)`,
        width: dotSize,
      });
    });
  }, [current, transition, prevIndex, length, extendedSlides.length, dotSize, dotGap, currentDotIndex]);

  return (
    <div className={carouselContainer}>
      <div className={`${carouselInner} ${!transition ? noTransition : ""}`} style={{ transform: `translateX(-${current * 100}%)` }} onTransitionEnd={handleTransitionEnd}>
        {extendedSlides.map((child, i) => (
          <div className={carouselItem} key={i}>
            {child}
          </div>
        ))}
      </div>

      <button className={arrowButton({ size, color })} style={{ left: size === "md" ? 16 : 20 }} onClick={prev}>
        <Icon name="arrow-left-s-line" color={iconColorMap[color]} size={size === "md" ? { width: 20, height: 20 } : { width: 24, height: 24 }} />
      </button>
      <button className={arrowButton({ size, color })} style={{ right: size === "md" ? 16 : 20 }} onClick={next}>
        <Icon name="arrow-right-s-line" color={iconColorMap[color]} size={size === "md" ? { width: 20, height: 20 } : { width: 24, height: 24 }} />
      </button>

      <div className={dotsContainer({ size, color })}>
        <div className={dotsWrapper({ size })}>
          {children.length > 0 &&
            children.map((_, i) => {
              const isActive = current === i + 1;
              return (
                <button
                  key={i}
                  className={dot({
                    size,
                    color,
                    isActive,
                  })}
                  onClick={() => goTo(i)}
                />
              );
            })}

          <div
            className={activeDot({ size, color })}
            style={{
              transform: dotStyle.transform,
              width: dotStyle.width,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
