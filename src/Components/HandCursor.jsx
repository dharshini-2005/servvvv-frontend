import React, { useEffect, useRef, useState } from "react";
import * as handTrack from "handtrackjs";

const HandCursor = () => {
  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [clicking, setClicking] = useState(false);
  const clickTimeoutRef = useRef(null);

  useEffect(() => {
    // Load Handtrack model
    handTrack.load({
      flipHorizontal: true,
      maxNumBoxes: 1,
      scoreThreshold: 0.6,
    }).then(model => {
      modelRef.current = model;
      startVideo();
    });

    // Cleanup on unmount
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject?.getTracks()?.forEach(track => track.stop());
      }
      clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const startVideo = () => {
    handTrack.startVideo(videoRef.current).then(status => {
      if (status) {
        runDetection();
      } else {
        console.log("Please enable video");
      }
    });
  };

  const runDetection = () => {
    modelRef.current.detect(videoRef.current).then(predictions => {
      if (predictions.length > 0) {
        const hand = predictions[0].bbox; // [x, y, width, height]
        const handX = hand[0] + hand[2] / 2;
        const handY = hand[1] + hand[3] / 2;

        const screenX = (handX / videoRef.current.videoWidth) * window.innerWidth;
        const screenY = (handY / videoRef.current.videoHeight) * window.innerHeight;

        setPosition({ x: screenX, y: screenY });

        // Scroll control
        if (handY < videoRef.current.videoHeight / 3) {
          window.scrollBy(0, -10); // Scroll up
        } else if (handY > (2 * videoRef.current.videoHeight) / 3) {
          window.scrollBy(0, 10); // Scroll down
        }

        // Click detection if hand is small (fist)
        if (hand[2] < 50 && hand[3] < 50) {
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
        } else {
          clearTimeout(clickTimeoutRef.current);
          setClicking(false);
        }
      }

      requestAnimationFrame(runDetection);
    });
  };

  return (
    <>
      <video
        ref={videoRef}
        style={{
          position: "fixed",
          right: "10px",
          top: "10px",
          width: "200px",
          height: "150px",
          opacity: 0.5,
          zIndex: 1000,
        }}
        autoPlay
        muted
      />
      <div
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          width: "20px",
          height: "20px",
          backgroundColor: "red",
          borderRadius: "50%",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          transition: "top 0.1s, left 0.1s", // Smooth movement
        }}
      />
    </>
  );
};

export default HandCursor;