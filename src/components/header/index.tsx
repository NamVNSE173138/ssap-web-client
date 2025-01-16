// import Logo from "../logo";
// import Navigation from "./Navigation";
// import RouteNames from "../../constants/routeNames";
// import navigation from "../../constants/multilingual/navigation";
// import AuthNavigation from "./AuthNavigation";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import HeaderAvatar from "./HeaderAvatar";

// const Header = () => {
//   const user = useSelector((state: RootState) => state.token.user);
//   console.log("ROLE", user?.role);

//   return (
//     <header
//       className="flex justify-around items-center p-1 "
//       style={{ backgroundColor: "#1eb2a6" }}
//     >
//       <Logo />
//       <div className="flex justify-between items-center">
//         <Navigation />
//         {user ? (
//           <div className="flex items-center ml-5 gap-5">
//             <HeaderAvatar />
//             <span className="text-black text-lg lg:text-xl font-medium">
//               {user?.role}
//             </span>
//           </div>
//         ) : (
//           <div className="flex justify-between gap-8">
//             <div
//               className="flex justify-center ml-9 p-2 rounded-xl"
//               style={{ backgroundColor: "#1eb2a6" }}
//             >
//               <AuthNavigation to={RouteNames.LOGIN} text={navigation.LOGIN} />
//               <p className="text-xl text-white">/</p>
//               <AuthNavigation
//                 to={RouteNames.REGISTER}
//                 text={navigation.REGISTER}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;

import AppLogo from "../../assets/logo.jpg";
import { RootState } from "@/store/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import HeaderAvatar from "./HeaderAvatar";
import { IoIosChatbubbles } from "react-icons/io";
import DropdownNotification from "@/router/adminRoutes/Dashboard/components/Header/DropdownNotification";

const Header = () => {
  const user = useSelector((state: RootState) => state.token.user);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Scholarship", path: "/scholarship-program" },
    { name: "Services", path: "/services" },
    { name: "About Us", path: "/about-us" },
    { name: "Guide", path: "/user-guide" },
  ];

  return (
    <nav className="bg-[#1eb2a6] border-b border-[#17a39b]">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src={AppLogo} className="h-20 rounded-full" alt="App Logo" />
        </Link>
        <div className="flex items-center md:order-2">
          {user ? (
            <div className="flex items-center gap-5">
              <Link
                className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-gray-100 hover:bg-blue-200 transition-all duration-300 ease-in-out"
                to="/chat"
              >
                <IoIosChatbubbles size={24} className="text-gray-600" />
              </Link>
              <DropdownNotification />
              <HeaderAvatar />
              <span className="text-white text-lg lg:text-xl font-medium">
                {user?.username}
                <p className="text-white text-sm lg:text-sm font-normal opacity-80">
                  {user?.role}
                </p>
              </span>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-[#1eb2a6] bg-white rounded hover:bg-[#f0fdfa] focus:ring-4 focus:ring-[#f0fdfa]"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-[#17a39b] border border-white rounded hover:bg-[#139487] focus:ring-4 focus:ring-[#f0fdfa]"
              >
                Register
              </Link>
            </div>
          )}
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-[#17a39b] focus:outline-none focus:ring-2 focus:ring-[#f0fdfa]"
            aria-controls="navbar-user"
            aria-expanded={navbarOpen}
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`absolute top-20 left-0 w-full bg-[#1eb2a6] z-40 ${
            navbarOpen ? "block" : "hidden"
          } md:static md:flex md:items-center md:justify-between md:w-auto md:order-1`}
          id="navbar-user"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 bg-[#17a39b] border border-[#1ca094] rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`block py-2 px-4 text-xl font-semimedium rounded md:p-0 ${
                    location.pathname === link.path
                      ? "text-[#f0fdfa] bg-[#139487] md:bg-transparent underline underline-offset-4 font-bold"
                      : "text-white hover:bg-[#139487] md:hover:bg-transparent md:hover:text-[#f0fdfa] hover:underline hover:underline-offset-4"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
