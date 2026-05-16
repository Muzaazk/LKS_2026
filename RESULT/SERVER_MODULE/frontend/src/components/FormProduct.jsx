import { Profiler, useEffect, useState } from "react";
import api from "../services/api";

export default function FormProduct({ product, categories, onClose, onSave }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setStock(product.stock);
    }
  }, [product]);
  const submit = async (e) => {
    e.preventDefault();
    try {
      let res = "";
      if (product) {
        res = await api.patch(`/products/${product.id}`, {
          name: name,
          price: price,
          stock: stock,
          category_id: category,
        });
      } else {
        res = await api.post("products", {
          name: name,
          price: price,
          stock: stock,
          category_id: category,
        });
      }
      console.log(res.data);
      alert(res.data.message);
      onClose();
      onSave();
    } catch (errors) {
      alert(errors.response?.message || "failed");
      console.log(errors.response);
    }
  };

  return (
    <>
      <form action="" className="p-5" onSubmit={submit}>
        <h3 className="mb-2">{product ? "Edit" : "Add"} Product</h3>
        <input
          type="text"
          required
          placeholder="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="form-control mb-2"
        />
        <input
          type="number"
          required
          className="form-control mb-2"
          placeholder="price"
          onChange={(e) => {
            setPrice(e.target.value);
          }}
          value={price}
        />
        <input
          type="number"
          required
          className="form-control mb-2"
          placeholder="stock"
          onChange={(e) => {
            setStock(e.target.value);
          }}
          value={stock}
        />
        <select
          required
          name="category"
          className="form-control mb-2"
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          value={category}
        >
          <option value="" disabled>
            --- Select category ---
          </option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <button className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary">{product ? "Edit" : "Add"}</button>
      </form>
    </>
  );
}
