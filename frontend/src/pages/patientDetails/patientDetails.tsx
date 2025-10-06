import { useEffect, useState } from "react";
import Avatar from "../../components/avatar/Avatar";
import Button from "../../components/button/Button";
import InputField from "../../components/input-field/InputField";
import "./patient-details-styles.scss";
import Select from "../../components/select/Select";
import type { DoctorInfo, GetProfileResponse, PatientInfo, UserInfo } from "../../models/user.types";
import TagInput from "../../components/tagInput/TagInput";
import { useSpecialties } from "../../hooks/useSpecialties";
import { EditIcon } from "../../assets/images/icons";
import { useParams } from "react-router-dom";
import "./patient-details-styles.scss";
import { toInputDate } from "../../utils/constants";
import NumberInput from "../../components/number-input/NumberInput";



const PatientDetails = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { specialties, loading } = useSpecialties();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { id } = useParams();
   

    const bloodTypesOptions = [
        { text: "A+", value: "A+" },
        { text: "A-", value: "A-" },
        { text: "B+", value: "B+" },
        { text: "B-", value: "B-" },
        { text: "AB+", value: "AB+" },
        { text: "AB-", value: "AB-" },
        { text: "O+", value: "O+" },
        { text: "O-", value: "O-" },
    ];


    const [conditions, setConditions] = useState<string[]>([]);
    const [allergies, setAllergies] = useState<string[]>([]);
   
    const getDoctorInfo = (doctor: Partial<DoctorInfo>) => ({
        phone: doctor.phone || "",
        bio: doctor.bio || "",
        license_number: doctor.license_number || "",
        experience_years: doctor.experience_years || 0,
        education: doctor.education || "",
        languages:
            doctor.languages
            || "",
        photo_url: doctor.photo_url || "",
        clinic_name: doctor.clinic_name || "",
        location: doctor.location || "",
        specialtyId: doctor.specialtyId || 0,
        is_active: doctor.is_active ?? false,
    });


    const getPatientInfo = (patient: Partial<PatientInfo>) => ({
        phone: patient.phone || "",
        address: patient.address || "",
        known_conditions: Array.isArray(patient.known_conditions)
            ? patient.known_conditions.filter((c): c is string => typeof c === "string")
            : [],
        allergies: Array.isArray(patient.allergies)
            ? patient.allergies.filter((c): c is string => typeof c === "string")
            : [],
        blood_type: patient.blood_type || "",
        weight_kg: typeof patient.weight_kg === "number" ? patient.weight_kg : 0,
        height_cm: typeof patient.height_cm === "number" ? patient.height_cm : 0,
    });


    const getpatientInfo = async (): Promise<GetProfileResponse> => {

        const res = await fetch(`${baseUrl}/users/patient-details/${id}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) throw new Error("Failed to fetch user patient");
        return res.json();
    };

    const handleSaveChanges = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${baseUrl}/users/update-profile`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userInfo),
            });

            const result = await response.json();
            if (!response.ok) {
                setIsLoading(false)
                throw new Error(result.message || "Failed to update patient");
            }


            setIsEditing(false);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error("Update error:", error);

        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                //fetch patient info
                const data = await getpatientInfo();
    
                const {
                    id,
                    fullName,
                    email,
                    dateOfBirth,
                    gender,
                    role,
                    doctor,
                    patient
                } = data;

             

                // Default user info
                const baseInfo = {
                    id,
                    fullName,
                    email,
                    dateOfBirth,
                    gender,
                    role,
                };


                 if (role === "DOCTOR") {
                    const additionalInfo = getDoctorInfo({
                        ...doctor,
                    });
                    // Ensure languages is always an array
                    const normalizedLanguages = Array.isArray(additionalInfo.languages)
                        ? additionalInfo.languages
                        : additionalInfo.languages
                        ? additionalInfo.languages.split(",").map((lang) => lang.trim()).filter(Boolean)
                        : [];
                    setUserInfo({
                        ...baseInfo,
                        ...additionalInfo,
                        languages: normalizedLanguages,
                        role: "DOCTOR",
                    });
                } else if (role === "PATIENT") {
                    const additionalInfo = getPatientInfo({ ...patient });
                    setUserInfo({
                        ...baseInfo,
                        ...additionalInfo,
                        role: "PATIENT"
                    });
                    setConditions(additionalInfo.known_conditions)
                    setAllergies(additionalInfo.allergies)
                } else if (role === "ADMIN") {
                    setUserInfo({
                        ...baseInfo,
                        role: "ADMIN",
                    });
                }

            } catch (error) {
                console.error("Failed to load patient", error);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (name: string, value: string) => {
        setUserInfo(prev => prev && { ...prev, [name]: value })
    }

    return (
        <div className="patient-container">
            <div className="patient-title">
                <h2 className="patient-title-text">Our Patient Page</h2>
                <div className="patient-line"></div>
            </div>
            <div className="patient-cards">
                <div className="patient-header">
                    <div className="patient-header-info">
                        <div className="patient-avatar-wrapper">
                            <div className={isEditing ? `patient-avatar-icons` : ""}>
                                <Avatar src="https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8" />
                                {isEditing && <div className="patient-icons-overlay">
                                    <Button icon={EditIcon} onClickHandler={() => { }} collapse variant="tertiary" />
                                </div>}

                            </div>
                        </div>
                        <div className="patient-header-content">
                            <p className="patient-name">{userInfo?.fullName} </p>
                            <p>{userInfo?.gender}</p>
                            <p className="patient-role">{userInfo?.role}</p>
                        </div>
                    </div>
                    <Button variant={"secondary"} text={isEditing ? "" : "Edit profile"} onClickHandler={() => { setIsEditing(true) }} />


                </div>
                <div className="patient-content">
                    <h3>Personal Information</h3>

                    <hr />
                    <div className="patient-info">
                        <div >
                            <label>Full Name</label>
                            {isEditing ? (
                                <InputField
                                    type="text"
                                    name="fullName"
                                    value={userInfo?.fullName || ""}
                                    onChange={(name, value) => handleInputChange(name, value)}
                                    placeholder="Enter your first name"
                                />
                            ) : (
                                <p>{userInfo?.fullName || "-"}</p>
                            )}
                        </div>
                        <div>
                            <label>Email</label>
                            {isEditing ? (
                                <InputField
                                    type="email"
                                    name="email"
                                    value={userInfo?.email || ""}
                                    onChange={(name, value) => handleInputChange(name, value)}
                                />
                            ) : (
                                <p>{userInfo?.email || "-"}</p>
                            )}
                        </div>
                        <div>
                            <label>Date of Birth</label>
                            {isEditing ? (
                                <InputField
                                    type="date"
                                    name="dateOfBirth"
                                    value={toInputDate(userInfo?.dateOfBirth)}
                                    onChange={(name, value) => handleInputChange(name, value)}
                                />
                            ) : (
                                <p>{userInfo?.dateOfBirth ? new Date(userInfo.dateOfBirth).toLocaleDateString() : "-"}</p>
                            )}
                        </div>
                        <div>
                            <label>User Role</label>
                            <p>{userInfo?.role || "-"}</p>
                        </div>
                        <div>
                            <label>Gender</label>
                            {isEditing ? (
                                <Select
                                    name="gender"
                                    options={[
                                        { text: "Male", value: "MALE" },
                                        { text: "Female", value: "FEMALE" }
                                    ]}
                                    value={userInfo?.gender || ""}
                                    onChange={(name, value) => handleInputChange(name, value)}
                                    id="patient-gender"
                                />
                            ) : (
                                <p>{userInfo?.gender || "-"}</p>
                            )}
                        </div>
                    </div>

                </div>
                <div className="patient-content">
                    <h3>Additional Information</h3>

                    <hr />
                    <div className="patient-info">
                        {userInfo?.role === "DOCTOR" ? (

                            <>
                                <div>
                                    <label>Phone Number</label>
                                    {isEditing ? (
                                        <InputField
                                            type="text"
                                            name="phone"
                                            value={userInfo?.phone || ""}
                                            onChange={(name, value) => setUserInfo({ ...userInfo, [name]: value })}
                                            placeholder="Enter phone number"
                                        />
                                    ) : (
                                        <p>{userInfo?.phone || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label>Bio</label>
                                    {isEditing ? (
                                        <InputField
                                            type="text"
                                            name="bio"
                                            value={userInfo?.bio || ""}
                                            onChange={(name, value) => setUserInfo({ ...userInfo, [name]: value })}
                                            placeholder="Enter bio"
                                        />
                                    ) : (
                                        <p>{userInfo.bio || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label>License Number ⚠️</label>
                                    {isEditing ? (
                                        <InputField
                                            type="text"
                                            name="licenseNumber"
                                            value={userInfo?.license_number || ""}
                                            onChange={(name, value) => setUserInfo({ ...userInfo, [name]: value })}
                                            placeholder="Enter license number"
                                        />
                                    ) : (
                                        <p>{userInfo?.license_number || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label>Education</label>
                                    {isEditing ? (
                                        <InputField
                                            type="text"
                                            name="education"
                                            value={userInfo.education || ""}
                                            onChange={(name, value) => setUserInfo({ ...userInfo, [name]: value })}
                                            placeholder="Enter education"
                                        />
                                    ) : (
                                        <p>{userInfo.education || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label>Languages</label>
                                    {isEditing ? (
                                        <InputField
                                            type="text"
                                            name="languages"
                                        value={Array.isArray(userInfo.languages) ? userInfo.languages.join(", ") : userInfo.languages || ""}
                                            onChange={(name, value) => setUserInfo({ ...userInfo, [name]: value })}
                                            placeholder="Enter languages"
                                        />
                                    ) : (
                                        <p>{userInfo.languages || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label>Clinic Name</label>
                                    {isEditing ? (
                                        <InputField
                                            type="text"
                                            name="clinicName"
                                            value={userInfo?.clinic_name || ""}
                                            onChange={(name, value) => setUserInfo({ ...userInfo, [name]: value })}
                                            placeholder="Enter clinic name"
                                        />
                                    ) : (
                                        <p>{userInfo?.clinic_name || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label>Location</label>
                                    {isEditing ? (
                                        <InputField
                                            type="text"
                                            name="location"
                                            value={userInfo.location || ""}
                                            onChange={(name, value) => setUserInfo({ ...userInfo, [name]: value })}
                                            placeholder="Enter location"
                                        />
                                    ) : (
                                        <p>{userInfo.location || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label>Specialty</label>
                                    {isEditing ? (
                                        <Select
                                            name="specialtyId"
                                            options={specialties}
                                            value={String(userInfo?.specialtyId)}
                                            onChange={(name, value) => setUserInfo({ ...userInfo, [name]: Number(value) })}
                                            id="patient-specialty"
                                        />
                                    ) : (
                                        <p>
                                            {specialties.find(s => s.value === String(userInfo?.specialtyId))?.text || "-"}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label>Active</label>
                                    {isEditing ? (
                                        <Select
                                            name="isActive"
                                            options={[
                                                { text: "Yes", value: "true" },
                                                { text: "No", value: "false" },
                                            ]}
                                            value={userInfo?.is_active ? "true" : "false"}
                                            onChange={(name, value) => setUserInfo({ ...userInfo, [name]: value === "true" })}
                                            id="patient-active"
                                        />
                                    ) : (
                                        <p>{userInfo?.is_active ? "Yes" : "-"}</p>
                                    )}
                                </div>
                            </>
                        ) : userInfo?.role === "PATIENT" ? (
                            // Patient Info
                            <>

                                <div>
                                    <label>Phone Number</label>
                                    {isEditing ? (
                                        <InputField
                                            type="text"
                                            name="phone"
                                            value={userInfo?.phone || ""}
                                            onChange={(name, value) => setUserInfo({ ...userInfo, [name]: value })}
                                            placeholder="Enter phone number"
                                        />
                                    ) : (
                                        <p>{userInfo?.phone || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label>Address</label>
                                    {isEditing ? (
                                        <InputField
                                            type="text"
                                            name="address"
                                            value={userInfo?.address || ""}
                                            onChange={(name, value) => setUserInfo({ ...userInfo, [name]: value })}
                                            placeholder="Enter address"
                                        />
                                    ) : (
                                        <p>{userInfo?.address || "-"}</p>
                                    )}
                                </div>


                                <div>
                                    <label>Blood Type</label>
                                    {isEditing ? (
                                        <Select

                                            name="blood_type"
                                            value={userInfo?.blood_type || ""}
                                            options={bloodTypesOptions}
                                            onChange={(name, value) => setUserInfo({ ...userInfo, [name]: value })}
                                            placeholder="Enter blood Type"
                                        />
                                    ) : (
                                        <p>{userInfo?.blood_type || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label>Weight (kg)</label>
                                    {isEditing ? (
                                       <NumberInput
                                            name="weight_kg"
                                            value={userInfo?.weight_kg || ""}
                                            onChange={(name, value) => setUserInfo({ ...userInfo, [name]: value })}
                                            placeholder="Enter weight in Kg"
                                        /> 
                                    ) : (
                                        <p>{userInfo?.weight_kg || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label>Height (cm)</label>
                                    {isEditing ? (
                                        <NumberInput
                                            name="height_cm"
                                            value={userInfo?.height_cm || ""}
                                            onChange={(name, value) => setUserInfo({ ...userInfo, [name]: value })}
                                            placeholder="Enter height in cm"
                                        />
                                    ) : (
                                        <p>{userInfo?.height_cm || "-"}</p>
                                    )}
                                </div>
                                <div>

                                    {isEditing ? (
                                        <TagInput
                                            label="Allergies"
                                            selectedTags={allergies}
                                            onChange={(newAllergies) => {
                                                setAllergies(newAllergies);
                                                setUserInfo((prev) =>
                                                    prev ? { ...prev, allergies: newAllergies } : prev
                                                );
                                            }}
                                        />
                                    ) : (
                                        <>
                                            <label>Allergies</label>
                                            <p>{userInfo?.allergies || "-"}</p>
                                        </>

                                    )}
                                </div>
                                <div>

                                    {isEditing ? (
                                        <TagInput
                                            label="Known Conditions"
                                            selectedTags={conditions}
                                            onChange={(newConditions) => {
                                                setConditions(newConditions);
                                                setUserInfo((prev) =>
                                                    prev ? { ...prev, known_conditions: newConditions } : prev
                                                );
                                            }}
                                        />
                                    ) : (
                                        <>
                                            <label>Known Conditions</label>
                                            {Array.isArray(userInfo?.known_conditions) && userInfo.known_conditions.length > 0 ? (
                                                <ul className="patient-known-conditions-list">
                                                    {userInfo.known_conditions.map((condition, index) => (
                                                        <li key={index}>{condition}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p></p>
                                            )}
                                        </>

                                    )}
                                </div>
                            </>
                        ) : (
                            <p>No patient info available.</p>
                        )}
                    </div>

                </div>
                {isEditing && <div className="patient-actionButtons">
                    <Button text={"Decline Changes"} variant="tertiary" onClickHandler={() => { setIsEditing(false) }} disabled={isLoading} />
                    <Button text={"Save Changes"} onClickHandler={handleSaveChanges} isLoading={isLoading} disabled={isLoading} />



                </div>}
            </div>

        </div>
    );
}
export default PatientDetails;