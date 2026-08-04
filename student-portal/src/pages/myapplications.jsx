import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

function MyApplications() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    useEffect(() => {

        const fetchApplications = async () => {

            try {

                const response = await api.get(
                    "/student/applications/my"
                );

                setApplications(
                    response.data.applications || []
                );

            } catch (error) {

                console.error(error);

                setError(
                    "Unable to load applications."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchApplications();

    }, []);

    const filteredApplications = useMemo(() => {

        return applications.filter((application) => {

            const company =
                application.job?.companyName || "";

            const job =
                application.job?.jobTitle || "";

            const status =
                application.status || "";

            return (
                company.toLowerCase().includes(search.toLowerCase()) ||
                job.toLowerCase().includes(search.toLowerCase()) ||
                status.toLowerCase().includes(search.toLowerCase())
            );

        });

    }, [applications, search]);

    return (
        <>
            <Navbar />

            <main className="my-applications-page">

                <div className="page-header">

                    <h1>
                        My Applications
                    </h1>

                    <p>
                        Track all your job applications.
                    </p>

                </div>

                <div className="search-box">

                    <input
                        type="text"
                        placeholder="Search company, job or status..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                {loading ? (

                    <p>Loading...</p>

                ) : error ? (

                    <p>{error}</p>

                ) : filteredApplications.length === 0 ? (

                    <div className="empty-state">

                        <h2>
                            No Applications Found
                        </h2>

                        <p>
                            Start applying for jobs.
                        </p>

                        <Link
                            to="/jobs"
                            className="browse-job-btn"
                        >
                            Browse Jobs
                        </Link>

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="applications-table">

                            <thead>

                                <tr>

                                    <th>Company</th>

                                    <th>Job</th>

                                    <th>Location</th>

                                    <th>Status</th>

                                    <th>Applied On</th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredApplications.map((application) => (

                                    <tr key={application._id}>

                                        <td>
                                            {application.job?.companyName}
                                        </td>

                                        <td>
                                            {application.job?.jobTitle}
                                        </td>

                                        <td>
                                            {application.job?.location}
                                        </td>

                                        <td>

                                            <span
                                                className={`status-badge ${application.status}`}
                                            >
                                                {application.status}
                                            </span>

                                        </td>

                                        <td>

                                            {new Date(
                                                application.createdAt
                                            ).toLocaleDateString()}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </main>

        </>
    );

}

export default MyApplications;