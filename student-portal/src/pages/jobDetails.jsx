import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

function JobDetails() {
    const { jobId } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        console.log("Job ID:", jobId );

        const fetchJob = async () => {
            try {
                console.log("Fetching job...");

                setLoading(true);
                setError("");

                const response = await api.get(
                    `/student/jobs/${jobId }`
                );

                console.log(
                    "Job API response:",
                    response.data
                );

                setJob(response.data.job);

            } catch (error) {
                console.error(
                    "Job details error:",
                    error
                );

                console.log(
                    "Status:",
                    error.response?.status
                );

                console.log(
                    "Response:",
                    error.response?.data
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load job"
                );

            } finally {
                console.log("Finished loading");

                setLoading(false);
            }
        };

        if (jobId ) {
            fetchJob();
        } else {
            setError("Job ID is missing");
            setLoading(false);
        }

    }, [jobId]);


    if (loading) {
        return (
            <>
                <Navbar />

                <main className="job-details-page">
                    <h2>Loading job...</h2>
                </main>
            </>
        );
    }


    if (error) {
        return (
            <>
                <Navbar />

                <main className="job-details-page">

                    <h2>
                        Unable to load job
                    </h2>

                    <p>
                        {error}
                    </p>

                    <Link to="/jobs">
                        ← Back to Jobs
                    </Link>

                </main>
            </>
        );
    }


    if (!job) {
        return (
            <>
                <Navbar />

                <main className="job-details-page">
                    <h2>
                        Job not found
                    </h2>

                    <Link to="/jobs">
                        ← Back to Jobs
                    </Link>
                </main>

            </>
        );
    }


    return (
        <>
            <Navbar />

            <main className="job-details-page">

                <Link
                    to="/jobs"
                    className="back-to-jobs"
                >
                    ← Back to Jobs
                </Link>


                <section className="job-details-card">

                    <div className="job-details-header">

                        <div className="company-logo large">
                            {job.companyName
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                        <div>

                            <p className="company-name">
                                {job.companyName}
                            </p>

                            <h1>
                                {job.jobTitle}
                            </h1>

                            <div className="job-meta">

                                <span>
                                    📍 {job.location}
                                </span>

                                <span>
                                    💼 {job.employmentType}
                                </span>

                                {job.salary && (
                                    <span>
                                        💰 {job.salary}
                                    </span>
                                )}

                            </div>

                        </div>

                    </div>


                    <div className="job-details-body">

                        <section>
                            <h2>
                                Job Description
                            </h2>

                            <p>
                                {job.description}
                            </p>
                        </section>


                        {job.eligibility && (
                            <section>
                                <h2>
                                    Eligibility
                                </h2>

                                <p>
                                    {job.eligibility}
                                </p>
                            </section>
                        )}


                        {Array.isArray(job.skills) &&
                            job.skills.length > 0 && (
                                <section>

                                    <h2>
                                        Required Skills
                                    </h2>

                                    <div className="job-skills">

                                        {job.skills.map(
                                            (skill) => (
                                                <span
                                                    key={skill}
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )}

                                    </div>

                                </section>
                            )}


                        <section>

                            <h2>
                                Application Deadline
                            </h2>

                            <p>
                                {new Date(
                                    job.applicationDeadline
                                ).toLocaleDateString()}
                            </p>

                        </section>

                    </div>


                    <div className="job-details-footer">

                        <Link
                            to={`/jobs/${job._id}/apply`}
                            className="apply-job-button"
                        >
                            Apply Now
                        </Link>

                    </div>

                </section>

            </main>
        </>
    );
}

export default JobDetails;