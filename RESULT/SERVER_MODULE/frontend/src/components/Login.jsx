import { useState } from "react";
import api from "../services/api.js";
import { Navigate, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      alert(response.data?.message || "success");
      navigate("/dashboard");
    } catch (errors) {
      const data = errors.response?.data;

      if (errors.response.status === 422) {
        if (data.errors?.email) {
          alert(data.errors.email);
        }
        if (data.errors?.password) {
          alert(data.errors.password);
        }
      } else if (errors.response.status === 401) {
        alert(data?.message);
      } else {
        alert("Kesalahan sambungan");
      }
    }
  };
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="card shadow" style={{ width: "350px" }}>
        <div className="card-body">
          <h4 className="text-center mb-4">Login</h4>
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="text"
                className="form-control"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <button className="btn btn-primary w-100" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
