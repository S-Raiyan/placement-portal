import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/jobs";
import JobDetails from "./pages/jobDetails";
import MyApplications from "./pages/myapplications";
import ApplyJob from "./pages/Applyjob";

import ProtectedRoute from "./components/ProtectedRoute";
import StudentIdCard from "./pages/StudentIdCard";
import StudentAttendance from "./pages/StudentAttendance";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/jobs"
                        element={<Jobs />}
                    />

                    <Route
                        path="/jobs/:jobId"
                        element={<JobDetails />}
                    />

                    <Route
                        path="/applications"
                        element={<MyApplications />}
                    />

                    <Route
                        path="/jobs/:id/apply"
                        element={<ApplyJob/>}
                    />

                    <Route
                       path="/student-id"
                       element={<StudentIdCard/>}
                    />

                    <Route
                        path="/attendance"
                        element={<StudentAttendance/>}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;