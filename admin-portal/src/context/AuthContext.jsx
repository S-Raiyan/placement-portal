import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token =
            localStorage.getItem("adminToken");

        if (!token) {
            setLoading(false);
            return;
        }

        const getCurrentAdmin = async () => {
            try {
                const response =
                    await api.get("/auth/me");

                setAdmin(response.data.user);

            } catch (error) {
                console.error(
                    "Admin authentication error:",
                    error
                );

                localStorage.removeItem(
                    "adminToken"
                );

                setAdmin(null);

            } finally {
                setLoading(false);
            }
        };

        getCurrentAdmin();

    }, []);

    const login = async (email, password) => {

        const response = await api.post(
            "/auth/admin/login",
            {
                email,
                password
            }
        );

        const token =
            response.data.token;

        localStorage.setItem(
            "adminToken",
            token
        );

        setAdmin(response.data.user);

        return response.data;
    };

    const logout = () => {
        localStorage.removeItem(
            "adminToken"
        );

        setAdmin(null);
    };

    return (
        <AuthContext.Provider
            value={{
                admin,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>
    useContext(AuthContext);