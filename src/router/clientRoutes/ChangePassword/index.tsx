import React, { useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import {
  ChangedPassword,
  ForgotPassword,
  VerifyOtp,
  ResetPassword,
} from "@/services/ApiServices/authenticationService";
import { Sidebar } from "@/components/AccountInfo";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { FaKey, FaLock, FaRegEnvelope } from "react-icons/fa";

const ChangePassword: React.FC = () => {
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [_otpSent, setOtpSent] = useState<boolean>(false);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [isResetPassword, setIsResetPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const navigate = useNavigate();

  const { toast } = useToast();

  const user = useSelector((state: RootState) => state.token.user);

  const handleChangePassword = async (values: any) => {
    toast({
      title: "Password Checking",
      description: "Your password has been checking. Wait the seconds.",
      duration: 5000,
      variant: "default",
    });
    try {
      await ChangedPassword({
        email: user?.email,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      toast({
        title: "Change Password Successful",
        description: "Your password has been changed successfully.",
        duration: 5000,
        variant: "default",
      });
      navigate("/home");
    } catch (error) {
      toast({
        title: "Change Password Failed",
        description: "Failed to change password.",
        duration: 5000,
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = async () => {
    try {
      toast({
        title: "OTP Sending",
        description: "OTP is sending to your email!",
        duration: 5000,
        variant: "default",
      });
      const response = await ForgotPassword({ email });
      console.log(response);
      if (response.message === "OTP has been sent to your email.") {
        toast({
          title: "OTP Sent",
          description: "OTP has been sent to your email!",
          duration: 5000,
          variant: "default",
        });
        setOtpSent(true);
        setIsOtpVerified(true);
        setEmailError("");
      } else {
        setEmailError("Incorrect Email!");
        toast({
          title: "Error",
          description: "Incorrect Email!",
          duration: 5000,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to Send OTP",
        description: "Failed to send OTP.",
        duration: 5000,
        variant: "destructive",
      });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await VerifyOtp({ email, otp });
      if (
        response.message === "OTP verified. You can now change your password."
      ) {
        setIsOtpVerified(true);
        setIsResetPassword(true);
        toast({
          title: "OTP Verified",
          description: "OTP has been verified successfully.",
          duration: 5000,
          variant: "default",
        });
      } else {
        toast({
          title: "Incorrect OTP",
          description: "The OTP you entered is incorrect.",
          duration: 5000,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to Verify OTP",
        description: "Failed to verify OTP.",
        duration: 5000,
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        duration: 5000,
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Reset Password Checking",
        description: "Your password has been checking!",
        duration: 5000,
        variant: "default",
      });
      const response = await ResetPassword({ email, newPassword });

      if (response.message === "Password reset successfully!") {
        toast({
          title: "Reset Password Successful",
          description: "Your password has been reset successfully!",
          duration: 5000,
          variant: "default",
        });
        // Optionally reset state or navigate back
        navigate("/home");
      } else {
        toast({
          title: "Reset Password Failed",
          description: "Failed to reset password.",
          duration: 5000,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to Reset Password",
        description: "Failed to reset password.",
        duration: 5000,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-12 ">
      <Sidebar className="col-start-2 col-end-4 h-auto self-start" />

      <div className="col-span-8 flex flex-col justify-start gap-1 p-5">
        <div className="mt-10 flex flex-col items-center bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {isForgotPassword ? "Forgot Password" : "Change Password"}
          </h2>

          {isForgotPassword ? (
            <>
              {!isOtpVerified ? (
                <Form onFinish={handleForgotPassword} className="w-80">
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: "email" }]}
                  >
                    <div className="flex items-center border rounded-full border-gray-300 px-4 py-2">
                      <FaRegEnvelope size={20} className="text-gray-600" />
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="border-none focus:ring-0 outline-none flex-1"
                      />
                    </div>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 rounded-full text-white"
                    >
                      Send OTP
                    </Button>
                  </Form.Item>
                  {emailError && <Alert message={emailError} type="error" />}
                  <p className="text-center mt-4">
                    <Button
                      type="link"
                      onClick={() => setIsForgotPassword(false)}
                      className="text-blue-600"
                    >
                      Back to Change Password
                    </Button>
                  </p>
                </Form>
              ) : !isResetPassword ? (
                <Form className="w-80">
                  <Form.Item
                    label="OTP"
                    name="otp"
                    rules={[{ required: true }]}
                  >
                    <div className="flex items-center border rounded-full border-gray-300 px-4 py-2">
                      <FaKey size={20} className="text-gray-600" />
                      <Input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="border-none focus:ring-0 outline-none flex-1"
                      />
                    </div>
                  </Form.Item>
                  <Form.Item>
                    <p className="text-center">
                      <Button
                        htmlType="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 rounded-full text-white"
                        onClick={handleVerifyOtp}
                      >
                        Verify OTP
                      </Button>
                    </p>
                  </Form.Item>
                </Form>
              ) : (
                <Form onFinish={handleResetPassword} className="w-80">
                  <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[{ required: true }]}
                  >
                    <div className="flex items-center border rounded-full border-gray-300 px-4 py-2">
                      <FaLock size={20} className="text-gray-600" />
                      <Input.Password
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="border-none focus:ring-0 outline-none flex-1"
                      />
                    </div>
                  </Form.Item>
                  <Form.Item
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    rules={[{ required: true }]}
                  >
                    <div className="flex items-center border rounded-full border-gray-300 px-4 py-2">
                      <FaLock size={20} className="text-gray-600" />
                      <Input.Password
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="border-none focus:ring-0 outline-none flex-1"
                      />
                    </div>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 rounded-full text-white"
                    >
                      Reset Password
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </>
          ) : (
            <Form onFinish={handleChangePassword} className="w-80">
              <Form.Item
                label="Old Password"
                name="oldPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your old password!",
                  },
                ]}
              >
                <div className="flex items-center border rounded-full border-gray-300 px-4 py-2">
                  <FaLock size={20} className="text-gray-600" />
                  <Input.Password
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="border-none focus:ring-0 outline-none flex-1"
                  />
                </div>
              </Form.Item>
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                ]}
              >
                <div className="flex items-center border rounded-full border-gray-300 px-4 py-2">
                  <FaLock size={20} className="text-gray-600" />
                  <Input.Password
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-none focus:ring-0 outline-none flex-1"
                  />
                </div>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 rounded-full text-white"
                >
                  Change Password
                </Button>
              </Form.Item>
              <p className="text-center mt-4">
                <Button
                  type="link"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-blue-600"
                >
                  Forgot password?
                </Button>
              </p>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
