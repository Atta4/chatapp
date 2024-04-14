import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../style/chat_style.css";
import { useParams } from "react-router-dom";

const ChatComponent = () => {
  const { username } = useParams();

  const [rooms, setRooms] = useState(["Lounge"]);
  const [room, setRoom] = useState("Lounge");
  const [userMessage, setUserMessage] = useState("");
  const [file, setFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/rooms").then((response) => {
      setRooms(response.data);
    });

    fetchRoomMessages(room);

    const pollingInterval = setInterval(() => {
      fetchRoomMessages(room);
    }, 3000);

    return () => {
      clearInterval(pollingInterval);
    };
  }, [room]);

  const fetchRoomMessages = (room) => {
    axios.get(`http://127.0.0.1:5000/api/rooms/${room}/messages?username=${username}`).then((response) => {
      setMessages(response.data);
    });
  };
  
  const handleSendMessage = () => {
    if (userMessage.trim() !== "") {
      const messageData = {
        msg: userMessage,
        username: username,
        room: room,
      };

      axios.post("http://127.0.0.1:5000/api/messages", messageData).then(() => {
        fetchRoomMessages(room);
        setUserMessage("");
      });
    }
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("username", username);
    formData.append("room", room);

    setFile(formData);
    setSelectedFileName(selectedFile.name);
  };

  const handleSendFile = () => {
    if (file) {
      axios
        .post("http://127.0.0.1:5000/api/files", file, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          fetchRoomMessages(room);
          setFile(null);
          setSelectedFileName("");
        })
        .catch((error) => {
          console.error("File upload failed:", error);
        });
    }
  };
  const handleDownloadFile = (fileId) => {
    axios
      .get(`http://127.0.0.1:5000/api/files/${fileId}`, {
        responseType: "arraybuffer", // Add this line to receive the response as an array buffer
      })
      .then((response) => {
        // Convert the array buffer to a Blob object
        const fileBlob = new Blob([response.data], { type: "application/octet-stream" });
        
        // Create a temporary URL to the Blob object
        const fileUrl = URL.createObjectURL(fileBlob);

        // Create a link and simulate a click to download the file
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = selectedFileName; // Set the desired file name
        link.click();

        // Revoke the temporary URL to free up resources
        URL.revokeObjectURL(fileUrl);
      })
      .catch((error) => {
        console.error("File download failed:", error);
      });
  };
  
  
  
  const handleSendEmoji = (emoji) => {
    setUserMessage(emoji);
  };

  const renderMessageContent = (message) => {
    if (message.type === "file") {
      return (
        <>
          <span className="file-link" onClick={() => handleDownloadFile(message.msg)}>
            File: {message.filename}
          </span>
          <br />
        </>
      );
    } else if (message.type === "emoji") {
      return message.msg; // Render emoji messages
    } else {
      return message.msg; // Render regular text messages
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-light fixed-top" style={{ backgroundColor: "#66a1ee" }}>
        <h4 className="centered-text">Welcome {username}</h4>
      </nav>

      <div id="main-section">
        <nav id="sidebar">
          <h4 className="centered-text">Chatle</h4>
          {rooms.map((roomName) => (
            <p
              key={roomName}
              className={room === roomName ? "select-room cursor-pointer selected-room" : "select-room cursor-pointer"}
              onClick={() => setRoom(roomName)}
            >
              {roomName}
            </p>
          ))}
        </nav>

        <div id="rightside-pannel">
          <div id="display-message-section">
          <h4 className="centered-text">{room}</h4> 
            {messages.map((message, index) => (
              <p key={index} className={message.username === username ? "my-msg" : "others-msg"}>
                <span className={message.username === username ? "my-username" : "other-username"}>{message.username}</span>
                <br />
                {renderMessageContent(message)}
                <br />
                <span className="timestamp">{message.timestamp}</span>
              </p>
            ))}
          </div>
          <div id="input-area" className="input-group mb-3">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="form-control"
              placeholder="Type here..."
              aria-label="Type a message"
              aria-describedby="basic-addon2"
              autoComplete="off"
            />
            <div className="input-group-append">
              <button onClick={handleSendMessage} className="btn btn-warning" type="button">
                SEND <i className="fas fa-paper-plane"></i>
              </button>
              <input type="file" onChange={handleFileUpload} />
              <button onClick={handleSendFile} className="btn btn-primary" type="button">
                Send File
              </button>
              <button onMouseEnter={() => handleSendEmoji("😀")} className="btn btn-primary" type="button">
                😀
              </button>
            </div>
          </div>
        </div>
      </div>

      <span id="get-username">{username}</span>
    </div>
  );
};

export default ChatComponent;
