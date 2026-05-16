import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import RequestValidation from "./components/RequestValidation";

function App() {
  return (
    <>
      <BrowserRouter basename="/XX_SERVER_MODULE/FRONTEND">
        <Routes>
          <Route path="/" element={<Login></Login>}></Route>
          <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
          <Route
            path="/request-validation"
            element={<RequestValidation></RequestValidation>}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
