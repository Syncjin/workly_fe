import React from "react";
import Icon from "../Icon";
import { arrowButton, carouselContainer, carouselInner, carouselItem, dot, dotsContainer, noTransition } from "./carousel.css";
import { useCarousel } from "./useCarousel";

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
  const { current, transition, extendedSlides, next, prev, goTo, handleTransitionEnd } = useCarousel({ children, autoSlide, autoSlideInterval });

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
        <Icon name="arrow-left-s-line" color={iconColorMap[color]} size={size === "md" ? 20 : 24} />
      </button>
      <button className={arrowButton({ size, color })} style={{ right: size === "md" ? 16 : 20 }} onClick={next}>
        <Icon name="arrow-right-s-line" color={iconColorMap[color]} size={size === "md" ? 20 : 24} />
      </button>

      <div className={dotsContainer({ size, color })}>
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
      </div>
    </div>
  );
};

export default Carousel;
