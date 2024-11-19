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
import { FaEdit, FaEye, FaPlus, FaRedo, FaStar, FaTrash } from "react-icons/fa";
import { NotifyProviderNewRequest } from "@/services/ApiServices/notification";
import { getAccountWallet } from "@/services/ApiServices/accountService";
import { transferMoney } from "@/services/ApiServices/paymentService";
import { toast, ToastContainer } from "react-toastify";
import { FaInfoCircle, FaDollarSign, FaClock, FaCheckCircle, FaUser } from "react-icons/fa";
import { Dialog, DialogTitle, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { IoIosPaper } from "react-icons/io";
import { getAllScholarshipProgram } from "@/services/ApiServices/scholarshipProgramService";

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
    const [scholarships, setScholarships] = useState<{ id: number; name: string }[]>([]);
    const [description, setDescription] = useState<string>("");
    const [applicationFileUrls, setApplicationFileUrls] = useState<any>(null);
    const [editData, setEditData] = useState<ServiceType | null>(null);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.token.user);
    const isProvider = user?.role === "Provider";
    const isFunder = user?.role === "Funder";
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
    const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);

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

            const scholarshipResponse = await getAllScholarshipProgram();
            setScholarships(scholarshipResponse.data.items);
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
        setIsFeedbackDialogOpen(true);
    };

    const handleCloseFeedbackDialog = () => {
        setIsFeedbackDialogOpen(false);
    };

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
            toast.success("Service marked as inactive successfully!");
            navigate(RouteNames.ACTIVITY);
        } catch (error) {
            setError((error as Error).message);
            toast.error("Failed to delete service.");
        } finally {
            setLoading(false);
        }
    };

    const handleRequestNow = async () => {
        if (!serviceData) return;
        try {
            setLoading(true);
            const walletResponse = await getAccountWallet(user?.id);
            const userBalance = walletResponse.data.balance;
            if (userBalance < serviceData?.price) {
                toast.error("Insufficient funds to request this service. Please add funds to your account.");
                setLoading(false);
                return;
            }
            setDialogOpen(true);

        } catch (error: any) {
            if (error.response?.data?.statusCode === 400) {
                setIsWalletDialogOpen(true);
            } else {
                toast.error("Failed to check wallet information.");
                console.error("Wallet check error:", error);
            }
        } finally {
            setLoading(false);
        }
    };


    const handleNavigateToWallet = () => {
        navigate(RouteNames.WALLET);
        setIsWalletDialogOpen(false);
    };

    const handleCloseWalletDialog = () => {
        setIsWalletDialogOpen(false);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setExpectedCompletionTime(null);
        setApplicationNotes("");
        setScholarshipType("");
        setApplicationFileUrls("");
        setConfirmationDialogOpen(false);
    };

    const handleSubmit = async () => {
        if (!serviceData) return;
        setLoading(true);
        setError(null);

        try {
            const walletResponse = await getAccountWallet(user?.id);
            const userBalance = walletResponse.data.balance;

            if (userBalance < serviceData?.price) {
                toast.error("Insufficient funds to request this service. Please add funds to your account.");
                setLoading(false);
                return;
            }

            let fileUrls: string[] = [];
            if (applicationFileUrls && applicationFileUrls.length > 0) {
                const filesArray = Array.from(applicationFileUrls);
                const uploadedFiles = await uploadFile(filesArray);
                fileUrls = uploadedFiles.urls;
            }

            const requestDatas = {
                description,
                applicantId: user?.id,
                serviceIds: [serviceData?.id],
                requestFileUrls: fileUrls,
            };

            const transferRequest = {
                senderId: Number(user.id),
                receiverId: serviceData.providerId,
                amount: serviceData.price,
                paymentMethod: "Pay by wallet",
            };
            setLoading(false);
            toast.success("Payment successful!");
            await transferMoney(transferRequest);
            closeDialog();
            toast.success("Request created successfully!");
            await createRequest(requestDatas);
            await fetchService();
            
            await NotifyProviderNewRequest(user.id, Number(serviceData?.id));
        } catch (error) {
            setError((error as Error).message);
            toast.error("Failed to create request.");
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
                        <div className="mb-5 flex justify-between items-center">
                            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                                <IoIosPaper className="text-3xl text-blue-500" />
                                <span>Create Request</span>
                            </DialogTitle>
                            <span
                                className="text-xl cursor-pointer"
                                onClick={closeDialog}
                            >
                                &times;
                            </span>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Description</label>
                                <input
                                    type="text"
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            {/* <div className="mb-4">
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="scholarship-type-label">Select Scholarship (Optional)</InputLabel>
                                    <Select
                                        labelId="scholarship-type-label"
                                        value={scholarshipType}
                                        onChange={(e) => setScholarshipType(e.target.value)}
                                        label="Select Scholarship"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {scholarships.map((scholarship) => (
                                            <MenuItem key={scholarship.id} value={scholarship.id}>
                                                {scholarship.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div> */}
                            <div className="mb-4">
                                <label className="block text-gray-700">Submit File(s)</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        if (files) {
                                            setApplicationFileUrls(Array.from(files));
                                        }
                                    }}
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
                                    Send
                                </button>
                            </div>
                        </form>
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

                                    {feedbacks.length > 0 ? (
                                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                                            <thead>
                                                <tr className="bg-gray-100 text-gray-700">
                                                    <th className="p-4 text-left font-semibold">Applicant Name</th>
                                                    <th className="p-4 text-left font-semibold">Rating</th>
                                                    <th className="p-4 text-left font-semibold">Comment</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {feedbacks.map((feedback, index) => (
                                                    <tr key={index} className="border-t hover:bg-gray-50">
                                                        <td className="p-4">{feedback.name || "********"}</td>
                                                        <td className="p-4 flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaStar
                                                                    key={i}
                                                                    color={i < feedback.rating ? "#FFB800" : "#ddd"}
                                                                    size={18}
                                                                />
                                                            ))}
                                                        </td>
                                                        <td className="p-4">{feedback.content}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                                            <thead>
                                                <tr className="bg-gray-100 text-gray-700">
                                                    <th className="p-4 text-left font-semibold">Applicant Name</th>
                                                    <th className="p-4 text-left font-semibold">Rating</th>
                                                    <th className="p-4 text-left font-semibold">Comment</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td colSpan={3} className="p-4 text-center text-gray-600">
                                                        No feedback available.
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )}
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
                        <div className="text-center flex h-[50px] mt-[26px]">
                            <div className="flex justify-between w-full gap-4">
                                {showButtons && (
                                    <>
                                        {!isFunder && !isProvider ? (
                                            requestStatus === "Finished" ? (
                                                <button
                                                    onClick={handleRequestNow}
                                                    className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-full px-6 py-2 transition duration-300"
                                                >
                                                    <FaRedo className="mr-2" /> Request Again
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleRequestNow}
                                                    className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-full px-6 py-2 transition duration-300"
                                                >
                                                    <FaPlus className="mr-2" /> Request Now
                                                </button>
                                            )
                                        ) : !isFunder && isProvider ? (
                                            <>
                                                <button
                                                    onClick={() => openEditDialog()}
                                                    className="flex items-center justify-center w-full bg-yellow-500 hover:bg-yellow-400 text-white text-lg font-semibold rounded-full px-6 py-2 transition duration-300"
                                                    disabled={!canEdit}
                                                >
                                                    <FaEdit className="mr-2" /> Edit
                                                </button>
                                                <button
                                                    onClick={handleOpenApplicantDialog}
                                                    className="flex items-center justify-center w-full bg-green-600 hover:bg-green-500 text-white text-lg font-semibold rounded-full px-6 py-2 transition duration-300"
                                                >
                                                    <FaEye className="mr-2" /> View Request
                                                </button>
                                                <button
                                                    onClick={handleDelete}
                                                    className="flex items-center justify-center w-full bg-red-600 hover:bg-red-500 text-white text-lg font-semibold rounded-full px-6 py-2 transition duration-300"
                                                >
                                                    <FaTrash className="mr-2" /> Delete
                                                </button>
                                            </>
                                        ) : (
                                            <div></div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-10">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-blue-600 mb-8 text-center font-poppins">
                        Service Details
                    </h2>

                    <div className="flex justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-3/5 bg-white shadow-lg rounded-xl p-8">
                            <div className="flex items-center space-x-4">
                                <FaInfoCircle className="text-blue-500 text-xl" />
                                <div>
                                    <p className="text-lg font-semibold text-gray-700">Service Type:</p>
                                    <p className="text-gray-600">{serviceData.type}</p>
                                </div>
                            </div>
                            <div className="flex ml-35 items-center space-x-4">
                                <FaDollarSign className="text-green-500 text-xl" />
                                <div>
                                    <p className="text-lg font-semibold text-gray-700">Price:</p>
                                    <p className="text-gray-600">${serviceData.price}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <FaClock className="text-yellow-500 text-xl" />
                                <div>
                                    <p className="text-lg font-semibold text-gray-700">Duration:</p>
                                    <p className="text-gray-600">{new Date(serviceData.duration).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="hidden flex items-center space-x-4">
                                <FaCheckCircle className="text-teal-500 text-xl" />
                                <div>
                                    <p className="text-lg font-semibold text-gray-700">Status:</p>
                                    <p className="text-gray-600">{serviceData.status}</p>
                                </div>
                            </div>
                            <div className="flex ml-35 items-center space-x-4">
                                <FaUser className="text-indigo-500 text-xl" />
                                <div>
                                    <Link
                                        to={RouteNames.PROVIDER_INFORMATION.replace(":id", serviceData.providerId)}
                                        className="text-blue-600 hover:underline text-lg font-semibold"
                                    >
                                        Provider Information
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <FaCheckCircle className="text-teal-500 text-xl" />
                                <div>
                                    <p className="text-lg font-semibold text-gray-700">About This Service:</p>
                                    <p className="text-gray-600">{serviceData.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <AccountApplicantDialog open={applicantDialogOpen}
                onClose={() => setApplicantDialogOpen(false)}
                applications={applicants ?? []}
                fetchApplications={async () => {
                    if (!serviceData) return;
                    await fetchApplicants(parseInt(serviceData?.id));
                }} />

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Wallet Dialog */}
            <Dialog open={isWalletDialogOpen} onClose={handleCloseWalletDialog}>
                <div className="p-6">
                    <h3 className="text-2xl font-semibold">You don't have a wallet yet!</h3>
                    <p className="my-4 text-lg text-gray-600">
                        You need to create a wallet to add services. Do you want to go to the Wallet page?
                    </p>
                    <div className="flex justify-end gap-4">
                        <button onClick={handleCloseWalletDialog} className="bg-gray-300 px-5 py-2 rounded-full hover:bg-gray-400 transition-all">
                            Cancel
                        </button>
                        <button onClick={handleNavigateToWallet} className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition-all">
                            Yes
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ServiceDetails;
