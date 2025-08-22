import "./admin-approval-style.scss";
const AdminAppointment = () => {
    return (
        <div className="admin-appointment-container">
            <div className="admin-appointment-title">
                <h2 className="admin-appointment-title-text">Admin Appointments</h2>
                <div className="admin-appointment-line"></div>
            </div>
            <div className="admin-appointment-body">
                {/* Content for admin appointments will go here */}
                <p>Admin appointments content will be displayed here.</p>
            </div>
        </div>
    );
}
export default AdminAppointment;