import { useNavigate } from "react-router";
import api from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.log(err.response);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
        {/* Left: Title */}
        <div className="text-xl font-bold text-gray-800">Instalment Cars</div>

        {/* Right: Menu */}
        <div className="flex items-center space-x-4">
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
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">Dashboard</h1>

        <div className="mt-10 border-1 p-2 w-max">
          <h2>My data validation</h2>
          <button
            className="bg-blue-900 px-3 py-1 text-sky-50 mt-2 cursor-pointer"
            onClick={() => {
              navigate("/request-validation");
            }}
          >
            + Request Validation
          </button>
        </div>
        <div className="mt-15">
          <h2>My instalment car</h2>
          <div className="mt-1 bg-yellow-100 width-max rounded px-3 py-4">
            Your validation must be approved by validator to instalment cars
          </div>
        </div>
      </main>
    </div>
  );
}
