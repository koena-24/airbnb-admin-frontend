import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Users from "./pages/Users/Users";
import Listings from "./pages/Listings/Listings";
import Reservations from "./pages/Reservations/Reservations";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/listings" element={<Listings />} />
      <Route path="/reservations" element={<Reservations />} />
    </Routes>
  );
}

export default App;