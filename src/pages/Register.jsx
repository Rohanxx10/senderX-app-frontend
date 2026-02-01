import { useState } from "react";
import "../css/component/Register.css";
import { Link, useNavigate } from "react-router-dom";
import {
  createUser,
  isExistUser,
  isExistUserEmail,
} from "../service/ApiService.jsx";

import av1 from "../assets/av1.jpg";
import av2 from "../assets/av2.jpg";
import av3 from "../assets/av3.png";
import av4 from "../assets/av4.jpg";
import av5 from "../assets/av5.png";
import av6 from "../assets/av6.jpg";

const defaultAvatars = [av1, av2, av3, av4, av5, av6];

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: "",
  });

  const [usernameStatus, setUsernameStatus] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const [errors, setErrors] = useState({});

  let usernameTimer;
  let emailTimer;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    /* ================= USERNAME CHECK ================= */
    if (name === "username") {
      setUsernameStatus("");
      if (value.length < 3) return;

      clearTimeout(usernameTimer);
      usernameTimer = setTimeout(async () => {
        try {
          setUsernameStatus("checking");
          const res = await isExistUser(value);

          if (res.data === true) {
            setUsernameStatus("exists");
          } else {
            setUsernameStatus("available");
          }
        } catch {
          setUsernameStatus("");
        }
      }, 400);
    }

    /* ================= EMAIL CHECK ================= */
    if (name === "email") {
      setEmailStatus("");

      if (!/^\S+@\S+\.\S+$/.test(value)) return;

      clearTimeout(emailTimer);
      emailTimer = setTimeout(async () => {
        try {
          setEmailStatus("checking");
          console.log("email", value);
          const res = await isExistUserEmail(value);
          console.log("email check ", res.data);
          if (res.data === true) {
            setEmailStatus("exists");
          } else {
            setEmailStatus("available");
          }
        } catch {
          setEmailStatus("");
        }
      }, 400);
    }
  };

const urlToFile = async (url, filename) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

const handleAvatarSelect = async (avatarUrl) => {
  const file = await urlToFile(avatarUrl, "avatar.jpg");

  setForm((prev) => ({
    ...prev,
    profilePicture: file,
  }));
};


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        profilePicture: "Invalid image file",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      profilePicture: file,
    }));

    setErrors((prev) => ({ ...prev, profilePicture: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.firstname) newErrors.firstname = "Required";
    if (!form.lastname) newErrors.lastname = "Required";

    if (!form.username || form.username.length < 3)
      newErrors.username = "Min 3 characters";

    if (usernameStatus === "exists")
      newErrors.username = "Username already exists";

    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Invalid email";

    if (emailStatus === "exists") newErrors.email = "Email already exists";

    if (!form.password || form.password.length < 6)
      newErrors.password = "Min 6 characters";

    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!form.profilePicture)
      newErrors.profilePicture = "Profile picture required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("first_name", form.firstname);
      formData.append("last_name", form.lastname);
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("confirm_password", form.confirmPassword);

      if (form.profilePicture instanceof File) {
        formData.append("profilePicture", form.profilePicture);
      }

      await createUser(formData);
      navigate("/login", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="signup-page">
      <form className="signup-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p>Join DropTalk and start sharing securely</p>

        <div className="row">
          <input
            name="firstname"
            placeholder="First Name"
            onChange={handleChange}
            className={errors.firstname ? "invalid" : ""}
          />
          <input
            name="lastname"
            placeholder="Last Name"
            onChange={handleChange}
            className={errors.lastname ? "invalid" : ""}
          />
        </div>

        {/* USERNAME */}
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className={
            usernameStatus === "exists"
              ? "invalid"
              : usernameStatus === "available"
                ? "valid"
                : ""
          }
        />

        {usernameStatus === "checking" && (
          <p className="field-info">Checking username...</p>
        )}
        {usernameStatus === "exists" && (
          <p className="field-error">Username already exists</p>
        )}
        {usernameStatus === "available" && (
          <p className="field-success">Username available ✓</p>
        )}

        {/* EMAIL */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className={
            emailStatus === "exists"
              ? "invalid"
              : emailStatus === "available"
                ? "valid"
                : ""
          }
        />

        {emailStatus === "checking" && (
          <p className="field-info">Checking email...</p>
        )}
        {emailStatus === "exists" && (
          <p className="field-error">Email already exists</p>
        )}
        {emailStatus === "available" && (
          <p className="field-success">Email available ✓</p>
        )}

        {/* AVATAR */}
        {/* AVATAR */}
        <div className="avatar-section">
          <p className={errors.profilePicture ? "error-text" : ""}>
            Choose Profile Picture
          </p>

          <div className="avatar-list">
            {defaultAvatars.map((avatar, i) => (
              <img
                key={i}
                src={avatar}
                alt={`avatar-${i}`}
                className={
                  form.profilePicture === avatar ? "avatar active" : "avatar"
                }
                onClick={() => handleAvatarSelect(avatar)}
              />
            ))}
          </div>

          <label className="upload-btn">
            Upload from Gallery
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>

          {/* ✅ PREVIEW */}
          {form.profilePicture && (
            <img
              src={
                form.profilePicture instanceof File
                  ? URL.createObjectURL(form.profilePicture)
                  : form.profilePicture
              }
              alt="preview"
              className="preview-img"
            />
          )}
        </div>

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className={errors.password ? "invalid" : ""}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          className={errors.confirmPassword ? "invalid" : ""}
        />

        <button type="submit">Sign Up</button>

        <span className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
}

export default Register;
