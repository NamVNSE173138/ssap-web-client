import RouteNames from "@/constants/routeNames";
import { setToken, setUser } from "@/reducers/tokenSlice";
import {GoogleAuth, RegisterUser, RegisterFunder, RegisterProvider } from "@/services/ApiServices/authenticationService";
import parseJwt from "@/services/parseJwt";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import RegisterImage from "../../../assets/login-image.jpg";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import ScreenSpinner from "../../../components/ScreenSpinner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ValidationErrorMessage from "../Login/components/ValidationErrorMessage";
import { useToast } from "@/components/ui/use-toast";
import { NotifyNewUser } from "@/services/ApiServices/notification";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email("This is not a valid email."),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (value) => /^\d+$/.test(value) && value.length === 10,
      "Phone number must be exactly 10 digits"
    ),
  fullName: z.string().min(1, "Full name is required"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." }
    ),
  role: z.string(),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [securePassword, setSecurePassword] = useState(true);
  const [selectedRole, setSelectedRole] = useState("applicant");
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      phoneNumber: '',
      fullName: '',
      password: '',
      role: selectedRole,
    },
  });

  const handleRegisterSubmit = async (data: any) => {
    setIsLoading(true);
    let user = null;
    try {
      switch (selectedRole) {
        case "applicant":
          user = await RegisterUser(data);
          break;
        case "funder":
          user = await RegisterFunder(data);
          break;
        case "provider":
          user = await RegisterProvider(data);
          break;
        default:
          throw new Error("Invalid role");
      }

      setIsLoading(false);
      dispatch(setToken(user.token));
      const userInfo = parseJwt(user.token);
      dispatch(setUser(userInfo));
      navigate(RouteNames.LOGIN);
      toast({
        title: "Registration Successful.",
        description: "You can now log in with your credentials.",
        duration: 5000,
        variant: 'default',
      });
      await NotifyNewUser(userInfo.id);
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error?.response?.data?.message || "An error occurred. Please try again later.";
      toast({
        title: "Registration Failed.",
        description: errorMessage,
        duration: 5000,
        variant: 'destructive',
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      let data = await GoogleAuth();
      window.location = data.url;
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    }
  };

  return (
    <div className="h-full">
      <div className="h-screen w-screen relative">
        <div className="absolute top-0 left-0 w-full h-full">
          <img
            src={RegisterImage}
            alt="Register background"
            className="w-full h-full object-cover "
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-black z-10 opacity-5 "></div>
        <div className="absolute md:w-[50%] w-[80%] h-[80%] md:h-[90%] md:p-[30px] p-2 top-1/2 left-1/2 bg-[rgba(255,255,255,0.75)] z-20 -translate-x-1/2 -translate-y-1/2 rounded-md">
          <button
            onClick={() => navigate("/login")}
            className="absolute top-4 left-4 z-30 text-white text-xl bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <div className="w-full h-full bg-transparent md:px-10 px-5 flex flex-col justify-center">
            <div className="w-full">
              <h3 className="text-3xl mb-4 md:mb-0 md:text-4xl text-black font-bold text-center">
                BECOME A MEMBER
              </h3>
            </div>

            <div className="mb-4 mt-4 flex justify-center font-semibold text-xl">
              <label className="mr-4">
                <input
                  type="radio"
                  value={selectedRole}
                  checked={selectedRole === "applicant"}
                  onChange={() => setSelectedRole("applicant")}
                />
                Sign up as Applicant
              </label>
              <label className="mr-4">
                <input
                  type="radio"
                  value= {selectedRole}
                  checked={selectedRole === "funder"}
                  onChange={() => setSelectedRole("funder")}
                />
                Sign up as Funder
              </label>
              <label>
                <input
                  type="radio"
                  value={selectedRole}
                  checked={selectedRole === "provider"}
                  onChange={() => setSelectedRole("provider")}
                />
                Sign up as Provider
              </label>
            </div>

            <form onSubmit={handleSubmit(handleRegisterSubmit)} className="w-full md:mt-4 mt-0">
              <div className="w-full flex flex-col mb-4 items-center">
                <input
                  {...register("username")}
                  placeholder="Username"
                  className="w-[65%] text-black py-2 text-lg md:text-xl mb-3 bg-transparent border-b border-black focus:outline-none"
                />
                {errors.username && <ValidationErrorMessage error={errors.username.message} />}
                
                <input
                  {...register("email")}
                  placeholder="Email"
                  className="w-[65%] text-black py-2 text-lg md:text-xl mb-3 bg-transparent border-b border-black focus:outline-none"
                />
                {errors.email && <ValidationErrorMessage error={errors.email.message} />}
                
                <input
                  {...register("phoneNumber")}
                  placeholder="Phone number"
                  className="w-[65%] text-black py-2 text-lg md:text-xl mb-3 bg-transparent border-b border-black focus:outline-none"
                />
                {errors.phoneNumber && <ValidationErrorMessage error={errors.phoneNumber.message} />}
                
                <input
                  {...register("fullName")}
                  placeholder="Full name"
                  className="w-[65%] text-black py-2 text-lg md:text-xl mb-3 bg-transparent border-b border-black focus:outline-none"
                />
                {errors.fullName && <ValidationErrorMessage error={errors.fullName.message} />}
                
                <div className="w-[65%] text-black py-2 text-lg md:text-xl mb-3 bg-transparent border-b border-black focus:outline-none flex justify-between gap-2 items-center">
                  <input
                    type={securePassword ? "password" : "text"}
                    placeholder="Password"
                    {...register("password")}
                    className="w-full bg-transparent focus:outline-none"
                  />
                  {securePassword ? (
                    <FaEyeSlash
                      className="right-0 top-0 mt-2 mr-2 cursor-pointer"
                      onClick={() => setSecurePassword(false)}
                    />
                  ) : (
                    <FaEye
                      className="right-0 top-0 mt-2 mr-2 cursor-pointer"
                      onClick={() => setSecurePassword(true)}
                    />
                  )}
                </div>
                {errors.password && <ValidationErrorMessage error={errors.password.message} />}
              </div>

              <div className="w-full flex flex-col md:space-y-2 space-y-1 items-center">
                <button
                  type="submit"
                  className="w-[55%] text-lg text-white bg-blue-500 rounded-3xl py-3"
                >
                  Sign up
                </button>
                <button
                  onClick={handleGoogleLogin}
                  type="button"
                  className="w-[55%] text-blue-500 bg-white border border-blue-500 rounded-3xl py-3"
                >
                  Sign up with Google
                </button>
              </div>
            </form>
            <div className="w-full flex justify-center md:mt-5 mt-10">
              <p className="text-black">
                <span className="text-lg">You already have an account?</span>
                <Link to={RouteNames.LOGIN}>
                  <span className="text-base font-semibold underline cursor-pointer">
                    Sign in
                  </span>
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <ScreenSpinner />}
    </div>
  );
};

export default Register;
