import { useEffect, useRef } from "react";

const HeadControlCursor = () => {
  const lastGaze = useRef({ x: null, y: null, time: null });

  useEffect(() => {
    const initWebGazer = async () => {
      if (window.webgazer) {
        window.webgazer.setGazeListener((data) => {
          if (!data) return;

          const { x, y } = data;

          // Move fake cursor
          const cursor = document.getElementById("head-cursor");
          if (cursor) {
            cursor.style.left = x + "px";
            cursor.style.top = y + "px";
          }

          // Scroll based on Y position
          window.scrollTo({
            top: y + window.scrollY - 200,
            behavior: "smooth",
          });

          // Gaze-based click detection
          const currentTime = Date.now();
          const threshold = 30; // pixels
          const duration = 2000; // 2 seconds

          const isStill =
            lastGaze.current.x !== null &&
            Math.abs(lastGaze.current.x - x) < threshold &&
            Math.abs(lastGaze.current.y - y) < threshold;

          if (isStill) {
            if (currentTime - lastGaze.current.time >= duration) {
              const element = document.elementFromPoint(x, y);
              if (element) {
                element.click();
                console.log("Gaze Clicked:", element);
              }
              lastGaze.current.time = currentTime + 3000; // Avoid rapid repeat
            }
          } else {
            lastGaze.current = { x, y, time: currentTime };
          }
        }).begin();
      }
    };

    initWebGazer();

    return () => {
      window.webgazer?.end();
    };
  }, []);

  return (
    <>
      <div
        id="head-cursor"
        style={{
          position: "absolute",
          width: "20px",
          height: "20px",
          backgroundColor: "red",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      ></div>
    </>
  );
};

export default HeadControlCursor;
