import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import Card from "../../components/card/Card";
import InputField from "../../components/input-field/InputField";
import "./admin-approval-style.scss"
import EmptyState from "../../components/EmptyState/EmptyState";
import { EmptySearchIcon } from "../../assets/images/icons";
import Modal from "../../components/modal/Modal";
import type { ButtonProps } from "../../models/components";
import InfiniteScroll from "../../components/InfiniteScroll/InfiniteScroll";
import { useAdmin } from "../../contexts/adminContext";

const AdminApproval = () => {
    const { pendingUsers, loading, error, fetchPendingUsers,setLoading ,setPendingUsers} = useAdmin();
    const [activeTab, setActiveTab] = useState<"doctors" | "patients">("doctors");
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const filteredUsers = pendingUsers
        .filter((user: any) => user.role === (activeTab === "doctors" ? "DOCTOR" : "PATIENT"))
        .filter((user: any) => {
            const search = searchTerm.toLowerCase();
            const name = user.fullName?.toLowerCase() || "";
            const email = user.email?.toLowerCase() || "";

            if (activeTab === "doctors") {
                const specialty = user.specialty?.toLowerCase() || "";
                return name.includes(search) || email.includes(search) || specialty.includes(search);
            } else if (activeTab === "patients") {
                return name.includes(search) || email.includes(search);
            }
        });

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const modalActions: ButtonProps[] = [
        {
            text: "Cancel",
            onClickHandler: () => setIsModalOpen(false),
            variant: "secondary",
            disabled: loading
        },
        {
            text: "Decline",
            onClickHandler: () => {
                if (selectedUser) {

                    handleAction(selectedUser.id, "reject");

                }
            },
            isDestructive: true,
            isLoading: loading

        }
    ];

    useEffect(() => {



    }, []);

    const handleAction = async (userId: string, action: "accept" | "reject") => {
        try {
            setLoading(true)
            const response = await fetch(`${baseUrl}/admin/users/${userId}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ action }),
            });


            if (!response.ok) {

                throw new Error(`Failed to ${action} user`);

            }

            setPendingUsers(prev => prev.filter((user: any) => user.id !== userId));


        } catch (err: any) {
            setLoading(false);
            alert(err.message || `Failed to ${action} user`);
        }
        finally {
            setLoading(false);
            handleCloseModal();
        }

    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    }
    return (
        <div className="admin-approval-container">
            <div className="admin-title">
                <h2 className="admin-title-text">Our Requests</h2>
                <div className="admin-line"></div>
            </div>

            <div className="admin-approval-card">
                <div className="admin-approval-card-header">
                    <Button text="Pending Doctors" onClickHandler={() => setActiveTab("doctors")} variant={"tertiary"} id={activeTab == "doctors" ? "admin-approval-button-filters" : ""} />
                    <Button text="Pending Patients" onClickHandler={() => setActiveTab("patients")} variant={"tertiary"} id={activeTab == "patients" ? "admin-approval-button-filters" : ""} />
                </div>
                <div className="admin-approval-card-body">
                    <div className="admin-approval-card-filter">
                        <InputField placeholder="Search by name" value={searchTerm} onChange={(name, value) => setSearchTerm(value)} />

                    </div>
                    {filteredUsers.length > 0 ? (
                        <InfiniteScroll
                            items={filteredUsers}
                            itemsToShow={3}
                            renderItem={(user: any) => (
                                <Card
                                    key={user.id}
                                    {...user}
                                    actionButtons={[
                                        {
                                            text: "Approve",
                                            onClickHandler: () => {
                                                handleAction(user.id, "accept"),
                                                    setSelectedUser({ ...user, action: "accept" });

                                            },
                                            isLoading: loading && selectedUser?.id === user.id,
                                            disabled: loading && selectedUser?.id === user.id,
                                        },
                                        {
                                            text: "Decline",
                                            onClickHandler: () => {
                                                setSelectedUser({ ...user, action: "reject" });
                                                setIsModalOpen(true);
                                            },
                                            variant: "secondary",
                                            disabled: loading && selectedUser?.id === user.id,
                                        },
                                    ]}
                                />
                            )}
                        />
                    ) : (
                        <EmptyState
                            title={`You’re all caught up! No ${activeTab === "doctors" ? "Doctors" : "Patients"} awaiting approval`}
                            icon={EmptySearchIcon}
                        />
                    )}
                </div>

            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Decline Request" modalActions={modalActions}>
                <div>
                    <p>Are you sure you want to decline  <b>{selectedUser?.fullName}</b> ?</p>
                </div>

            </Modal>
        </div>
    );
}

export default AdminApproval;