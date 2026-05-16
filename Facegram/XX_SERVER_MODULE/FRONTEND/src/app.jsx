import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/register.jsx";
import { useEffect, useState } from "react";

import api from "./api.js";
import UseProvider from "./context/authContext.jsx";
import Profile from "./components/Profile.jsx";
import SearchPage from "./components/Search.jsx";
import UsersProfile from "./components/UsersProfile.jsx";
import Following from "./components/Following.jsx";
import Follower from "./components/Follower.jsx";
import Notification from "./components/Notification.jsx";
import Post from "./components/Post.jsx";

export default function App() {
  function PrivateRoute({ children }) {
    let [isLogin, setIsLogin] = useState(null);

    useEffect(() => {
      const check = async () => {
        try {
          await api.get("/posts");
          setIsLogin(true);
        } catch (err) {
          console.log(err.response);
          setIsLogin(false);
        }
      };
      check();
    }, []);

    if (isLogin == null) {
      return <div>loading</div>;
    }

    return isLogin ? children : <Navigate to="/" />;
  }

  return (
    <UseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile/:username" element={<UsersProfile />} />
          <Route path="/:username/following" element={<Following />} />
          <Route path="/:username/follower" element={<Follower />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/post" element={<Post />} />
        </Routes>
      </BrowserRouter>
    </UseProvider>
  );
}
