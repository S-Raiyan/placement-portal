import {
    Outlet
} from "react-router-dom";

import AdminSidebar from "./AdminSiderbar";
import AdminHeader from "./AdminHeader";

function AdminLayout() {

    return (
        <div className="admin-layout">

            <AdminSidebar />

            <div className="admin-main">

                <AdminHeader />

                <div className="admin-content">
                    <Outlet />
                </div>

            </div>

        </div>
    );
}

export default AdminLayout;
