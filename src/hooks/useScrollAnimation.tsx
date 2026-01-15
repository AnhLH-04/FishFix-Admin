import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.2,
    rootMargin = '0px',
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        
        // Calculate scroll progress (0 to 1)
        if (entry.isIntersecting) {
          const progress = entry.intersectionRatio;
          setScrollProgress(progress);
        }
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100), // 0, 0.01, 0.02, ... 1.0
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rootMargin]);

  return { ref, isVisible, scrollProgress };
}
