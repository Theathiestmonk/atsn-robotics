import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
}) => {
  const containerRef = useRef(null);
  // Track only the triggers we create so cleanup doesn't affect other animations
  const triggersRef = useRef([]);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span
          key={index}
          className="word"
          style={{ display: 'inline-block', willChange: 'opacity, filter' }}
        >
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const t1 = gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom',
          end: rotationEnd,
          scrub: true,
        },
      }
    );

    const wordElements = el.querySelectorAll('.word');

    const t2 = gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, willChange: 'opacity' },
      {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=20%',
          end: wordAnimationEnd,
          scrub: true,
        },
      }
    );

    triggersRef.current = [t1, t2];

    if (enableBlur) {
      const t3 = gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=20%',
            end: wordAnimationEnd,
            scrub: true,
          },
        }
      );
      triggersRef.current.push(t3);
    }

    return () => {
      // Only kill triggers created by this component instance
      triggersRef.current.forEach(t => {
        if (t && t.scrollTrigger) t.scrollTrigger.kill();
      });
      triggersRef.current = [];
    };
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    rotationEnd,
    wordAnimationEnd,
    blurStrength,
  ]);

  return (
    <p
      ref={containerRef}
      className={containerClassName}
      style={{ display: 'block' }}
    >
      <span className={textClassName} style={{ display: 'inline' }}>
        {splitText}
      </span>
    </p>
  );
};

export default ScrollReveal;
