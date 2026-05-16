import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import FormTransaction from "./FormTransaction";
import { toRupiah } from "../utils/format";
import { logout } from "../services/logout";

export default function Transaction() {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState([]);
  const [addTransaction, setAddTransaction] = useState(false);

  useEffect(() => {
    getTransaction();
  }, []);
  async function getTransaction() {
    try {
      const res = await api.get("/transactions");
      setTransaction(res.data.data);
    } catch (err) {
      console.log(err.response);
    }
  }

  async function deleted(id) {
    try {
      const res = await api.delete(`/transactions/${id}`);
      alert(res.data.message || "success");
      getTransaction();
    } catch (err) {
      console.log(err.response?.message || "failed");
    }
  }

  function showAdd() {
    setAddTransaction(true);
  }
  function closeAdd() {
    setAddTransaction(false);
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
          <li className="nav-item mb-2 ">
            <a className="nav-link active">Transactions</a>
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
          <h3>Transactions</h3>
          <button
            onClick={() => {
              showAdd();
            }}
            className="btn btn-primary btn-sm"
          >
            + New Transaction
          </button>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-light">
                <tr align="center">
                  <th>No</th>
                  <th>Transaction Code</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th width="180">Action</th>
                </tr>
              </thead>
              <tbody>
                {transaction.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.transaction_code}</td>
                    <td>{item.transaction_date}</td>
                    <td>{toRupiah(item.total_amount)}</td>
                    <td>
                      <a
                        onClick={() => {
                          navigate(`/transaction-detail/${item.id}`);
                        }}
                        className="btn btn-info btn-sm"
                      >
                        Detail
                      </a>
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
            {addTransaction && (
              <div className="modal show fade d-block ">
                <div className="modal-dialog ">
                  <div
                    className="modal-content p-3 "
                    style={{ width: "750px" }}
                  >
                    <FormTransaction
                      closeAdd={closeAdd}
                      getTransaction={getTransaction}
                    ></FormTransaction>
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
