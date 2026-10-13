
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function StatCounter({ end, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const isDecimal = !Number.isInteger(end);

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let lastUpdate = 0;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Throttle state update to at most once every 33ms (~30fps) for smooth perf
      if (timestamp - lastUpdate > 33 || progress >= 1) {
        lastUpdate = timestamp;
        if (isDecimal) {
          setCount(Number((end * progress).toFixed(1)));
        } else {
          setCount(Math.floor(end * progress));
        }
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, end, duration, isDecimal]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-variant-numeric: tabular-nums"
    >
      {count}{suffix}
    </motion.span>
  );
}

export default StatCounter;
