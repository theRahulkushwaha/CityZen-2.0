import React, { useState, useEffect } from "react";
import axios from "axios";
import '../Pages/Page-css/report.css';

const Report = () => {
  const [reports, setReports] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    // Fetch the list of reports and videos from the backend
    const fetchReportsAndVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/reports');
        setReports(response.data.reports);
        setVideos(response.data.videos);
      } catch (error) {
        console.error("Error fetching reports and videos:", error);
      }
    };

    fetchReportsAndVideos();
  }, []);

  return (
    <div className="report-container">
      <h2>Accident Reports</h2>

      <div className="video-list">
        <h3>Select a Video:</h3>
        <ul>
          {videos.map((video, index) => (
            <li key={index} onClick={() => setSelectedVideo(video)}>
              {video}
            </li>
          ))}
        </ul>
      </div>

      <div className="report-list">
        <h3>Select a Report:</h3>
        <ul>
          {reports.map((report, index) => (
            <li key={index} onClick={() => setSelectedReport(report)}>
              {report}
            </li>
          ))}
        </ul>
      </div>

      {/* Video Section */}
      {selectedVideo && (
        <div className="video-section">
          <h3>Video:</h3>
          <video controls>
            <source src={`http://localhost:5000/videos/${selectedVideo}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* PDF Section */}
      {selectedReport && (
        <div className="pdf-section">
          <h3>PDF Report:</h3>
          <iframe
            src={`http://localhost:5000/reports/${selectedReport}`}
            title="PDF Report"
            width="100%"
            height="500px"
          />
        </div>
      )}
    </div>
  );
};

export default Report;
