import { useState, useRef, useEffect } from "react";
import { FaExpandAlt, FaCompressAlt } from "react-icons/fa";
import Left from "./Left";
import Right from "./Right";
import "../../css/component/ChatBox.css";
import { useNavigate } from "react-router-dom";
import { addIncommingContact, deleteAllData, getToken } from "../../service/UserService";
import { connectToWebSocketAndReceiverMessages } from "../../service/websocket";
import { getPreviousChats, isValidToken } from "../../service/ApiService";



function ChatBox({setUser}) {

  const [isFullScreen, setIsFullScreen] = useState(false);
  const scrollPosition = useRef(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messagesByUser, setMessagesByUser] = useState({});
  const socketConnectedRef = useRef(false);
  const [active, setActive] = useState("");


  const currentUser = localStorage.getItem("username");
  const [token,setToken]=useState(getToken());
  const [chatBox,setChatBox]=useState(null);

  // 🔥 THIS is handleIncomingMessage
const handleIncomingMessage = (msg) => {
  const currentUser = localStorage.getItem("username");

  if (msg.sender === currentUser && msg.receiver === currentUser) return;

  const chatUser =
    msg.sender === currentUser ? msg.receiver : msg.sender;

  setMessagesByUser(prev => ({
    ...prev,
    [chatUser]: [...(prev[chatUser] || []), msg],
  }));

  // 🔥 ONLY for incoming messages
  if (msg.sender !== currentUser) {
    addIncommingContact(msg);
    setActive(msg.sender); // 🔴 active unread user
  }
};


  const validToken = async () => {
  const res = await isValidToken();
  return res.data; 
};



useEffect(() => {
  if (!selectedUser) return;

  const fetchChat = async () => {
    try {
      const res = await getPreviousChats(
        currentUser,
        selectedUser.username
      );
      console.log(res.data)
      setMessagesByUser(prev => ({
        ...prev,
        [selectedUser.username]: res.data
      }));
    } catch (err) {
      console.error("Failed to load chat history", err);
    }
  };

  fetchChat();
}, [selectedUser]);




useEffect(() => {
  if (socketConnectedRef.current) return;

  if (!currentUser || !token) return;

  socketConnectedRef.current = true;
  console.log("check..........")
  const checkAuth = async () => {
    const isValid = await validToken();
    console.log("validation token ",isValid);
    if (!isValid) {
      setToken("");
      setChatBox(false);
      deleteAllData();
      setUser(null);
      // localStorage.removeItem("token");
    }
     else{
      setChatBox(true);
    connectToWebSocketAndReceiverMessages(
    currentUser,
    token,
    handleIncomingMessage,
    () => console.log("WebSocket connected")
  );
  console.log("connect to websocket")
  };

  }
    checkAuth();

  

  return () => {
    // optional: disconnect here on unmount
  };
}, [currentUser, token]);



  const navigate = useNavigate();
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      scrollPosition.current = window.scrollY;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: scrollPosition.current, behavior: "smooth" });
    }
    setIsFullScreen(!isFullScreen);
  };

  const handle = () => {
    navigate("/register");
  };

  

  return (
    <div id="chatBox" className={isFullScreen ? "fullscreen" : ""}>
      {/* IF NOT LOGGED IN */}
      {(!chatBox) ? (
        <div className="chat-locked">
          <h3>Join DropTalk</h3>
          <p>Please register or login to start chatting and sharing files.</p>
          <button className="register-btn" onClick={handle}>
            Register / Login
          </button>
        </div>
      ) : (
        <>
          {/* FULLSCREEN BUTTON */}
          <button className="fullscreen-btn" onClick={toggleFullScreen}>
            {isFullScreen ? <FaCompressAlt /> : <FaExpandAlt />}
          </button>

          <Left setSelectedUser={setSelectedUser} active={active} setActive={setActive}/>
          <Right selectedUser={selectedUser}   messages={messagesByUser[selectedUser?.username] || []} setMessagesByUser={setMessagesByUser} />
        </>
      )}
    </div>
  );
}

export default ChatBox;
