import { useNavigate } from "react-router";
import api from "../api";
import { useState } from "react";

export default function RequestValidation() {
  const [job, setJob] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [income, setIncome] = useState(null);
  const [reason, setReason] = useState(null);
  const [message, setMessage] = useState(false);

  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post("/validations", {
        job,
        job_description: jobDescription,
        income,
        reason_accepted: reason,
      });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/dashboard");
        setMessage(false);
      }, 3000);
    } catch (err) {
      console.log(err.response);
      setMessage(err.response.data.message);
    }
  };

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
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">
          Request Data Validation
        </h1>
        <form action="" className="flex flex-col">
          <div>
            <label htmlFor="">Are you working?</label>
            <select name="working" id="working" className="border-1 ml-2">
              <option value="">Yes, i have</option>
            </select>
          </div>
          <input
            onChange={(e) => {
              setJob(e.target.value);
            }}
            required
            type="text"
            placeholder="your job"
            className="border-1 rounded py-1 px-3 mt-3"
          />
          <textarea
            onChange={(e) => {
              setJobDescription(e.target.value);
            }}
            required
            className="border-1 rounded py-1 px-3 mt-3"
            name="job-description"
            id=""
            placeholder="describe what you do in your job"
          ></textarea>
          <input
            onChange={(e) => {
              setIncome(e.target.value);
            }}
            required
            type="number"
            placeholder="income (Rp)"
            className="border-1 rounded py-1 px-3 mt-3"
          />
          <label htmlFor="" className="mt-6">
            Reason Accepted
          </label>
          <textarea
            onChange={(e) => {
              setReason(e.target.value);
            }}
            required
            name="reason"
            id=""
            className="border-1 rounded py-1 px-3 mt-3"
            placeholder="Explain why you should be accepted"
          ></textarea>
          <button
            type="button"
            className="bg-blue-500 size-max py-1 px-3 rounded mt-3 cursor-pointer"
            onClick={() => {
              submit();
            }}
          >
            Send request
          </button>
        </form>
        {message && (
          <div className="flex align-center justify-center bg-red-200 rounded p-3 mt-3">
            {message}
          </div>
        )}
      </main>
    </div>
  );
}
