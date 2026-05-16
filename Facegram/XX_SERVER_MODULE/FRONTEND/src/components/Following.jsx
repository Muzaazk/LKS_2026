import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";

export default function Following() {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const username = useParams();

  const getData = async () => {
    try {
      const res = await api.get(`/following`);
      setUser(res.data.following);
    } catch (err) {
      console.log(err.response);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  //   async function follow(username) {
  //     try {
  //       const res = await api.post(`users/${username}/follow`);
  //       getData();
  //     } catch (err) {
  //       console.log(err.response);
  //     }
  //   }

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
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
