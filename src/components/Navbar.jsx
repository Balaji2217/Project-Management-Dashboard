import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div>
        <h1>ProjectFlow</h1>
        <p>Project Management Dashboard</p>
      </div>

      <div className="user-menu">
        <button
          className="user-button"
          onClick={() => setOpen(!open)}
        >
          <div className="avatar">
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="user-info">
            <strong>{currentUser?.name}</strong>
            <span>{currentUser?.email}</span>
          </div>

          <span>⌄</span>
        </button>

        {open && (
          <div className="user-dropdown">
            <div>
              <strong>{currentUser?.name}</strong>
              <span>{currentUser?.email}</span>
            </div>

            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}