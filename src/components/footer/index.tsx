import Logo from "../../assets/logo.jpg";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-[#1eb2a6] text-white mx-auto  REM flex flex-col items-center justify-center w-full">
      <div className="flex lg:flex-row flex-col items-center justify-between px-10 py-4 w-[75%]">
        <div className="flex flex-col lg:gap-8 lg:items-start items-center lg:p-0 pb-8">
          <img className="lg:h-30 h-28 rounded-full" src={Logo} alt="" />
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-2 items-center text-lg">
              <svg
                fill="#ffffff"
                height="24px"
                width="24px"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 75.294 75.294"
                stroke="#ffffff"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>

                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <g>
                    {" "}
                    <path d="M66.097,12.089h-56.9C4.126,12.089,0,16.215,0,21.286v32.722c0,5.071,4.126,9.197,9.197,9.197h56.9 c5.071,0,9.197-4.126,9.197-9.197V21.287C75.295,16.215,71.169,12.089,66.097,12.089z M61.603,18.089L37.647,33.523L13.691,18.089 H61.603z M66.097,57.206h-56.9C7.434,57.206,6,55.771,6,54.009V21.457l29.796,19.16c0.04,0.025,0.083,0.042,0.124,0.065 c0.043,0.024,0.087,0.047,0.131,0.069c0.231,0.119,0.469,0.215,0.712,0.278c0.025,0.007,0.05,0.01,0.075,0.016 c0.267,0.063,0.537,0.102,0.807,0.102c0.001,0,0.002,0,0.002,0c0.002,0,0.003,0,0.004,0c0.27,0,0.54-0.038,0.807-0.102 c0.025-0.006,0.05-0.009,0.075-0.016c0.243-0.063,0.48-0.159,0.712-0.278c0.044-0.022,0.088-0.045,0.131-0.069 c0.041-0.023,0.084-0.04,0.124-0.065l29.796-19.16v32.551C69.295,55.771,67.86,57.206,66.097,57.206z"></path>{" "}
                  </g>{" "}
                </g>
              </svg>
              portalscholarship6@gmail.com
            </div>
            <div className="flex flex-row gap-2 items-center text-lg">
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="#ffffff"
                xmlns="http://www.w3.org/2000/svg"
                transform="matrix(-1, 0, 0, 1, 0, 0)"
                stroke="#ffffff"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier"></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M21 5.5C21 14.0604 14.0604 21 5.5 21C5.11378 21 4.73086 20.9859 4.35172 20.9581C3.91662 20.9262 3.69906 20.9103 3.50103 20.7963C3.33701 20.7019 3.18146 20.5345 3.09925 20.364C3 20.1582 3 19.9181 3 19.438V16.6207C3 16.2169 3 16.015 3.06645 15.842C3.12515 15.6891 3.22049 15.553 3.3441 15.4456C3.48403 15.324 3.67376 15.255 4.05321 15.117L7.26005 13.9509C7.70153 13.7904 7.92227 13.7101 8.1317 13.7237C8.31637 13.7357 8.49408 13.7988 8.64506 13.9058C8.81628 14.0271 8.93713 14.2285 9.17882 14.6314L10 16C12.6499 14.7999 14.7981 12.6489 16 10L14.6314 9.17882C14.2285 8.93713 14.0271 8.81628 13.9058 8.64506C13.7988 8.49408 13.7357 8.31637 13.7237 8.1317C13.7101 7.92227 13.7904 7.70153 13.9509 7.26005L13.9509 7.26005L15.117 4.05321C15.255 3.67376 15.324 3.48403 15.4456 3.3441C15.553 3.22049 15.6891 3.12515 15.842 3.06645C16.015 3 16.2169 3 16.6207 3H19.438C19.9181 3 20.1582 3 20.364 3.09925C20.5345 3.18146 20.7019 3.33701 20.7963 3.50103C20.9103 3.69907 20.9262 3.91662 20.9581 4.35173C20.9859 4.73086 21 5.11378 21 5.5Z"
                    stroke="#000000"
                    strokeWidth="2"
                  ></path>{" "}
                </g>
              </svg>
              0999 888 777
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row md:flex-row lg:gap-32 gap-8">
          <div className="list-none text-lg gap-2 flex flex-col">
            <h4 className="font-bold mb-4">ORGANIZATION</h4>
            <Link className="text-white" to={"/home"}>
              <li className="hover:text-gray-300">Home</li>
            </Link>
            <Link className="text-white" to={"/scholarship-program"}>
              <li className="hover:text-gray-300">Scholarships</li>
            </Link>
            <Link className="text-white" to={"/services"}>
              <li className="hover:text-gray-300">Services</li>
            </Link>
            <Link className="text-white" to={"/chat"}>
              <li className="hover:text-gray-300">Chat</li>
            </Link>
            <Link className="text-white" to={"/about-us"}>
              <li className="hover:text-gray-300">About Us</li>
            </Link>
          </div>
          <div className="list-none text-lg gap-2 flex flex-col ">
            <h4 className="font-bold mb-4">SUPPORT</h4>
            <Link className="text-white" to={"/user-guide"}>
              <li className="hover:text-gray-300">User Guide</li>
            </Link>
            <Link className="text-white" to={""}>
              <li className="hover:text-gray-300">Terms of Use</li>
            </Link>
            <Link className="text-white" to={""}>
              <li className="hover:text-gray-300">Privacy Policy</li>
            </Link>
            <Link className="text-white" to={""}>
              <li className="hover:text-gray-300">Payment Method</li>
            </Link>
            <Link className="text-white" to={""}>
              <li className="hover:text-gray-300">Contact</li>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-[75%] border-t border-t-solid px-10 py-4 lg:text-lg text-sm font-extralight">
        Copyright © 2025 Scholarship. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
