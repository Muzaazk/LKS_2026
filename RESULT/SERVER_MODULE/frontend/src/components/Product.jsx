import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import FormProduct from "./FormProduct";
import { toRupiah } from "../utils/format";
import { logout } from "../services/logout";

export default function Product() {
  const [data, setData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  const initApi = useEffect(() => {
    getApi();
    category();
  }, []);

  async function getApi() {
    try {
      const res = await api.get("/products");
      setData(res.data.data);
    } catch (errors) {
      console.log(errors.response);
    }
  }
  async function category() {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data);
    } catch (errors) {
      console.log(errors.response);
    }
  }
  const deleted = (id) => {
    async function deleteProducts() {
      try {
        const res = await api.delete(`/products/${id}`);
        setData(data.filter((item) => item.id !== id));
        if (res) {
          alert(res.data?.message);
        }
      } catch (errors) {
        console.log(errors.response);
      }
    }
    deleteProducts();
  };

  const handleEdit = (item = null) => {
    setEdit(true);
    setProduct(item);
  };

  const onClose = () => {
    setEdit(false);
    setProduct(null);
  };

  const onSave = () => {
    getApi();
  };

  const navigate = useNavigate();
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
            <a
              className="nav-link"
              onClick={() => {
                navigate("/category");
              }}
            >
              Categories
            </a>
          </li>
          <li className="nav-item mb-2">
            <a className="nav-link active">Products</a>
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Products</h3>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              handleEdit();
            }}
          >
            + Add Product
          </button>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-light">
                <tr align="center">
                  <th>No</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th width="180">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.name}</td>
                    <td>{data.category.name}</td>
                    <td>{toRupiah(data.price)}</td>
                    <td>{data.stock}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => {
                          handleEdit(data);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          deleted(data.id);
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
                <div className="modal-dialog p-5">
                  <div className="modal-content">
                    <FormProduct
                      product={product}
                      categories={categories}
                      onClose={onClose}
                      onSave={onSave}
                    ></FormProduct>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
