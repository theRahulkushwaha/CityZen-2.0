// alerts.jsx
import React from "react";
import "../Components/Alerts.css";

const AlertStream = ({ streamUrl, alerts, setAlerts }) => {
  React.useEffect(() => {
    const eventSource = new EventSource("http://localhost:5000/alerts");

    const handleNewAlert = (event) => {
      setAlerts((prevAlerts) => ({
        ...prevAlerts,
        [streamUrl]: [...(prevAlerts[streamUrl] || []), event.data],
      }));
    };

    eventSource.onmessage = handleNewAlert;

    return () => eventSource.close();
  }, [streamUrl]);

  return (
    <ul className="alert-list">
      {alerts[streamUrl] &&
        alerts[streamUrl].map((alert, index) => (
          <li key={index} className="alert-item">
            {alert}
          </li>
        ))}
    </ul>
  );
};

function Alert({ streamUrl }) {
  const [alerts, setAlerts] = React.useState({});

  const handleClearAlerts = () => {
    setAlerts({});
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
