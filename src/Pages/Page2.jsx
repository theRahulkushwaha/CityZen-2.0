import React, { useEffect, useState } from "react";
import "../Pages/Page-css/Page1.css";
import Alert from "../Components/Alerts";

function Page2() {
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    setVideoSrc("http://localhost:5002/video_feed");
  }, []);

  return (
    <div className="feed">
      <p className="title">Video Streaming and Infrastructure Detection</p>
      <div className="feed-container">
        <div className="video-section">
          <div className="video-wrapper">
            {videoSrc && (
              <img
                src={videoSrc}
                alt="video stream"
                className="video-feed"
                style={{ objectFit: "contain" }} // Remove width and height from inline style
              />
            )}
          </div>
        </div>

        <div className="alerts-section">
          <Alert streamUrl="http://localhost:5002/alerts" />
        </div>
      </div>
    </div>
  );
}

export default Page2;
