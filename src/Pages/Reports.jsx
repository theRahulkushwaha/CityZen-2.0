import React, { useState, useEffect } from "react";
import axios from "axios";
import '../Pages/Page-css/report.css';

const Report = () => {
  const [reports, setReports] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReportsAndVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/recent_reports');
        setReports(response.data.reports);
        setVideos(response.data.videos);
      } catch (error) {
        console.error("Error fetching reports and videos:", error);
      }
    };

    fetchReportsAndVideos();
  }, []);

  return (
    <div className="report-page-container">
      <h1>Accident Reports and Videos</h1>

      <div className="selection-container">
        {/* Select video */}
        <div className="select-container">
          <label htmlFor="video-select">Select a Video:</label>
          <select id="video-select" onChange={(e) => setSelectedVideo(e.target.value)} defaultValue="">
            <option value="" disabled>Select a video</option>
            {videos.map((video, index) => (
              <option key={index} value={video}>{video}</option>
            ))}
          </select>
        </div>

        {/* Select PDF Report */}
        <div className="select-container">
          <label htmlFor="report-select">Select a PDF Report:</label>
          <select id="report-select" onChange={(e) => setSelectedReport(e.target.value)} defaultValue="">
            <option value="" disabled>Select a report</option>
            {reports.map((report, index) => (
              <option key={index} value={report}>{report}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Display video and PDF side by side */}
      <div className="media-container">
        {/* Video Section */}
        {selectedVideo && (
          <div className="media-section video-section">
            <h3>Video:</h3>
            <video controls>
              <source src={`http://localhost:5000/videos/${selectedVideo}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* PDF Section */}
        {selectedReport && (
          <div className="media-section pdf-section">
            <h3>PDF Report:</h3>
            <iframe
              src={`http://localhost:5000/reports/${selectedReport}`}
              title="PDF Report"
              className="pdf-iframe"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
