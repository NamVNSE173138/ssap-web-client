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
import {z} from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ValidationErrorMessage from "./components/ValidationErrorMessage";
import { log } from "console";
import { useToast } from "@/components/ui/use-toast";
import { Google } from "@mui/icons-material";
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
  const {toast} = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//         email: '',
//         password: '',
//         role: '0',
//     },
// });

const { register, handleSubmit, formState } = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    email: '',
    password: '',
    role: '0',
  },
});

const { errors } = formState;


  // const handleLoginSubmit = async (e: any) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   let user = null;
  //   try {
  //     user = await LoginUser({
  //       email: email,
  //       password: password,
  //     });
  //     setIsLoading(false);
  //     setError("");
  //   } catch (error: any) {
  //     setIsLoading(false);
  //     if (error.response.data.message) {
  //       // If the error response contains a message, set it as the error message
  //       setError(error.response.data.message);
  //     } else {
  //       // If the error is something else, set a generic error message
  //       setError("An error occurred. Please try again later.");
  //     }
  //     return;
  //   }
  //   dispatch(setToken(user.token));
  //   const userInfo = parseJwt(user.token);
  //   dispatch(setUser(userInfo));
  //   /*if (parseJwt(user.token).role === "Admin") {
  //     navigate("/dashboard");
  // } else {*/
  //   navigate("/");
  // };


  const handleLoginSubmit = async (data: any) => {
    setIsLoading(true);
    setError(""); // Clear any previous errors
    try {
      const user = await LoginUser({
        email: data.email,
        password: data.password,
      });
      setIsLoading(false);
      dispatch(setToken(user.token));
      const userInfo = parseJwt(user.token);
      //alert(userInfo.role==RoleNames.ADMIN);
      dispatch(setUser(userInfo));
      if(userInfo.role === RoleNames.ADMIN) {
        navigate("/admin");
      }
      /*else if(userInfo.role === RoleNames.FUNDER) {
        navigate("/funder");
      }
      else if(userInfo.role === RoleNames.PROVIDER) {
        navigate("/provider");
      }
      else if(userInfo.role === RoleNames.EXPERT) {
        navigate("/expert");
      }*/
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
    //  <>
    //    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    //     <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    //       <img
    //         alt="SSAP"
    //         src="/src/assets/logo.jpg"
    //         className="mx-auto h-10 w-auto"
    //       />
    //       <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
    //         Log in to your account
    //       </h2>
    //     </div>

    //     <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    //       <form action="#" method="POST" className="space-y-6">
    //         <div>
    //           <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
    //             Email address
    //           </label>
    //           <div className="mt-2">
    //             <input
    //               id="email"
    //               name="email"
    //               type="email"
    //               value={email}
    //               onChange={(e) => setEmail(e.target.value)}
    //               required
    //               autoComplete="email"
    //               className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    //             />
    //           </div>
    //         </div>

    //         <div>
    //           <div className="flex items-center justify-between">
    //             <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
    //               Password
    //             </label>
    //             <div className="text-sm">
    //               <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
    //                 Forgot password?
    //               </a>
    //             </div>
    //           </div>
    //           <div className="mt-2">
    //             <input
    //               id="password"
    //               name="password"
    //               type="password"
    //               value={password}
    //               onChange={(e) => setPassword(e.target.value)}
    //               required
    //               autoComplete="current-password"
    //               className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    //             />
    //           </div>
    //         </div>

    //         {error && <p className="text-red-500">{error}</p>}

    //         <div>
    //           <button
    //             onClick={handleLoginSubmit}
    //             type="submit"
    //             className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    //           >
    //             Log in
    //           </button>
    //         </div>
    //       </form>

    //       <p className="mt-10 text-center text-sm text-gray-500">
    //         Not a member?{' '}
    //         <Link to={RouteNames.REGISTER} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
    //           Register now
    //         </Link>
    //       </p>
    //     </div>
    //   </div>
    // </>
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

            {/* <form action="#" method="POST" className="w-full"> */}
            <form onSubmit={handleSubmit(handleLoginSubmit)} className="w-full">
              <div className="w-full flex flex-col mb-4 items-center">
                <input
                  {...register('email')}
                  id="email"
                  // name="email"
                  type="email"
                  // value={email}
                  // onChange={(e) => setEmail(e.target.value)}
                  // required
                  // autoComplete="email"
                  placeholder="Email"
                  className="w-[75%] py-2 mb-3 text-lg md:text-xl bg-transparent border-b border-black focus:outline-none text-black"
                  aria-label="Username"
                />
                
                {errors.email && <ValidationErrorMessage error={errors.email.message} />}
                <div className="w-[75%] text-black py-2 text-lg md:text-xl mb-3 bg-transparent border-b border-black focus:outline-none flex justify-between gap-2 items-center">
                  <input
                    type={securePassword ? 'password' : 'text'}
                    id="password"
                    // name="password"
                    // value={password}
                    // onChange={(e) => setPassword(e.target.value)}
                    // required
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

              {/* {error && <p className="text-red-500">{error}</p>} */}

              <div className="w-full flex flex-col space-y-3 items-center">
                <button
                  //onClick={handleLoginSubmit}
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
