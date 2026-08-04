import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { useEffect, useState } from "react";

import api from "../services/api";



function AdminDashboard() {

    const { admin } = useAuth();

    const [stats, setStats] = useState({
        students: 0,
        jobs: 0,
        applications: 0,
        selected: 0
    })

    useEffect(() => {

    const fetchStats = async () => {


        try {

            const response =
                await api.get(
                    "/admin/dashboard/stats"
                );

                console.log("Response:", response)

            setStats(response.data.stats);

        } catch (error) {

            console.log("error =",error)
            console.log("error response =",error.response)

            console.error(error);

        }

    };

    fetchStats();

}, []);


    return (
        <div className="dashboard-page">

            <section className="dashboard-welcome">

                <div>

                    <p className="page-eyebrow">
                        OVERVIEW
                    </p>

                    <h1>
                        Good to see you,{" "}
                        {admin?.name || "Admin"}
                    </h1>

                    <p>
                        Manage students, jobs and
                        placement applications from
                        one place.
                    </p>

                </div>

            </section>


            <section className="dashboard-stats">

                <div className="dashboard-stat-card">

                    <div className="stat-icon">
                        ♙
                    </div>

                    <div>
                        <span>
                            Total Students
                        </span>

                        <strong>
                            {stats.students}
                        </strong>
                    </div>

                </div>


                <div className="dashboard-stat-card">

                    <div className="stat-icon">
                        ▣
                    </div>

                    <div>
                        <span>
                            Active Jobs
                        </span>

                        <strong>
                            {stats.jobs}
                        </strong>
                    </div>

                </div>


                <div className="dashboard-stat-card">

                    <div className="stat-icon">
                        ▤
                    </div>

                    <div>
                        <span>
                            Applications
                        </span>

                        <strong>
                            {stats.applications}
                        </strong>
                    </div>

                </div>


                <div className="dashboard-stat-card">

                    <div className="stat-icon">
                        ✓
                    </div>

                    <div>
                        <span>
                            Selected
                        </span>

                        <strong>
                            {stats.selected}
                        </strong>
                    </div>

                </div>

            </section>


            <section className="dashboard-actions">

                <div className="dashboard-section-header">

                    <div>
                        <p className="page-eyebrow">
                            QUICK ACTIONS
                        </p>

                        <h2>
                            Manage portal
                        </h2>
                    </div>

                </div>


                <div className="quick-actions">

                    <Link
                        to="/students"
                        className="quick-action-card"
                    >
                        <span className="quick-action-icon">
                            ♙
                        </span>

                        <strong>
                            Manage Students
                        </strong>

                        <span>
                            Add, update and manage
                            student accounts →
                        </span>
                    </Link>


                    <Link
                        to="/jobs"
                        className="quick-action-card"
                    >
                        <span className="quick-action-icon">
                            ▣
                        </span>

                        <strong>
                            Manage Jobs
                        </strong>

                        <span>
                            Create and publish
                            opportunities →
                        </span>
                    </Link>


                    <Link
                        to="/applications"
                        className="quick-action-card"
                    >
                        <span className="quick-action-icon">
                            ▤
                        </span>

                        <strong>
                            Applications
                        </strong>

                        <span>
                            Review student
                            applications →
                        </span>
                    </Link>

                </div>

            </section>

        </div>
    );
}

export default AdminDashboard;