import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./Components/Login";
import { Home } from "./Components/Home";
import { Register } from "./Components/Register";

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};
