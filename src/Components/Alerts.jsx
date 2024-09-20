import React from "react";
import "../Components/Alerts.css"; 

const AlertStream = ({ streamUrl, alerts, setAlerts }) => {
  React.useEffect(() => {
    const eventSource = new EventSource(streamUrl);

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

function Alert() {
  const [alerts, setAlerts] = React.useState({});

  const handleClearAlerts = () => {
    Object.keys(alerts).forEach((streamUrl) => {
      setAlerts((prevAlerts) => ({ ...prevAlerts, [streamUrl]: [] }));
    });
  };

  return (
    <div className="alert-container">
      <div className="alert-streams">
        {["http://localhost:5000/alerts"].map((streamUrl) => (
          <div key={streamUrl}>
            <AlertStream streamUrl={streamUrl} alerts={alerts} setAlerts={setAlerts} />
          </div>
        ))}
      </div>
      <button className="clear-button" onClick={handleClearAlerts}>
        Clear History
      </button>
    </div>
  );
}

export default Alert;
