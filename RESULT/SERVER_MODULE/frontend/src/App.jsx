import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Category from "./components/Category";
import Product from "./components/Product";
import Transaction from "./components/Transaction";
import TransactionDetail from "./components/TransactionDetail";
import api from "./services/api";
import { useEffect, useState } from "react";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const check = async () => {
      if (!token) {
        setIsAuth(false);
        return;
      }
      try {
        await api.get("/products");
        setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
      }
    };
    check();
  }, []);

  if (isAuth === null) {
    return <p>Memverifikasi akses...</p>;
  }

  if (isAuth === false) {
    return <Navigate to="/" />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/category"
          element={
            <PrivateRoute>
              <Category />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/product"
          element={
            <PrivateRoute>
              <Product />
            </PrivateRoute>
          }
        ></Route>

        <Route
          path="/transaction"
          element={
            <PrivateRoute>
              <Transaction />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/transaction-detail/:id"
          element={
            <PrivateRoute>
              <TransactionDetail />
            </PrivateRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
