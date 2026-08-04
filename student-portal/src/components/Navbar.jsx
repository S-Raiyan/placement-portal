import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
    FiMenu,
    FiX,
    FiHome,
    FiBriefcase,
    FiFileText,
    FiUser,
    FiUserCheck
} from "react-icons/fi";

function Navbar() {

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className="navbar">

            <div className="navbar-inner">

                <NavLink
                    to="/dashboard"
                    className="navbar-brand"
                >
                    <span className="brand-mark">
                        P
                    </span>

                    <span>
                        Placement Portal
                    </span>
                </NavLink>

                <nav className="navbar-links">

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/jobs"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Jobs
                    </NavLink>

                    <NavLink
                        to="/applications"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        My Applications
                    </NavLink>

                    <NavLink
                        to="/student-id"
                        className={({ isActive}) => 
                            isActive? "nav-link active": "nav-link"}>
            
                                Smart ID
                            </NavLink>

                    <NavLink
                        to="/attendance"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Attendance
                    </NavLink>

                </nav>

                <div className="navbar-profile">

                    <div className="profile-info">

                        <div className="profile-avatar">
                            {user?.name?.charAt(0)?.toUpperCase() || "S"}
                        </div>

                        <div className="profile-text">

                            <span className="profile-name">
                                {user?.name || "Student"}
                            </span>

                            <span className="profile-role">
                                Student
                            </span>

                        </div>

                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                    <button
                        className="menu-toggle"
                        onClick={() =>
                            setMenuOpen(!menuOpen)
                        }
                    >
                        <FiMenu />
                    </button>

                </div>

            </div>

            {menuOpen && (
                <>
                    <div
                        className="mobile-overlay"
                        onClick={closeMenu}
                    />

                    <aside className="mobile-sidebar">

                        <button
                            className="close-menu"
                            onClick={closeMenu}
                        >
                            <FiX />
                        </button>

                        <NavLink
                            to="/dashboard"
                            className="mobile-link"
                            onClick={closeMenu}
                        >
                            <FiHome />
                            <span>Dashboard</span>
                        </NavLink>

                        <NavLink
                            to="/jobs"
                            className="mobile-link"
                            onClick={closeMenu}
                        >
                            <FiBriefcase />
                            <span>Jobs</span>
                        </NavLink>

                        <NavLink
                            to="/applications"
                            className="mobile-link"
                            onClick={closeMenu}
                        >
                            <FiFileText />
                            <span>My Applications</span>
                        </NavLink>

                         <NavLink
                            to="/student-id"
                            className="mobile-link"
                            onClick={closeMenu}
                        >
                            <FiUser/>
                            <span>Smart ID</span>
                        </NavLink>

                         <NavLink
                            to="/attendance"
                            className="mobile-link"
                            onClick={closeMenu}
                        >
                            <FiUserCheck/>
                            <span>Attendance</span>
                        </NavLink>

                        <button className="moblie.logout" onClick={handleLogout}>
                         Logout
                        </button>

                    </aside>

                </>
            )}

        </header>
    );
}

export default Navbar;