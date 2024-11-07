import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Spinner from "@/components/Spinner";
import RouteNames from "@/constants/routeNames";
import { deleteService, getServiceById, updateService } from "@/services/ApiServices/serviceService";
import { cancelRequest, checkUserRequest, createRequest, getRequestsByService } from "@/services/ApiServices/requestService";
import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import AccountApplicantDialog from "./applicantrequests-dialog";
import { deleteFile, uploadFile } from "@/services/ApiServices/testService";
import { FaStar } from "react-icons/fa";

interface ServiceType {
    id: string;
    name: string;
    description: string;
    type: string;
    price: number;
    duration: string;
    status: string;
    providerId: string;
}

const ServiceDetails = ({ showButtons = true, serviceId = null }: any) => {
    const { id } = serviceId ?? useParams<{ id: string }>();
    const [serviceData, setServiceData] = useState<ServiceType | null>(null);
    const [applicants, setApplicants] = useState<any>(null);
    const [applicantDialogOpen, setApplicantDialogOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    const [expectedCompletionTime, setExpectedCompletionTime] = useState<Date | null>(null);
    const [applicationNotes, setApplicationNotes] = useState<string>("");
    const [scholarshipType, setScholarshipType] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [applicationFileUrls, setApplicationFileUrls] = useState<any>(null);
    const [editData, setEditData] = useState<ServiceType | null>(null);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.token.user);
    const isProvider = user?.role === "PROVIDER";
    const isFunder = user?.role === "FUNDER";
    const [canEdit, setCanEdit] = useState<boolean>(true);
    const [hasExistingRequest, setHasExistingRequest] = useState<boolean>(false);
    const [existingRequestId, setExistingRequestId] = useState<number | null>(null);
    const [requestStatus, setRequestStatus] = useState<string | null>(null);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [feedbackCount, setFeedbackCount] = useState<number>(0);
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
    const [amount, setAmount] = useState<number>(serviceData?.price || 0);
    const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState<boolean>(false);
    const [requestData, setRequestData] = useState<any>(null);

    const fetchService = async () => {
        try {
            const data = await getServiceById(Number(id));
            setServiceData(data.data);
            const feedbacks = data.data.feedbacks || [];
            console.log(feedbacks)
            if (feedbacks && feedbacks.length > 0) {
                const totalRating = feedbacks.reduce((acc: number, feedback: any) => acc + (feedback.rating || 0), 0);
                const count = feedbacks.length;
                setFeedbacks(feedbacks);
                setAverageRating(totalRating / count);
                setFeedbackCount(count);
            }
            const response = await fetchApplicants(data.data.id);
            console.log(response);
            setExistingRequestId(response.find((r: any) => r.applicantId == user?.id)?.id || null);
            if (response.length == 0) {
                setCanEdit(true);
            } else {
                setCanEdit(false);
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchService();

    }, [id, user]);

    const openEditDialog = () => {
        setEditData(serviceData);
        setEditDialogOpen(true);
    };

    const handleFeedbackClick = () => {
        if (feedbackCount === 0) {
            alert("This service has no feedbacks yet, be the first!");
        } else {
            setIsFeedbackDialogOpen(true);
        }
    };

    const handleCloseFeedbackDialog = () => {
        setIsFeedbackDialogOpen(false);
    };

    // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const files = e.target.files;
    //     if (!files) return;

    //     setLoading(true);

    //     try {
    //         const filesArray = Array.from(files);
    //         const formData = new FormData();

    //         filesArray.forEach((file) => {
    //             formData.append("files", file);
    //         });

    //         const urls = await uploadFile(formData);
    //         setApplicationFileUrls(urls);
    //     } catch (error) {
    //         console.error("File upload failed:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchApplicants = async (serviceId: number) => {
        try {
            const response = await getRequestsByService(serviceId);
            if (response.statusCode == 200) {
                setApplicants(response.data);
                const existingRequest = response.data.find((r: any) => r.applicantId == user?.id);
                console.log(existingRequest)
                if (existingRequest) {
                    setExistingRequestId(existingRequest.id);
                    setRequestStatus(existingRequest.status);
                } else {
                    setExistingRequestId(null);
                    setRequestStatus(null);
                }
                setCanEdit(existingRequest ? false : true);
                return response.data;
            }
            else {
                setError("Failed to get applicants");
            }
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenApplicantDialog = async () => {
        setLoading(true);
        if (!serviceData) return;
        await fetchApplicants(parseInt(serviceData?.id));
        setLoading(false);
        setApplicantDialogOpen(true);
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Do you really want to delete?");
        if (!confirmDelete || !serviceData) return;

        setLoading(true);
        try {
            const updatedData = { ...serviceData, status: "Inactive" };
            await updateService(Number(id), updatedData);

            setServiceData(updatedData);
            alert("Service marked as inactive successfully!");
            navigate(RouteNames.ACTIVITY);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestNow = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setExpectedCompletionTime(null);
        setApplicationNotes("");
        setScholarshipType("");
        setApplicationFileUrls("");
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setDialogOpen(false);
        setConfirmationDialogOpen(true);
        setRequestData(e);
    };

    const handleConfirmPayment = async () => {
        if (!requestData) return;
        try {
            await handleSubmit();
            alert("Request has been successfully confirmed and paid!");
            await fetchService();
            closeDialog();
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
            setConfirmationDialogOpen(false);
        }
    };

    const handleCancelPayment = () => {
        setConfirmationDialogOpen(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const filesArray = Array.from(applicationFileUrls || []);
        const formData = new FormData();

        filesArray.forEach((file: any) => {
            formData.append("files", file);
        });

        const urls = await uploadFile(filesArray);

        const requestDatas = {
            description,
            requestDate: new Date(),
            status: "Paid",
            applicantId: user?.id,
            requestDetails: [{
                id,
                expectedCompletionTime,
                applicationNotes,
                scholarshipType,
                applicationFileUrl: filesArray.length > 0 ? urls.urls.join(", ") : null,
                serviceId: serviceData?.id,

            }
            ]
        };

        try {
            await createRequest(requestDatas);
            alert("Request created successfully!");
            await fetchService();
            closeDialog();
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner size="large" />;
    if (error) return <p className="text-center text-xl font-semibold">{error}</p>;
    if (!serviceData) return <p className="text-center text-xl font-semibold">Service not found</p>;

    return (
        <div>
            {isDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-[90%] md:w-[60%]">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold mb-4">Create Request</h2>
                            <span
                                className="text-xl cursor-pointer"
                                onClick={closeDialog}
                            >
                                &times;
                            </span>
                        </div>
                        <form onSubmit={handleNext}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Expected Completion Time</label>
                                <input
                                    type="date"
                                    onChange={(e) => setExpectedCompletionTime(new Date(e.target.value))}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Description</label>
                                <input
                                    type="text"
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Scholarship Type</label>
                                <input
                                    type="text"
                                    onChange={(e) => setScholarshipType(e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Application File(s)</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => setApplicationFileUrls(e.target.files)}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeDialog}
                                    className="mr-2 bg-gray-300 rounded px-4 py-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white rounded px-4 py-2"
                                >
                                    Next
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isConfirmationDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-[90%] md:w-[60%]">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold mb-4">Confirmation</h2>
                            <span
                                className="text-xl cursor-pointer"
                                onClick={handleCancelPayment}
                            >
                                &times;
                            </span>
                        </div>
                        <p className="text-gray-700 mb-4">
                            Using this service will incur a fee: <strong>${serviceData.price}</strong>. Do you want to continue?
                        </p>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleCancelPayment}
                                className="mr-2 bg-gray-300 rounded px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmPayment}
                                className="bg-blue-600 text-white rounded px-4 py-2"
                            >
                                Yes, Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative">
                <ScholarshipProgramBackground />
                <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-start items-start p-[70px] gap-[170px] z-10">
                    <div>
                        <Breadcrumb>
                            <BreadcrumbList className="text-white">
                                <BreadcrumbItem>
                                    <Link to="/" className="md:text-xl text-lg">
                                        Home
                                    </Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <Link to="/services" className="text-white md:text-xl text-lg">
                                        Services
                                    </Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <p className="text-white md:text-xl text-lg">{serviceData.name}</p>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className={isProvider ? "w-2/3" : ""}>
                        <div className="lg:flex-col items-center flex-row flex gap-[20px]">
                            <div>
                                <p className="text-white text-5xl lg:line-clamp-3 line-clamp-5">
                                    {serviceData.name}
                                </p>
                            </div>
                            <div className="flex flex-col items gap-2">
                                <div className="flex items-center gap-2">
                                    <FaStar color="yellow" size={20} />
                                    <p className="text-yellow-500 cursor-pointer underline" onClick={handleFeedbackClick}>
                                        {averageRating.toFixed(1)} ({feedbackCount} {feedbackCount === 1 ? 'feedback' : 'feedbacks'})
                                    </p>
                                </div>
                            </div>
                        </div>

                        {isFeedbackDialogOpen && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                <div className="bg-white p-5 rounded-lg shadow-lg w-[90%] md:w-[60%]">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold">Feedback Details</h2>
                                        <span
                                            className="text-xl cursor-pointer"
                                            onClick={handleCloseFeedbackDialog}
                                        >
                                            &times;
                                        </span>
                                    </div>

                                    <table className="min-w-full bg-white border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-2 text-left">Applicant Name</th>
                                                <th className="p-2 text-left">Rating</th>
                                                <th className="p-2 text-left">Comment</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {feedbacks.map((feedback, index) => (
                                                <tr key={index} className="border-t">
                                                    <td className="p-2">********</td>
                                                    <td className="p-2 flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar
                                                                key={i}
                                                                color={i < feedback.rating ? "#FFB800" : "#ddd"}
                                                                size={16}
                                                            />
                                                        ))}
                                                    </td>
                                                    <td className="p-2">{feedback.content}</td>
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                    <div className="mt-4 text-right">
                                        <button
                                            onClick={handleCloseFeedbackDialog}
                                            className="bg-gray-300 px-4 py-2 rounded-md"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="text-white text-center flex h-[50px] mt-[26px]">
                            <div className="flex justify-between w-full gap-10">
                                {showButtons && <>
                                    {!isFunder && !isProvider ? (
                                        requestStatus === "Finished" ? (
                                            <>
                                                <button
                                                    onClick={handleRequestNow}
                                                    className="text-xl w-full bg-blue-700 rounded-[25px] mt-2"
                                                >
                                                    Request Now
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={handleRequestNow}
                                                className="text-xl w-full bg-blue-700 rounded-[25px]"
                                            >
                                                Request Now
                                            </button>
                                        )
                                    ) : (!isFunder && isProvider ? (
                                        <>
                                            <button onClick={() => openEditDialog()} className="text-xl w-full bg-blue-700 rounded-[25px]" disabled={!canEdit}>
                                                Edit
                                            </button>
                                            <button onClick={handleOpenApplicantDialog} className="text-xl w-full bg-blue-700 rounded-[25px]">
                                                View Request
                                            </button>
                                            <button onClick={handleDelete} className="text-xl w-full bg-red-900 rounded-[25px]">
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        <div></div>
                                    ))}</>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="bg-white py-10">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-semibold mb-6">Service Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="font-semibold">Service Type:</p>
                            <p>{serviceData.type}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Price:</p>
                            <p>${serviceData.price}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Duration:</p>
                            <p>{new Date(serviceData.duration).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Status:</p>
                            <p>{serviceData.status}</p>
                        </div>
                        <div>
                            <Link
                                to={RouteNames.PROVIDER_INFORMATION.replace(":id", serviceData.providerId)}
                                className="text-blue-600 hover:underline"
                            >
                                Provider Information
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gray-100 py-10">
                <div className="container mx-auto px-6">
                    <h3 className="text-2xl font-semibold mb-4">About This Service</h3>
                    <p>{serviceData.description}</p>
                </div>
            </section>
            <AccountApplicantDialog open={applicantDialogOpen}
                onClose={() => setApplicantDialogOpen(false)}
                applications={applicants ?? []}
                fetchApplications={async () => {
                    if (!serviceData) return;
                    await fetchApplicants(parseInt(serviceData?.id));
                }} />
        </div>
    );
};

export default ServiceDetails;
