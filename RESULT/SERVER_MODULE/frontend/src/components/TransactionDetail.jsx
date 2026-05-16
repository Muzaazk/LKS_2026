import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useEffect, useState } from "react";
import { toRupiah } from "../utils/format";
import { logout } from "../services/logout";

export default function TransactionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const idNum = Number(id);
  const [transaction, setTransaction] = useState([]);
  const [transactionDetail, setTransactionDetail] = useState([]);

  async function getTransactionDetail() {
    try {
      const res = await api.get(`/transactions/${idNum}`);
      setTransaction([res.data.data]);
      setTransactionDetail(res.data.data.transaction_details);
    } catch (err) {
      console.log(err.response);
    }
  }
  useEffect(() => {
    getTransactionDetail();
  }, []);
  // console.log(transaction[0].transaction_date);

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
                navigate("/categories");
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
        <h3>Transaction Detail</h3>

        <div className="card shadow-sm mb-3">
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <p>
                  <strong>Transaction Code:</strong>
                  {transaction[0]?.transaction_code}
                </p>
              </div>
              <div className="col-md-4">
                <p>
                  <strong>Date:</strong>
                  {transaction[0]?.transaction_date}
                </p>
              </div>
              <div className="col-md-4">
                <p>
                  <strong>Status:</strong> Completed
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>No</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {transactionDetail.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.product.name}</td>
                    <td>{toRupiah(item.price)}</td>
                    <td>{item.quantity}</td>
                    <td>{toRupiah(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-secondary">
                  <th colSpan="4" className="text-end">
                    Total
                  </th>
                  <th>{toRupiah(transaction[0]?.total_amount)}</th>
                </tr>
              </tfoot>
            </table>

            <a
              onClick={() => {
                navigate("/transaction");
              }}
              className="btn btn-secondary btn-sm"
            >
              Back to Transactions
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
