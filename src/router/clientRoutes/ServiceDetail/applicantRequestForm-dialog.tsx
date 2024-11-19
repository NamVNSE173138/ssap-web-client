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
    const [expectedCompletionTime, setExpectedCompletionTime] = useState<Date | null>(null);
    const [scholarshipType, setScholarshipType] = useState<any>("");
    const [applicationFiles, setApplicationFiles] = useState<any>(null);
    const [scholarships, setScholarships] = useState<{ id: number; name: string }[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [applicationNotes, setApplicationNotes] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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
    
        try {
            // Step 1: Check user's wallet balance
            const walletResponse = await getAccountWallet(Number(user?.id));
            const userBalance = walletResponse.data.balance;
    
            if (userBalance < totalPrice) {
                toast.error("Insufficient funds. Please add funds to your account.");
                setLoading(false);
                return;
            }
    
            // Step 2: Upload files
            const filesArray = Array.from(applicationFiles || []);
            const uploadUrls = filesArray.length > 0 ? await uploadFile(filesArray) : { urls: [] };
    
            // Step 3: Process each selected service one by one
            for (const serviceId of selectedService) {
                const service = services.find((s) => Number(s.id) === serviceId);
    
                if (!service) {
                    console.error(`Service with ID ${serviceId} not found.`);
                    continue;
                }
    
                // Step 3.1: Handle payment for this service
                if (service?.providerId && service?.price > 0) {
                    const transferRequest = {
                        senderId: Number(user.id),
                        receiverId: service.providerId,
                        amount: service.price,
                        paymentMethod: "Pay by wallet",
                    };
                    await transferMoney(transferRequest);
                    toast.success(`Payment successful for service ID ${serviceId}.`);
                }
    
                // Step 3.2: Create the request data for this service
                const requestData = {
                    description,
                    applicantId: user?.id,
                    serviceIds: [serviceId], // Only the current service
                    requestFileUrls: uploadUrls.urls, // File URLs for this specific service
                };
    
                // Step 3.3: Create the request for this service
                await createRequest(requestData);
                toast.success(`Request created successfully for service ID ${serviceId}.`);
            }
    
            // Step 4: Finalize the process
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
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
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
                            className="rounded-xl"
                        >
                            {services.map((service) => (
                                <MenuItem key={service.id} value={service.id}>
                                    {service.name} - ${service.price}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Total Price */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Total Price</label>
                        <input
                            type="text"
                            value={`$${totalPrice}`}
                            readOnly
                            className="w-full border rounded p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Provide a brief description"
                        />
                    </div>

                    {/* Application Files */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Application File(s)</label>
                        <input
                            type="file"
                            multiple
                            onChange={(e) => setApplicationFiles(e.target.files)}
                            className="w-full border rounded p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Error Message */}
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} className="bg-gray-300 text-black hover:bg-gray-400 rounded-xl px-5 py-2">
                    Cancel
                </Button>
                <Button
                    onClick={handleFormSubmit}
                    className="bg-blue-500 text-white hover:bg-blue-600 rounded-xl px-5 py-2"
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Send"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RequestFormModal;
