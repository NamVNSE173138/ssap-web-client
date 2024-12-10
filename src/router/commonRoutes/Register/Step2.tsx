import React, { useState } from "react";
import { notification, Modal } from "antd";
import { useForm } from "react-hook-form";
import { forgotPassword, verifyOtp } from "@/services/ApiServices/accountService";

const Step2 = ({ onEmailVerified }: { onEmailVerified: (email: string) => void }) => {
    const { register, handleSubmit, watch } = useForm();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

    const handleSendOtp = () => {
        setIsDialogVisible(true); 
    };

    const confirmSendOtp = async () => {
        try {
            setIsDialogVisible(false); 
            await forgotPassword(email);
            notification.success({
                message: "We have sent an email to verify",
            });
            setIsOtpSent(true); 
        } catch (error: any) {
            notification.error({
                message: "Failed to send OTP",
                description: error.response?.data?.message || "Please try again later.",
            });
        }
    };

    const handleVerifyOtp = async () => {
        try {
            setIsVerifyingOtp(true);
            await verifyOtp(email, otp);
            notification.success({ message: "OTP verified successfully!" });
            onEmailVerified(email); 
        } catch (error) {
            notification.error({
                message: "Invalid OTP",
                description: "The OTP you entered is incorrect. Please try again.",
            });
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    return (
        <div className="step-2">
            <h2 className="text-xl font-semibold mb-4">Verify Your Email</h2>
            <form>
                <div className="mb-4">
                    <label className="block text-gray-700">Email:</label>
                    <input
                        type="email"
                        className="border rounded w-full p-2"
                        {...register("email")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button
                    type="button"
                    className="bg-blue-600 text-white p-2 rounded"
                    onClick={handleSendOtp}
                >
                    Send OTP
                </button>
            </form>

            {isOtpSent && (
                <div className="mt-4">
                    <label className="block text-gray-700">Enter your OTP:</label>
                    <input
                        type="text"
                        className="border rounded w-full p-2"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button
                        type="button"
                        className="bg-green-600 text-white p-2 rounded mt-2"
                        onClick={handleVerifyOtp}
                        disabled={isVerifyingOtp}
                    >
                        Verify OTP
                    </button>
                </div>
            )}

            <Modal
                title="Confirm Email"
                visible={isDialogVisible}
                onOk={confirmSendOtp}
                onCancel={() => setIsDialogVisible(false)}
            >
                <p>Are you sure you want to use this email: <strong>{email}</strong> for our website?</p>
            </Modal>
        </div>
    );
};

export default Step2;
