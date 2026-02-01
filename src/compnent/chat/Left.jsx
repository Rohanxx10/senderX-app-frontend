import { useEffect, useState } from "react";
import "../../css/component/Left.css";
import { FaSearch, FaFilter, FaQrcode, FaCamera } from "react-icons/fa";
import { search } from "../../service/ApiService";
import {
  addSelectedChat,
  setCurrentReceiver,
  getSelectedChats
} from "../../service/UserService";

import UserQrCard from "../QrCode";
import QrScanner from "../QrScanner";

function Left({ setSelectedUser, setActive }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [contacts, setContacts] = useState([]);
  const username = localStorage.getItem("username");
  const [showQR, setShowQR] = useState(false);
  const [scanQR, setScanQR] = useState(false);
  const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);


  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      const response = await search(value);
      setResults(response.data);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

    const handleScanResult = (scannedUsername) => {
    console.log("Scanned Username:", scannedUsername);
    setScanQR(false);

    // 🔥 Example action:
    // open chat / search user / navigate
    // navigate(`/chat/${scannedUsername}`);
  };

  const handleUserClick = (user) => {
    setCurrentReceiver(user);
    addSelectedChat(user);
    setContacts(getSelectedChats());
    setSelectedUser(user);
    setShowDropdown(false);
    setQuery("");
  };

  const contactClick = (user) => {
    setCurrentReceiver(user);
    setSelectedUser(user);
    setActive(""); // ❌ clear red dot

    const currentUser = localStorage.getItem("username");
    const key = `selectedChats_${currentUser}`;

    let chats = JSON.parse(localStorage.getItem(key)) || [];
    chats = chats.map(c =>
      c.username === user.username ? { ...c, unread: false } : c
    );

    localStorage.setItem(key, JSON.stringify(chats));
    setContacts(chats);
  };

  useEffect(() => {
    setContacts(getSelectedChats());

    // 🔁 keep syncing when new msg comes
    const interval = setInterval(() => {
      setContacts(getSelectedChats());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="left">
      <div className="left-top">
        <h3>Chats</h3>
        <FaQrcode
        className="icon"
        onClick={() => setShowQR(true)}
        title="Show QR"
      />

      {showQR && (
        <UserQrCard
          username={username}
          onClose={() => setShowQR(false)}
        />
      )}
      </div>
       {isMobile() && (
        <FaCamera
          className="icon"
          title="Scan QR"
          onClick={() => setScanQR(true)}
        />
      )}
       {scanQR && (
        <QrScanner
          onResult={handleScanResult}
          onClose={() => setScanQR(false)}
        />
      )}

      <div className="search-box">
        <FaSearch />
        <input
          type="text"
          placeholder="Search contacts"
          value={query}
          onChange={handleSearch}
        />
        <FaFilter />
      </div>

      {showDropdown && (
        <div className="search-dropdown">
          {results.map(user => (
            <div
              key={user.id}
              className="search-item"
              onClick={() => handleUserClick(user)}
            >
              <img src={user.profilePicture || "/default-avatar.png"} />
              <div>
                <h4>{user.username}</h4>
                <p>{user.firstName} {user.lastName}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="contacts">
        {contacts.map((user, i) => (
          <div
            key={i}
            className={`contact ${user.unread ? "highlight" : ""}`}
            onClick={() => contactClick(user)}
          >
              {user.unread && <span className="red-dot" />}
            <div className="avatar">
              <img src={user.profilePicture || "/default-avatar.png"} />
            </div>

            <div className="contact-info">
              <h4>{user.username}</h4>
            </div>

          
          </div>
        ))}
      </div>
    </div>
  );
}

export default Left;
