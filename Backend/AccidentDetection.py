from flask import Flask, Response, stream_with_context, jsonify
from flask_cors import CORS
from roboflow import Roboflow
import cv2
import os
import time
import json
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import datetime
# from send_sms import send_sms  # Import the SMS function from send_sms.py

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

#-------------------Roboflow API KEY ----------------------------
rf = Roboflow(api_key="VArwTQnDOOH8QhfqQEtU")
project = rf.workspace().project("accident_dataset-o5th9")
model = project.version("1").model

# Shared list to hold alerts
alerts_list = []
recording = False  # Flag to track if we're currently recording a video
video_writer = None  # OpenCV VideoWriter object

# Dictionary to store accident statistics
accident_statistics = {
    "car_car_accident": 0,
    "injured": 0,
    "car_person_accident": 0
}

# Directory to save accident clips
output_dir = "reports"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Directory to save accident reports
report_output_dir = "reports"
if not os.path.exists(report_output_dir):
    os.makedirs(report_output_dir)

# Function to generate a PDF report
def generate_pdf_report(accident_details):
    pdf_filename = f'accident_report_{int(time.time())}.pdf'
    pdf_path = os.path.join(report_output_dir, pdf_filename)
    
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter

    # Add title
    c.setFont("Helvetica", 16)
    c.drawString(100, height - 50, "Accident Report")

    # Add accident details
    c.setFont("Helvetica", 12)
    y_position = height - 100
    for detail in accident_details:
        c.drawString(100, y_position, detail)
        y_position -= 20

    # Save the PDF
    c.save()
    print(f"PDF report generated: {pdf_path}")
    return pdf_path

def generate_frames():
    global recording, video_writer
    
    video_source = 'car and human accidents.mp4'
    # video_source = 0  # Use webcam if needed

    # Check if the video file exists
    if not os.path.exists(video_source):
        print(f"Video file {video_source} not found.")
        return
    
    cap = cv2.VideoCapture(video_source)
    frame_skip = 6  # Skip every 2nd frame to increase speed
    frame_count = 0
    fps = cap.get(cv2.CAP_PROP_FPS)
    
    # Slow down the video by reducing the FPS
    slow_fps = fps / 2  # Half the FPS to slow down video playback
    
    while True:
        success, frame = cap.read()
        if not success:
            print("Failed to read frame.")
            break
        
        frame_count += 1

        # Skip frames
        if frame_count % frame_skip != 0:
            continue
        
        # Resize the frame to a lower resolution to speed up processing
        input_size = (640, 640)  # Lower resolution for faster processing
        frame_resized = cv2.resize(frame, input_size)

        # Save the resized frame temporarily to run through the Roboflow model
        temp_frame_path = 'temp_frame.jpg'
        cv2.imwrite(temp_frame_path, frame_resized)

        # Predict using the Roboflow model
        prediction = model.predict(temp_frame_path, confidence=40).json()
        predictions = prediction.get('predictions', [])

        accident_detected = False  # Flag to check if an accident is detected in the current frame

        #------------- Draw boxes on the frame using prediction results-------------------------------
        for box in predictions:
            x = int(box['x'] - box['width'] / 2)
            y = int(box['y'] - box['height'] / 2)
            w = int(box['width'])
            h = int(box['height'])
            label = box['class']
            
            color = (0, 255, 0)  # Default color (green)
            if label in ['car_car_accident', 'injured', 'car_person_accident']: 
                color = (0, 0, 255)  # Red color for specific labels
                accident_detected = True  # Accident detected in this frame

                # Update accident statistics
                if label in accident_statistics:
                    accident_statistics[label] += 1

                # Send alert
                send_alert(label)

                # Generate PDF report with accident details
                latitude = 28.199  # Replace with actual latitude
                longitude = 76.6183  # Replace with actual longitude
                nearest_hospital = "Bhagat Hospital"  # Replace with actual hospital name
                nearest_police_station = "Sagarpur police station"  # Replace with actual police station name
                video_name = os.path.basename(video_source)

                accident_details = [
                    f"Date: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
                    f"Type: {label}",
                    f"Latitude: {latitude}",
                    f"Longitude: {longitude}",
                    f"Nearest Hospital: {nearest_hospital}",
                    f"Nearest Police Station: {nearest_police_station}",
                    f"Video Name: {video_name}",
                ]
                # send_alert(label)
                generate_pdf_report(accident_details)
                # send_sms(f"ALERT: {label} detected!")

            cv2.rectangle(frame_resized, (x, y), (x + w, y + h), color, 2)
            cv2.putText(frame_resized, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

        # If an accident is detected, start collecting frames and saving to video
        if accident_detected:
            if not recording:
                # Start recording a new video in the accident_clips folder
                recording = True
                video_filename = f'accident_{int(time.time())}.mp4'
                video_path = os.path.join(output_dir, video_filename)
                
                fourcc = cv2.VideoWriter_fourcc(*'XVID')
                video_writer = cv2.VideoWriter(video_path, fourcc, slow_fps, input_size)
                print(f"Started recording accident video: {video_path}")

            # Append frame to the video
            video_writer.write(frame_resized)

        # If no accident is detected and recording was ongoing, stop recording
        elif recording:
            print("Stopping recording...")
            recording = False
            video_writer.release()  # Save the video

        # Encode the frame as JPEG
        ret, buffer = cv2.imencode('.jpg', frame_resized)
        if not ret:
            continue
        frame_bytes = buffer.tobytes()

        # Yield the frame to be streamed
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

        # Clean up the temporary file
        os.remove(temp_frame_path)

    cap.release()

#-------------------------ALERT FUNCTION--------------------------
def send_alert(label):
    # Append the alert to the alerts list
    alert_message = f"ALERT: {label} detected!"
    alerts_list.append(alert_message)
    print(alert_message)

@app.route('/statistics')
def get_accident_statistics():
    return jsonify(accident_statistics)

@app.route('/reports')
def get_recent_reports():
    # List all report PDF files
    reports = [f for f in os.listdir(report_output_dir) if f.endswith('.pdf')]
    
    # List all video files
    videos = [f for f in os.listdir(output_dir) if f.endswith('.mp4')]
    
    # Return the lists as a JSON response
    return jsonify({"reports": reports, "videos": videos})

def alert_stream():
    # Stream the alerts as Server-Sent Events
    @stream_with_context
    def generate():
        while True:
            if alerts_list:
                yield f"data: {alerts_list.pop(0)}\n\n"
            time.sleep(1)  # Adjust the sleep time as necessary

    return Response(generate(), mimetype='text/event-stream')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/alerts')
def alerts_feed():
    return alert_stream()

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5000)
