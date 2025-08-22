import { Link, useNavigate } from "react-router-dom"
import { DoctorIcon } from "../../assets/images/icons"
import Button from "../../components/button/Button"
import InputField from "../../components/input-field/InputField"
import Radio from "../../components/radio/Radio"
import Select from "../../components/select/Select"
import "./signup-style.scss"
import { days, months, years } from "../../utils/constants"
import {  useState } from "react"
import { useSpecialties } from "../../hooks/useSpecialties"

const Signup = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        roleId: "",
        gender: "",
        day: "",
        month: "",
        year: "",
        specialtyId: "",
    });
    const { specialties, loading } = useSpecialties();
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async () => {
        try {
            if (!formData.day || !formData.month || !formData.year) {
                alert("Please select a complete date of birth.");
                return;
            }
            const response = await fetch(`${baseUrl}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },

                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    roleId: Number(formData.roleId),
                    gender: formData.gender,
                    dateOfBirth: `${formData.year}-${formData.month.padStart(2, "0")}-${formData.day.padStart(2, "0")}`,
                    specialtyId: formData.specialtyId
                }),
            });

            const data = await response.json();
            if (!response.ok) {

                setErrorMessage(data.message || "Signup failed. Please try again.");
                return;
            }
            navigate("/login");

        } catch (error) {
            setErrorMessage("Signup failed. Please check your credentials.");
            console.error("Signup failed:", error);
        }
    }

    const handleFieldChange = (name: string, value: string) => {

        setFormData({ ...formData, [name]: value });
    };
    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-icon">{DoctorIcon}</div>
                <h1>Doctor Appointment</h1>
                <p>Sign up to book your appointment</p>
                <InputField type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={(name, value) => handleFieldChange(name, value)} />
                <p className="signup-labels">Date of birth</p>
                <div className="signup-dropdowns">

                    <Select name="day" value={formData.day} onChange={(name, value) => { handleFieldChange(name, value) }} options={days} placeholder="Day" />
                    <Select name="month" value={formData.month} onChange={(name, value) => { handleFieldChange(name, value) }} options={months} placeholder="Month" />
                    <Select name="year" value={formData.year} onChange={(name, value) => { handleFieldChange(name, value) }} options={years} placeholder="Year" />
                </div>

                <p className="signup-labels">Gender</p>
                <div className="signup-buttons">
                    <Radio name="male" value="male" onChange={(e) => handleFieldChange("gender", e.target.value)} label="Male" size="sm" checked={formData.gender === "male"} />
                    <Radio name="female" value="female" onChange={(e) => handleFieldChange("gender", e.target.value)} label="Female" size="sm" checked={formData.gender === "female"} />

                </div>
                <InputField type="text" name="email" placeholder="Email" value={formData.email} onChange={(name, value) => { handleFieldChange(name, value) }} errorMessage={errorMessage} />
                <InputField type="password" name="password" placeholder="Password" value={formData.password} onChange={(name, value) => { handleFieldChange(name, value) }} />
                <div className="signup-buttons">
                    <Radio name="doctor" value="2" onChange={(e) => handleFieldChange("roleId", e.target.value)} label="Doctor" size="sm" checked={formData.roleId === "2"} />
                    <Radio name="patient" value="3" onChange={(e) => handleFieldChange("roleId", e.target.value)} label="Patient" size="sm" checked={formData.roleId === "3"} />
                </div>
                {formData.roleId === "2" && (<div>

                    <Select
                        id="signup-specialty"
                        name="specialtyId"
                        value={formData.specialtyId}
                        onChange={(name, value) => handleFieldChange(name, value)}
                        options={specialties}
                        placeholder="Select Specialty"
                    />


                </div>)}
                <Button text="Sign up" onClickHandler={handleSubmit} />
                <p className="signup-link">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    )

}

export default Signup