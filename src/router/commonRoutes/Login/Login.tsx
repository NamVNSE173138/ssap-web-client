import RouteNames from "@/constants/routeNames";
import { setToken, setUser } from "@/reducers/tokenSlice";
import {
  GoogleAuth,
  LoginUser,
} from "@/services/ApiServices/authenticationService";
import parseJwt from "@/services/parseJwt";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LoginImage from "../../../assets/college-students.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ScreenSpinner from "../../../components/ScreenSpinner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ValidationErrorMessage from "./components/ValidationErrorMessage";
import RoleNames from "@/constants/roleNames";
import { notification } from "antd";
import AppLogo from "../../../assets/logo.jpg";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email("This is not a valid email."),
  password: z.string().min(1, "Password cannot be empty"),
  role: z.string(),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [_error, setError] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "0",
    },
  });

  const { errors } = formState;

  const handleLoginSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");
    try {
      const user = await LoginUser({
        email: data.email,
        password: data.password,
      });
      setIsLoading(false);
      dispatch(setToken(user.token));
      const userInfo = parseJwt(user.token);
      dispatch(setUser(userInfo));
      if (userInfo.role === RoleNames.ADMIN) {
        navigate("/admin");
      } else {
        navigate("/");
      }

      notification.success({ message: "Login Successful" });
    } catch (error: any) {
      setIsLoading(false);

      if (error.response?.data?.message) {
        if (error.response.data.message === "Email not found") {
          setError("Email not found");
        } else if (error.response.data.message === "Wrong password") {
          setError("Wrong password");
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else {
        setError("An error occurred. Please try again later.");
        notification.error({ message: "Login Failed" });
      }
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
      <div className="h-screen w-screen relative flex flex-col md:flex-row">
        <div className="w-full md:w-[50%] h-[50%] md:h-full relative">
          <img
            src={LoginImage}
            alt="Login background"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-80"></div>
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center px-5">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Build Bright Future
            </h1>
            <p className="text-base md:text-lg text-white">
              Explore and apply for the best scholarships available to help you
              achieve your academic goals, unlock new opportunities, and pave
              the way for a successful future
            </p>
          </div>
        </div>

        <div className="w-full md:w-[50%] h-[50%] md:h-full bg-white z-20 p-5 md:p-10 flex flex-col justify-center">
          <div className="w-full flex flex-col justify-center items-center">
            <Link to="/home">
              <img
                src={AppLogo}
                alt="app_logo"
                className="w-[100px] h-[100px] md:w-[130px] md:h-[130px] rounded-full mb-5"
              />
            </Link>
            <h3 className="text-2xl md:text-3xl mb-5 md:mb-7 text-black font-bold text-center lg:max-w-[50%]">
              Welcome To Scholarship Search Portal
            </h3>
          </div>

          <form onSubmit={handleSubmit(handleLoginSubmit)} className="w-full">
            <div className="w-full flex flex-col mb-4 items-center">
              <input
                {...register("email")}
                id="email"
                type="email"
                placeholder="Email"
                className="w-full md:w-[75%] py-2 mb-3 text-lg md:text-xl bg-transparent border-b border-black focus:outline-none text-black"
                aria-label="Username"
              />

              {errors.email && (
                <ValidationErrorMessage error={errors.email.message} />
              )}
              <div className="w-full md:w-[75%] text-black py-2 text-lg md:text-xl mb-3 bg-transparent border-b border-black focus:outline-none flex justify-between gap-2 items-center">
                <input
                  type={securePassword ? "password" : "text"}
                  id="password"
                  autoComplete="current-password"
                  {...register("password")}
                  placeholder="Password"
                  className="w-full bg-transparent focus:outline-none"
                  aria-label="Password"
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
              {errors.password && (
                <ValidationErrorMessage error={errors.password.message} />
              )}
            </div>
            <div className="w-full flex justify-center mb-10">
              <Link
                to="/forgot-password"
                className="text-sm font-medium underline cursor-pointer"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="w-full flex flex-col space-y-3 items-center">
              <button
                type="submit"
                className="w-[80%] md:w-[60%] text-lg text-white bg-[#1eb2a6] rounded-3xl py-3 font-bold"
              >
                Log In
              </button>
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-[80%] md:w-[60%] text-[#1eb2a6] bg-white border border-[#1eb2a6] rounded-3xl py-3 flex items-center justify-center font-bold"
              >
                <svg
                  width="20px"
                  height="20px"
                  viewBox="-3 0 262 262"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid"
                  fill="#000000"
                  className="mr-2"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                      fill="#4285F4"
                    ></path>
                    <path
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                      fill="#34A853"
                    ></path>
                    <path
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                      fill="#FBBC05"
                    ></path>
                    <path
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                      fill="#EB4335"
                    ></path>
                  </g>
                </svg>
                Log in with Google
              </button>
            </div>
          </form>
          <div className="w-full flex justify-center mt-10">
            <p className="text-base text-black">
              You don't have an account?{" "}
              <Link to={RouteNames.REGISTER}>
                <span className="font-semibold cursor-pointer text-[#1eb2a6]">
                  Sign Up
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
      {isLoading && <ScreenSpinner />}
    </div>
  );
};

export default Login;
