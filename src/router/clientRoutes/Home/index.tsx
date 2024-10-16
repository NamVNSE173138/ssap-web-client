import Background from "./components/Background";
import ImageCarousel from "./components/Carousel";
import attributes from "./data";
import Attribute from "./components/Attribute";
import Background2 from "./components/Background2";
import { MdAgriculture, MdArchitecture, MdFormatPaint } from "react-icons/md";
import { FaCamera, FaHotel, FaMedkit, FaMicroscope, FaUser } from "react-icons/fa";
import { BsFillSuitcaseFill, BsFillSuitcaseLgFill, BsRulers, BsTerminal } from "react-icons/bs";
import { GoLaw } from "react-icons/go";
import { getAllMajors } from "@/services/ApiServices/majorService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScreenSpinner from "@/components/ScreenSpinner";
import { Spin } from "antd";

const Home = () => {
  const [majors, setMajors] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<any>(null);

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
      "Business & Management": <BsFillSuitcaseLgFill size={45} className="ml-3 mt-3" />,
      "Computer Science": <BsTerminal size={45} className="ml-3 mt-3" />,
      "Creative Art & Design": <MdFormatPaint size={45} className="ml-3 mt-3" />,
      "Mechanism & Technology": <BsRulers size={45} className="ml-3 mt-3" />,
      "Public Health": <FaMedkit size={45} className="ml-3 mt-3" />,
      Humanities: <FaUser size={45} className="ml-3 mt-3" />,
      Law: <GoLaw size={45} className="ml-3 mt-3" />,
      "Social Science & Media": <FaCamera size={45} className="ml-3 mt-3" />,
      "Tourism & Hotel": <FaHotel size={45} className="ml-3 mt-3" />
  };

  useEffect(() => {
    fetchMajors()
  }, [])

  return (
    <>
      <div
        className="max-h-full max-w-full mt-[2px]"
        style={{ backgroundColor: "#BBD4EA" }}
      >
        {/** LANDING PAGE */}
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
      </div>

      {/** HOW TO APPLY */}
      <div className="">
        <section className="relative ">
          <div className="absolute ">
            <p>HOW TO APPLY</p>
            <ul className=" grid grid-cols-4 gap-20 px-12 py-10 text-center">
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
          </div>
          <Background />
        </section>
      </div>

      {/** BROWSER BY DISCIPLINES */}
      {!majors && <Spin size="large" />}
      <div className="my-10">
        <section className="relative ">
          <p>BROWSE BY DISCIPLINE</p>
          <div className="absolute -skew-y-12 rotate-12 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-24 gap-y-16 gap-x-[112px] px-10 py-10">
            {majors && majors.map((major: any) => (
            <Link to={`/major/${major.id}`} className="relative w-[250px] h-[110px] hover:scale-110 transition-transform  bg-orange-600 rounded-lg">
              <p className="text-center text-white  text-lg font-bold">{major.name}</p>
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-white drop-shadow-lg rounded-full">
                {majorIcons[major.name]}
              </div>
            </Link>
            ))}
            {/*<div className="relative w-[250px] h-[110px] hover:scale-110 transition-transform bg-red-600 rounded-lg ">
              <p className="text-center text-white text-lg font-bold">Agriculture</p>
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-white drop-shadow-lg rounded-full">
                <MdAgriculture size={45} className="ml-3 mt-3" />
              </div>
            </div>
            <div className="relative w-[250px] h-[110px] hover:scale-110 transition-transform bg-pink-600 rounded-lg">
              <p className="text-center text-white text-lg font-bold">Sciences</p>
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-white drop-shadow-lg rounded-full">
                <FaMicroscope size={45} className="ml-3 mt-3" />
              </div>
            </div>
            <div className="relative w-[250px] h-[110px] hover:scale-110 transition-transform bg-green-600 rounded-lg">
              <p className="text-center text-white text-lg font-bold">Architecture</p>
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-white drop-shadow-lg rounded-full">
                <MdArchitecture size={45} className="ml-3 mt-3" />
              </div>
            </div>
            <div className="relative w-[250px] h-[110px] hover:scale-110 transition-transform bg-yellow-600 rounded-lg">
              <p className="text-center text-white text-lg font-bold">
                Business & Management
              </p>
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-white drop-shadow-lg rounded-full">
                <BsFillSuitcaseLgFill size={45} className="ml-3 mt-3" />
              </div>
            </div>
            <div className="relative w-[250px] h-[110px] hover:scale-110 transition-transform  bg-orange-600 rounded-lg">
              <p className="text-center text-white  text-lg font-bold">Computer Science</p>
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-white drop-shadow-lg rounded-full">
                <BsTerminal size={45} className="ml-3 mt-3" />
              </div>
            </div>
            <div className="relative w-[250px] h-[110px] hover:scale-110 transition-transform  bg-orange-600 rounded-lg">
              <p className="text-center text-white  text-lg font-bold">
                Creative Art & Design
              </p>
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-white drop-shadow-lg rounded-full">
                <MdFormatPaint size={45} className="ml-3 mt-3" />
              </div>
            </div>
            <div className="relative w-[250px] h-[110px] hover:scale-110 transition-transform  bg-orange-600 rounded-lg">
              <p className="text-center text-white  text-lg font-bold">
                Mechanism & Technology
              </p>
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-white drop-shadow-lg rounded-full">
                <BsRulers size={45} className="ml-3 mt-3" />
              </div>
            </div>
            <div className="relative w-[250px] h-[110px] hover:scale-110 transition-transform  bg-orange-600 rounded-lg">
              <p className="text-center text-white  text-lg font-bold">Public Health</p>
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-white drop-shadow-lg rounded-full">
                <FaMedkit size={45} className="ml-3 mt-3" />
              </div>
            </div>
            <div className="relative w-[250px] h-[110px] hover:scale-110 transition-transform  bg-orange-600 rounded-lg">
              <p className="text-center text-white  text-lg font-bold">Humanities</p>
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-white drop-shadow-lg rounded-full">
                <FaUser size={45} className="ml-3 mt-3" />
              </div>
            </div>
            <div className="relative w-[250px] h-[110px] hover:scale-110 transition-transform  bg-orange-600 rounded-lg">
              <p className="text-center text-white  text-lg font-bold">Law</p>
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-white drop-shadow-lg rounded-full">
                <GoLaw size={45} className="ml-3 mt-3" />
              </div>
            </div>
            <div className="relative w-[250px] h-[110px] hover:scale-110 transition-transform  bg-orange-600 rounded-lg">
              <p className="text-center text-white  text-lg font-bold">
                Social Science & Media
              </p>
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-white drop-shadow-lg rounded-full">
                <FaCamera size={45} className="ml-3 mt-3" />
              </div>
            </div>
            <div className="relative w-[250px] h-[110px] hover:scale-110 transition-transform  bg-orange-600 rounded-lg">
              <p className="text-center text-white  text-lg font-bold">Tourism & Hotel</p>
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-white drop-shadow-lg rounded-full">
                <FaHotel size={45} className="ml-3 mt-3" />
              </div>
            </div>*/}
          </div>
          <Background2 />
        </section>
      </div>
    </>
  );
};

export default Home;
