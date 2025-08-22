
import "./login-style.scss";
import InputField from "../../components/input-field/InputField";
import { DoctorIcon } from "../../assets/images/icons";
import Button from "../../components/button/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const baseUrl = import.meta.env.VITE_BASE_URL
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${baseUrl}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();
          
            if (!response.ok) {
                setErrorMessage(data.message || "Login failed. Please try again.");
                return;
            }
            localStorage.setItem("userRole", data.user.role);
            localStorage.setItem("userId", data.user.id);
            navigate("/");

        } catch (error) {
            setErrorMessage("Login failed. Please check your credentials.");
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">
                <div className="login-icon">{DoctorIcon}</div>
                <h1>Doctor Appointment</h1>
                <h2>Login</h2>
                <InputField type="text" placeholder="Email" value={email} onChange={(name, value) => setEmail(value)} />
                <InputField type="password" placeholder="Password" value={password} onChange={(name, value) => setPassword(value)} errorMessage={errorMessage} />
                <Button text="Login" onClickHandler={handleSubmit} />
                <p className="login-link">
                    Don’t have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>


    );
};

export default Login;
