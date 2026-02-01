import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import App from "./App";
import NotFound from "./NotFound";
import UserProfile from "./pages/ProfilePage";

function RouterPage() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user-profile" element={<UserProfile/>}/>
      <Route path="*" element={<NotFound/>}/>

    </Routes>
  );
}

export default RouterPage;
