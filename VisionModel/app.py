from flask import Flask, Response, jsonify
from flask_cors import CORS
import cv2
import cvlib as cv
from cvlib.object_detection import draw_bbox

app = Flask(__name__)
CORS(app)

# Global variable to hold the count of detected "person" objects
person_count = 0

def generate_frames():
    global person_count  # Declare the variable as global so we can modify it
    stream_url = "http://192.168.137.45:81/stream"
    cap = cv2.VideoCapture(stream_url)

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Stream ended or unavailable.")
            break

        bbox, label, conf = cv.detect_common_objects(frame)
        frame_with_detection = draw_bbox(frame, bbox, label, conf)

        # Count the number of "person" detected
        person_count = label.count('person')

        _, buffer = cv2.imencode('.jpg', frame_with_detection)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video')
def video():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/person_count')
def get_person_count():
    global person_count  # Declare the variable as global so we can access it
    return jsonify({'person_count': person_count})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
