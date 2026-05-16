import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import api from "../api";
import { useAuth } from "../context/authContext";

export default function Notification() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  console.log(user.username);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get(
          `api/v1/users/${user.username}/pending-follower`,
        );
        console.log(res.data);
      } catch (err) {
        console.log(err.response);
      }
    };
    getData();
  }, []);
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Navbar></Navbar>
      {/* Main Content */}
      {/* <main className="flex-1 p-6">
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
      </main> */}
    </div>
  );
}
