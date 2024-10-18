import React, { useState } from "react";

const ComplaintForm = () => {
  const [complaintType, setComplaintType] = useState("");
  const [complaintDetails, setComplaintDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const complaintTypes = ["Accident", "Infrastructure", "Traffic", "Crime"];

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here, you can handle the submission (e.g., send to an API)
    setSubmitted(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.complaintBox}>
        <h2 style={styles.heading}>Submit a Complaint</h2>
        {submitted ? (
          <div style={styles.thankYouMessage}>
            <h3>Thank You!</h3>
            <p>Your complaint has been submitted successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={styles.label} htmlFor="complaint-type">
              Choose a complaint type:
            </label>
            <select
              id="complaint-type"
              value={complaintType}
              onChange={(e) => setComplaintType(e.target.value)}
              required
              style={styles.select}
            >
              <option value="">Select a type</option>
              {complaintTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <label style={styles.label} htmlFor="complaint-details">
              Details of your complaint:
            </label>
            <textarea
              id="complaint-details"
              value={complaintDetails}
              onChange={(e) => setComplaintDetails(e.target.value)}
              rows="5"
              required
              style={styles.textarea}
            ></textarea>

            <button type="submit" style={styles.button}>
              Submit Complaint
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// CSS styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#06121a",
    // background: "linear-gradient(120deg, #EAEAEA, #06121a)",
    margin: 0,
    fontFamily: "Arial, sans-serif",
  },
  complaintBox: {
    backgroundColor: "#112230",
    padding: "50px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "80vw",
    height: "80vh",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  label: {
    marginBottom: "5px",
    display: "block",
    fontWeight: "bold",
  },
  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  button: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
  },
  buttonHover: {
    backgroundColor: "#218838",
  },
  thankYouMessage: {
    textAlign: "center",
    marginTop: "20px",
  },
};

export default ComplaintForm;
