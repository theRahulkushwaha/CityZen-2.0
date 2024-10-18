import React, { useState } from "react";

const Feedback = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here, you can handle the submission (e.g., send to an API)
    setSubmitted(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.feedbackForm}>
        <h2 style={styles.heading}>Feedback Form</h2>
        {submitted ? (
          <div style={styles.thankYouMessage}>
            <h3>Thank You!</h3>
            <p>Your feedback has been submitted successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={styles.label} htmlFor="name">
              Name:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />

            <label style={styles.label} htmlFor="email">
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />

            <label style={styles.label} htmlFor="rating">
              Rating:
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              style={styles.select}
            >
              <option value="">Select a rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>

            <label style={styles.label} htmlFor="comments">
              Comments:
            </label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows="4"
              style={styles.textarea}
            ></textarea>

            <button type="submit" style={styles.button}>
              Submit Feedback
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
    margin: 0,
    fontFamily: "Arial, sans-serif",
  },
  feedbackForm: {
    backgroundColor: "#112230",
    padding: "20px",
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
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
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
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
  },
  thankYouMessage: {
    textAlign: "center",
    marginTop: "20px",
  },
};

export default Feedback;
