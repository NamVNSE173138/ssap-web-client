import Background from "./components/Background";
import BackgroundImage from "./components/Carousel";
import attributes from "./data";
import Attribute from "./components/Attribute";
import Background2 from "./components/Background2";
import { MdAgriculture, MdArchitecture, MdFormatPaint } from "react-icons/md";
import {
  FaCamera,
  FaHotel,
  FaMedkit,
  FaMicroscope,
  FaUser,
} from "react-icons/fa";
import {
  BsFillSuitcaseFill,
  BsFillSuitcaseLgFill,
  BsRulers,
  BsTerminal,
} from "react-icons/bs";
import { GoLaw } from "react-icons/go";
import { getAllMajors } from "@/services/ApiServices/majorService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScreenSpinner from "@/components/ScreenSpinner";
import { Spin } from "antd";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const Home = () => {
  const [majors, setMajors] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

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

  const majorIcons: any = {
    Agriculture: <MdAgriculture size={45} className="ml-3 mt-3" />,
    Sciences: <FaMicroscope size={45} className="ml-3 mt-3" />,
    Architecture: <MdArchitecture size={45} className="ml-3 mt-3" />,
    "Business & Management": (
      <BsFillSuitcaseLgFill size={45} className="ml-3 mt-3" />
    ),
    "Computer Science": <BsTerminal size={45} className="ml-3 mt-3" />,
    "Creative Art & Design": <MdFormatPaint size={45} className="ml-3 mt-3" />,
    "Mechanism & Technology": <BsRulers size={45} className="ml-3 mt-3" />,
    "Public Health": <FaMedkit size={45} className="ml-3 mt-3" />,
    Humanities: <FaUser size={45} className="ml-3 mt-3" />,
    Law: <GoLaw size={45} className="ml-3 mt-3" />,
    "Social Science & Media": <FaCamera size={45} className="ml-3 mt-3" />,
    "Tourism & Hotel": <FaHotel size={45} className="ml-3 mt-3" />,
  };

  useEffect(() => {
    fetchMajors();
  }, []);

  return (
    <>
      {/* <div
        className="max-h-full max-w-full mt-[2px]"
        style={{ backgroundColor: "#BBD4EA" }}
      >
        
        <section className="flex justify-around flex-row mx-32">
          <section className="p-14">
            <p className="w-[65%] text-3xl text-center text-white font-semibold drop-shadow-lg my-10">
              THE FUTURE BELONGS TO THOSE WHO BELIEVE IN THE BEAUTY OF THEIR
              DREAMS
            </p>
            <p className="w-[65%] text-2xl text-center font-semibold drop-shadow-lg">
              Create Your Own Tomorrow
            </p>
            <p className="w-[65%] text-lg text-center font-semibold drop-shadow-lg">
              Discover thousands of Master's degrees worldwide!
            </p>
            <div className="flex items-center pt-10">
              <input className="h-14" type="text" placeholder="What to study" />
              <input
                className="h-14"
                type="text"
                placeholder="Where to study"
              />
              <button
                className="h-14 w-[20%] text-white"
                style={{ backgroundColor: "#5559C7" }}
              >
                Find scholarship
              </button>
            </div>
          </section>
          <section className="w-[30%] h-[30%] mt-1">
            <ImageCarousel />
          </section>
        </section>
      </div> */}
      <div className="relative">
        <BackgroundImage />
        <div className="absolute inset-0 flex flex-col justify-center text-white max-w-[85%] m-auto">
          <div className="text-center max-w-[60%] items-start">
            <p className="text-3xl font-semibold drop-shadow-lg my-10">
              THE FUTURE BELONGS TO THOSE WHO BELIEVE IN THE BEAUTY OF THEIR
              DREAMS
            </p>
            <p className="text-2xl font-semibold drop-shadow-lg">
              Create Your Own Tomorrow
            </p>
            <p className="text-lg font-semibold drop-shadow-lg">
              Discover thousands of Master's degrees worldwide!
            </p>
          </div>
          <div className="flex items-center pt-10">
            <input
              className="h-14 px-4"
              type="text"
              placeholder="What to study"
            />
            <input
              className="h-14 px-4"
              type="text"
              placeholder="Where to study"
            />
            <button
              className="h-14 w-[20%] text-white"
              style={{ backgroundColor: "#5559C7" }}
            >
              Find scholarship
            </button>
          </div>
        </div>
      </div>

      {/** HOW TO APPLY */}
      <div className="">
        <section className="relative ">
          <div className="absolute">
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
                style={{ color: "#5559C7" }}
              >
                HOW TO APPLY
              </b>
            </motion.div>
            <motion.div>
              <ul className=" grid grid-cols-4 gap-20 px-12 py-9 text-center">
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
          <Background />
        </section>
      </div>

      {/** BROWSER BY DISCIPLINES */}
      {/* {!majors && <Spin size="large" />} */}
      <div className="my-10">
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
              style={{ color: "#5559C7" }}
            >
              BROWSER BY DISCIPLINES
            </b>
          </motion.div>
          {/* {!majors && <Spin size="large" />} */}
          <motion.div
            className="absolute grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-24 gap-y-16 gap-x-[112px] px-10 py-10"
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
            viewport={{ once: true }} // Animates only once when it enters the viewport
          >
            {majors &&
              majors.map((major: any) => (
                <Link
                  key={major.id}
                  to={`/major/${major.id}`}
                  className="relative w-[250px] h-[110px] hover:scale-110 transition-transform bg-[#5559c7] rounded-lg"
                >
                  <p className="text-center text-white text-lg font-bold">
                    {major.name}
                  </p>
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-white drop-shadow-lg rounded-full">
                    {majorIcons[major.name]}
                  </div>
                </Link>
              ))}
          </motion.div>

          <Background2 />
        </section>
      </div>
    </>
  );
};

export default Home;
