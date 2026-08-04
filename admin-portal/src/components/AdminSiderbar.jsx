import { NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminSidebar() {

    const { logout } = useAuth();

    return (
        <aside className="admin-sidebar">

            <div className="admin-sidebar-brand">

                <span className="admin-brand-mark">
                    P
                </span>

                <div>
                    <strong>
                        Placement
                    </strong>

                    <span>
                        Admin Panel
                    </span>
                </div>

            </div>


            <nav className="admin-sidebar-nav">

                <p className="sidebar-label">
                    MAIN
                </p>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive ? "active" : ""
                        }`
                    }
                >
                    <span>⌂</span>
                    Dashboard
                </NavLink>


                <p className="sidebar-label">
                    MANAGEMENT
                </p>

                <NavLink
                    to="/students"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive ? "active" : ""
                        }`
                    }
                >
                    <span>♙</span>
                    Students
                </NavLink>

                <NavLink to="/attendance"   className={({ isActive }) =>
                        `sidebar-link ${
                            isActive ? "active" : ""
                        }`
                    }>
                     Attendance </NavLink>


                <NavLink
                    to="/jobs"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive ? "active" : ""
                        }`
                    }
                >
                    <span>▣</span>
                    Jobs
                </NavLink>


                <NavLink
                    to="/applications"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive ? "active" : ""
                        }`
                    }
                >
                    <span>▤</span>
                    Applications
                </NavLink>

            </nav>


            <div className="admin-sidebar-bottom">

                <button
                    onClick={logout}
                    className="sidebar-logout"
                >
                    <span>↪</span>
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default AdminSidebar;