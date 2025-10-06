import "./doctors-styles.scss";
import EmptyState from "../../components/EmptyState/EmptyState";
import { EmptySearchIcon } from "../../assets/images/icons";
import Card from "../../components/card/Card";
import InputField from "../../components/input-field/InputField";
import { useEffect, useState } from "react";
import InfiniteScroll from "../../components/InfiniteScroll/InfiniteScroll";
import { useNavigate } from "react-router-dom";
import type { UserInfo } from "../../models/user.types";


const Doctors = () => {
    const [doctors, setDoctors] = useState<UserInfo[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {

        if (searchTerm) {
            const filteredDoctors = doctors.filter(doctor =>
                doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setDoctors(filteredDoctors);
        } else {
            fetchDoctors();
        }
    }, [searchTerm]);
    const fetchDoctors = async () => {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        try {
            const response = await fetch(`${baseUrl}/users/doctors`, { credentials: "include" });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setDoctors(data);
       
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };
    const navigate = useNavigate();

    return (
        <div className="doctor-container">
            <div className="doctor-title">
                <h2 className="doctor-title-text">Our Doctors</h2>
                <div className="doctor-line"></div>
            </div>
            <div className="doctor-approval-card">

                <div className="doctor-approval-card-filter">
                    <InputField placeholder="Search by name" value={searchTerm} onChange={(name, value) => { setSearchTerm(value) }} />

                </div>
                <div className="doctor-body">
                    {doctors.length > 0 ?
                        <InfiniteScroll items={doctors} itemsToShow={3} renderItem={(doctor) => (
                            <Card
                                key={doctor.id}
                                fullName={doctor.fullName}
                                email={doctor.email}
                                id={doctor.id}
                                gender={doctor.gender}
                                specialty={doctor.specialty}
                                profileUrl={doctor.profileUrl}
                                created_at={doctor.created_at}
                                actionButtons={[
                                    {
                                        text: "View Details",
                                        onClickHandler: () => { navigate(`/doctor-details/${doctor.id}`) },
                                    },
                                ]}
                            />
                        )} />
                        : (
                            <EmptyState
                                icon={EmptySearchIcon}
                                title="No Doctors Found"
                                subtitle="Try adjusting your search or filter settings."
                            />
                        )
                    }
                </div>
            </div>

        </div>
    );
};

export default Doctors;