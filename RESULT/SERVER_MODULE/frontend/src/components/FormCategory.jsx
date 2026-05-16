import { useEffect, useState } from "react";
import api from "../services/api";

export default function FormCategory({ category, getCategory, closeEdit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(category.name);
    setDescription(category.description);
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/categories/${category.id}`, {
        name,
        description,
      });
      alert(res.data.message || "success");
      closeEdit();
      getCategory();
    } catch (err) {
      alert(err.response?.data?.errors?.name || "failed");
    }
  };
  return (
    <form action="" className="p-5">
      <h3>Edit Product</h3>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      <button className="btn btn-secondary" onClick={closeEdit}>
        Cancel
      </button>
      <button className="btn btn-primary" onClick={submit}>
        Edit
      </button>
    </form>
  );
}
