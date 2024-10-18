import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPassword, VerifyOtp, ResetPassword } from "@/services/ApiServices/authenticationService";
import RegisterImage from "../../../assets/login-image.jpg";
import { useToast } from "@/components/ui/use-toast";
import ScreenSpinner from "../../../components/ScreenSpinner";
import ValidationErrorMessage from "../Login/components/ValidationErrorMessage";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Invalid email format."),
  otp: z.string().optional(),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." }
  ).optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  return data.newPassword === data.confirmNewPassword;
}, {
  path: ["confirmNewPassword"],
  message: "Passwords do not match",
});

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [securePassword, setSecurePassword] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const handleSendOtp = async (data: any) => {
    setIsLoading(true);
    try {
      await ForgotPassword({ email: data.email });
      setStep(2);
      toast({
        title: "OTP Sent",
        description: "An OTP has been sent to your email.",
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        title: "Failed",
        description: "Failed to send OTP, please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (data: any) => {
    setIsLoading(true);
    try {
      await VerifyOtp({ email: data.email, otp: data.otp });
      setStep(3);
      toast({
        title: "OTP Verified",
        description: "You can now reset your password.",
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        title: "Failed",
        description: "OTP verification failed.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: any) => {
    toast({
      title: "Password Checking",
      description: "Your password has been checking, wait the minutes.",
      duration: 5000,
    });
    setIsLoading(true);
    try {
      await ResetPassword({
        email: data.email,
        newPassword: data.newPassword,
      });
      toast({
        title: "Password Reset",
        description: "Your password has been reset successfully.",
        duration: 5000,
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Failed",
        description: "Failed to reset password.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full">
      <div className="h-screen w-screen relative">
        <div className="absolute top-0 left-0 w-full h-full">
          <img
            src={RegisterImage}
            alt="Forgot Password background"
            className="w-full h-full object-cover "
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-black z-10 opacity-5 "></div>

        <div className="absolute md:w-[50%] w-[80%] h-[60%] md:h-[80%] md:p-[30px] p-2 top-1/2 left-1/2 bg-[rgba(255,255,255,0.75)] z-20 -translate-x-1/2 -translate-y-1/2 rounded-md">
          <button
            onClick={() => navigate("/login")}
            className="absolute top-4 left-4 z-30 text-white text-xl bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <div className="w-full h-full bg-transparent md:px-10 px-5 flex flex-col justify-center">
            <div className="w-full">
              <h3 className="text-3xl mb-4 md:mb-0 md:text-4xl text-black font-bold text-center">
                {step === 1 ? "Forgot Password" : step === 2 ? "Enter OTP" : "Reset Password"}
              </h3>
            </div>

            <form onSubmit={handleSubmit(step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleResetPassword)} className="w-full md:mt-4 mt-0">
              {step === 1 && (
                <div className="w-full flex flex-col mb-4 items-center">
                  <button
                    onClick={() => navigate("/login")}
                    className="absolute top-4 left-4 z-30 text-white text-xl bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <FaArrowLeft />
                  </button>
                  <input
                    {...register("email")}
                    placeholder="Email"
                    className="w-[65%] text-black py-2 text-lg md:text-xl mb-3 bg-transparent border-b border-black focus:outline-none"
                  />
                  {errors.email && <ValidationErrorMessage error={errors.email.message?.toString()} />}
                </div>
              )}

              {step === 2 && (
                <div className="w-full flex flex-col mb-4 items-center">
                  <button
                    onClick={() => navigate("/login")}
                    className="absolute top-4 left-4 z-30 text-white text-xl bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <FaArrowLeft />
                  </button>
                  <input
                    {...register("otp")}
                    placeholder="Enter OTP"
                    className="w-[65%] text-black py-2 text-lg md:text-xl mb-3 bg-transparent border-b border-black focus:outline-none"
                  />
                  {errors.otp && <ValidationErrorMessage error={errors.otp.message?.toString()} />}
                </div>
              )}

              {step === 3 && (
                <>
                  <div className="w-full flex flex-col mb-4 items-center">
                    <div className="w-[65%] text-black py-2 text-lg md:text-xl mb-3 bg-transparent border-b border-black focus:outline-none flex justify-between gap-2 items-center">
                      <button
                        onClick={() => navigate("/login")}
                        className="absolute top-4 left-4 z-30 text-white text-xl bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors"
                      >
                        <FaArrowLeft />
                      </button>
                      <input
                        type={securePassword ? "password" : "text"}
                        {...register("newPassword")}
                        placeholder="New Password"
                        className="w-full bg-transparent focus:outline-none"
                      />
                      {securePassword ? (
                        <FaEyeSlash
                          className="cursor-pointer"
                          onClick={() => setSecurePassword(false)}
                        />
                      ) : (
                        <FaEye
                          className="cursor-pointer"
                          onClick={() => setSecurePassword(true)}
                        />
                      )}
                    </div>
                    {errors.newPassword && <ValidationErrorMessage error={errors.newPassword.message?.toString()} />}
                  </div>

                  <div className="w-full flex flex-col mb-4 items-center">
                    <input
                      type={securePassword ? "password" : "text"}
                      {...register("confirmNewPassword")}
                      placeholder="Confirm New Password"
                      className="w-[65%] text-black py-2 text-lg md:text-xl mb-3 bg-transparent border-b border-black focus:outline-none"
                    />
                    {errors.confirmNewPassword && <ValidationErrorMessage error={errors.confirmNewPassword.message?.toString()} />}
                  </div>
                </>
              )}

              <div className="w-full flex flex-col md:space-y-2 space-y-1 items-center">
                <button
                  type="submit"
                  className="w-[55%] text-lg text-white bg-blue-500 rounded-3xl py-3"
                >
                  {step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {isLoading && <ScreenSpinner />}
    </div>
  );
};

export default ForgetPassword;
