import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

function ApplicationDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [application, setApplication] = useState(null);

    const [loading, setLoading] = useState(true);

    const [updating, setUpdating] = useState(false);

    const fetchApplication = async () => {

        try {

            const response = await api.get(
                `/admin/applications/${id}`
            );

            setApplication(
                response.data.application
            );

        } catch (error) {

            console.error(error);

            alert("Unable to load application");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchApplication();

    }, [id]);

    const updateStatus = async (status) => {

        try {

            setUpdating(true);

            await api.put(
                `/admin/applications/${id}`,
                { status }
            );

            alert("Status updated successfully");

            fetchApplication();

        } catch (error) {

            console.error(error);

            alert("Failed to update status");

        } finally {

            setUpdating(false);

        }

    };

    if (loading) {

        return (


                <h2>Loading...</h2>



        );

    }

    return (

        <div className="application-details-page">

            <button
                className="back-btn"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            <h1>
                Application Details
            </h1>

            <hr />

            <h2>
                Student Details
            </h2>

            <p>
                <strong>Name:</strong>
                {" "}
                {application.student?.name}
            </p>

            <p>
                <strong>Email:</strong>
                {" "}
                {application.student?.email}
            </p>

            <p>
                <strong>Phone:</strong>
                {" "}
                {application.phone}
            </p>

            <hr />

            <h2>
                Job Details
            </h2>

            <p>
                <strong>Company:</strong>
                {" "}
                {application.job?.companyName}
            </p>

            <p>
                <strong>Position:</strong>
                {" "}
                {application.job?.jobTitle}
            </p>

            <p>
                <strong>Location:</strong>
                {" "}
                {application.job?.location}
            </p>

            <hr />

            <h2>
                Cover Message
            </h2>

            <p>
                {application.coverMessage ||
                    "No cover message"}
            </p>

            <hr />

            <h2>
                Status
            </h2>

            <h3>
                {application.status}
            </h3>

            <button
                disabled={updating}
                onClick={() =>
                    updateStatus(
                        "shortlisted"
                    )
                }
            >
                Shortlist
            </button>

            <button
                disabled={updating}
                onClick={() =>
                    updateStatus(
                        "selected"
                    )
                }
            >
                Select
            </button>

            <button
                disabled={updating}
                onClick={() =>
                    updateStatus(
                        "rejected"
                    )
                }
            >
                Reject
            </button>

        </div>

    );

}

export default ApplicationDetails;