import { PaperClipIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Home, Search, PlusSquare, Heart, User } from "lucide-react";
import Navbar from "./Navbar";

export default function Profile() {
  const { user, setUser, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [follower, setFollower] = useState("");
  const [following, setFollowing] = useState("");
  const [bio, setBio] = useState("");
  const [postCount, setPostCount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user.username) return;

    async function fetchData() {
      try {
        const res = await api.get(`/users/${user.username}`);
        setFullName(res.data.full_name);
        setUsername(res.data.username);
        setBio(res.data.bio);
        setFollower(res.data.followers_count);
        setFollowing(res.data.following_count);
        setPostCount(res.data.posts_count);
      } catch (err) {
        console.log(err.response.message);
      }
    }
    fetchData();
  }, []);

  const logout = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.log(err.response);
    }
  };

  return (
    !loading && (
      <div className="flex min-h-screen bg-gray-100">
        <Navbar></Navbar>
        <div className="px-4 sm:px-0 m-5  ">
          <div className="items-center justify-center flex max-w-full w-300">
            <h3 className="text-base/7 font-bold  text-gray-900">
              {user.username}
            </h3>
            <button
              className="bg-red-500 rounded px-3 py-1 font-medium text-white"
              onClick={(e) => {
                logout(e);
              }}
            >
              Logout
            </button>
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
            postCount={postCount}
          ></DetailProfile>
        </div>
      </div>
    )
  );
}

export function DetailProfile({
  fullName,
  bio,
  follower,
  following,
  username,
  postCount,
}) {
  const navigate = useNavigate();
  return (
    <div className="mt-6 border-t border-gray-100">
      <dl className="divide-y divide-gray-100">
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm/6 font-medium text-gray-900">Full name</dt>
          <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
            {fullName}
          </dd>
        </div>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm/6 font-medium text-gray-900">Bio</dt>
          <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
            {bio}
          </dd>
        </div>
        <div
          className="px-4 py-6 hover:bg-gray-200/50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 hover:cursor-pointer"
          onClick={() => {
            navigate(`/${username}/follower`);
          }}
        >
          <dt className="text-sm/6 font-medium text-gray-900">Follower </dt>
          <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
            {follower}
          </dd>
        </div>
        <div
          className="px-4 py-6 hover:bg-gray-200/50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 hover:cursor-pointer"
          onClick={() => {
            navigate(`/${username}/following`);
          }}
        >
          <dt className="text-sm/6 font-medium text-gray-900">Following </dt>
          <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
            {following}
          </dd>
        </div>

        <div className="px-4 py-6 hover:bg-gray-200/50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 hover:cursor-pointer">
          <dt className="text-sm/6 font-medium text-gray-900">Post Count </dt>
          <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
            {postCount}
          </dd>
        </div>
      </dl>
    </div>
  );
}
