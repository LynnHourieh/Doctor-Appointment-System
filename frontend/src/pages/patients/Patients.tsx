import "./patients-styles.scss";
import EmptyState from "../../components/EmptyState/EmptyState";
import { EmptySearchIcon } from "../../assets/images/icons";
import Card from "../../components/card/Card";
import InputField from "../../components/input-field/InputField";
import { useEffect, useState } from "react";
import InfiniteScroll from "../../components/InfiniteScroll/InfiniteScroll";
import { useNavigate } from "react-router-dom";
import type { UserInfo } from "../../models/user.types";


const Patients = () => {
    const [patients, setPatients] = useState<UserInfo[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {

        if (searchTerm) {
            const filteredPatients = patients.filter(patient =>
                patient.fullName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setPatients(filteredPatients);
        } else {
            fetchPatients();
        }
    }, [searchTerm]);
    const fetchPatients = async () => {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        try {
            const response = await fetch(`${baseUrl}/users/patients`, { credentials: "include" });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setPatients(data);
           
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    };
    const navigate = useNavigate();

    return (
        <div className="patient-container">
            <div className="patient-title">
                <h2 className="patient-title-text">Our Patients</h2>
                <div className="patient-line"></div>
            </div>
            <div className="patient-approval-card">

                <div className="patient-approval-card-filter">
                    <InputField placeholder="Search by name" value={searchTerm} onChange={(name, value) => { setSearchTerm(value) }} />

                </div>
                <div className="patient-body">
                    {patients.length > 0 ?
                        <InfiniteScroll items={patients} itemsToShow={3} renderItem={(patient) => (
                            <Card
                                key={patient.id}
                                fullName={patient.fullName}
                                email={patient.email}
                                id={patient.id}
                                gender={patient.gender}
                                specialty={patient.specialty}
                                profileUrl={patient.profileUrl}
                                created_at={patient.created_at}
                                actionButtons={[
                                    {
                                        text: "View Details",
                                        onClickHandler: () => { navigate(`/patient-details/${patient.id}`) },
                                    },
                                ]}
                            />
                        )} />
                        : (
                            <EmptyState
                                icon={EmptySearchIcon}
                                title="No Patients Found"
                                subtitle="Try adjusting your search or filter settings."
                            />
                        )
                    }
                </div>
            </div>

        </div>
    );
};

export default Patients;