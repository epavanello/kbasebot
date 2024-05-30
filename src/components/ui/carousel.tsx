"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: React.ReactNode;
  visibleItems?: number;
  infinite?: boolean;
  autoplay?: boolean;
  speed?: number; // transition speed in milliseconds
  delay?: number; // autoplay delay in milliseconds
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  visibleItems = 1,
  infinite = false,
  autoplay = false,
  speed = 1000, // default to 1 second transition speed
  delay = 3000, // default to 3 seconds delay
  gap = 0,
}) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const slideWidth = 100 / visibleItems;

  const totalSlides = React.Children.count(children) * 2;

  const goToSlide = (index: number) => {
    if (infinite) {
      if (index < 0) index = totalSlides - visibleItems - React.Children.count(children);
      // Consider duplicate set
      else if (index >= totalSlides - visibleItems) {
        index = 0;
        setTimeout(() => setCurrentSlide(0), speed); // Quickly jump to start of original set after animation
      }
    } else {
      if (index < 0) index = 0;
      else if (index >= React.Children.count(children) - visibleItems)
        index = React.Children.count(children) - visibleItems;
    }
    setCurrentSlide(index);
  };

  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    if (autoplay && !isHovered) {
      if (delay === 0) {
        const interval = setInterval(() => {
          goToSlide(currentSlide + 0.1); // smooth scroll
        }, speed / 10); // smooth scroll speed

        return () => clearInterval(interval);
      } else {
        const interval = setInterval(() => {
          goToSlide(currentSlide + 1);
        }, delay + speed);

        return () => clearInterval(interval);
      }
    }
  }, [currentSlide, autoplay, delay, speed, isHovered]);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex transition-transform duration-300"
        style={{
          transform: `translateX(-${currentSlide * slideWidth}%)`,
          transitionDuration: `${speed}ms`,
          gap: `${gap}px`, // Setting the gap here
        }}
      >
        {/* Render original set */}
        {React.Children.map(children, (child) => (
          <div style={{ flex: `0 0 ${slideWidth}%` }}>{child}</div>
        ))}
        {/* Render duplicate set */}
        {React.Children.map(children, (child) => (
          <div style={{ flex: `0 0 ${slideWidth}%` }}>{child}</div>
        ))}
      </div>
      <CarouselNavigation onPrev={() => goToSlide(currentSlide - 1)} onNext={() => goToSlide(currentSlide + 1)} />
    </div>
  );
};

interface CarouselItemProps {
  children: React.ReactNode;
}

export const CarouselItem: React.FC<CarouselItemProps> = ({ children }) => {
  return <div className="min-w-full">{children}</div>;
};

interface CarouselNavigationProps {
  onPrev: () => void;
  onNext: () => void;
}

export const CarouselNavigation: React.FC<CarouselNavigationProps> = ({ onPrev, onNext }) => {
  return (
    <div className="absolute top-1/2 transform -translate-y-1/2 left-0 right-0">
      <button className={cn("absolute left-4 p-4")} onClick={onPrev}>
        &#10094;
      </button>
      <button className={cn("absolute right-4 p-4")} onClick={onNext}>
        &#10095;
      </button>
    </div>
  );
};
