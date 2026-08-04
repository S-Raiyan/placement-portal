import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Skeleton from "../components/Skeleton";
import api from "../services/api";

function Jobs() {
    const [jobs, setJobs] = useState([]);

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    "/student/jobs"
                );

                setJobs(
                    response.data.jobs || []
                );

            } catch (error) {
                console.error(
                    "Jobs loading error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load jobs"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const locations = useMemo(() => {
        return [
            ...new Set(
                jobs
                    .map((job) => job.location)
                    .filter(Boolean)
            )
        ];
    }, [jobs]);

    const filteredJobs = useMemo(() => {
        const searchValue =
            search.trim().toLowerCase();

        return jobs.filter((job) => {
            const matchesSearch =
                !searchValue ||
                job.jobTitle
                    ?.toLowerCase()
                    .includes(searchValue) ||
                job.companyName
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesLocation =
                !location ||
                job.location === location;

            return (
                matchesSearch &&
                matchesLocation
            );
        });
    }, [jobs, search, location]);

    return (
        <>
            <Navbar />

            <main className="jobs-page">

                <section className="jobs-header">

                    <div>
                        <p className="dashboard-eyebrow">
                            Opportunities
                        </p>

                        <h1>
                            Find your next opportunity
                        </h1>

                        <p>
                            Explore placement opportunities
                            available for you.
                        </p>
                    </div>

                </section>


                <section className="jobs-filters">

                    <div className="search-wrapper">

                        <span>
                            Search
                        </span>

                        <input
                            type="text"
                            placeholder="Job title or company"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    <select
                        value={location}
                        onChange={(e) =>
                            setLocation(e.target.value)
                        }
                    >
                        <option value="">
                            All locations
                        </option>

                        {locations.map(
                            (item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            )
                        )}

                    </select>

                </section>


                {loading ? (

                    <section className="jobs-grid">

                        <Skeleton type="job" />
                        <Skeleton type="job" />
                        <Skeleton type="job" />
                        <Skeleton type="job" />
                        <Skeleton type="job" />
                        <Skeleton type="job" />

                    </section>

                ) : error ? (

                    <div className="jobs-message error">
                        {error}
                    </div>

                ) : filteredJobs.length === 0 ? (

                    <div className="jobs-message">

                        <h3>
                            No opportunities found
                        </h3>

                        <p>
                            Try changing your search
                            or location filter.
                        </p>

                    </div>

                ) : (

                    <section className="jobs-grid">

                        {filteredJobs.map(
                            (job) => (

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

                                        <div className="job-meta">

                                            <span>
                                                📍 {job.location}
                                            </span>

                                            <span>
                                                💼{" "}
                                                {job.employmentType}
                                            </span>

                                        </div>

                                        {job.applicationDeadline && (
                                            <p className="job-deadline">
                                                Apply before{" "}
                                                {new Date(
                                                    job.applicationDeadline
                                                ).toLocaleDateString()}
                                            </p>
                                        )}

                                    </div>


                                    <Link
                                        to={`/jobs/${job._id}`}
                                        className="job-card-button"
                                    >
                                        View opportunity
                                        <span>→</span>
                                    </Link>

                                </article>

                            )
                        )}

                    </section>

                )}

            </main>
        </>
    );
}

export default Jobs;