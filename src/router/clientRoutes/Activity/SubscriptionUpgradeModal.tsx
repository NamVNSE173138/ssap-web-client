import RouteNames from "@/constants/routeNames";
import { getAccountById, getAccountWallet, updateAccount } from "@/services/ApiServices/accountService";
import { transferMoney } from "@/services/ApiServices/paymentService";
import { RootState } from "@/store/store";
import { Dialog } from "@mui/material";
import { notification } from "antd";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaClock, FaCreditCard, FaDollarSign, FaExclamationTriangle, FaInfoCircle, FaRocket, FaTag, FaTimes, FaWallet } from "react-icons/fa";
import { IoIosApps, IoIosArrowDown, IoIosArrowUp, IoMdClose } from "react-icons/io";
import { IoCashOutline, IoInformationCircle, IoPricetag, IoPricetagOutline, IoWalletOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SubscriptionContractDialog from "../ServiceDetail/SubscriptionContractDialog";
import { getAllSubscriptions, getSubscriptionByProviderId } from "@/services/ApiServices/subscriptionService";
import { NotifySubscriptionPurchase } from "@/services/ApiServices/notification";

type Subscription = {
    name: string;
    id: number;
    description: string;
    amount: number;
    numberOfServices: number;
    validMonths: number;
};

const MultiStepUpgradeSubscriptionModal = ({
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
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchSubscriptionsFromAPI();
            fetchSubscriptionByProviderId();
        }
    }, [isOpen]);

    const fetchSubscriptionsFromAPI = async () => {
        try {
            setLoading(true);
            const data = await getAllSubscriptions();
            console.log(data)
            setSubscriptions(data.data);
        } catch (error) {
            console.error("Failed to fetch subscriptions:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubscriptionByProviderId = async () => {
        if (!user || !user.id) {
            console.error("User information is missing.");
            return null;
        }

        try {
            const response = await getSubscriptionByProviderId(Number(user.id));

            if (response?.statusCode === 200) {
                setCurrentSubscription(response.data);
                return response.data;
            } else {
                console.error("Failed to fetch subscription. Response:", response);
                return null;
            }
        } catch (error) {
            console.error("Failed to fetch subscription by provider ID:", error);
            return null;
        }
    };

    const handleSubscriptionClick = (sub: Subscription) => {
        if (currentSubscription && (sub.amount <= currentSubscription.amount)) {
            notification.error({
                message: 'Error',
                description: 'You cannot upgrade your subscription to the same price or less.',
                placement: 'topRight',
            });
        } else {
            // Chọn subscription hợp lệ
            setSelectedSubscription(sub.id);
        }
    };

    const handleNext = () => {
        if (step === 1 && selectedSubscription !== null) setStep(2);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const openContractDialog = () => {
        setContractOpen(true);
    };

    const handleCheckout = async () => {
        if (!paymentMethod || !selectedSubscription) return;
        if (!user) return null;

        try {
            setLoading(true);

            const accountData = await getAccountById(Number(user.id));
            const currentSubscription = await fetchSubscriptionByProviderId();

            const selectedSubscrip = subscriptions.find((sub) => sub.id === selectedSubscription);

            if (!selectedSubscrip) {
                notification.error({ message: "Invalid subscription selection." });
                return;
            }

            const currentPrice = currentSubscription?.amount || 0;
            const selectedPrice = selectedSubscrip.amount;
            const totalPrice = Math.max(selectedPrice - currentPrice, 0);

            if (paymentMethod === "Wallet") {
                const userBalance = accountData.wallet?.balance || 0;

                if (userBalance < totalPrice) {
                    notification.error({
                        message: "Insufficient funds to request this service. Please add funds to your account."
                    });
                    setLoading(false);
                    return;
                }
            }

            const transferRequest = {
                senderId: user.id,
                receiverId: 1,
                amount: totalPrice,
                paymentMethod: paymentMethod,
                description: "Pay for subscription upgrade"
            };

            const paymentResponse = await transferMoney(transferRequest);

            if (paymentResponse.statusCode === 200) {
                const validMonths = selectedSubscrip.validMonths ?? 0;
                const currentDate = new Date();
                const subscriptionEndDate = new Date(currentDate.setMonth(currentDate.getMonth() + validMonths));

                const updatedAccountData = {
                    ...accountData,
                    subscriptionEndDate: subscriptionEndDate.toISOString(),
                    subscriptionId: selectedSubscrip?.id,
                };

                const updateResponse = await updateAccount(updatedAccountData);

                notification.success({ message: "Upgrade subscription successfully!" });
                if(!selectedSubscrip) return null;
                await NotifySubscriptionPurchase(selectedSubscrip?.id, Number(user.id))

                if (updateResponse) {
                    fetchSubscriptions();
                    setIsOpen(false);
                }
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

    const selectedSubscrip = subscriptions.find((sub) => sub.id === selectedSubscription);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-3xl p-6 relative transition-all duration-300">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close Modal"
                >
                    <IoMdClose className="text-2xl" />
                </button>

                <div className="flex items-center justify-center mb-6">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${step === 1 ? "bg-blue-600" : "bg-gray-300"}`}>
                        1
                    </div>
                    <div className="h-1 w-20 bg-gray-300 mx-2"></div>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${step === 2 ? "bg-blue-600" : "bg-gray-300"}`}>
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
                            {subscriptions.map((sub) => (
                                <div
                                    key={sub.id}
                                    className={`border rounded-lg shadow-sm p-4 hover:shadow-xl transition-all cursor-pointer 
                                    ${selectedSubscription === sub.id ? "border-blue-500 bg-blue-50" : "border-gray-300"} 
                                    ${currentSubscription && (sub.amount < currentSubscription.amount || sub.amount === currentSubscription.amount) ? "opacity-50 cursor-not-allowed" : ""}`}
                                    onClick={() => handleSubscriptionClick(sub)}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-800 flex items-center gap-2">
                                            <FaRocket className="text-blue-500" />
                                            {sub.name}
                                        </span>
                                        <button
                                            className="text-blue-500 hover:text-blue-700 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSubscriptionClick(sub);
                                            }}
                                        >
                                            {selectedSubscription === sub.id ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                        </button>
                                    </div>

                                    {selectedSubscription === sub.id && (
                                        <div className="mt-3 text-gray-600 space-y-2">
                                            <p className="flex items-center gap-2">
                                                <strong>Description:</strong> {sub.description}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <strong>Amount:</strong> {sub.amount}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <strong>Number of Services:</strong> {sub.numberOfServices}
                                            </p>
                                            <p className="flex items-center gap-2">
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
                                    ? "bg-blue-600 text-white hover:bg-blue-700 transition-all"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
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

                        <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
                            <div className="border rounded-lg p-4 bg-blue-50">
                                <p className="flex items-center gap-2">
                                    <FaTag className="text-blue-500" />
                                    <strong>Name:</strong> {selectedSubscrip?.name}
                                </p>

                                <p className="flex items-center gap-2">
                                    <FaInfoCircle className="text-gray-600" />
                                    <strong>Description:</strong> {selectedSubscrip?.description}
                                </p>

                                <p className="flex items-center gap-2">
                                    <FaDollarSign className="text-green-500" />
                                    <strong>Amount:</strong> {selectedSubscrip?.amount}
                                </p>

                                <p className="flex items-center gap-2">
                                    <IoIosApps className="text-purple-500" />
                                    <strong>Number of Services:</strong> {selectedSubscrip?.numberOfServices}
                                </p>

                                <p className="flex items-center gap-2">
                                    <FaClock className="text-orange-500" />
                                    <strong>Valid for:</strong> {selectedSubscrip?.validMonths} months
                                </p>
                            </div>

                            <br />

                            {currentSubscription && selectedSubscrip && (
                                <div className="mb-4 p-4 bg-blue-50 text-black-700 rounded-lg">
                                    <p className="flex items-center gap-2">
                                        <FaCheckCircle className="text-green-500" size={20} />
                                        You have bought <strong>{currentSubscription.name}</strong> with price{" "}
                                        <strong>{currentSubscription.amount}</strong>$, so you need to pay with price{" "}
                                        <strong>{selectedSubscrip.amount > currentSubscription.amount ? selectedSubscrip.amount - currentSubscription.amount : 0}</strong>$.
                                    </p>

                                    <div className="mt-4">
                                        <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                                            <IoPricetagOutline className="text-blue-500" size={20} />
                                            Total Price
                                        </label>
                                        <input
                                            type="text"
                                            value={`$${selectedSubscrip ? (selectedSubscrip.amount > currentSubscription?.amount ? selectedSubscrip.amount - currentSubscription.amount : 0) : 0}`}
                                            readOnly
                                            className="w-full border rounded-xl p-4 text-gray-700 bg-white focus:outline-none shadow-md transition-all duration-300 ease-in-out hover:shadow-lg"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Phần tiếp theo của modal */}
                            <div className="mt-6">
                                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                    Choose Payment Method
                                </label>
                                <div className="flex gap-4">
                                    <div
                                        onClick={() => setPaymentMethod("Wallet")}
                                        className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "Wallet" ? "border-blue-500 bg-blue-100" : "border-gray-300 hover:bg-gray-100"}`}
                                    >
                                        <div className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full">
                                            <IoWalletOutline className="text-2xl" />
                                        </div>
                                        <span className="font-medium text-gray-800">Pay by Wallet</span>
                                    </div>

                                    <div
                                        onClick={() => setPaymentMethod("Cash")}
                                        className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "Cash" ? "border-green-500 bg-green-100" : "border-gray-300 hover:bg-gray-100"}`}
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
                        </div>

                        <div className="flex justify-between mt-6">
                            <button
                                className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                                onClick={handleBack}
                                disabled={loading}
                            >
                                Back
                            </button>
                            <button
                                className={`px-6 py-2 rounded-lg font-medium ${paymentMethod
                                    ? "bg-blue-600 text-white hover:bg-blue-700 transition-all"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                disabled={!paymentMethod}
                                onClick={handleCheckout}
                            >
                                Confirm & Pay
                            </button>
                        </div>
                    </>

                )}
            </div>

            <Dialog open={isWalletDialogOpen} onClose={handleCloseWalletDialog}>
                <div className="p-8 bg-white rounded-lg shadow-xl max-w-md mx-auto">
                    <div className="flex items-center mb-6">
                        <FaExclamationTriangle className="text-yellow-500 text-4xl mr-4" />
                        <h3 className="text-2xl font-semibold text-gray-800">You don't have enough money!</h3>
                    </div>
                    <p className="my-4 text-lg text-gray-600">
                        You need to deposit money into the system. Do you want to go to the Wallet page?
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

            <SubscriptionContractDialog
                isOpen={isContractOpen}
                onClose={() => setContractOpen(false)}
            />
        </div>


    );
};

export default MultiStepUpgradeSubscriptionModal;
