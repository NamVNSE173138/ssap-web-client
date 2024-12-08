import RouteNames from "@/constants/routeNames";
import { setToken, setUser } from "@/reducers/tokenSlice";
import { GoogleAuth, LoginUser } from "@/services/ApiServices/authenticationService";
import parseJwt from "@/services/parseJwt";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LoginImage from "../../../assets/login-image.jpg";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ScreenSpinner from "../../../components/ScreenSpinner";
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ValidationErrorMessage from "./components/ValidationErrorMessage";
import { useToast } from "@/components/ui/use-toast";
import RoleNames from "@/constants/roleNames";


const formSchema = z.object({
  email: z.string().min(1, { message: "Email is required." }).email("This is not a valid email."),
  password: z.string().min(1, 'Password cannot be  empty'),
  role: z.string(),
});


const Login = () => {
  const navigate = useNavigate();
  //const token = useSelector((state: RootState) => state.token.token);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [_error, setError] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      role: '0',
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
      }
      else {
        navigate("/");
      }
      toast({
        title: "Login Successful.",
        description: "Now you can....",
        duration: 5000,
        variant: 'default',
      });
    } catch (error: any) {
      setIsLoading(false);


      if (error.response?.data?.message) {
        console.log()
        if (error.response.data.message === "Email not found") {
          setError("Email not found");
        } else if (error.response.data.message === "Wrong password") {
          setError("Wrong password");
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else {
        setError("An error occurred. Please try again later.");
        toast({
          title: "Login Failed.",
          description: "Now you can ....",
          duration: 5000,
          variant: 'destructive',
        });
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
      <div className="h-screen w-screen relative">
        <div className="absolute top-0 left-0 w-full h-full">
          <img
            src={LoginImage}
            alt="Login background"
            className="w-full h-full object-cover "
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-black z-10 opacity-5 "></div>{" "}
        <div className="absolute md:w-[50%] w-[80%] h-[60%] md:h-[80%] md:p-[30px] p-2 top-1/2 left-1/2 bg-[rgba(255,255,255,0.75)] z-20 -translate-x-1/2 -translate-y-1/2 rounded-md">
          <div className="w-full h-full bg-transparent md:px-10 px-5 flex flex-col justify-center">
            <div className="w-full">
              <h3 className="text-3xl mb-7 md:mb-10 md:text-4xl text-black font-bold text-center">
                WELCOME TO SCHOLARSHIP SEARCH PORTAL
              </h3>
            </div>

            <form onSubmit={handleSubmit(handleLoginSubmit)} className="w-full">
              <div className="w-full flex flex-col mb-4 items-center">
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="w-[75%] py-2 mb-3 text-lg md:text-xl bg-transparent border-b border-black focus:outline-none text-black"
                  aria-label="Username"
                />

                {errors.email && <ValidationErrorMessage error={errors.email.message} />}
                <div className="w-[75%] text-black py-2 text-lg md:text-xl mb-3 bg-transparent border-b border-black focus:outline-none flex justify-between gap-2 items-center">
                  <input
                    type={securePassword ? 'password' : 'text'}
                    id="password"
                    autoComplete="current-password"
                    {...register('password')}
                    placeholder="Password"
                    className="w-full bg-transparent focus:outline-none"
                    aria-label="Password"
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
              <div className="w-full flex justify-center mb-10">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium underline cursor-pointer"
                >
                  Forgot Password
                </Link>
              </div>
              <div className="w-full flex flex-col space-y-3 items-center">
                <button
                  type="submit"
                  className="w-[60%] text-lg text-white  bg-blue-500 rounded-3xl py-3"
                >
                  Log In
                </button>
                <button
                  onClick={handleGoogleLogin}
                  type="button"
                  className="w-[60%] text-blue-500 bg-white border border-blue-500 rounded-3xl py-3"
                >
                  Log in with Google
                </button>
              </div>
            </form>
            <div className="w-full flex justify-center mt-10">
              <p className="text-base text-black">
                You don't have an account?{" "}
                <Link to={RouteNames.REGISTER}>
                  <span className="font-semibold underline cursor-pointer">
                    Sign Up
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <ScreenSpinner />}
    </div>
  );
};
export default Login;
