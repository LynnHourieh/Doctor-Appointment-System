import { useEffect, useState } from "react";
import Avatar from "../../components/avatar/Avatar";
import Button from "../../components/button/Button";
import InputField from "../../components/input-field/InputField";
import "./doctor-details-styles.scss";
import Select from "../../components/select/Select";
import type { DoctorInfo, GetProfileResponse, PatientInfo, UserInfo } from "../../models/user.types";
import TagInput from "../../components/tagInput/TagInput";
import { useSpecialties } from "../../hooks/useSpecialties";
import { EditIcon } from "../../assets/images/icons";
import { useParams } from "react-router-dom";
import "./doctor-details-styles.scss";



const DoctorDetails = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { specialties } = useSpecialties();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { id } = useParams();
    const isAdmin = localStorage.getItem("userRole") === "ADMIN";
    const currentUserId = localStorage.getItem("userId");


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

    const languageOptions = [
        { text: "Arabic", value: "arabic" },
        { text: "English", value: "english" },
        { text: "French", value: "french" },
        { text: "Spanish", value: "spanish" },
    ];

    const [conditions, setConditions] = useState<string[]>([]);
    const [allergies, setAllergies] = useState<string[]>([]);

    const getDoctorInfo = (doctor: Partial<DoctorInfo>) => ({
        phone: doctor.phone || "",
        bio: doctor.bio || "",
        license_number: doctor.license_number || "",
        experience_years: doctor.experience_years || 0,
        education: doctor.education || "",
        languages: Array.isArray(doctor.languages)
            ? doctor.languages.filter((l): l is string => typeof l === "string")
            : typeof doctor.languages === "string"
                ? [doctor.languages]
                : [],
        photo_url: doctor.photo_url || "",
        clinic_name: doctor.clinic_name || "",
        location: doctor.location || "",
        specialtyId: doctor.specialtyId || 0,
        is_active: doctor.is_active ?? false,
    });


    const getPatientInfo = (doctor: Partial<PatientInfo>) => ({
        phone: doctor.phone || "",
        address: doctor.address || "",
        known_conditions: Array.isArray(doctor.known_conditions)
            ? doctor.known_conditions.filter((c): c is string => typeof c === "string")
            : [],
        allergies: Array.isArray(doctor.allergies)
            ? doctor.allergies.filter((c): c is string => typeof c === "string")
            : [],
        blood_type: doctor.blood_type || "",
        weight_kg: typeof doctor.weight_kg === "number" ? doctor.weight_kg : 0,
        height_cm: typeof doctor.height_cm === "number" ? doctor.height_cm : 0,
    });


    const getdoctorInfo = async (): Promise<GetProfileResponse> => {

        const res = await fetch(`${baseUrl}/users/doctor-details/${id}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) throw new Error("Failed to fetch user doctor");
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
                throw new Error(result.message || "Failed to update doctor");
            }


            setIsEditing(false);
            setIsLoading(false);
        } catch (error) {
            console.error("Update error:", error);

        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                //fetch doctor info
                const data = await getdoctorInfo();

                const {
                    id,
                    fullName,
                    email,
                    dateOfBirth,
                    gender,
                    role,
                    patient,
                    doctor
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
                        role: "DOCTOR"
                    });
                    setUserInfo({
                        ...baseInfo,
                        ...additionalInfo,
                        role: "DOCTOR",
                       

                    });
                } else if (role === "PATIENT") {
                    const additionalInfo = getPatientInfo({ ...patient, role: "PATIENT" });
                    setUserInfo({
                        ...baseInfo,
                        ...additionalInfo,
                        role: "PATIENT",
                    });
                    setConditions(additionalInfo.known_conditions);
                    setAllergies(additionalInfo.allergies);
                } else if (role === "ADMIN") {
                    // Admin 
                    setUserInfo({
                        ...baseInfo,
                        role: "ADMIN",
                        statusId: data.statusId ?? 0,
                    });
                }

            } catch (error) {
                console.error("Failed to load doctor", error);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (name: string, value: string) => {
        setUserInfo(prev => prev && { ...prev, [name]: value })
    }

    return (
        <div className="doctor-container">
            <div className="doctor-title">
                <h2 className="doctor-title-text">Our Doctor Page</h2>
                <div className="doctor-line"></div>
            </div>
            <div className="doctor-cards">
                <div className="doctor-header">
                    <div className="doctor-header-info">
                        <div className="doctor-avatar-wrapper">
                            <div className={isEditing ? `doctor-avatar-icons` : ""}>
                                <Avatar src="https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8" />
                                {isEditing && <div className="doctor-icons-overlay">
                                    <Button icon={EditIcon} onClickHandler={() => { }} collapse variant="tertiary" />
                                </div>}

                            </div>
                        </div>
                        <div className="doctor-header-content">
                            <p className="doctor-name">{userInfo?.fullName} </p>
                            <p>{userInfo?.gender}</p>
                            <p className="doctor-role">{userInfo?.role}</p>
                        </div>
                    </div>

                    {(isAdmin || (id == currentUserId)) && <Button variant={"secondary"} text={isEditing ? "" : "Edit profile"} onClickHandler={() => { setIsEditing(true) }} />}


                </div>
                <div className="doctor-content">
                    <h3>Personal Information</h3>

                    <hr />
                    <div className="doctor-info">
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
                                    value={userInfo?.dateOfBirth || ""}
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
                                    id="doctor-gender"
                                />
                            ) : (
                                <p>{userInfo?.gender || "-"}</p>
                            )}
                        </div>
                    </div>

                </div>
                <div className="doctor-content">
                    <h3>Additional Information</h3>

                    <hr />
                    <div className="doctor-info">
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
                                            name="license_number"
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
                                {/* <div>
                                    <label>Languages</label>
                                    {isEditing ? (
                                        <Select
                                            name="languages"
                                            options={languageOptions}
                                            value={
                                                Array.isArray(userInfo?.languages)
                                                    ? userInfo.languages[0] || ""
                                                    : userInfo?.languages || ""
                                            }
                                            onChange={(name, value) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    [name]: [value], // always store as array
                                                })
                                            }
                                            placeholder="Enter languages"
                                        />
                                    ) : (
                                        <p>
                                            {Array.isArray(userInfo.languages)
                                                ? userInfo.languages.join(", ")
                                                : userInfo.languages || "-"}
                                        </p>
                                    )}
                                </div> */}
                                <div>
                                    <label>Clinic Name</label>
                                    {isEditing ? (
                                        <InputField
                                            type="text"
                                            name="clinic_name"
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
                                            id="doctor-specialty"
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
                                            name="is_active"
                                            options={[
                                                { text: "Yes", value: "true" },
                                                { text: "No", value: "false" },
                                            ]}
                                            value={userInfo?.is_active ? "true" : "false"}
                                            onChange={(name, value) => setUserInfo({ ...userInfo, [name]: value === "true" })}
                                            id="doctor-active"
                                        />
                                    ) : (
                                        <p>{userInfo?.is_active ? "Yes" : "-"}</p>
                                    )}
                                </div>
                            </>
                        ) : userInfo?.role === "PATIENT" ? (
                            // patient Info
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
                                        <InputField
                                            type="text"
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
                                        <InputField
                                            type="text"
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
                                                <ul className="doctor-known-conditions-list">
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
                            <p>No doctor info available.</p>
                        )}
                    </div>

                </div>
                {isEditing && <div className="doctor-actionButtons">
                    <Button text={"Decline Changes"} variant="tertiary" onClickHandler={() => { setIsEditing(false) }} disabled={isLoading} />
                    <Button text={"Save Changes"} onClickHandler={handleSaveChanges} isLoading={isLoading} disabled={isLoading} />



                </div>}
            </div>

        </div>
    );
}
export default DoctorDetails;