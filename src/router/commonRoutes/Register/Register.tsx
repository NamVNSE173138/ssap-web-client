import RouteNames from "@/constants/routeNames";
import { setToken, setUser } from "@/reducers/tokenSlice";
import { RegisterUser } from "@/services/ApiServices/authenticationService";
import parseJwt from "@/services/parseJwt";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import RegisterImage from "../../../assets/login-image.jpg";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ScreenSpinner from "../../../components/ScreenSpinner";


const Register = () => {
  const navigate = useNavigate();
  //const token = useSelector((state: RootState) => state.token.token);
  const dispatch = useDispatch();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);


  const [error, setError] = useState("");

  const handleRegisterSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    let user = null;
    try {
      user = await RegisterUser({
        username: userName,
        email: email,
        phoneNumber: phoneNumber,
        fullName: fullName,
        password: password,
      });
      setIsLoading(false);
      setError("");
    } catch (error: any) {
      setIsLoading(false);
      if (error.response.data.message) {
        // If the error response contains a message, set it as the error message
        setError(error.response.data.message);
      } else {
        // If the error is something else, set a generic error message
        setError("An error occurred. Please try again later.");
      }
      return;
    }
    dispatch(setToken(user.token));
    const userInfo = parseJwt(user.token);
    dispatch(setUser(userInfo));
    /*if (parseJwt(user.token).role === "Admin") {
      navigate("/dashboard");
  } else {*/
    navigate("/");
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
    //         Register your account
    //       </h2>
    //     </div>

    //     <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    //       <form action="#" method="POST" className="space-y-6">
    //         <div>
    //           <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
    //             Username
    //           </label>
    //           <div className="mt-2">
    //             <input
    //               value={userName}
    //               onChange={(e) => setUserName(e.target.value)}
    //               required
    //               autoComplete="email"
    //               className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    //             />
    //           </div>
    //         </div>
    //         <div>
    //           <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
    //             Email address
    //           </label>
    //           <div className="mt-2">
    //             <input
    //               value={email}
    //               onChange={(e) => setEmail(e.target.value)}
    //               required
    //               autoComplete="email"
    //               className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    //             />
    //           </div>
    //         </div>
    //         <div>
    //           <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
    //             Phone number
    //           </label>
    //           <div className="mt-2">
    //             <input
    //               value={phoneNumber}
    //               onChange={(e) => setPhoneNumber(e.target.value)}
    //               required
    //               autoComplete="email"
    //               className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    //             />
    //           </div>
    //         </div>
    //         <div>
    //           <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
    //             Full name
    //           </label>
    //           <div className="mt-2">
    //             <input
    //               value={fullName}
    //               onChange={(e) => setFullName(e.target.value)}
    //               required
    //               autoComplete="email"
    //               className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    //             />
    //           </div>
    //         </div>
    //         <div>
    //           <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
    //             Password
    //           </label>
    //           <div className="mt-2">
    //             <input
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
    //             onClick={handleRegisterSubmit}
    //             type="submit"
    //             className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    //           >
    //             Register
    //           </button>
    //         </div>
    //       </form>

    //       <p className="mt-10 text-center text-sm text-gray-500">
    //         Already a member?{' '}
    //         <Link to={RouteNames.LOGIN} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
    //           Login now
    //         </Link>
    //       </p>
    //     </div>
    //   </div>
    // </>
    <div className="h-full">
      <div className="h-screen w-screen relative">
        <div className="absolute top-0 left-0 w-full h-full">
          <img
            src={RegisterImage}
            alt="Register background"
            className="w-full h-full object-cover "
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-black z-10 opacity-5 "></div>{" "}
        <div className="absolute md:w-[50%] w-[80%] h-[80%] md:h-[90%] md:p-[30px] p-2 top-1/2 left-1/2 bg-[rgba(255,255,255,0.75)] z-20 -translate-x-1/2 -translate-y-1/2 rounded-md">
          <div className="w-full h-full bg-transparent md:px-10 px-5 flex flex-col justify-center">
            <div className="w-full">
              <h3 className="text-3xl mb-4 md:mb-0 md:text-4xl text-black font-bold text-center">
                BECOME TO THE MEMBER
              </h3>
            </div>

            <form action="#" method="POST" className="w-full md:mt-4 mt-0">
              <div className="w-full flex flex-col mb-4 items-center">
                <input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Username"
                  className="w-[65%] text-black py-2 text-lg md:text-xl mb-3 bg-transparent border-b border-black focus:outline-none"
                  aria-label="Email"
                />
                
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="Email"
                  className="w-[65%] text-black py-2 text-lg md:text-xl mb-3 bg-transparent border-b border-black focus:outline-none"
                  aria-label="Email"
                />
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  type="text"
                  autoComplete="phone_number"
                  placeholder="Phone number"
                  className="w-[65%] text-black py-2 text-lg md:text-xl mb-3 bg-transparent border-b border-black focus:outline-none"
                  aria-label="Phone_number"
                />
               
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="full_name"
                  type="text"
                  placeholder="Full name"
                  className="w-[65%] text-black py-2 text-lg md:text-xl mb-3 bg-transparent border-b border-black focus:outline-none"
                  aria-label="Full_name"
                />
                
                <div className="w-[65%] text-black py-2 text-lg md:text-xl mb-3 bg-transparent border-b border-black focus:outline-none flex justify-between gap-2 items-center">
                  <input
                    
                    type={securePassword ? "password" : "text"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
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
                
              </div>

              {error && <p className="text-red-500">{error}</p>}

              <div className="w-full flex flex-col md:space-y-2 space-y-1 items-center">
                <button
                  onClick={handleRegisterSubmit}
                  type="submit"
                  className="w-[55%] text-lg text-white bg-blue-500 rounded-3xl py-3"
                >
                  Sign up
                </button>
                <button
                  // onClick={handleLoginWithGoogle}
                  type="button"
                  className="w-[55%] text-blue-500 bg-white border border-blue-500 rounded-3xl py-3"
                >
                  Sign up with Google
                </button>
              </div>
            </form>
            <div className="w-full flex justify-center md:mt-5 mt-10">
              <p className="text-black">
                <p className="text-lg text-black">
                  You already have account?
                </p>
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
