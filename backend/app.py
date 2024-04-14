import time
from bson import ObjectId
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from gridfs import GridFS
import io

client = MongoClient('mongodb://localhost:27017')
chat_db = client.get_database("chatle")
users_collection = chat_db.get_collection("users")
messages_collection = chat_db.get_collection("messages")
fs = GridFS(chat_db)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
app.secret_key = "sfdjkafnk"

ROOMS = ["Lounge"]

@app.route('/')
def home():
    return "maejskjsnjsnc  sjsndhsf,jfjsdnckjdsjcklsdcmksldfkl"

@app.route("/signup", methods=['POST'])
@cross_origin(supports_credentials=True)
def signup():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = data['password']
    signup_user = users_collection.find_one({'username': username})

    if signup_user:
        return jsonify(False)

    users_collection.insert_one({'username': username, 'password': password, 'email': email})
    room = username
    if room not in ROOMS:
        ROOMS.append(room)
    return jsonify(True)

@app.route('/signin', methods=['POST'])
@cross_origin(supports_credentials=True)
def signin():
    data = request.get_json()
    username = data['username']
    password = data['password']
    signin_user = users_collection.find_one({'username': username})

    if signin_user and signin_user['password'] == password:
        return jsonify(True)
    else:
        return jsonify(False)

@app.route("/api/rooms", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_rooms():
    usernames = users_collection.distinct("username")
    ROOMS = [username for username in usernames]
    return jsonify(ROOMS)

@app.route("/api/messages", methods=["POST"])
@cross_origin(supports_credentials=True)
def create_message():
    data = request.get_json()
    data["timestamp"] = time.strftime('%b-%d %I:%M%p', time.localtime())

    # Check if the message is an emoji (for demonstration purposes)
    if "msg" in data and data["msg"] in ["😀", "😄", "😊", "😍"]:
        data["type"] = "emoji"
    else:
        data["type"] = "text"

    # Add the recipient field to the message data
    data["recipient"] = data["room"]

    messages_collection.insert_one(data)
    return jsonify({"message": "Message sent successfully!"})

@app.route("/api/files", methods=["POST"])
@cross_origin(supports_credentials=True)
def upload_file():
    if "file" not in request.files:
        return jsonify({"success": False, "message": "No file provided!"})

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"success": False, "message": "No file selected!"})

    username = request.form.get("username")
    room = request.form.get("room")
    timestamp = time.strftime('%b-%d %I:%M%p', time.localtime())

    # Save the file to GridFS and get the file_id
    file_id = fs.put(file, filename=file.filename, username=username, room=room, timestamp=timestamp)

    # Store the file information in the messages collection
    file_info = {
        "msg": str(file_id),
        "filename": file.filename,
        "username": username,
        "room": room,
        "timestamp": timestamp,
        "type": "file"
    }
    messages_collection.insert_one(file_info)

    return jsonify({"success": True, "message": "File uploaded successfully!"})

@app.route('/api/files/<string:file_id>', methods=['GET'])
@cross_origin(supports_credentials=True)
def download_file(file_id):
    try:
        # Find the file information from the messages collection using the file_id
        file_info = messages_collection.find_one({"msg": file_id, "type": "file"})
        if file_info:
            # Retrieve file from GridFS using the file_id
            file_data = fs.get(ObjectId(file_id)).read()
            return send_file(io.BytesIO(file_data), attachment_filename=file_info["filename"], as_attachment=True)
        else:
            return jsonify({"error": "File not found!"}), 404
    except Exception as e:
        print("Error while downloading file:", str(e))
        return jsonify({"error": "File download failed!"}), 500

@app.route('/api/rooms/<string:room>/messages', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_room_messages(room):
    last_timestamp = request.args.get('last_timestamp', type=float)
    username = request.args.get('username', type=str)  # Get the current user's username

    # Filter messages based on the sender (username) and recipient (room)
    query = {"$or": [{"username": username, "room": room}, {"username": room, "recipient": username}]}
    
    if last_timestamp:
        query["timestamp"] = {"$gt": last_timestamp}

    messages = messages_collection.find(query, {"_id": 0}).sort("timestamp")

    return jsonify(list(messages))

if __name__ == "__main__":
    app.run(debug=True)
