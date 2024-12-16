import { IoCalendarOutline, IoClose, IoCloseCircleOutline, IoDocumentText, IoListCircle, IoLockClosedOutline, IoPersonOutline, IoShieldCheckmarkOutline, IoWarningOutline } from "react-icons/io5";

const ScholarshipContractDialogForFunder = ({
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
                        Scholarship Agreement for Funders
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
                            You must comply with all regulations and guidelines set forth by our organization.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoPersonOutline className="text-blue-500 mt-1" />
                            You are required to have sufficient funds to cover the creation of the scholarship and any associated award milestone fees.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoLockClosedOutline className="text-green-500 mt-1" />
                            Timely payments to scholarship recipients are mandatory; failure to do so may result in unilateral termination of your account.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoShieldCheckmarkOutline className="text-yellow-500 mt-1" />
                            You agree to provide transparent communication regarding scholarship criteria and changes to funding availability.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoCalendarOutline className="text-purple-500 mt-1" />
                            This agreement is valid for the duration of the scholarship program and may be reviewed annually for compliance.
                        </li>
                    </ul>
                </div>

                <div className="border-t pt-4 mt-4 text-gray-700">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <IoListCircle className="text-blue-500" />
                        Acknowledgment of Responsibilities
                    </h3>
                    <ul className="list-disc list-inside mt-3 space-y-3">
                        <li className="flex items-start gap-2">
                            <IoWarningOutline className="text-red-500 mt-1" />
                            By entering into this agreement, you acknowledge your responsibilities as a funder and agree to adhere to our policies.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoPersonOutline className="text-blue-500 mt-1" />
                            You commit to promptly addressing any issues or concerns raised by scholarship recipients or our organization.
                        </li>
                        <li className="flex items-start gap-2">
                            <IoLockClosedOutline className="text-green-500 mt-1" />
                            You agree to maintain accurate records of all transactions related to the scholarship and provide these records upon request.
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

export default ScholarshipContractDialogForFunder;