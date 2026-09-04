import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">P</div>

        <div>
          <strong>ProjectFlow</strong>
          <span>Management System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">MAIN MENU</p>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          <span>▦</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          <span>▣</span>
          Projects
        </NavLink>
      </nav>
    </aside>
  );
}