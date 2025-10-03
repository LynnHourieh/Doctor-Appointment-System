import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/login/login'
import Signup from './pages/signup/signup'
import HomePage from './pages/homePage/homePage'
import MainLayout from './pages/mainLayout/MainLayout'
import AuthLayout from './pages/authLayout/AuthLayout'
import AdminApproval from './pages/adminApproval/AdminApproval'
import Profile from './pages/profile/Profile'
import Patients from './pages/patients/Patients'
import PatientDetails from './pages/patientDetails/patientDetails'
import AdminAppointment from './pages/adminAppointments/adminAppointment'
import Settings from './pages/settings/Settings'
import Appointments from './pages/appointments/Appointments'
import Doctors from './pages/doctors/Doctors'
import DoctorDetails from './pages/doctorDetails/doctorDetails'
import Dashboard from './pages/dashboard/Dashboard'
import BookAppointment from './pages/bookAppointment/BookAppointment'

function App() {

  return (
    <Routes>
      {/* Routes with Sidebar */}
      <Route element={<MainLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-approval" element={<AdminApproval />} />
        <Route path="/admin-appointments" element={<AdminAppointment />} />
        <Route path="/my-appointments" element={<Appointments />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/patient-details/:id" element={<PatientDetails />} />
        <Route path="/doctor-details/:id" element={<DoctorDetails />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/book-appointment/:patientId" element={<BookAppointment />} />

      </Route>

      {/* Auth Routes without Sidebar */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Optional fallback */}
      <Route path="*" element={<Login />} />
    </Routes>



  )
}

export default App
