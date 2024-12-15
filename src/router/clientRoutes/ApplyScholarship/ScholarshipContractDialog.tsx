import { IoCalendarOutline, IoClose, IoCloseCircleOutline, IoDocumentText, IoListCircle, IoLockClosedOutline, IoPersonOutline, IoShieldCheckmarkOutline, IoWarningOutline } from "react-icons/io5";

const ScholarshipContractDialog = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? "block" : "hidden"}`}
            aria-labelledby="contract-dialog"
        >
            <div
                className="bg-white w-[90%] md:w-[60%] rounded-lg shadow-xl p-6 relative transform transition-all scale-95 hover:scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-blue-600 flex items-center gap-2">
                        <IoDocumentText className="text-3xl text-blue-500" />
                        Scholarship Contract
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
                            If awarded the scholarship, you must submit required documents as requested by the funder within the specified timeframe.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoPersonOutline className="text-blue-500 mt-1" />
                            Failure to submit the required documents on time may result in the funder unilaterally terminating this agreement.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoLockClosedOutline className="text-green-500 mt-1" />
                            The scholarship funds must be used exclusively for educational expenses, including tuition, books, and necessary supplies.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoShieldCheckmarkOutline className="text-yellow-500 mt-1" />
                            You agree to maintain a minimum GPA of 3.0 throughout the academic year. Failing to meet this GPA may lead to termination of the scholarship.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoCalendarOutline className="text-purple-500 mt-1" />
                            This contract is valid for the academic year and may be revoked if any of the terms are violated.
                        </li>
                    </ul>
                </div>

                <div className="border-t pt-4 mt-4 text-gray-700">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <IoListCircle className="text-blue-500" />
                        Agreement Acknowledgment
                    </h3>
                    <ul className="list-disc list-inside mt-3 space-y-3">
                        <li className="flex items-start gap-2">
                            <IoWarningOutline className="text-red-500 mt-1" />
                            By signing this agreement, you acknowledge and accept the terms and conditions set forth by the funder.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoPersonOutline className="text-blue-500 mt-1" />
                            If selected, you agree to promptly provide all required documentation as requested by the funder.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoLockClosedOutline className="text-green-500 mt-1" />
                            You agree to maintain communication with the funder regarding any changes to your academic status or personal information.
                        </li>
                    </ul>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
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

export default ScholarshipContractDialog;