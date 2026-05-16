import React, { useEffect, useState } from "react";
import { Home, Search, PlusSquare, Heart, User } from "lucide-react";
import Navbar from "./Navbar";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const getData = async () => {
    try {
      const res = await api.get("/users");
      setUser(res.data.users);
    } catch (err) {
      console.log(err.response);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  async function follow(username) {
    try {
      await api.post(`users/${username}/follow`);
      getData();
    } catch (err) {
      console.log(err.response);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Navbar></Navbar>
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-xl mx-auto space-y-6">
          {user.map((item) => (
            <div className="p-2 border-b-1 mb-3 flex justify-between">
              <p
                onClick={() => {
                  navigate(`/profile/${item.username}`);
                }}
              >
                {item.username}
              </p>
              <div
                className="bg-blue-500 text-white px-2 py-1 rounded hover:cursor-pointer"
                onClick={() => {
                  follow(item.username);
                }}
              >
                follow
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
