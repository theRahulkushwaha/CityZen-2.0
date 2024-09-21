import React from "react";
import "../Components/Alerts.css";

const AlertStream = ({ streamUrl, alerts, setAlerts }) => {
  React.useEffect(() => {
    const eventSource = new EventSource(streamUrl);

    const handleNewAlert = (event) => {
      const timestamp = new Date().toLocaleTimeString(); // Get the current time
      const newAlert = {
        message: event.data,
        time: timestamp,
      };
      setAlerts((prevAlerts) => ({
        ...prevAlerts,
        [streamUrl]: [...(prevAlerts[streamUrl] || []), newAlert],
      }));
    };

    eventSource.onmessage = handleNewAlert;

    eventSource.onerror = () => {
      console.error("Error in event stream");
    };

    return () => eventSource.close();
  }, [streamUrl, setAlerts]);

  return (
    <ul className="alert-list">
      {alerts[streamUrl] &&
        alerts[streamUrl].map((alert, index) => (
          <li key={index} className="alert-item">
            <div className="alert-message">{alert.message}</div>
            <div className="alert-time">{alert.time}</div>
          </li>
        ))}
    </ul>
  );
};

function Alert({ streamUrl }) {
  const [alerts, setAlerts] = React.useState({});

  const handleClearAlerts = () => {
    setAlerts((prevAlerts) => ({
      ...prevAlerts,
      [streamUrl]: [],
    }));
  };

  return (
    <div className="alert-container">
      <div className="alert-streams">
        <AlertStream streamUrl={streamUrl} alerts={alerts} setAlerts={setAlerts} />
      </div>
      <button className="clear-button" onClick={handleClearAlerts}>
        Clear History
      </button>
    </div>
  );
}

export default Alert;
