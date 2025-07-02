import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./Components/Login"
import { Home } from "./Components/Home"


export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  )
}

