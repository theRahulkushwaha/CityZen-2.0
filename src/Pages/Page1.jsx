import React, { useEffect, useState } from "react";
// import { AiOutlineWarning } from "react-icons/ai";
import "../Pages/Page-css/Page1.css";

function Page1() {
  const [videoSrc, setVideoSrc] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null); // New state to handle  errors

  useEffect(() => {
    setVideoSrc("http://localhost:5000/video_feed");

    // Set up the EventSource for real-time alerts
    const eventSource = new EventSource("http://localhost:5000/alerts");

    const handleNewAlert = (event) => {
      const newAlert = {
        id: Date.now(),
        message: event.data,
        severity: Math.floor(Math.random() * 3) + 1, // Random severity for now
      };
      setAlerts((prevAlerts) => [newAlert, ...prevAlerts].slice(0, 5)); // Keep latest 5 alerts
    };

    const handleError = (event) => {
      console.error("EventSource error:", event);
      setError("Failed to load alerts. Please try again later.");
    };

    eventSource.onmessage = handleNewAlert;
    eventSource.onerror = handleError;

    // Cleanup the EventSource on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  const dismissAlert = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  return (
    <div className="feed">
      <p className="title">Video Streaming and Accident Detection</p>
      <div className="feed-container">
        {/* Video Feed Section */}
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

        {/* Alerts Section */}
        <div className="alerts-section">
          <h2 className="alerts-title">AI Accident Detection Alerts</h2>
          {error && <p className="error-message">{error}</p>} {/* Display error if any */}
          {alerts.length === 0 && !error ? (
            <p className="no-alerts">No alerts at the moment.</p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`alert-item alert-severity-${alert.severity}`}
              >
                <div className="alert-content">
                  <AiOutlineWarning className="alert-icon" />
                  <p>{alert.message}</p>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  aria-label="Dismiss"
                >
                  Dismiss
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Page1;
