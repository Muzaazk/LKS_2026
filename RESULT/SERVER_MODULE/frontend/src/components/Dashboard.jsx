import React, { useEffect, useState } from "react";
import "../index.css";
import api from "../services/api";
import { Navigate, useNavigate } from "react-router-dom";
import { logout } from "../services/logout";

export default function Dashboard() {
  const [product, setProduct] = useState(0);
  const [category, setCategory] = useState(0);
  const [transaction, setTransaction] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function res() {
      try {
        const [responseProduct, responseCategory, responseTransaction] =
          await Promise.all([
            api.get("/products"),
            api.get("/categories"),
            api.get("/transactions"),
          ]);

        setProduct(responseProduct.data.data.length);
        setCategory(responseCategory.data.data.length);
        setTransaction(responseTransaction.data.data.length);
      } catch (errors) {
        console.log(errors.response);
      }
    }
    (";");
    res();
  }, []);

  return (
    <>
      <div className="sidebar p-3">
        <h4 className="text-primary fw-bold mb-4">Product Management</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <a className="nav-link active">Dashboard</a>
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
        <h3>Dashboard</h3>
        <p>Welcome to the admin panel</p>

        <div className="row">
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6>Total Category</h6>
                <h3>{category}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6>Total Product</h6>
                <h3>{product}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6>Total Transaction</h6>
                <h3>{transaction}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
