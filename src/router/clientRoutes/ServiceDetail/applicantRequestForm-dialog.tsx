import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { IoIosPaper } from "react-icons/io";
import { useState, useEffect } from "react";
import { ServiceType } from "../Service/data";
import { getAllScholarshipProgram } from "@/services/ApiServices/scholarshipProgramService";
import { createRequest } from "@/services/ApiServices/requestService";
import { transferMoney } from "@/services/ApiServices/paymentService";
import { toast } from "react-toastify";
import { uploadFile } from "@/services/ApiServices/testService";
import { getAccountWallet } from "@/services/ApiServices/accountService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { IoWalletOutline, IoCashOutline, IoCloudUpload, IoText, IoPricetag, IoCard, IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaTimes, FaWallet } from "react-icons/fa";
import RouteNames from "@/constants/routeNames";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { NotifyProviderNewRequest } from "@/services/ApiServices/notification";


type RequestFormModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  services: ServiceType[];
  handleSubmit: (
    serviceIds: number[],
    description: string,
    expectedCompletionTime: Date,
    scholarshipType: any,
    applicationFiles: FileList | null,
    totalPrice: number
  ) => void;
};

const RequestFormModal = ({ isOpen, handleClose, services, handleSubmit }: RequestFormModalProps) => {
  const user = useSelector((state: RootState) => state.token.user);
  const [selectedService, setSelectedService] = useState<number[]>([]);
  const [description, setDescription] = useState<string>("");
  const [applicationFiles, setApplicationFiles] = useState<File[]>([]);
  const [scholarships, setScholarships] = useState<{ id: number; name: string }[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await getAllScholarshipProgram();
        setScholarships(response.data.items);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
        setError("Failed to fetch scholarship programs.");
      }
    };

    if (isOpen) {
      fetchScholarships();
    }
  }, [isOpen]);

  useEffect(() => {
    const newTotalPrice = selectedService.reduce((total, serviceId) => {
      const service = services.find((service) => Number(service.id) === serviceId);
      return service ? total + service.price : total;
    }, 0);
    setTotalPrice(newTotalPrice);
  }, [selectedService, services]);

  const handleFormSubmit = async () => {
    if (selectedService.length === 0) {
      toast.error("Please select at least one service.");
      return;
    }

    if (!user) {
      toast.error("User not found. Please log in again.");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (paymentMethod === "Wallet") {
        try {
          const walletResponse = await getAccountWallet(Number(user?.id));
          const userBalance = walletResponse.data.balance;

          if (userBalance < totalPrice) {
            toast.error("Insufficient funds to request this service. Please add funds to your account.");
            setLoading(false);
            return;
          }
        } catch (error: any) {
          if (error.response?.data?.statusCode === 400) {
            setIsWalletDialogOpen(true);
          } else {
            toast.error("Failed to check wallet information.");
            console.error("Wallet check error:", error);
          }
        }
      }

      const filesArray = Array.from(applicationFiles || []);
      const uploadUrls = filesArray.length > 0 ? await uploadFile(filesArray) : { urls: [] };

      for (const serviceId of selectedService) {
        const service = services.find((s) => Number(s.id) === serviceId);
        if (!service) {
          console.error(`Service with ID ${serviceId} not found.`);
          continue;
        }

        if (service.providerId && service.price > 0) {
          const transferRequest = {
            senderId: Number(user.id),
            receiverId: service.providerId,
            amount: service.price,
            paymentMethod,
            description: "Pay for service",
          };

          await transferMoney(transferRequest);
          console.log(`Payment successful for service ID ${serviceId}.`);
        }

        const requestData = {
          description,
          applicantId: user?.id,
          serviceIds: [serviceId],
          requestFileUrls: uploadUrls.urls,
        };

        await createRequest(requestData);
        await NotifyProviderNewRequest(Number(user.id), serviceId);
        console.log(`Request created successfully for service ID ${serviceId}.`);
      }
      handleClose();
      toast.success("All services processed successfully!");
    } catch (err) {
      console.error("Error submitting the request:", err);
      setError("An error occurred while submitting the request.");
      toast.error("Failed to process some or all services.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseWalletDialog = () => {
    setIsWalletDialogOpen(false);
  };

  const handleNavigateToWallet = () => {
    navigate(RouteNames.WALLET);
    setIsWalletDialogOpen(false);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl h-[95%] w-[90%] md:w-[60%] transform transition-all scale-95 hover:scale-100 overflow-y-auto">
            <DialogTitle className="text-2xl font-semibold flex items-center gap-3 relative">
              <IoIosPaper className="text-3xl text-blue-500" />
              <span>Request Service</span>
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <IoClose className="text-2xl" />
              </button>
            </DialogTitle>

            <DialogContent>
              <div className="flex flex-col gap-6">
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="service-label">Select Service</InputLabel>
                  <Select
                    labelId="service-label"
                    multiple
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value as number[])}
                    label="Select Service"
                    className="rounded-xl shadow-md focus:outline-none hover:border-blue-500"
                  >
                    {services.map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        <span className="flex items-center justify-between w-full">
                          {service.name}
                          <span className="text-blue-500 font-medium">${service.price}</span>
                        </span>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <IoText className="text-blue-500" />
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded-xl p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="Provide a brief description"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
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
                        if (files) setApplicationFiles(Array.from(files));
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

                  {applicationFiles.length > 0 && (
                    <div className="mt-4 text-gray-700">
                      <h3 className="font-medium">Selected Files:</h3>
                      <ul className="list-disc pl-5">
                        {applicationFiles.map((file: File, index: number) => (
                          <li key={index} className="text-sm">
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <IoPricetag className="text-blue-500" />
                    Total Price
                  </label>
                  <input
                    type="text"
                    value={`$${totalPrice}`}
                    readOnly
                    className="w-full border rounded-xl p-3 text-gray-700 bg-gray-100 cursor-not-allowed focus:outline-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <IoCard className="text-blue-500" />
                    Choose Payment Method
                  </label>
                  <div className="flex gap-4">
                    <div
                      onClick={() => setPaymentMethod("Wallet")}
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${paymentMethod === "Wallet"
                        ? "border-blue-500 bg-blue-100"
                        : "border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full">
                        <IoWalletOutline className="text-2xl" />
                      </div>
                      <span className="font-medium text-gray-800">Pay by Wallet</span>
                    </div>

                    <div
                      onClick={() => setPaymentMethod("Cash")}
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${paymentMethod === "Cash"
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
                    <p className="text-red-500 text-sm mt-2">Please select a payment method.</p>
                  )}
                </div>

                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
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

                {error && <div className="text-red-500 text-sm">{error}</div>}
              </div>
            </DialogContent>

            <DialogActions>
              <Button
                onClick={handleClose}
                className="bg-gray-300 text-black hover:bg-gray-400 rounded-xl px-5 py-2 transition"
              >
                Cancel
              </Button>
              <Button
                onClick={handleFormSubmit}
                className="bg-blue-500 text-white hover:bg-blue-600 rounded-xl px-5 py-2 transition"
                disabled={loading}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <CheckCircleOutlineIcon className="mr-2" />
                    Send
                  </>
                )}
              </Button>
            </DialogActions>
          </div>
        </div>
      </Dialog>

      <Dialog open={isWalletDialogOpen} onClose={handleCloseWalletDialog}>
        <div className="p-8 bg-white rounded-lg shadow-xl max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <FaExclamationTriangle className="text-yellow-500 text-4xl mr-4" />
            <h3 className="text-2xl font-semibold text-gray-800">You don't have a wallet yet!</h3>
          </div>
          <p className="my-4 text-lg text-gray-600">
            You need to create a wallet to add services. Do you want to go to the Wallet page?
          </p>
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleCloseWalletDialog}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-400 transition-all flex items-center gap-2">
              <FaTimes className="text-gray-700" /> Cancel
            </button>
            <button
              onClick={handleNavigateToWallet}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all flex items-center gap-2">
              <FaWallet className="text-white" /> Yes, Go to Wallet
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default RequestFormModal;
