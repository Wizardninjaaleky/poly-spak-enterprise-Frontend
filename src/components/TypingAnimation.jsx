'use client';

import { useState, useEffect } from 'react';

export default function TypingAnimation({ 
  text = "Polyspack Enterprises", 
  speed = 100, 
  delay = 0,
  className = "",
  loop = false,
  cursor = true 
}) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (delay > 0 && currentIndex === 0) {
      const delayTimeout = setTimeout(() => {
        startTyping();
      }, delay);
      return () => clearTimeout(delayTimeout);
    } else {
      startTyping();
    }

    function startTyping() {
      const timeout = setTimeout(() => {
        if (!isDeleting && currentIndex < text.length) {
          setDisplayText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        } else if (isDeleting && currentIndex > 0) {
          setDisplayText((prev) => prev.slice(0, -1));
          setCurrentIndex((prev) => prev - 1);
        } else if (loop && currentIndex === text.length && !isDeleting) {
          setTimeout(() => setIsDeleting(true), 1500);
        } else if (loop && currentIndex === 0 && isDeleting) {
          setIsDeleting(false);
        }
      }, isDeleting ? speed / 2 : speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, isDeleting, text, speed, delay, loop]);

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <span 
          className={`inline-block w-0.5 ml-1 bg-current transition-opacity duration-100 ${
            showCursor ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ height: '1em' }}
        />
      )}
    </span>
  );
}
