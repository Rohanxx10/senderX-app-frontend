import { useEffect, useState } from "react";
import "../css/component/userProfile.css";
import { userProfile } from "../service/ApiService";
import { FaUserCircle } from "react-icons/fa";

function UserProfile() {
  const [user, setUser] = useState({
    name: "unknown",
    email: "unknown",
    lastName: "unknown",
    firstName: "unknown",
    photoUrl: "unknown",
  });

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const username = localStorage.getItem("username");
      if (!username) return;

      const profile = await userProfile(username);

      setUser({
        username: profile.data.username,
        email: profile.data.email,
        lastName: profile.data.lastName,
        firstName: profile.data.firstName,
        photoUrl: profile.data.profilePicture,
      });
    } catch (e) {
      console.error(e);
    }
  };

  fetchProfile();
}, []);


  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* TOP SECTION */}
        <div className="profile-top">
          {user.photoUrl === "unknown" ? (
            <FaUserCircle />
          ) : (
            <img src={user.photoUrl} alt="profile" className="profile-avatar" />
          )}

          <div className="profile-basic">
            <h2>
              {user.firstName} {user.lastName}
            </h2>
            <p className="username">@{user.username}</p>
            <p className="email">{user.email}</p>
          </div>
        </div>

        {/* INFO GRID */}
        <div className="profile-info-grid">
          <div className="info-box">
            <span>First Name</span>
            <p>{user.firstName}</p>
          </div>

          <div className="info-box">
            <span>Last Name</span>
            <p>{user.lastName}</p>
          </div>

          <div className="info-box">
            <span>Username</span>
            <p>{user.username}</p>
          </div>

          <div className="info-box">
            <span>Email</span>
            <p>{user.email}</p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="profile-actions">
          <button className="edit-btn">Edit Profile</button>
          <button className="logout-btn">Sign Out</button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
