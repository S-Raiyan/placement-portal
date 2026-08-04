import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Skeleton from "../components/Skeleton";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Dashboard() {
    const { user } = useAuth();

    const [jobs, setJobs] = useState([]);
    const [applicationCount, setApplicationCount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const [jobsResponse, applicationsResponse] =
                    await Promise.all([
                        api.get("/student/jobs"),
                        api.get("/student/applications/my")
                    ]);

                setJobs(
                    jobsResponse.data.jobs || []
                );

                setApplicationCount(
                    applicationsResponse.data.count || 0
                );

            } catch (error) {
                console.error(
                    "Dashboard loading error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    return (
        <>
            <Navbar />

            <main className="dashboard-page">

                <section className="dashboard-header">

                    <div>
                        <p className="dashboard-eyebrow">
                            Student Portal
                        </p>

                        <h1>
                            Welcome back, {user?.name}
                        </h1>

                        <p className="dashboard-subtitle">
                            Explore the latest placement
                            opportunities and track your
                            applications.
                        </p>
                    </div>

                </section>


                {loading ? (

                    <section className="dashboard-stats">

                        <Skeleton type="stat" />
                        <Skeleton type="stat" />
                        <Skeleton type="stat" />

                    </section>

                ) : (

                    <section className="dashboard-stats">

                        <div className="stat-card">
                            <span className="stat-label">
                                Available Jobs
                            </span>

                            <strong>
                                {jobs.length}
                            </strong>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">
                                My Applications
                            </span>

                            <strong>
                                {applicationCount}
                            </strong>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">
                                Profile
                            </span>

                            <strong>
                                {status}
                            </strong>
                        </div>

                    </section>

                )}


                <section className="dashboard-section">

                    <div className="section-heading">

                        <div>
                            <p className="section-eyebrow">
                                Opportunities
                            </p>

                            <h2>
                                Latest Jobs
                            </h2>
                        </div>

                        <a
                            href="/jobs"
                            className="view-all-link"
                        >
                            View all →
                        </a>

                    </div>


                    {loading ? (

                        <div className="job-preview-grid">

                            <Skeleton type="job" />
                            <Skeleton type="job" />
                            <Skeleton type="job" />

                        </div>

                    ) : error ? (

                        <div className="dashboard-error">
                            {error}
                        </div>

                    ) : jobs.length === 0 ? (

                        <div className="empty-state">
                            <h3>
                                No jobs available
                            </h3>

                            <p>
                                New placement opportunities
                                will appear here.
                            </p>
                        </div>

                    ) : (

                        <div className="job-preview-grid">

                            {jobs
                                .slice(0, 3)
                                .map((job) => (

                                    <article
                                        className="job-card"
                                        key={job._id}
                                    >

                                        <div className="job-card-top">

                                            <div className="company-logo">
                                                {job.companyName
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}
                                            </div>

                                            <span className="job-status">
                                                Open
                                            </span>

                                        </div>


                                        <div className="job-card-content">

                                            <p className="company-name">
                                                {job.companyName}
                                            </p>

                                            <h3>
                                                {job.jobTitle}
                                            </h3>

                                            <p className="job-location">
                                                {job.location}
                                            </p>

                                        </div>


                                        <a
                                            href={`/jobs/${job._id}`}
                                            className="job-card-button"
                                        >
                                            View opportunity
                                            <span>→</span>
                                        </a>

                                    </article>

                                ))}

                        </div>

                    )}

                </section>

            </main>
        </>
    );
}

export default Dashboard;