
import React, { useEffect, useRef, useState } from "react";

const HeadCursor = () => {
  const videoRef = useRef(null);
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [clicking, setClicking] = useState(false);
  const clickTimeoutRef = useRef(null);

  useEffect(() => {
    // Initialize webgazer
    const initWebGazer = async () => {
      if (window.webgazer) {
        window.webgazer.setGazeListener((data, elapsedTime) => {
          if (data == null) return;

          const { x, y } = data; // x and y are the gaze coordinates

          // Update head cursor position
          setPosition({
            x: (x / window.innerWidth) * window.innerWidth,
            y: (y / window.innerHeight) * window.innerHeight,
          });

          // Scroll control based on head Y position
          if (y < window.innerHeight / 3) {
            window.scrollBy(0, -10); // Scroll up
          } else if (y > (2 * window.innerHeight) / 3) {
            window.scrollBy(0, 10); // Scroll down
          }

          // Click detection if gaze stays still in the same spot
          const screenX = (x / window.innerWidth) * window.innerWidth;
          const screenY = (y / window.innerHeight) * window.innerHeight;

          if (!clicking) {
            setClicking(true);
            clickTimeoutRef.current = setTimeout(() => {
              const elem = document.elementFromPoint(screenX, screenY);
              if (elem) {
                elem.click();
              }
              setClicking(false);
            }, 800); // 800ms delay before clicking
          }
        }).begin();
      }
    };

    initWebGazer();

    return () => {
      window.webgazer?.end();
      clearTimeout(clickTimeoutRef.current);
    };
  }, [clicking]);

  return (
    <>
      {/* Camera Feed in Top Right Corner */}
      <video
        ref={videoRef}
        style={{
          position: "fixed",
          right: "10px", // Top-right corner
          top: "10px", // Top-right corner
          width: "200px", // Adjusted size for the camera feed
          height: "150px", // Adjusted size for the camera feed
          opacity: 0.5,
          zIndex: 1000,
        }}
        autoPlay
        muted
      />
      
      {/* Head Cursor */}
      <div
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          width: "20px",
          height: "20px",
          backgroundColor: "blue", // Color of the head cursor
          borderRadius: "50%",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)", // Center cursor
          zIndex: 1000,
          transition: "top 0.1s, left 0.1s", // Smooth movement
        }}
      />
    </>
  );
};

export default HeadCursor;
