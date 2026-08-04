import QRCode from "react-qr-code";
import { useAuth } from "../context/AuthContext";

function StudentIdCard() {

    const { user } = useAuth();

    return (

    <div className="student-id-page">

        <div className="student-id-card">

            <h2>Institute Smart ID</h2>

            <div className="student-avatar">

                {user?.name?.charAt(0).toUpperCase()}

            </div>

            <h3>{user?.name}</h3>

            <p>

                <strong>ID :</strong> {user?.studentId}

            </p>

            <p>

                <strong>Course :</strong> {user?.course}

            </p>

            <p>

                <strong>Email :</strong> {user?.email}

            </p>

            <div className="student-qr">

                <QRCode
                    value={user?.studentId || ""}
                    size={180}
                />

            </div>

            <div className="student-footer">

                Scan this QR for attendance

            </div>

        </div>

    </div>

);

}

export default StudentIdCard;