import React, { useState } from "react";
import { IoCalendarOutline, IoClose, IoCloseCircleOutline, IoDocumentText, IoInformationCircleOutline, IoListCircle, IoLockClosedOutline, IoPersonOutline, IoShieldCheckmarkOutline, IoWarningOutline } from "react-icons/io5";
import { toast } from "react-toastify";

const ServiceContractDialog = ({
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
                        Service Contract
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
                            Service fees are non-refundable under any circumstances.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoPersonOutline className="text-blue-500 mt-1" />
                            The service is provided exclusively to the registered individual.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoLockClosedOutline className="text-green-500 mt-1" />
                            Your personal information will remain confidential and will not be shared with third parties unless required by law.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoShieldCheckmarkOutline className="text-yellow-500 mt-1" />
                            You agree not to use the service for any illegal activities or against our policies.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoCalendarOutline className="text-purple-500 mt-1" />
                            This contract is effective immediately upon signing and cannot be canceled once the service is activated.
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

export default ServiceContractDialog;
