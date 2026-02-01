import "../../css/component/Right.css";
import { useRef, useEffect, useState } from "react";
import { sendMessage } from "../../service/UserService";
import { uploadFile } from "../../service/ApiService";
import downloadGif from "../../assets/download.gif";

import {
  FaPaperclip,
  FaPaperPlane,
  FaFile,
  FaImage,
  FaVideo,
  FaMusic,
  FaDownload,
} from "react-icons/fa";

function Right({ selectedUser, messages, setMessagesByUser }) {
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentUser = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const [selectedFile, setSelectedFile] = useState(null);
  const [downloadingMsg, setDownloadingMsg] = useState(null);
  const [loading, setLoding] = useState(false);
  const [viewingMsgId, setViewingMsgId] = useState(null);


  /* ------------------ Helpers ------------------ */

  const getMessageType = (mime) => {
    if (mime.startsWith("image")) return "IMAGES";
    if (mime.startsWith("audio")) return "AUDIO";
    if (mime.startsWith("video")) return "VIDEO";
    return "FILE";
  };

  const getIcon = (type) => {
    switch (type) {
      case "IMAGES":
        return <FaImage />;
      case "VIDEO":
        return <FaVideo />;
      case "AUDIO":
        return <FaMusic />;
      default:
        return <FaFile />;
    }
  };

  /* ------------------ Auto Scroll ------------------ */
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  /* ------------------ Send Message ------------------ */
  const handleSend = async () => {
    if (!selectedUser) return;
    setSelectedFile(null);
    
    fileInputRef.current.value = "";

    // FILE MESSAGE
    if (selectedFile) {
      setLoding(true);
      const res = await uploadFile(selectedFile, token);
      console.log("upload response", res.data);
      const msg = {
        sender: currentUser,
        receiver: selectedUser.username,
        content: res.data.url,
        type: getMessageType(selectedFile.type),
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        time: new Date().toISOString(),
      };

      appendMessage(msg);
      sendMessage(msg);
      setLoding(false);
      setSelectedFile(null);
      return;
    }

    // TEXT MESSAGE
    const text = inputRef.current.value.trim();
    if (!text) return;

    const msg = {
      sender: currentUser,
      receiver: selectedUser.username,
      content: text,
      type: "TEXT",

      time: new Date().toISOString(),
    };

    appendMessage(msg);
    sendMessage(msg);
    setLoding(false);
    inputRef.current.value = "";
  };

  const appendMessage = (msg) => {
    setMessagesByUser((prev) => ({
      ...prev,
      [selectedUser.username]: [...(prev[selectedUser.username] || []), msg],
    }));
  };

  /* ------------------ Download File ------------------ */
  const downloadFile = async (fileName) => {
    try {
      setDownloadingMsg(fileName);

      const res = await fetch(
        `http://localhost:8080/files/download?fileName=${encodeURIComponent(
          fileName,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download file");
    } finally {
      setDownloadingMsg(null);
    }
  };

  const handleView = async (msg) => {
    try {
    
       setViewingMsgId(msg.content);
      const res = await fetch(
        `http://localhost:8080/files/download?fileName=${encodeURIComponent(
          msg.content,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("View failed");

      const blob = await res.blob();

      // Create temp browser file
      const blobUrl = URL.createObjectURL(blob);

      // Open in new tab (VIEW)
      window.open(blobUrl, "_blank", "noopener,noreferrer");

      // Cleanup
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 10000);
    } catch (err) {
      console.error(err);
      alert("Unable to open file");
    } finally {
     
     setViewingMsgId(null)
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div id="right">
      {/* HEADER */}
      <div className="chat-header">
        <div className="chat-user">
          {selectedUser ? (
            <div className="avatar">
              <img src={selectedUser.profilePicture} alt="profile" />
            </div>
          ) : (
            <div className="avatar">?</div>
          )}
          <h4>{selectedUser?.username || "Select a user"}</h4>
        </div>
      </div>

      {/* MESSAGES */}
      < div className="messages" ref={messagesRef}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`msg ${
              msg.sender === currentUser ? "sent" : "received"
            }`}
          >
            {msg.type === "TEXT" && msg.content}

            {msg.type !== "TEXT" && (
              <div className="file-msg">
                <div className="file-row">
                  <span className="file-icon">{getIcon(msg.type)}</span>
                  <span className="file-name">{msg.fileName}</span>

                  <div className="file-actions">
                    
                    {viewingMsgId === msg.content ? (
                      <img src={downloadGif} height={20} style={{
                        borderRadius: 20,
                        marginTop: 8
                      }} alt="loading" />
                    ) : (
                      <button onClick={() => handleView(msg)}>👁️</button>
                    )}
                     {downloadingMsg === msg.content ? (
                      <img src={downloadGif} height={20} style={{
                        borderRadius: 20,
                        width: 20,
                        marginRight: 20,
                        marginBottom: 10,
                        alignSelf: 'end',
                        marginTop: 8
                      }} alt="loading" />
                    ): (
                       <button onClick={() => downloadFile(msg.content)}>
                      <FaDownload />
                    </button>
                    ) }
                   
                  </div>
                </div>

               
              </div>
            )}
            
          </div>
          
          
        ))}
               
          {loading ? (
                      <img src={downloadGif} height={40} style={{
                        borderRadius: 20,
                        width: 40,
                        marginRight: 20,
                        alignSelf: 'end',
                        marginTop: 8
                      }} alt="loading" />
                    ) : (
                      <div></div>
                    )}
        
      </div>
 
      
      {/* FILE PREVIEW */}
      {selectedFile && (
        <div className="file-preview">
          <div>
            <strong>{selectedFile.name}</strong>
            <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
          </div>

          <div className="file-actions">
            <button
              onClick={() => window.open(URL.createObjectURL(selectedFile))}
            >
              View
            </button>
            <button
              onClick={() => {
                setSelectedFile(null);
                fileInputRef.current.value = "";
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* INPUT */}
      {selectedUser && (
        <div className="chat-input">
          <button
            className="file-btn"
            onClick={() => fileInputRef.current.click()}
          >
            <FaPaperclip />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />

          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button className="send-btn" onClick={handleSend}>
            <FaPaperPlane />
          </button>
        </div>
      )}
    </div>
  );
}

export default Right;
