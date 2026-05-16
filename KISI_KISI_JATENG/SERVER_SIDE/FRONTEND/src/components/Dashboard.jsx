import { useNavigate } from "react-router";
import api from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const res = await api.post("/auth/logout");
      console.log(res.data);
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.log(err.response);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
          {/* Left: Title */}
          <div className="text-xl font-bold text-gray-800">Dashboard</div>

          {/* Right: Menu */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-blue-500">Home</button>
            <button className="text-gray-600 hover:text-blue-500">
              Profile
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={() => {
                logout();
              }}
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Content */}
        <main className="p-6">
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">
            Welcome Back 👋
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-gray-500">Users</h2>
              <p className="text-2xl font-bold">1,200</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-gray-500">Revenue</h2>
              <p className="text-2xl font-bold">$3,400</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-gray-500">Orders</h2>
              <p className="text-2xl font-bold">320</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
