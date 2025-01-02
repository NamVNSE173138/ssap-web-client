import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Spinner from "@/components/Spinner";
import RouteNames from "@/constants/routeNames";
import {
  getServiceById,
  updateService,
} from "@/services/ApiServices/serviceService";
import {
  createRequest,
  getRequestById,
  getRequestsByService,
} from "@/services/ApiServices/requestService";
import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import AccountApplicantDialog from "./applicantrequests-dialog";
import { uploadFile } from "@/services/ApiServices/testService";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaEdit,
  FaExclamationTriangle,
  FaEye,
  FaPlus,
  FaRedo,
  FaServicestack,
  FaStar,
  FaTimes,
  FaTrash,
  FaUsers,
  FaWallet,
} from "react-icons/fa";
import { NotifyProviderNewRequest } from "@/services/ApiServices/notification";
import { getAccountWallet } from "@/services/ApiServices/accountService";
import { transferMoney } from "@/services/ApiServices/paymentService";
import {
  FaInfoCircle,
  FaDollarSign,
  FaCheckCircle,
  FaUser,
} from "react-icons/fa";
import { Button, Dialog, DialogTitle, Paper, Tab, Tabs } from "@mui/material";
import { IoIosEye, IoIosPaper } from "react-icons/io";
import {
  IoWalletOutline,
  IoCashOutline,
  IoCloudUpload,
  IoClose,
  IoText,
  IoCard,
  IoCloseCircleOutline,
  IoInformationCircle,
  IoAlbums,
  IoBandage,
  IoList,
} from "react-icons/io5";
import { getAllScholarshipProgram } from "@/services/ApiServices/scholarshipProgramService";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditServiceModal from "../Activity/UpdateServiceModal";
import ServiceContractDialog from "./ServiceContractDialog";
import { notification } from "antd";
import { format } from "date-fns";

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

const ConfirmationDialog = ({ isOpen, onClose, onConfirm }: any) => {
  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? "block" : "hidden"
        }`}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 max-w-sm w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <FaExclamationTriangle className="text-yellow-500 text-4xl mb-4" />
        <h3 className="text-xl font-semibold mb-4">
          Are you sure you want to delete this service?
        </h3>
        <div className="flex space-x-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-500 transition"
          >
            Ok
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ServiceDetails = ({ showButtons = true, serviceId = null }: any) => {
  const { id } = serviceId ?? useParams<{ id: string }>();
  const [serviceData, setServiceData] = useState<ServiceType | null>(null);
  const [applicants, setApplicants] = useState<any>(null);
  const [applicantDialogOpen, setApplicantDialogOpen] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [_scholarshipType, setScholarshipType] = useState<string>("");
  const [_scholarships, setScholarships] = useState<
    { id: number; name: string }[]
  >([]);
  const [description, setDescription] = useState<string>("");
  const [applicationFileUrls, setApplicationFileUrls] = useState<File[]>([]);
  const [_editData, setEditData] = useState<ServiceType | null>(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.token.user);
  const isProvider = user?.role === "Provider";
  const isFunder = user?.role === "Funder";
  const isApplicant = user?.role === "Applicant";
  const [canEdit, setCanEdit] = useState<boolean>(true);
  const [_existingRequestId, setExistingRequestId] = useState<number | null>(
    null
  );
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [feedbackCount, setFeedbackCount] = useState<number>(0);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] =
    useState<boolean>(false);
  // const [requestData, setRequestData] = useState<any>(null);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isContractOpen, setContractOpen] = useState(false);
  const [_isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const [requestapplicants, setRequestApplicants] = useState<any>({ pending: [], finished: [] });
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const applications = await getRequestsByService(id);
        const requestApplicant = applications.data;
        console.log(applications)
        setRequestApplicants({
          pending: requestApplicant.filter((app: any) => app.status === "Pending"),
          finished: requestApplicant.filter((app: any) => app.status === "Finished"),
        });
      } catch (error: any) {
        console.log(error)
      }
    };
    fetchApplicants();
  }, [id]);

  const fetchService = async () => {
    try {
      const data = await getServiceById(Number(id));
      setServiceData(data.data);
      const feedbacks = data.data.feedbacks || [];
      console.log(feedbacks);
      if (feedbacks && feedbacks.length > 0) {
        const totalRating = feedbacks.reduce(
          (acc: number, feedback: any) => acc + (feedback.rating || 0),
          0
        );
        const count = feedbacks.length;
        setFeedbacks(feedbacks);
        setAverageRating(totalRating / count);
        setFeedbackCount(count);
      }
      const response = await fetchApplicants(data.data.id);
      console.log(response);
      setExistingRequestId(response);
      if (response.length == 0) {
        setCanEdit(true);
      } else {
        console.log("Hrllo");

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

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditData(null);
  };

  const handleFeedbackClick = () => {
    setIsFeedbackDialogOpen(true);
  };

  const handleCloseFeedbackDialog = () => {
    setIsFeedbackDialogOpen(false);
  };

  const handleOpenContract = () => {
    setContractOpen(true);
  };

  const fetchApplicants = async (serviceId: number) => {
    try {
      const response = await getRequestsByService(serviceId);
      if (response.statusCode == 200) {
        setApplicants(response.data);
        const existingRequest = response.data
        console.log(existingRequest);
        if (existingRequest) {
          setExistingRequestId(existingRequest.id);
          setRequestStatus(existingRequest.status);
        } else {
          setExistingRequestId(null);
          setRequestStatus(null);
        }
        setCanEdit(existingRequest.length != 0 ? false : true);
        return response.data;
      } else {
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
    if (!serviceData) return;
    setConfirmationDialogOpen(false);
    setLoading(true);
    try {
      const updatedData = { ...serviceData, status: "Inactive" };
      await updateService(Number(id), updatedData);

      setServiceData(updatedData);
      notification.success({
        message: "Service marked as inactive successfully!",
      });
      navigate(RouteNames.SERVICES);
    } catch (error) {
      setError((error as Error).message);
      notification.error({ message: "Failed to delete service." });
    } finally {
      setLoading(false);
    }
  };

  const checkWallet = async () => {
    try {
      const response = await getAccountWallet(Number(user?.id));
      if (response.statusCode === 200) {
        setIsServiceModalOpen(true);
      }
    } catch (error: any) {
      if (error.response.data.statusCode === 400) {
        setIsWalletDialogOpen(true);
      }
      console.error("Error checking wallet:", error);
    }
  };

  const handleRequestNow = async () => {
    checkWallet();
    if (!serviceData) {
      notification.error({
        message: "Service data is missing. Please try again.",
      });
      return;
    }

    try {
      setLoading(true);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error in handleRequestNow:", error);
      notification.error({
        message:
          "An error occurred while processing your request. Please try again.",
      });
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
    setScholarshipType("");
    setApplicationFileUrls([]);
    setConfirmationDialogOpen(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!serviceData) {
      notification.error({
        message: "Service data is missing. Please try again.",
      });
      return;
    }

    if (description.length > 200) {
      notification.error({ message: "Description cannot exceed 200 characters." });
      return;
    }

    if (!paymentMethod) {
      notification.error({ message: "Please select a payment method." });
      return;
    }

    setLoadingSubmit(true);
    setError(null);

    try {
      console.log(paymentMethod);
      if (paymentMethod === "Wallet") {
        try {
          const walletResponse = await getAccountWallet(user?.id);
          const userBalance = walletResponse.data.balance;

          if (userBalance < serviceData?.price) {
            notification.error({
              message:
                "Insufficient funds to request this service. Please add funds to your account.",
            });
            setLoading(false);
            return;
          }
        } catch (error: any) {
          if (error.response?.data?.statusCode === 400) {
            setIsWalletDialogOpen(true);
          } else {
            notification.error({
              message: "Failed to check wallet information.",
            });
            console.error("Wallet check error:", error);
          }
        }
      }

      let fileUrls: string[] = [];
      if (applicationFileUrls && applicationFileUrls.length > 0) {
        const filesArray = Array.from(applicationFileUrls);
        const uploadedFiles = await uploadFile(filesArray);
        fileUrls = uploadedFiles.urls || [];
      }

      const requestDatas = {
        description,
        applicantId: user?.id,
        serviceIds: [serviceData?.id],
        requestFileUrls: fileUrls,
      };
      console.log(serviceData.price);

      if (serviceData.price > 0) {
        const transferRequest = {
          senderId: Number(user.id),
          receiverId: serviceData.providerId,
          amount: serviceData.price,
          paymentMethod,
          description: "Pay for service",
        };

        await transferMoney(transferRequest);
        console.log(`Payment successful for service ID ${serviceData.id}.`);
      }

      await createRequest(requestDatas);
      closeDialog();
      notification.success({ message: "Request created successfully!" });
      await fetchService();
      await NotifyProviderNewRequest(user.id, Number(serviceData?.id));
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setError((error as Error).message || "An unknown error occurred.");
      notification.error({ message: "Failed to create request." });
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loading) return <Spinner size="large" />;
  if (error)
    return <p className="text-center text-xl font-semibold">{error}</p>;
  if (!serviceData)
    return (
      <p className="text-center text-xl font-semibold">Service not found</p>
    );

  return (
    <div>
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] md:w-[60%] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 transform transition-all scale-95 hover:scale-100">
            <div className="mb-5 flex justify-between items-center">
              <DialogTitle className="text-2xl font-semibold flex items-center gap-2 text-blue-600">
                <IoIosPaper className="text-3xl text-blue-500" />
                <span className="font-bold">CREATE REQUEST</span>
              </DialogTitle>
              <span
                className="text-xl cursor-pointer text-gray-600 hover:text-red-500 transition-all"
                onClick={closeDialog}
              >
                <IoClose className="text-2xl" />
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <IoText className="text-blue-500" />
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Enter a description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm"
                />
                <div
                  className={`text-sm mt-1 ${description.length > 200 ? "text-red-500" : "text-gray-500"
                    }`}
                >
                  {description.length}/{200}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <label className="text-gray-700 font-medium flex items-center gap-2">
                    <IoList className="text-blue-500" />
                    <div className="text-gray-400">(Suggest description)</div>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSuggest(!showSuggest)} // Toggle state
                    className="text-blue-500 hover:underline text-sm"
                  >
                    {showSuggest ? "Hide Suggestions" : "Show Suggestions"}
                  </button>
                </div>
                {showSuggest && ( // Hiển thị form nếu state showSuggest là true
                  <div className="max-w-7xl mx-auto p-6 bg-[rgba(219,216,216,0.95)] shadow-lg rounded-md mt-3">
                    <ul className="space-y-2">
                      {[
                        "Provide feedback to refine my CV for a specific job application.",
                        "Help me translate an academic essay into fluent English.",
                        "Assist with writing a compelling essay for my scholarship application.",
                        "Review my application documents to ensure they are error-free and impactful.",
                        "Prepare me for an upcoming interview with personalized coaching.",
                        "Draft a strong and persuasive recommendation letter for a scholarship.",
                        "Support me in finding scholarships tailored to my background and goals.",
                        "Proofread my research paper to enhance clarity and grammar.",
                        "Guide me in developing a personalized scholarship strategy for maximum success.",
                        "Offer insights into financial aid options to cover tuition costs.",
                      ].map((suggestion, index) => (
                        <li
                          key={index}
                          className="cursor-pointer text-blue-500 hover:underline"
                          onClick={() => setDescription(suggestion)}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>


              <div className="mb-5">
                <label className=" text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <IoCloudUpload className="text-blue-500" />
                  Submit File(s)
                </label>
                <div className="border border-dashed border-gray-300 p-4 rounded-lg text-center hover:bg-gray-50 transition-all">
                  <input
                    type="file"
                    multiple
                    className="w-full hidden"
                    id="file-upload"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) setApplicationFileUrls(Array.from(files));
                    }}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-blue-500 hover:underline"
                  >
                    <IoCloudUpload className="text-4xl mx-auto text-gray-400 mb-2" />
                    Click to upload files
                  </label>
                </div>

                {applicationFileUrls.length > 0 && (
                  <div className="mt-4 text-gray-700">
                    <h3 className="font-medium">Selected Files:</h3>
                    <ul className="list-disc pl-5">
                      {applicationFileUrls.map((file: File, index: number) => (
                        <li key={index} className="text-sm">
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mb-5">
                <label className=" text-gray-700 font-medium mb-3 flex items-center gap-2">
                  <IoCard className="text-blue-500" />
                  Choose Payment Method
                </label>
                <div className="flex gap-6">
                  <div
                    onClick={() => setPaymentMethod("Wallet")}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "Wallet"
                      ? "border-blue-500 bg-blue-100"
                      : "border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full">
                      <IoWalletOutline className="text-2xl" />
                    </div>
                    <span className="font-medium text-gray-800">
                      Pay by Wallet
                    </span>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("Cash")}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "Cash"
                      ? "border-green-500 bg-green-100"
                      : "border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full">
                      <IoCashOutline className="text-2xl" />
                    </div>
                    <span className="font-medium text-gray-800">Cash</span>
                  </div>
                </div>
                {paymentMethod === null && (
                  <p className="text-red-500 text-sm mt-2">
                    Please select a payment method.
                  </p>
                )}
              </div>

              <div className="mb-5">
                <label className=" text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <IoText className="text-blue-500" />
                  Payment Description
                </label>
                <input
                  type="text"
                  value="Pay for service"
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 text-gray-700 rounded-lg p-3 shadow-sm cursor-not-allowed focus:outline-none"
                />
              </div>

              <div className="mb-5 text-gray-600 text-base">
                <IoInformationCircle className="text-blue-500 inline mr-2" />
                When you click "Send", it means you agree to our{" "}
                <span
                  className="text-blue-500 font-medium cursor-pointer hover:underline"
                  onClick={handleOpenContract}
                >
                  Service Contract
                </span>
                .
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="mr-3 bg-gray-300 text-gray-700 rounded-lg px-5 py-2 hover:bg-gray-400 transition"
                  disabled={loadingSubmit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white rounded-lg px-5 py-2 flex items-center space-x-2 hover:bg-blue-700 transition"
                  disabled={loadingSubmit}
                >
                  {loadingSubmit ? (
                    "Processing..."
                  ) : (
                    <>
                      <CheckCircleOutlineIcon className="text-white" />
                      <span>Send</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="relative">
        <ScholarshipProgramBackground />
        <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-start items-start p-[40px] gap-[80px] z-10">
          <div>
            <Breadcrumb>
              <BreadcrumbList className="text-[#000]">
                <BreadcrumbItem>
                  <Link
                    to="/"
                    className="md:text-xl text-lg "
                  >
                    Home
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    to="/services"
                    className="text-[#000] md:text-xl font-medium text-lg"
                  >
                    Services
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <p className="text-[#000] md:text-xl text-lg font-semibold">
                    {serviceData.name}
                  </p>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className={isProvider ? "w-2/3" : ""}>
            <div className="lg:flex-col items-center flex-row flex gap-[20px]">
              <div>
                <p className="text-white text-5xl lg:line-clamp-3 line-clamp-5 font-bold ">
                  {serviceData.name}
                </p>
              </div>
              <div className="flex flex-col items gap-2">
                <div className="flex items-center gap-2">
                  <FaStar color="yellow" size={20} />
                  <p
                    className="text-yellow-500 cursor-pointer underline hover:text-yellow-400 transition-all"
                    onClick={handleFeedbackClick}
                  >
                    {averageRating.toFixed(1)} ({feedbackCount}{" "}
                    {feedbackCount === 1 ? "feedback" : "feedbacks"})
                  </p>
                </div>
              </div>
            </div>

            {isFeedbackDialogOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-5 rounded-lg shadow-lg w-[90%] md:w-[60%]">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-[#1eb2a6]">
                      Feedback Details
                    </h2>
                  </div>

                  {feedbacks.length > 0 ? (
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700">
                          <th className="p-4 text-left font-semibold" style={{ width: '5%' }}>#</th> {/* Chiếm 0.5 */}
                          <th className="p-4 text-left font-semibold" style={{ width: '20%' }}>Applicant Name</th> {/* Chiếm 2 */}
                          <th className="p-4 text-left font-semibold" style={{ width: '10%' }}>Rating</th> {/* Chiếm 1 */}
                          <th className="p-4 text-left font-semibold" style={{ width: '20%' }}>Comment</th> {/* Chiếm 2 */}
                          <th className="p-4 text-left font-semibold" style={{ width: '15%' }}>Date</th> {/* Chiếm 1 */}
                        </tr>
                      </thead>
                      <tbody>
                        {feedbacks.map((feedback, index) => (
                          <tr key={index} className="border-t hover:bg-gray-50">
                            <td className="p-4" style={{ width: '5%' }}>{index + 1}</td> {/* Chiếm 0.5 */}
                            <td className="p-4" style={{ width: '20%' }}>{feedback.name || "********"}</td> {/* Chiếm 2 */}
                            <td className="p-4 flex items-center" style={{ width: '10%' }}>
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  color={i < feedback.rating ? "#FFB800" : "#ddd"}
                                  size={18}
                                />
                              ))}
                            </td> {/* Chiếm 1 */}
                            <td className="p-4" style={{ width: '20%' }}>{feedback.content}</td> {/* Chiếm 2 */}
                            <td className="p-4" style={{ width: '15%' }}>
                              {new Date(feedback.feedbackDate).toLocaleDateString('en-US')}
                            </td> {/* Chiếm 1 */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700">
                          <th className="p-4 text-left font-semibold" style={{ width: '5%' }}>#</th>
                          <th className="p-4 text-left font-semibold" style={{ width: '20%' }}>Applicant Name</th>
                          <th className="p-4 text-left font-semibold" style={{ width: '10%' }}>Rating</th>
                          <th className="p-4 text-left font-semibold" style={{ width: '20%' }}>Comment</th>
                          <th className="p-4 text-left font-semibold" style={{ width: '15%' }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            colSpan={5}
                            className="p-4 text-center text-gray-600"
                          >
                            No feedback available.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                  <div className="mt-4 text-right">
                    <button
                      onClick={handleCloseFeedbackDialog}
                      className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition-all"
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
                    {isApplicant ? (
                      requestStatus === "Finished" ? (
                        <button
                          onClick={handleRequestNow}
                          className="flex items-center justify-center w-full bg-[#1eb2a6] hover:bg-blue-500 text-white text-lg font-semibold rounded-full px-6 py-2 transition duration-300"
                        >
                          <FaRedo className="mr-2" /> Request Again
                        </button>
                      ) : (
                        <button
                          onClick={handleRequestNow}
                          className="flex items-center mb-3 justify-center w-full bg-[#1eb2a6] hover:bg-blue-500 text-white text-lg font-semibold rounded-full px-6 py-2 transition duration-300"
                        >
                          <FaPlus className="mr-2" /> Request Now
                        </button>
                      )
                    ) : !isFunder && isProvider ? (
                      <>
                        <button
                          onClick={() => openEditDialog()}
                          className={`flex items-center justify-center w-full text-lg font-semibold rounded-full px-6 py-2 transition duration-300 ${!canEdit
                            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                            : "bg-yellow-500 hover:bg-yellow-400 text-white"
                            }`}
                          disabled={!canEdit}
                          title={
                            !canEdit
                              ? "There is already an applicant to buy this service."
                              : ""
                          }
                        >
                          <FaEdit className="mr-2" /> Edit
                        </button>
                        {/* <button
                          onClick={handleOpenApplicantDialog}
                          className="flex items-center justify-center w-full bg-green-600 hover:bg-green-500 text-white text-lg font-semibold rounded-full px-6 py-2 transition duration-300"
                        >
                          <FaEye className="mr-2" /> View Request
                        </button> */}
                        <button
                          onClick={() => setConfirmationDialogOpen(true)}
                          className={`flex items-center justify-center w-full text-lg font-semibold rounded-full px-6 py-2 transition duration-300 ${!canEdit
                            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-500 text-white"
                            }`}
                          disabled={!canEdit}
                          title={
                            !canEdit
                              ? "There is already an applicant to buy this service."
                              : ""
                          }
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
          <div className="flex justify-center">
            <div className="w-11/12 md:w-4/5 bg-white shadow-xl rounded-2xl p-10 space-y-6">
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-[#1eb2a6] rounded-full">
                  <FaServicestack className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl sm:text-3xl font-bold text-gray-800">Service Details</h2>
              </div>
              <div className="h-1 w-16 bg-[#1eb2a6] rounded mt-2"></div>
              <br />

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Service Type */}
                  <div className="flex items-center space-x-4 hover:shadow-xl transition-all duration-300 p-4 rounded-lg hover:bg-blue-50">
                    <FaInfoCircle className="text-blue-500 text-3xl" />
                    <div>
                      <p className="text-lg font-semibold text-gray-700">Service Type:</p>
                      <p className="text-gray-600">{serviceData.type}</p>
                    </div>
                  </div>

                  {/* Provider Information */}
                  <div className="flex items-center space-x-4 hover:shadow-xl transition-all duration-300 p-4 rounded-lg hover:bg-indigo-50">
                    <FaUser className="text-indigo-500 text-3xl" />
                    <div>
                      <Link
                        to={RouteNames.PROVIDER_INFORMATION.replace(":id", serviceData.providerId)}
                        className="text-[#1eb2a6] hover:underline text-lg font-semibold"
                      >
                        Provider Information
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Price */}
                  <div className="flex items-center space-x-4 hover:shadow-xl transition-all duration-300 p-4 rounded-lg hover:bg-green-50">
                    <FaDollarSign className="text-green-500 text-3xl" />
                    <div>
                      <p className="text-lg font-semibold text-gray-700">Price:</p>
                      <p className="text-gray-600">${serviceData.price}</p>
                    </div>
                  </div>

                  {/* About This Service */}
                  <div className="flex items-center space-x-4 hover:shadow-xl transition-all duration-300 p-4 rounded-lg hover:bg-yellow-50">
                    <FaClipboardList className="text-teal-500 text-3xl" />
                    <div>
                      <p className="text-lg font-semibold text-gray-700">About This Service:</p>
                      <p className="text-gray-600">{serviceData.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <br></br>
          <br></br>

          {user.role == "Provider" && (
            <div className="flex justify-center">
              <div className="w-11/12 md:w-4/5 bg-white shadow-xl rounded-2xl p-10 space-y-6">
                {/* Tiêu đề */}
                <div>
                  <div className="relative flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-r from-[#1eb2a6] to-[#0d9488] rounded-full">
                      <FaUsers className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Applicant's Requests</h2>
                  </div>
                  {/* Gạch dưới */}
                  <div className="h-1 w-20 bg-gradient-to-r from-[#1eb2a6] to-[#0d9488] rounded mt-2"></div>
                </div>


                {/* Tabs */}
                <Tabs
                  value={selectedTab}
                  onChange={(_, newValue) => setSelectedTab(newValue)}
                  aria-label="Applications Tabs"
                  centered
                  className="bg-gray-100 rounded-lg shadow-sm p-2"
                >
                  <Tab
                    label="Pending Request"
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      color: selectedTab === 0 ? "#0369a1" : "#6b7280",
                    }}
                  />
                  <Tab
                    label="Finished Request"
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      color: selectedTab === 1 ? "#16a34a" : "#6b7280",
                    }}
                  />
                </Tabs>

                {/* Bảng ứng viên */}
                <Paper
                  elevation={3}
                  style={{
                    padding: '20px',
                    borderRadius: '10px',
                    backgroundColor: '#fafafa',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {/* Table Header */}
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
                    <div style={{ flex: 0.5 }}>#</div>
                    <div style={{ flex: 1 }}>Avatar</div>
                    <div style={{ flex: 1 }}>Name</div>
                    <div style={{ flex: 1 }}>Request Date</div>
                    <div style={{ flex: 1 }}>Action</div>
                  </div>

                  {/* Applicants List */}
                  {(selectedTab === 0 ? requestapplicants.pending : requestapplicants.finished)?.length > 0 ? (
                    (selectedTab === 0 ? requestapplicants.pending : requestapplicants.finished).map((app: any, index: number) => (
                      <div
                        key={app.id}
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
                        {/* Index */}
                        <div style={{ flex: 0.5 }}>{index + 1}</div>

                        {/* Avatar */}
                        <div style={{ flex: 1 }}>
                          <img
                            src={app.applicant.avatarUrl || '/path/to/default-avatar.jpg'}
                            alt="Avatar"
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid #0369a1',
                            }}
                          />
                        </div>

                        {/* Name */}
                        <div style={{ flex: 1 }}>{app.applicant.username}</div>

                        {/* Applied At */}
                        <div style={{ flex: 1 }}>
                          {app.requestDate ? format(new Date(app.requestDate), 'MM/dd/yyyy') : 'N/A'}
                        </div>

                        {/* Actions */}
                        <div style={{ flex: 1 }}>
                          <Button
                            onClick={() => navigate(`/provider/requestinformation/${app.id}`)}
                            style={{
                              backgroundColor: '#1e88e5',
                              color: '#fff',
                              padding: '6px 12px',
                              borderRadius: '5px',
                            }}
                          >
                            <IoIosEye style={{ marginRight: '8px' }} />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 font-semibold">No applicants available.</p>
                  )}
                </Paper>

              </div>
            </div>
          )}

        </div>
      </section>

      <AccountApplicantDialog
        open={applicantDialogOpen}
        onClose={() => setApplicantDialogOpen(false)}
        applications={applicants ?? []}
        fetchApplications={async () => {
          if (!serviceData) return;
          await fetchApplicants(parseInt(serviceData?.id));
        }}
      />

      <Dialog open={isWalletDialogOpen} onClose={handleCloseWalletDialog}>
        <div className="p-8 bg-white rounded-lg shadow-xl max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <FaExclamationTriangle className="text-yellow-500 text-4xl mr-4" />
            <h3 className="text-2xl font-semibold text-gray-800">
              You don't have a wallet yet!
            </h3>
          </div>
          <p className="my-4 text-lg text-gray-600">
            You need to create a wallet to add services. Do you want to go to
            the Wallet page?
          </p>
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleCloseWalletDialog}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-400 transition-all flex items-center gap-2"
            >
              <FaTimes className="text-gray-700" /> Cancel
            </button>
            <button
              onClick={handleNavigateToWallet}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              <FaWallet className="text-white" /> Yes, Go to Wallet
            </button>
          </div>
        </div>
      </Dialog>
      <EditServiceModal
        isOpen={isEditDialogOpen}
        setIsOpen={closeEditDialog}
        serviceData={serviceData}
        fetchServices={fetchService}
      />
      <ConfirmationDialog
        isOpen={isConfirmationDialogOpen}
        onClose={() => setConfirmationDialogOpen(false)}
        onConfirm={handleDelete}
      />
      <ServiceContractDialog
        isOpen={isContractOpen}
        onClose={() => setContractOpen(false)}
      />
    </div>
  );
};

export default ServiceDetails;
