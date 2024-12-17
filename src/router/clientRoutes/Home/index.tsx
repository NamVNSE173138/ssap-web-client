import BackgroundImage from "./components/Carousel";
import attributes from "./data";
import Attribute from "./components/Attribute";
import { MdAgriculture, MdArchitecture, MdFormatPaint } from "react-icons/md";
import {
  FaCamera,
  FaHotel,
  FaMedkit,
  FaMicroscope,
  FaUser,
} from "react-icons/fa";
import {
  BsFillSuitcaseLgFill,
  BsRulers,
  BsTerminal,
} from "react-icons/bs";
import { GoLaw } from "react-icons/go";
import { getAllMajors } from "@/services/ApiServices/majorService";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import RouteNames from "@/constants/routeNames";


const Home = () => {
  const [majors, setMajors] = useState<any>(null);
  const [_errorMessage, setErrorMessage] = useState<any>(null);
  const navigate = useNavigate();
  const handleApplyNowClick = () => {
    navigate(RouteNames.SCHOLARSHIP_PROGRAM);
  };

  const fetchMajors = async () => {
    try {
      let majors = await getAllMajors();
      setMajors(majors.data.items);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
        "An error occurred. Please try again later."
      );
    }
  };

  const majorIcons: any = [
    <MdAgriculture size={45} className="ml-1 lg:ml-2 mt-1 lg:mt-2" />,
    <FaMicroscope size={45} className="ml-1 lg:ml-2 mt-1 lg:mt-2" />,
    <MdArchitecture size={45} className="ml-1 lg:ml-2 mt-1 lg:mt-2" />,
    <BsFillSuitcaseLgFill size={45} className="ml-1 lg:ml-2 mt-1 lg:mt-2" />,
    <BsTerminal size={45} className="ml-1 lg:ml-2 mt-1 lg:mt-2" />,
    <MdFormatPaint size={45} className="ml-1 lg:ml-2 mt-1 lg:mt-2" />,
    <BsRulers size={45} className="ml-1 lg:ml-2 mt-1 lg:mt-2" />,
    <FaMedkit size={45} className="ml-1 lg:ml-2 mt-1 lg:mt-2" />,
    <FaUser size={45} className="ml-1 lg:ml-2 mt-1 lg:mt-2" />,
    <GoLaw size={45} className="ml-1 lg:ml-2 mt-1 lg:mt-2" />,
    <FaCamera size={45} className="ml-1 lg:ml-2 mt-1 lg:mt-2" />,
    <FaHotel size={45} className="ml-1 lg:ml-2 mt-1 lg:mt-2" />,
  ];

  useEffect(() => {
    fetchMajors();
  }, []);

  return (
    <>
      <div className="relative">
        <BackgroundImage />
        <div className="absolute inset-0 flex flex-col justify-center text-white mx-auto px-4 max-w-[85%]">
          <div className="text-center md:max-w-[60%] max-w-[50%] items-start">
            <p className="text-xl md:text-2xl lg:text-3xl font-semibold drop-shadow-lg my-6 md:my-10">
              THE FUTURE BELONGS TO THOSE WHO BELIEVE IN THE BEAUTY OF THEIR
              DREAMS
            </p>
            <p className="text-xl md:text-2xl font-semibold drop-shadow-lg">
              Create Your Own Tomorrow
            </p>
            <p className="text-base md:text-lg font-semibold drop-shadow-lg">
              Discover thousands of Master's degrees worldwide!
            </p>
          </div>
          {/* <div className="flex items-center justify-start pt-8 md:pt-10 ml-70 md:ml-25"> */}
          <div className="flex items-center pt-8 md:pt-10 ml-25 md:ml-30 lg:ml-50 xl:ml-60">
            <button
              // className="h-12 md:h-14 w-[20%] lg:w-[35%] md:w-[35%] text-white font-semibold text-md md:text-lg lg:text-xl py-2 md:py-3 px-4 md:px-6 rounded-full"
              className="h-14 w-[30%] text-white font-semibold text-md md:text-base lg:text-xl py-3 px-6 rounded-full"
              style={{
                background: 'linear-gradient(45deg, #1eb2a6, #12d7b5)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseOver={(e: any) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e: any) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onClick={handleApplyNowClick}
            >
              Find Scholarship
            </button>
          </div>
        </div>
      </div>

      <div className="">
        <section className="relative ">
          <br></br>
          <div className="">
            <motion.div
              className=" md:my-5 md:w-[70%]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              <b
                className=" font-semibold text-[30px] md:text-[38px] lg:text-[48px] px-15 "
                style={{ color: "#000" }}
              >
                HOW TO APPLY
              </b>
            </motion.div>
            <motion.div>
              <ul className=" grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-10 lg:gap-20 px-5 lg:px-12 py-5 lg:py-9 text-center">
                {attributes.map((attribute, idx) => (
                  <Attribute
                    key={attribute.title}
                    icon={attribute.icon}
                    title={attribute.title}
                    description={attribute.description}
                    index={idx}
                  />
                ))}
              </ul>
            </motion.div>
          </div>
          {/* <Background /> */}
        </section>
      </div>

      <div className="my-5 md:my-8 lg:my-10">
        <section className="relative ">
          <motion.div
            className="md:my-5 md:w-[70%]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <b
              className=" font-semibold text-[30px] md:text-[38px] lg:text-[48px] px-15 "
              style={{ color: "#000" }}
            >
              BROWSER BY DISCIPLINES
            </b>
          </motion.div>
          <motion.div
            className="text-[#1eb2a6] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mx-24 gap-y-16 gap-x-[100px] px-4 md:px-10 py-6"
            // className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 lg:gap-12 px-4 md:px-10 py-6"
            whileInView={{ opacity: 1, scale: 1, skewY: -6, rotate: 6 }}
            initial={{ opacity: 0, scale: 0.5, skewY: -15, rotate: 0 }}
            transition={{
              duration: 0.2,
              ease: [0, 0.71, 0.2, 1.01],
              scale: {
                type: "spring",
                damping: 7,
                stiffness: 100,
                restDelta: 0.001,
              },
              skew: {
                type: "spring",
                damping: 10,
                stiffness: 50,
              },
            }}
            viewport={{ once: true }}
          >
            {majors &&
              majors.map((major: any, index: any) => (
                <Link
                  key={major.id}
                  to={`/major/${major.id}`}
                  // className="relative w-[250px] h-[110px] hover:scale-110 transition-transform hover:bg-[#1eb2a6] bg-[#fff] rounded-lg shadow-3 group"
                  className="relative w-full sm:w-[200px] md:w-[250px] h-[110px] hover:scale-105 transition-transform hover:bg-[#1eb2a6] bg-[#fff] rounded-lg shadow-lg group mx-auto"
                >
                  <p className="text-center text-[#000] text-sm md:text-lg font-bold group-hover:text-white ">
                    {major.name}
                  </p>
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-[60px] md:w-[70px] h-[60px] md:h-[70px] bg-white drop-shadow-lg rounded-full flex items-center justify-center">
                    {majorIcons[index]}
                  </div>
                </Link>
              ))}
          </motion.div>

          {/* <Background2 /> */}
        </section>
      </div>
    </>
  );
};

export default Home;
