import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/Home/HomePage";
import Login from "./components/Authentication/Login";
import AddStock from "./components/Home/AddStock";
import Bill from "./components/Home/Bill";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inventory" element={<HomePage />} />
        <Route path="/addstock" element={<AddStock />} />
        <Route path="/bill" element={<Bill />} />
      </Routes>
    </Router>
  );
}

export default App;
