import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
    Card,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Tooltip,
    IconButton,
    Button,
    Input,
    Paper,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { ScholarshipProgramType } from "@/router/clientRoutes/ScholarshipProgram/data";
import { getAllScholarshipProgram, updateScholarshipStatus } from "@/services/ApiServices/scholarshipProgramService";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FaEye, FaTimesCircle } from "react-icons/fa";
import { notification } from "antd";
import { NotifyFunderScholarshipAcceptance, NotifyFunderScholarshipRejection } from "@/services/ApiServices/notification";

const ScholarshipAwaitingApproval = () => {
    const token = useSelector((state: any) => state.token.token);
    const [data, setData] = useState<ScholarshipProgramType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [rejectedScholarship, setRejectedScholarship] = useState<ScholarshipProgramType | null>(null);
    const [rejectionReason, setRejectionReason] = useState<string>("");

    const fetchData = async () => {
        try {
            const response = await getAllScholarshipProgram();
            if (response.data.statusCode === 200) {
                setData(response.data.data.items);
                console.log(response.data.data);
            } else {
                setError("Failed to fetch data");
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (scholarship: ScholarshipProgramType) => {
        setLoading(true);
        try {
            await updateScholarshipStatus(Number(scholarship.id), { "status": "Open" });
            notification.success({ message: "Scholarship approved successfully." });
            NotifyFunderScholarshipAcceptance(Number(scholarship.id));
        } catch (error) {
            console.error("Error approving scholarship:", error);
            notification.error({ message: "Error approving scholarship." });
        } finally {
            setLoading(false);
        }
        fetchData();
    };

    const handleReject = (scholarship: ScholarshipProgramType) => {
        setRejectedScholarship(scholarship);
        setRejectionReason("");
    };

    const handleSendRejectionEmail = async () => {
        if (!rejectionReason) {
            notification.error({ message: "Please provide a rejection reason." });
            return;
        }
        setLoading(true);
        try {
            const scholarshipId = rejectedScholarship?.id ? Number(rejectedScholarship.id) : 0;

            if (scholarshipId === 0) {
                notification.error({ message: "Invalid scholarship ID." });
                return;
            }

            await NotifyFunderScholarshipRejection(scholarshipId, rejectionReason);

            await updateScholarshipStatus(scholarshipId, { "status": "Rejected" });

            notification.success({ message: "Rejection email sent successfully." });

            setRejectedScholarship(null);
            setRejectionReason("");
        } catch (error) {
            console.error("Error rejecting scholarship:", error);
            notification.error({ message: "Error rejecting scholarship." });
        } finally {
            setLoading(false);
        }
        fetchData();
    };


    useEffect(() => {
        fetchData();
    }, []);

    const renderRejectionModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-semibold text-red-600">
                    <FaTimesCircle className="inline-block mr-2" />
                    Reject Scholarship
                </h3>
                <p className="mt-2 text-gray-700">Please provide a reason for rejecting this scholarship.</p>
                <Input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Rejection reason"
                    className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                />
                <div className="mt-4 flex justify-between space-x-4">
                    <Button onClick={handleSendRejectionEmail} className="bg-red-500 text-white hover:bg-red-600">
                        Send Reason
                    </Button>
                    <Button onClick={() => setRejectedScholarship(null)} className="bg-gray-500 text-white hover:bg-gray-600">
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );

    const renderTable = () => (
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
            <div
                style={{
                    display: 'flex',
                    fontWeight: 'bold',
                    backgroundColor: '#f1f1f1',
                    padding: '10px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                }}
            >
                <div style={{ flex: 0.5, marginRight: '20px' }}>ID</div>
                <div style={{ flex: 1, marginRight: '20px' }}>Name</div>
                <div style={{ flex: 2.5, marginRight: '20px' }}>Description</div>
                <div style={{ flex: 2, marginRight: '20px' }}>Education Level</div>
                <div style={{ flex: 1, marginRight: '20px' }}>Status</div>
                <div style={{ flex: 1, marginRight: '20px' }}>Amount</div>
                <div style={{ flex: 1.25, marginRight: '20px' }}>Deadline</div>
                <div style={{ flex: 2.25, marginRight: '20px' }}>University</div>
                <div style={{ flex: 2.5, marginRight: '20px' }}>Major</div>
                <div style={{ flex: 2.5 }}>Actions</div>
            </div>

            {/* Data Rows */}
            {data
                .filter((scholarship) => scholarship.status === 'Draft')
                .map((scholarship) => (
                    <div
                        key={scholarship.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#f9f9f9',
                            padding: '10px',
                            borderRadius: '8px',
                            marginBottom: '10px',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e3f2fd')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                    >
                        {/* ID */}
                        <div style={{ flex: 0.5, marginRight: '20px' }}>{scholarship.id}</div>
                        {/* Name */}
                        <div style={{ flex: 1, marginRight: '20px' }}>{scholarship.name}</div>
                        {/* Description */}
                        <div style={{ flex: 2.5, marginRight: '20px' }}>
                            {scholarship.description.length > 12 ? scholarship.description.slice(0, 12) + '..' : scholarship.description}
                        </div>
                        {/* Education Level */}
                        <div style={{ flex: 2, marginRight: '20px' }}>{scholarship.educationLevel}</div>
                        {/* Status */}
                        <div style={{ flex: 1, marginRight: '20px' }}>{scholarship.status}</div>
                        {/* Amount */}
                        <div style={{ flex: 1, marginRight: '20px' }}>${scholarship.scholarshipAmount}</div>
                        {/* Deadline */}
                        <div style={{ flex: 1.25, marginRight: '20px' }}>
                            {new Date(scholarship.deadline).toLocaleDateString()}
                        </div>
                        {/* University */}
                        <div style={{ flex: 2.25, marginRight: '20px' }}>{scholarship.university.name}</div>
                        {/* Major */}
                        <div style={{ flex: 2.5, marginRight: '20px' }}>{scholarship.major.name}</div>
                        {/* Actions */}
                        <div style={{ flex: 2.5 }}>
                            <Button
                                style={{ backgroundColor: '#007bff' }}
                            >
                                <Link
                                    to={`/scholarship-program/${scholarship.id}`}
                                    style={{
                                        color: 'white',
                                        borderRadius: '4px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                    }}
                                >
                                    <FaEye style={{ marginRight: '8px' }} />
                                    Details
                                </Link>
                            </Button>
                            <Button
                                onClick={() => handleApprove(scholarship)}
                                style={{
                                    marginTop: '8px',
                                    backgroundColor: '#4caf50',
                                    color: 'white',
                                    marginRight: '20px',
                                }}
                            >
                                <AiOutlineCheckCircle style={{ marginRight: '8px' }} />
                                Approve
                            </Button>
                            <Button
                                onClick={() => handleReject(scholarship)}
                                style={{
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    marginTop: '8px',
                                }}
                            >
                                <FaTimesCircle style={{ marginRight: '8px' }} />
                                Reject
                            </Button>
                        </div>
                    </div>
                ))}
        </Paper>

    );

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <h2 style={{ marginLeft: "16px", marginBottom: "24px", color: "#3f51b5", fontWeight: "bold" }}>
                    Scholarship Awaiting Approval
                </h2>
            </div>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {renderTable()}
                </>
            )}

            {rejectedScholarship && renderRejectionModal()}
        </>
    );
};


export default ScholarshipAwaitingApproval;