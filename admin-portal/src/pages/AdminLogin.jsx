import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminLogin() {

    const {
        admin,
        login
    } = useAuth();

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    if (admin) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!email || !password) {
            setError(
                "Email and password are required"
            );
            return;
        }

        try {

            setLoading(true);

            await login(
                email,
                password
            );

            navigate(
                "/dashboard",
                {
                    replace: true
                }
            );

        } catch (error) {

            console.error(
                "Admin login error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-login-page">

            <section className="admin-login-card">

                <div className="admin-login-header">

                    <span className="admin-badge">
                        ADMIN
                    </span>

                    <h1>
                        Placement Portal
                    </h1>

                    <p>
                        Sign in to manage
                        placement activities.
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="admin-login-form"
                >

                    {error && (
                        <div className="admin-login-error">
                            {error}
                        </div>
                    )}


                    <div className="admin-form-field">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <div className="admin-form-field">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign in"}
                    </button>

                </form>

            </section>

        </main>
    );
}

export default AdminLogin;