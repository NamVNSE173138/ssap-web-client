import RouteNames from "@/constants/routeNames";
import { getAccountWallet } from "@/services/ApiServices/accountService";
import { transferMoney } from "@/services/ApiServices/paymentService";
import { RootState } from "@/store/store";
import { Dialog } from "@mui/material";
import { notification } from "antd";
import React, { useState } from "react";
import { FaCreditCard, FaExclamationTriangle, FaTimes, FaWallet } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoCashOutline, IoInformationCircle, IoWalletOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SubscriptionContractDialog from "../ServiceDetail/SubscriptionContractDialog";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const subscriptionData = [
    {
        id: 1,
        name: "Basic Plan",
        description: "Perfect for individuals starting out.",
        amount: "$10",
        numberOfServices: 5,
        validMonths: 1,
    },
    {
        id: 2,
        name: "Standard Plan",
        description: "Best for small businesses.",
        amount: "$30",
        numberOfServices: 20,
        validMonths: 6,
    },
    {
        id: 3,
        name: "Premium Plan",
        description: "Ideal for growing enterprises.",
        amount: "$50",
        numberOfServices: 50,
        validMonths: 12,
    },
];

const MultiStepSubscriptionModal = ({
    isOpen,
    setIsOpen,
    fetchSubscriptions,
}: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    fetchSubscriptions: () => void;
}) => {
    const [step, setStep] = useState(1);
    const [selectedSubscription, setSelectedSubscription] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.token.user);
    const [loading, setLoading] = useState<boolean>(false);
    const [isContractOpen, setContractOpen] = useState(false);

    const handleNext = () => {
        if (step === 1 && selectedSubscription !== null) setStep(2);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const openContractDialog = () => {
        setContractOpen(true);
    };

    const closeContractDialog = () => {
        setContractOpen(false);
    };

    const handleCheckout = async () => {
        if (!paymentMethod || !selectedPlan) return;
        if (!user) return null;

        try {
            const walletResponse = await getAccountWallet(Number(user?.id));
            const userBalance = walletResponse.data.balance;
            const totalPrice = parseFloat(selectedPlan.amount.replace('$', ''));

            if (userBalance < totalPrice) {
                notification.error({
                    message: "Insufficient funds to request this service. Please add funds to your account."
                });
                setLoading(false);
                return;
            }

            const transferRequest = {
                senderId: Number(user.id),
                receiverId: 1,
                amount: totalPrice,
                paymentMethod: paymentMethod,
                description: "Pay for subscription"
            };

            const paymentResponse = await transferMoney(transferRequest);
            notification.success({ message: "Buy subscription successfullly!" })

            if (paymentResponse.success) {
                fetchSubscriptions();
                setIsOpen(false);
            } else {
                notification.error({ message: "Payment failed. Please try again." });
            }
        } catch (error: any) {
            if (error.response?.data?.statusCode === 400) {
                setIsWalletDialogOpen(true);
            } else {
                notification.error({ message: "Failed to process payment." });
                console.error("Payment error:", error);
            }
        }
    };

    const handleCloseWalletDialog = () => {
        setIsWalletDialogOpen(false);
    };

    const handleNavigateToWallet = () => {
        navigate(RouteNames.WALLET);
        setIsWalletDialogOpen(false);
    };

    const selectedPlan = subscriptionData.find((sub) => sub.id === selectedSubscription);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-3xl p-6 relative">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close Modal"
                >
                    ✕
                </button>

                <div className="flex items-center justify-center mb-6">
                    <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${step === 1 ? "bg-blue-600" : "bg-gray-300"}`}
                    >
                        1
                    </div>
                    <div className="h-1 w-20 bg-gray-300 mx-2"></div>
                    <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${step === 2 ? "bg-blue-600" : "bg-gray-300"}`}
                    >
                        2
                    </div>
                </div>

                {step === 1 ? (
                    <>
                        <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center">
                            <FaCreditCard className="text-3xl mr-3" />
                            Choose Your Subscription
                        </h2>
                        <div className="space-y-4">
                            {subscriptionData.map((sub) => (
                                <div
                                    key={sub.id}
                                    className={`border rounded-lg shadow-sm p-4 hover:shadow-md transition ${selectedSubscription === sub.id ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                                    onClick={() => setSelectedSubscription(sub.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-800">{sub.name}</span>
                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedSubscription(sub.id);
                                            }}
                                        >
                                            {selectedSubscription === sub.id ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                        </button>
                                    </div>
                                    {selectedSubscription === sub.id && (
                                        <div className="mt-3 text-gray-600 space-y-2">
                                            <p>
                                                <strong>Description:</strong> {sub.description}
                                            </p>
                                            <p>
                                                <strong>Amount:</strong> {sub.amount}
                                            </p>
                                            <p>
                                                <strong>Number of Services:</strong> {sub.numberOfServices}
                                            </p>
                                            <p>
                                                <strong>Valid for:</strong> {sub.validMonths} months
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-6">
                            <div />
                            <button
                                className={`px-6 py-2 rounded-lg font-medium ${selectedSubscription
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                onClick={handleNext}
                                disabled={!selectedSubscription}
                            >
                                Next
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center">
                            <FaCreditCard className="text-3xl mr-3" />
                            Checkout
                        </h2>
                        <div className="border rounded-lg p-4 bg-blue-50">
                            <p>
                                <strong>Name:</strong> {selectedPlan?.name}
                            </p>
                            <p>
                                <strong>Description:</strong> {selectedPlan?.description}
                            </p>
                            <p>
                                <strong>Amount:</strong> {selectedPlan?.amount}
                            </p>
                            <p>
                                <strong>Number of Services:</strong> {selectedPlan?.numberOfServices}
                            </p>
                            <p>
                                <strong>Valid for:</strong> {selectedPlan?.validMonths} months
                            </p>
                        </div>

                        <div className="mt-6">
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
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
                            {!paymentMethod && (
                                <p className="text-red-500 text-sm mt-2">Please select a payment method.</p>
                            )}
                        </div>

                        <div className="mt-6 text-gray-600 text-base flex items-center gap-2">
                            <IoInformationCircle className="text-blue-500 inline" />
                            By clicking <span className="font-medium">"Confirm & Pay"</span>, you agree to our{" "}
                            <span
                                className="text-blue-500 font-medium cursor-pointer hover:underline"
                                onClick={openContractDialog}
                            >
                                Subscription Contract
                            </span>.
                        </div>

                        <div className="flex justify-between mt-6">
                            <button
                                className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                                onClick={handleBack}
                                disabled={loading} // Vô hiệu hóa nút "Back" khi đang xử lý
                            >
                                Back
                            </button>
                            <button
                                className={`px-6 py-2 rounded-lg font-medium ${paymentMethod
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                onClick={handleCheckout}
                                disabled={loading || !paymentMethod}
                            >
                                {loading ? (
                                    "Processing..."
                                ) : (
                                    <>
                                        <CheckCircleOutlineIcon className="mr-2" />
                                        Confirm & Pay
                                    </>
                                )}
                            </button>
                        </div>

                    </>
                )}
            </div>

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

            <SubscriptionContractDialog
                isOpen={isContractOpen}
                onClose={() => setContractOpen(false)}
            />
        </div>

    );
};

export default MultiStepSubscriptionModal;
