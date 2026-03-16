import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import gsap from 'gsap';

export const Card = forwardRef(({ customClass, style, children, ...rest }, ref) => (
  <div
    ref={ref}
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.08)',
      background: '#0a0a0a',
      transformStyle: 'preserve-3d',
      willChange: 'transform',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      overflow: 'hidden',
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true,
  });

const placeFlip = (el, i, total) =>
  gsap.set(el, {
    x: 0, y: 0, z: 0,
    rotateY: 0,
    xPercent: -50,
    yPercent: -50,
    transformOrigin: 'center center',
    zIndex: total - i,
    force3D: true,
  });

const CardSwap = ({
  width = 340,
  height = 190,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  swapOnHover = false,
  swapOnClick = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  containerAlign = 'left',
  flipMode = false,
  children,
}) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);
  const swapFnRef = useRef(null);

  useEffect(() => {
    const total = refs.length;

    // ── Initial placement ─────────────────────────────────────────────────────
    if (flipMode) {
      refs.forEach((r, i) => placeFlip(r.current, i, total));
    } else {
      refs.forEach((r, i) =>
        placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount)
      );
    }

    // ── Swap logic ────────────────────────────────────────────────────────────
    const swap = flipMode
      ? () => {
          if (order.current.length < 2) return;
          const [front, ...rest] = order.current;
          const elFront = refs[front].current;
          const elNext  = refs[rest[0]].current;
          const tl = gsap.timeline();
          tlRef.current = tl;

          // Phase 1: front card slides up and exits
          tl.to(elFront, { y: '-=500', duration: 0.35, ease: 'power2.in' });

          // Mid: reset front to center (for its next cycle), stage next below
          tl.call(() => {
            gsap.set(elFront, { zIndex: 0, y: 0 });
            gsap.set(elNext,  { zIndex: refs.length, y: 500 });
          });

          // Phase 2: next card slides up into center
          tl.to(elNext, { y: 0, duration: 0.35, ease: 'power2.out' });

          // Cleanup: advance order
          tl.call(() => {
            order.current = [...rest, front];
          });
        }
      : () => {
          if (order.current.length < 2) return;

          const [front, ...rest] = order.current;
          const elFront = refs[front].current;
          const tl = gsap.timeline();
          tlRef.current = tl;

          tl.to(elFront, { y: '+=500', duration: config.durDrop, ease: config.ease });

          tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
          rest.forEach((idx, i) => {
            const el = refs[idx].current;
            const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
            tl.set(el, { zIndex: slot.zIndex }, 'promote');
            tl.to(
              el,
              { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease },
              `promote+=${i * 0.15}`
            );
          });

          const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
          tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
          tl.call(() => { gsap.set(elFront, { zIndex: backSlot.zIndex }); }, undefined, 'return');
          tl.to(
            elFront,
            { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: config.durReturn, ease: config.ease },
            'return'
          );
          tl.call(() => { order.current = [...rest, front]; });
        };

    swapFnRef.current = swap;

    const node = container.current;
    const cleanupFns = [];

    // Pause interval + animation when scrolled out of view, resume when back
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(swap, delay);
      } else {
        clearInterval(intervalRef.current);
        tlRef.current?.pause();
      }
    }, { threshold: 0.1 });
    observer.observe(node);
    cleanupFns.push(() => observer.disconnect());

    // Initial swap on first mount
    swap();
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const pause = () => { tlRef.current?.pause(); clearInterval(intervalRef.current); };
      const resume = () => { tlRef.current?.play(); intervalRef.current = window.setInterval(swap, delay); };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      cleanupFns.push(() => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
      });
    }

    if (swapOnHover) {
      const triggerSwap = () => {
        clearInterval(intervalRef.current);
        swap();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener('mouseenter', triggerSwap);
      cleanupFns.push(() => node.removeEventListener('mouseenter', triggerSwap));
    }

    return () => {
      clearInterval(intervalRef.current);
      cleanupFns.forEach(fn => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, swapOnHover, skewAmount, easing, flipMode]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, cursor: swapOnClick ? 'pointer' : 'default', ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e);
            onCardClick?.(i);
            if (swapOnClick) {
              clearInterval(intervalRef.current);
              swapFnRef.current?.();
              intervalRef.current = window.setInterval(swapFnRef.current, delay);
            }
          },
        })
      : child
  );

  const alignStyle =
    containerAlign === 'left'
      ? { bottom: 0, left: 0, transformOrigin: 'bottom left', transform: 'translate(-5%, 20%)' }
      : containerAlign === 'center'
      ? { bottom: 0, left: '50%', transformOrigin: 'bottom center', transform: 'translate(-50%, 20%)' }
      : { bottom: 0, right: 0, transformOrigin: 'bottom right', transform: 'translate(5%, 20%)' };

  return (
    <div
      ref={container}
      style={{
        position: 'absolute',
        ...(flipMode ? {} : { perspective: '900px' }),
        overflow: 'visible',
        ...alignStyle,
      }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;
