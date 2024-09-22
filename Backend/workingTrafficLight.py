from flask import Flask, Response, stream_with_context, jsonify
from flask_cors import CORS
from roboflow import Roboflow
import cv2
import os
import time
import threading

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

#-------------------Roboflow API KEY ----------------------------
rf = Roboflow(api_key="VArwTQnDOOH8QhfqQEtU")
project = rf.workspace().project("traffic-rz3cd")
model = project.version("1").model

# Shared list to hold alerts
alerts_list = []

# Define video sources
video_sources = {
    'video1': 'C1.mp4',
    'video2': 'C2.mp4',
    'video3': 'C3.mp4',
    'video4': 'C4.mp4'
}

# Dictionary to keep track of vehicle counts
vehicle_counts = {key: 0 for key in video_sources.keys()}

# Dictionary to keep track of traffic light states
traffic_light_states = {key: 'RED' for key in video_sources.keys()}

def generate_frames(video_key):
    video_source = video_sources.get(video_key, 'C1.mp4')

    # Check if the video file exists
    if not os.path.exists(video_source):
        print(f"Video file {video_source} not found.")
        return

    cap = cv2.VideoCapture(video_source)
    if not cap.isOpened():
        print(f"Failed to open video file {video_source}.")
        return
    
    frame_skip = 6  # Skip every 6th frame to increase speed
    frame_count = 0

    while True:
        success, frame = cap.read()
        if not success:
            print(f"Failed to read frame from {video_source}.")
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

        # Initialize vehicle count for each frame
        vehicle_count = 0

        # Draw boxes on the frame using prediction results
        for box in predictions:
            x = int(box['x'] - box['width'] / 2)
            y = int(box['y'] - box['height'] / 2)
            w = int(box['width'])
            h = int(box['height'])
            label = box['class']
            
            # Count vehicles
            if label in ['car', 'truck', 'bus', 'bike']:  # Adjust based on your labels
                vehicle_count += 1
                color = (0, 255, 0)  # Green color for vehicles
                cv2.rectangle(frame_resized, (x, y), (x + w, y + h), color, 2)
                cv2.putText(frame_resized, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)
            else:
                color = (0, 0, 255)  # Red color for other labels
                cv2.rectangle(frame_resized, (x, y), (x + w, y + h), color, 2)
                cv2.putText(frame_resized, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

        # Calculate text size and position to center it
        text = f'Vehicle Count: {vehicle_count}'
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 1
        font_color = (0, 255, 0)  # Green color for text
        thickness = 2
        (text_width, text_height), _ = cv2.getTextSize(text, font, font_scale, thickness)
        text_x = (frame_resized.shape[1] - text_width) // 2
        text_y = (frame_resized.shape[0] + text_height) // 2

        # Display the vehicle count at the center of the frame
        cv2.putText(frame_resized, text, (text_x, text_y), font, font_scale, font_color, thickness, cv2.LINE_AA)

        # Calculate traffic density
        frame_area = frame_resized.shape[0] * frame_resized.shape[1]  # Width * Height
        density = vehicle_count / frame_area

        # Display the density on the frame
        density_text = f'Density: {density:.6f} vehicles per pixel'
        (density_width, density_height), _ = cv2.getTextSize(density_text, font, font_scale, thickness)
        density_x = (frame_resized.shape[1] - density_width) // 2
        density_y = text_y + text_height + 20  # Position below the vehicle count

        cv2.putText(frame_resized, density_text, (density_x, density_y), font, font_scale, font_color, thickness, cv2.LINE_AA)

        # Encode the frame as JPEG
        ret, buffer = cv2.imencode('.jpg', frame_resized)
        if not ret:
            print(f"Failed to encode frame from {video_source}.")
            continue
        frame_bytes = buffer.tobytes()

        # Yield the frame to be streamed
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

        # Clean up the temporary file
        os.remove(temp_frame_path)

        # Update vehicle count in the shared dictionary
        vehicle_counts[video_key] = vehicle_count

    cap.release()

def send_alert(label):
    # Append the alert to the alerts list
    alert_message = f"ALERT: {label} detected!"
    alerts_list.append(alert_message)
    print(alert_message)

def alert_stream():
    # Stream the alerts as Server-Sent Events
    @stream_with_context
    def generate():
        while True:
            if alerts_list:
                yield f"data: {alerts_list.pop(0)}\n\n"
            time.sleep(1)  # Adjust the sleep time as necessary

    return Response(generate(), mimetype='text/event-stream')

def video_stream(video_key):
    return Response(generate_frames(video_key), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video_feed/<video_key>')
def video_feed(video_key):
    if video_key in video_sources:
        return video_stream(video_key)
    else:
        return "Video key not found", 404

@app.route('/alerts')
def alerts_feed():
    return alert_stream()

@app.route('/traffic_lights')
def traffic_lights():
    return jsonify(traffic_light_states)

# Traffic light control function
def traffic_light_control():
    while True:
        sorted_roads = sorted(vehicle_counts.items(), key=lambda x: x[1], reverse=True)
        
        for road, count in sorted_roads:
            green_time = 30 + (len(sorted_roads) - sorted_roads.index((road, count))) * 5
            red_time = 30 - (len(sorted_roads) - sorted_roads.index((road, count))) * 5

            traffic_light_states[road] = 'GREEN'
            print(f"{road} GREEN for {green_time} seconds")
            time.sleep(green_time)

            traffic_light_states[road] = 'YELLOW'
            print(f"{road} YELLOW for 5 seconds")
            time.sleep(5)

            traffic_light_states[road] = 'RED'
            print(f"{road} RED for {red_time} seconds")
            time.sleep(red_time)
        
        time.sleep(5)  # Adjust timing before next cycle

# Start the traffic light control in a separate thread
traffic_control_thread = threading.Thread(target=traffic_light_control)
traffic_control_thread.start()

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5002)
