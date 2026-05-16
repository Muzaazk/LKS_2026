import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../services/api";
import FormCategory from "./FormCategory";
import { logout } from "../services/logout";

export default function Category() {
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [edit, setEdit] = useState(false);
  const [editCategory, setEditCategory] = useState([]);

  const getCategory = async () => {
    try {
      const res = await api.get("/categories");
      setCategory(res.data.data);
    } catch (errors) {
      alert(errors.response?.data?.message);
    }
  };
  useEffect(() => {
    getCategory();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/categories", {
        name,
        description,
      });
      console.log(res.data);
      alert(res.data.message);
      setName("");
      setDescription("");
      getCategory();
    } catch (err) {
      alert(err.response);
      console.log(err.response);
    }
  };

  async function deleted(id) {
    try {
      const res = await api.delete(`/categories/${id}`);
      alert(res.data.message);
      getCategory();
    } catch (err) {
      alert(err);
      console.log(err);
    }
  }

  function showEdit(item) {
    setEdit(true);
    setEditCategory(item);
  }

  function closeEdit() {
    setEdit(false);
    setEditCategory([]);
  }

  return (
    <>
      <div className="sidebar p-3">
        <h4 className="text-primary fw-bold mb-4">Product Management</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <a
              className="nav-link"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Dashboard
            </a>
          </li>
          <li className="nav-item mb-2">
            <a className="nav-link active">Categories</a>
          </li>
          <li className="nav-item mb-2">
            <a
              className="nav-link"
              onClick={() => {
                navigate("/product");
              }}
            >
              Products
            </a>
          </li>
          <li className="nav-item mb-2">
            <a
              className="nav-link"
              onClick={() => {
                navigate("/transaction");
              }}
            >
              Transactions
            </a>
          </li>
          <li className="nav-item mt-4">
            <a
              className="nav-link text-danger"
              onClick={() => {
                logout(navigate);
              }}
            >
              Logout
            </a>
          </li>
        </ul>
      </div>

      <div className="content">
        <h3>Category</h3>

        <div className="card shadow-sm mb-3">
          <div className="card-body">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Category Name"
              required
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Description"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              value={description}
            />
            <button onClick={submit} className="btn btn-primary btn-sm">
              Save
            </button>
          </div>
        </div>

        <table className="table table-bordered bg-white">
          <thead className="table-light">
            <tr align="center">
              <th>No</th>
              <th>Category</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {category.map((item, index) => (
              <tr key={index}>
                <td align="center">{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td align="center">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                      showEdit(item);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      deleted(item.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {edit && (
          <div className="modal fade show d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <FormCategory
                  category={editCategory}
                  getCategory={getCategory}
                  closeEdit={closeEdit}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
