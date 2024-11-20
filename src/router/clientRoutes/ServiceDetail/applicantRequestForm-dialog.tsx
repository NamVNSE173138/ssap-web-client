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
import { IoWalletOutline, IoCashOutline, IoCloudUpload, IoText, IoPricetag, IoCard } from "react-icons/io5";

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
  const [applicationNotes, setApplicationNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

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

    setLoading(true);
    setError(null);

    if (!user) return null;
    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    try {
      if (paymentMethod === "Pay by wallet") {
        const walletResponse = await getAccountWallet(Number(user?.id));
        const userBalance = walletResponse.data.balance;

        if (userBalance < totalPrice) {
          toast.error("Insufficient funds. Please add funds to your account.");
          setLoading(false);
          return;
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

        if (service?.providerId && service?.price > 0) {
          const transferRequest = {
            senderId: Number(user.id),
            receiverId: service.providerId,
            amount: service.price,
            paymentMethod,
          };
          await transferMoney(transferRequest);
          toast.success(`Payment successful for service ID ${serviceId}.`);
        }

        const requestData = {
          description,
          applicantId: user?.id,
          serviceIds: [serviceId],
          requestFileUrls: uploadUrls.urls,
        };

        await createRequest(requestData);
        toast.success(`Request created successfully for service ID ${serviceId}.`);
      }

      handleClose();
    } catch (err) {
      console.error("Error submitting the request:", err);
      setError("An error occurred while submitting the request.");
      toast.error("Failed to create request.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-2xl font-semibold flex items-center gap-3">
        <IoIosPaper className="text-3xl text-blue-500" />
        <span>Request Service</span>
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-6">
          {/* Service Selection */}
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

          {/* Description */}
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

          {/* File Upload */}
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

            {/* Display the selected file names */}
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

          {/* Total Price */}
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

          {/* Payment Method */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
              <IoCard className="text-blue-500" />
              Choose Payment Method
            </label>
            <div className="flex gap-4">
              {/* Pay by Wallet */}
              <div
                onClick={() => setPaymentMethod("Pay by wallet")}
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${paymentMethod === "Pay by wallet"
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300 hover:bg-gray-100"
                  }`}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full">
                  <IoWalletOutline className="text-2xl" />
                </div>
                <span className="font-medium text-gray-800">Pay by Wallet</span>
              </div>

              {/* Cash */}
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

          {/* Error Message */}
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
          {loading ? "Processing..." : "Send"}
        </Button>
      </DialogActions>
    </Dialog>

  );
};

export default RequestFormModal;
