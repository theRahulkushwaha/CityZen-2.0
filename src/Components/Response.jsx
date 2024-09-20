import React, { useState, useEffect } from 'react';
import './Response.css'; // Import the CSS file

const Response = () => {
  const [reports, setReports] = useState([]);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  const fetchReportsAndVideos = async () => {
    try {
      const response = await fetch('http://localhost:5000/recent_reports');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      // Update the reports and videos arrays while keeping old data
      setReports(prevReports => [...new Set([...prevReports, ...data.reports])]);
      setVideos(prevVideos => [...new Set([...prevVideos, ...data.videos])]);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchReportsAndVideos(); // Initial fetch

    const intervalId = setInterval(fetchReportsAndVideos, 200); // Fetch every 200ms

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  return (
    <div className="response-container">
      <h4>Accident Reports and Videos</h4>
      {error && <p className="error">Error: {error}</p>}
      <div className="section">
        <h3>Recent Reports</h3>
        <div className="scroll-container">
          <ul className="list">
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <li key={index}>
                  <a href={`http://localhost:5000/accident_clips/${report}`} target="_blank" rel="noopener noreferrer">
                    {report}
                  </a>
                </li>
              ))
            ) : (
              <p>No reports available</p>
            )}
          </ul>
        </div>
      </div>
      <div className="section">
        <h3>Recent Videos</h3>
        <div className="scroll-container">
          <ul className="list">
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <li key={index}>
                  <a href={`http://localhost:5000/accident_clips/${video}`} target="_blank" rel="noopener noreferrer">
                    {video}
                  </a>
                </li>
              ))
            ) : (
              <p>No videos available</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Response;
