import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiMapPin,
  FiCalendar,
  FiLogOut,
} from "react-icons/fi";

import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar">
      <div>
        <h2 className="sidebar-title">Airbnb Admin</h2>

        <nav className="sidebar-links">
          <Link
            to="/dashboard"
            className={isActive("/dashboard") ? "active" : ""}
          >
            <FiHome />
            Dashboard
          </Link>

          <Link
            to="/users"
            className={isActive("/users") ? "active" : ""}
          >
            <FiUsers />
            Users
          </Link>

          <Link
            to="/listings"
            className={isActive("/listings") ? "active" : ""}
          >
            <FiMapPin />
            Listings
          </Link>

          <Link
            to="/reservations"
            className={isActive("/reservations") ? "active" : ""}
          >
            <FiCalendar />
            Reservations
          </Link>
        </nav>
      </div>

      <button
        type="button"
        className="logout-button"
        onClick={handleLogout}
      >
        <FiLogOut />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;