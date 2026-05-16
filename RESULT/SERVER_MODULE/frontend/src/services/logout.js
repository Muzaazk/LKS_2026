import api from "./api";

export const logout = async function logout(navigate) {
  try {
    const res = await api.post("/logout");
    alert(res.data?.message || "success");
    localStorage.removeItem("token");
    navigate("/");
  } catch (err) {
    alert(err.response?.data?.message || "failed");
  }
};
