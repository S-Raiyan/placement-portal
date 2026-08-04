import { useAuth } from "../context/AuthContext";

function AdminHeader() {

    const { admin } = useAuth();

    return (
        <header className="admin-header">

            <div>
                <p className="admin-header-label">
                    ADMIN PANEL
                </p>

                <h2>
                    Placement Management
                </h2>
            </div>


            <div className="admin-profile">

                <div className="admin-avatar">
                    {admin?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "A"}
                </div>

                <div className="admin-profile-info">

                    <strong>
                        {admin?.name || "Admin"}
                    </strong>

                    <span>
                        Administrator
                    </span>

                </div>

            </div>

        </header>
    );
}

export default AdminHeader;