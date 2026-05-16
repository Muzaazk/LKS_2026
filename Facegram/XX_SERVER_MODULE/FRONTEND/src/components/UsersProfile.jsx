import { PaperClipIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import { DetailProfile } from "./Profile";

export default function UsersProfile() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [follower, setFollower] = useState("");
  const [following, setFollowing] = useState("");
  const [bio, setBio] = useState("");
  const user = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`/users/${user.username}`);
        setFullName(res.data.full_name);
        setUsername(res.data.username);
        setBio(res.data.bio);
        setFollower(res.data.followers_count);
        setFollowing(res.data.following_count);
      } catch (err) {
        console.log(err.response);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar></Navbar>
      <div className="p-10 w-full">
        <div className="px-4 sm:px-0 w-full">
          <div className="justify-center flex max-w-full w-full">
            <h3 className="text-base/7 font-bold  text-gray-900">
              {user.username}
            </h3>
          </div>
          <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
            Personal details.
          </p>
          <DetailProfile
            fullName={fullName}
            bio={bio}
            follower={follower}
            following={following}
            username={username}
          ></DetailProfile>
        </div>
      </div>
    </div>
  );
}
