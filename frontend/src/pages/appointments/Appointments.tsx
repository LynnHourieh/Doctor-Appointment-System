import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import InputField from "../../components/input-field/InputField";
import "./appointments-styles.scss"
import { calenderClock, CancelIcon, checkIcon, smallCloseIcon } from "../../assets/images/icons";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const [appointments, setAppointments] = useState<Array<{
        id: number;
        appointmentDate: string;
        appointmentTime: string;
        patient: {
            user: any;
            id: number;
            fullName: string;
        };
        doctor: {
            id: number;
            user: any;
            fullName: string;
        };

        status: string;
    }>>([]);
    const userId = localStorage.getItem("userId");

    const fetchAppointments = async () => {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        try {
            const response = await fetch(`${baseUrl}/appointments/${userId}`, { credentials: "include" });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };
    useEffect(() => { fetchAppointments() }, [])
    const navigate = useNavigate();

    const updateAppointmentStatus = async (appointmentId: number, newStatus: string) => {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        try {
            const response = await fetch(`${baseUrl}/appointments/${appointmentId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ action: newStatus }),
            });
            if (!response.ok) {
                throw new Error("Failed to update appointment status");
            }

            setAppointments((prev) =>
                prev.map((appt) =>
                    appt.id === appointmentId ? { ...appt, status: newStatus } : appt
                )
            );
        } catch (error) {
            console.error("Error updating appointment status:", error);
        }
    };

    return (<div className="appointments-container">
        <div className="appointments-title">
            <h2 className="appointments-title-text">My Appointments</h2>
            <div className="appointments-line"></div>
        </div>
        <p>View and Manage your upcoming and past appointments</p>
        <div className="appointments-search">
            <InputField
            placeholder="Search by name"
            value={searchTerm}
            onChange={(name, value) => setSearchTerm(value)}
            />
        </div>   
        <table>
            <thead>
            <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Patient Name</th>
                <th>Doctor Name</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {appointments
                .filter((appt) => {
                const term = searchTerm.toLowerCase();
                return (
                    appt.patient.user.fullName.toLowerCase().includes(term) ||
                    appt.doctor.user.fullName.toLowerCase().includes(term)
                );
                })
                .map((appt) => (
                <tr key={appt.id}>
                    <td>{new Date(appt.appointmentDate).toISOString().slice(0, 10)}</td>
                    <td>{appt.appointmentTime}</td>
                    <td>{appt.patient.user.fullName}</td>
                    <td>{appt.doctor.user.fullName}</td>
                    <td>{appt.status}</td>
                    <td>
                    {appt.status === "PENDING" ? (
                        <div className="appointments-action-buttons">
                        <Button icon={checkIcon} onClickHandler={() => { updateAppointmentStatus(appt.id, "CONFIRMED") }} variant="tertiary" collapse />
                        <Button icon={smallCloseIcon} onClickHandler={() => { updateAppointmentStatus(appt.id, "REJECTED") }} variant="tertiary" collapse />
                        <Button icon={calenderClock} onClickHandler={() => { navigate("/book-appointment") }} variant="tertiary" collapse />
                        </div>
                    )
                        : appt.status === "REJECTED" ? (
                        <div className="appointments-action-buttons">
                            <Button icon={checkIcon} onClickHandler={() => { updateAppointmentStatus(appt.id, "CONFIRMED") }} collapse variant="tertiary" />
                            <Button icon={calenderClock} onClickHandler={() => { navigate("/book-appointment") }} collapse variant="tertiary" />
                        </div>
                        ) : null}
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
      
    </div>)
}
export default Appointments;