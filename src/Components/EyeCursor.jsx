import React, { useEffect, useState } from 'react';

const EyeCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Load WebGazer
    const script = document.createElement('script');
    script.src = "https://webgazer.cs.brown.edu/webgazer.js";
    script.async = true;
    script.onload = initializeWebGazer;
    document.body.appendChild(script);

    function initializeWebGazer() {
      console.log('WebGazer loaded');
      // Check if WebGazer is initialized
      if (window.webgazer) {
        window.webgazer.setRegression('ridge')
          .setGazeListener((data, elapsedTime) => {
            if (data == null) return;

            // Debugging: Log the raw gaze data
            console.log(data);

            // Ensure coordinates are within bounds
            const x = Math.min(Math.max(data.x, 0), window.innerWidth);  // Clamp to screen width
            const y = Math.min(Math.max(data.y, 0), window.innerHeight); // Clamp to screen height

            setPosition({ x, y });
          })
          .begin();
      } else {
        console.error('WebGazer did not load correctly');
      }
    }

    // Cleanup when component unmounts
    return () => {
      if (window.webgazer) {
        window.webgazer.end();
        console.log('WebGazer ended');
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        width: '20px',
        height: '20px',
        backgroundColor: 'red',
        borderRadius: '50%',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
      }}
    />
  );
};

export default EyeCursor;