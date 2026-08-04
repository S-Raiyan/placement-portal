import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import AdminLayout from "./components/AdminLayout";

import Students from "./pages/Students";
import Jobs from "./pages/jobs";
import Applications from "./pages/Applications";
import ApplicationDetails from "./pages/ApplicationDetails";
import Attendance from "./pages/Attendance";

function ProtectedRoute({ children }) {

    const {
        admin,
        loading
    } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!admin) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
}

function App() {

    return (
        <Routes>

            <Route
                path="/login"
                element={<AdminLogin />}
            />


            <Route
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    path="/dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/students"
                    element={<Students/>}
                />
                <Route 
                    path="/attendance"
                    element={<Attendance/>}
                />

                <Route
                    path="/jobs"
                    element={
                        <Jobs/>
                    }
                />

                <Route
                    path="/applications"
                    element={
                        <Applications/>
                    }
                />


                 <Route
                path="/dashboard/applications/:id"
                element={<ApplicationDetails />}
            />


            </Route>

           

            <Route
                path="*"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />
        </Routes>
    );
}

export default App;