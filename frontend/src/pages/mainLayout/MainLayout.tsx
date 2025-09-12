import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./mainLayout-style.scss";
import Sidebar from "../../components/sidebar/Sidebar";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const isAdmin = localStorage.getItem("userRole") === "ADMIN";
  const isDoctor = localStorage.getItem("userRole") === "DOCTOR";
  const isPatient = localStorage.getItem("userRole") === "PATIENT";
  const navigate = useNavigate();

  const navItems = [
    isAdmin && { label: "Dashboard", url: "/dashboard" },
    { label: "Profile", url: "/profile" },

    (isDoctor || isAdmin) && { label: "Patients", url: "/patients" },
    (isPatient || isAdmin) && { label: "Doctors", url: "/doctors" },
    isAdmin && { label: "Admin Approval", url: "/admin-approval" },
    isAdmin && { label: "Appointments", url: "/admin-appointments" },
    
    (isPatient || isDoctor) && { label: "My Appointments", url: "/my-appointments" },
    isPatient && { label: "Book Appointment", url: "/book-appointment" },
    isDoctor && { label: "Settings", url: "/settings" },
    { label: "Logout", action: "logout" }
  ].filter(Boolean) as { label: string; url?: string; action?: string }[];

  const handleLogout = async () => {
    try {
      await fetch(`${baseUrl}/users/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1023);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={`main-layout ${isMobile ? "mobile" : "desktop"}`}>
      {isMobile ? (
        <>
          <Sidebar navItems={navItems} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} isMobile={isMobile} onLogout={handleLogout} />
          <div className="page-content">
            <Outlet />
          </div>
        </>
      ) : (
        <div className={`desktop-container `}>
          <Sidebar navItems={navItems} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} isMobile={isMobile} onLogout={handleLogout} />
          <div className="page-content">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
