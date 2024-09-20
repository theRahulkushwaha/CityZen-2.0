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
        <div>
          <h2>Select a Video:</h2>
          <select onChange={(e) => setSelectedVideo(e.target.value)} defaultValue="">
            <option value="" disabled>Select a video</option>
            {videos.map((video, index) => (
              <option key={index} value={video}>{video}</option>
            ))}
          </select>
        </div>

        {/* Select PDF Report */}
        <div>
          <h2>Select a PDF Report:</h2>
          <select onChange={(e) => setSelectedReport(e.target.value)} defaultValue="">
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
    </div>
  );
};

export default Report;
