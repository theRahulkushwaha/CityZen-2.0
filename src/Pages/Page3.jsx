// Page3.jsx
import React, { useEffect, useState } from "react";
import "../Pages/Page-css/Page1.css";
import Alert from "../Components/Alerts";

function Page3() {
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    setVideoSrc("http://localhost:5001/video_feed");
  }, []);

  return (
    <div className="feed">
      <p className="title">Video Streaming and Crime Detection</p>
      <div className="feed-container">
        <div className="video-section">
          <div className="video-wrapper">
            {videoSrc && (
              <img
                src={videoSrc}
                alt="video stream"
                className="video-feed"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            )}
          </div>
        </div>

        <div className="alerts-section">
          <Alert streamUrl="http://localhost:5001/alerts" />
        </div>
      </div>
    </div>
  );
}

export default Page3;
