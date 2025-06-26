import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const Headtrack = () => {
  const videoRef = useRef(null);
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [clicking, setClicking] = useState(false);
  const clickTimeoutRef = useRef(null);

  useEffect(() => {
    // Load face-api.js models
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");

      startVideo();
    };

    loadModels();

    // Cleanup on unmount
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject?.getTracks()?.forEach(track => track.stop());
      }
      clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        runDetection();
      })
      .catch((err) => {
        console.log("Error accessing camera:", err);
      });
  };

  const runDetection = () => {
    if (videoRef.current) {
      const canvas = faceapi.createCanvasFromMedia(videoRef.current);
      document.body.append(canvas);
      const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks();
        if (detections.length > 0) {
          const { x, y, width, height } = detections[0].alignedRect._box;
          const centerX = x + width / 2;
          const centerY = y + height / 2;

          const screenX = (centerX / videoRef.current.videoWidth) * window.innerWidth;
          const screenY = (centerY / videoRef.current.videoHeight) * window.innerHeight;

          setPosition({ x: screenX, y: screenY });

          // Scroll control based on head position
          if (centerY < videoRef.current.videoHeight / 3) {
            window.scrollBy(0, -10); // Scroll up
          } else if (centerY > (2 * videoRef.current.videoHeight) / 3) {
            window.scrollBy(0, 10); // Scroll down
          }

          // Selection control (Head to left for click)
          if (!clicking && centerX < videoRef.current.videoWidth / 2) {
            setClicking(true);
            clickTimeoutRef.current = setTimeout(() => {
              const elem = document.elementFromPoint(screenX, screenY);
              if (elem) {
                elem.click();
              }
              setClicking(false);
            }, 800); // 800ms delay before clicking
          }
        }
      }, 100);
    }
  };

  return (
    <>
      {/* Camera Feed on Top-Left Corner */}
      <video
        ref={videoRef}
        style={{
          position: "fixed",
          left: "10px",  // Move to the left side of the screen
          top: "10px",   // Top-left corner
          width: "200px",  // Adjusted size for the camera feed
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
          backgroundColor: "red",
          borderRadius: "50%",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)", // To center the cursor
          zIndex: 1000,
          transition: "top 0.1s, left 0.1s", // Smooth movement
        }}
      />
    </>
  );
};

export default Headtrack;
