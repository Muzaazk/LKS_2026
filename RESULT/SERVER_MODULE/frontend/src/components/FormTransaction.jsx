import { useEffect, useState } from "react";
import api from "../services/api";
import { toRupiah } from "../utils/format";

export default function FormTransaction({ closeAdd, getTransaction }) {
  const [product, setProduct] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState([]);
  async function getData() {
    try {
      const res = await api.get("/products");
      setProduct(res.data.data);
    } catch (err) {
      alert(err.response?.message || "failed");
    }
  }
  useEffect(() => {
    getData();
  }, []);
  const [rows, setRows] = useState([
    { product_id: 0, price: 0, qty: 0, total: 0 },
  ]);
  function addRow() {
    setRows((prev) => [...prev, { product_id: 0, price: 0, qty: 0, total: 0 }]);
  }

  function addData(index, field, value) {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i != index) {
          return row;
        }
        let newRow = { ...row, [field]: value };
        if (field === "product_id") {
          const selectedProduct = product.find(
            (item) => item.id === newRow.product_id,
          );
          newRow.price = selectedProduct.price;
        }

        const total = newRow.price * newRow.qty;
        newRow.total = total;

        return newRow;
      }),
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/transactions", {
        payment_method: paymentMethod,
        details: rows.map((item) => ({
          product_id: item.product_id,
          quantity: item.qty,
        })),
      });
      alert(res.data?.message || "success");
      closeAdd();
      getTransaction();
    } catch (err) {
      alert(err.response?.data?.error || "failed");
    }
  };
  return (
    <form onSubmit={submit}>
      <h3 align="center">Add Transaction</h3>
      <select
        id=""
        value={paymentMethod}
        className="form-control mb-3"
        required
        onChange={(e) => {
          setPaymentMethod(e.target.value);
        }}
      >
        <option value="" disabled selected>
          --- Payment Method ---
        </option>
        <option value="QRIS">Qris</option>
        <option value="Cash">Cash</option>
        <option value="Tranfer">Tranfer</option>
      </select>
      <table className="table">
        <thead align="center">
          <tr>
            <td>No</td>
            <td>Product</td>
            <td>Price</td>
            <td>Qty</td>
            <td>total</td>
          </tr>
        </thead>
        <tbody align="center">
          {rows.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <select
                  name=""
                  id=""
                  className="form-control"
                  onChange={(e) => {
                    addData(index, "product_id", Number(e.target.value));
                  }}
                  required
                >
                  <option value="" disabled selected>
                    -- Product --
                  </option>
                  {product.map((product, no) => (
                    <option value={product.id} key={no}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={toRupiah(rows[index].price)}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  required
                  onChange={(e) => {
                    addData(index, "qty", Number(e.target.value));
                  }}
                  value={rows[index].qty || ""}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={toRupiah(rows[index].total)}
                  readOnly
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">
              <button
                className="btn btn-light"
                type="button"
                onClick={() => {
                  addRow();
                }}
              >
                + Add row
              </button>
            </td>
            <td align="end">Subtotal :</td>
            <td>
              <input
                type="text"
                className="form-control"
                value={toRupiah(
                  rows.reduce((sum, row) => {
                    return sum + row.total;
                  }, 0),
                )}
              />
            </td>
          </tr>
        </tfoot>
      </table>
      <button
        className="btn btn-primary me-3"
        onClick={() => {
          submit();
        }}
      >
        Add
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => {
          closeAdd();
        }}
      >
        Close
      </button>
    </form>
  );
}
