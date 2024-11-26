import React from "react";
import { IoCalendarOutline, IoClose, IoCloseCircleOutline, IoDocumentText, IoListCircle, IoShieldCheckmarkOutline, IoWarningOutline, IoPersonOutline, IoLockClosedOutline } from "react-icons/io5";

const SubscriptionContractDialog = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-99999 ${isOpen ? "block" : "hidden"
                }`}
        >
            <div
                className="bg-white w-[90%] md:w-[60%] rounded-lg shadow-xl p-6 relative transform transition-all scale-95 hover:scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-blue-600 flex items-center gap-2">
                        <IoDocumentText className="text-3xl text-blue-500" />
                        Subscription Contract
                    </h2>
                    <IoClose
                        className="text-2xl cursor-pointer text-gray-600 hover:text-red-500 transition-all"
                        onClick={onClose}
                    />
                </div>

                <div className="border-b pb-4 mb-4 text-gray-700 leading-relaxed">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <IoListCircle className="text-blue-500" />
                        Terms and Conditions
                    </h3>
                    <ul className="list-disc list-inside mt-3 space-y-3">
                        <li className="flex items-start gap-2">
                            <IoWarningOutline className="text-red-500 mt-1" />
                            All subscription fees are non-refundable after activation.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoPersonOutline className="text-blue-500 mt-1" />
                            Subscription is valid only for the registered account holder.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoLockClosedOutline className="text-green-500 mt-1" />
                            Your account information will remain confidential.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoShieldCheckmarkOutline className="text-yellow-500 mt-1" />
                            You agree not to misuse the subscription service.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoCalendarOutline className="text-purple-500 mt-1" />
                            Subscription is effective immediately upon payment and cannot be canceled.
                        </li>
                    </ul>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition flex items-center gap-2"
                    >
                        <IoCloseCircleOutline className="text-lg" />
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionContractDialog;
