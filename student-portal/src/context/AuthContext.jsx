import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("studentToken");

        if (!token) {
            setLoading(false);
            return;
        }

        const getCurrentUser = async () => {
            try {
                const response = await api.get("/auth/me");

                if (
                    response.data.success &&
                    response.data.user.role === "student"
                ) {
                    setUser(response.data.user);
                } else {
                    logout();
                }
            } catch (error) {
                localStorage.removeItem("studentToken");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getCurrentUser();
    }, []);

    const login = async (username, password) => {
        const response = await api.post(
            "/auth/student/login",
            {
                username,
                password
            }
        );

        const { token, user } = response.data;

        if (user.role !== "student") {
            throw new Error("Student access only");
        }

        localStorage.setItem(
            "studentToken",
            token
        );

        setUser(user);

        return response.data;
    };

    const logout = () => {
        localStorage.removeItem("studentToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};