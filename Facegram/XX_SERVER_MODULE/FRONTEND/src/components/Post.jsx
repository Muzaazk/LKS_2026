import React, { useEffect, useState } from "react";
import { Home, Search, PlusSquare, Heart, User } from "lucide-react";
import Navbar from "./Navbar";
import api from "../api";

function PostCard({ post }) {
  const attachments = post.attachments || [];
  const multiple = attachments.length > 1;
  const carouselId = `carousel-post-${post.id}`;

  return (
    <div
      id={carouselId}
      className="carousel slide flex flex-column items-center"
    >
      <div className="carousel-inner">
        {attachments.map((item, index) => (
          <div
            className={`carousel-item ${index === 0 ? "active" : ""}`}
            key={item.id}
          >
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/storage/${item.storage_path}`}
              className="d-block w-100"
              alt="Post attachment"
            />
          </div>
        ))}
      </div>

      {multiple && (
        <>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target={`#${carouselId}`}
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target={`#${carouselId}`}
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </>
      )}
      <button className="btn btn-secondary size-max mt-2">delete</button>
    </div>
  );
}

export default function Post() {
  const [posts, setPosts] = useState(null);
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get("/posts");
        setPosts(res.data.posts);
      } catch (err) {
        console.log(err.response);
      }
    };
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("caption", caption);

    console.log(images.length);
    for (let i = 0; i < images.length; i++) {
      formData.append("attachments[]", images[i]);
    }

    try {
      const res = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data);
      setCaption("");
      setImages([]);
    } catch (err) {
      console.log(err.response);
    }
  };

  return (
    posts && (
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Navbar></Navbar>
        {/* Main Content */}

        <main className="flex-1 p-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded-lg shadow mb-6"
          >
            <textarea
              placeholder="Tulis caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <input
              type="file"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files))}
              className="mb-3"
            />

            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Post
            </button>
          </form>

          <div className=" mx-auto space-y-6 grid grid-cols-3 gap-20">
            {posts.map((item) => (
              <PostCard key={item.id} post={item} />
            ))}
          </div>
        </main>
      </div>
    )
  );
}
