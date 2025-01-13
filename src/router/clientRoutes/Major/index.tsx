import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import RouteNames from "@/constants/routeNames";
import { getMajor } from "@/services/ApiServices/majorService";
import { Container } from "@mui/material";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import {
  FaCamera,
  FaHotel,
  FaMedkit,
  FaMicroscope,
  FaUser,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { getAllScholarshipProgramByMajorId } from "@/services/ApiServices/scholarshipProgramService";
import { Card } from "@/components/ScholarshipProgram";
import ScholarshipProgramSkeleton from "../ScholarshipProgram/ScholarshipProgramSkeleton";
import { MdAgriculture, MdArchitecture, MdFormatPaint } from "react-icons/md";
import { BsFillSuitcaseLgFill, BsRulers, BsTerminal } from "react-icons/bs";
import { GoLaw } from "react-icons/go";

const Major = () => {
  const { id } = useParams<{ id: string }>();
  const [major, setMajor] = useState<any>(null);
  const [scholarships, setScholarships] = useState<any>(null);
  const [_errorMessage, setErrorMessage] = useState<any>(null);
  const [scholarshipError, setScholarshipError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMajor = async () => {
    try {
      if (!id) return;
      let majors = await getMajor(id);
      setMajor(majors.data);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    }
  };

  const fetchScholarshipByMajor = async (id: string | undefined) => {
    try {
      if (!id) return;
      let majorId = parseInt(id);
      setLoading(true);
      let scholars = await getAllScholarshipProgramByMajorId(majorId);
      setScholarships(scholars.data);
      setLoading(false);
    } catch (error: any) {
      setScholarshipError(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
      setLoading(false);
    }
  };

  const majorIcons: any = [
    <MdAgriculture size={75} className="ml-3 mt-3" />,
    <FaMicroscope size={75} className="ml-3 mt-3" />,
    <MdArchitecture size={75} className="ml-3 mt-3" />,
    <BsFillSuitcaseLgFill size={75} className="ml-3 mt-3" />,
    <BsTerminal size={75} className="ml-3 mt-3" />,
    <MdFormatPaint size={75} className="ml-3 mt-3" />,
    <BsRulers size={75} className="ml-3 mt-3" />,
    <FaMedkit size={75} className="ml-3 mt-3" />,
    <FaUser size={75} className="ml-3 mt-3" />,
    <GoLaw size={75} className="ml-3 mt-3" />,
    <FaCamera size={75} className="ml-3 mt-3" />,
    <FaHotel size={75} className="ml-3 mt-3" />,
  ];

  const transformToMarkdown = (text: string) => {
    return text.replace(/\\n/gi, "\n").replace(/\n/gi, "<br/>");
  };

  const CustomLink = ({ children, href }: any) => {
    return (
      <Link to={href} className="text-blue-400 no-underline">
        {children}
      </Link>
    );
  };

  useEffect(() => {
    fetchMajor();
    fetchScholarshipByMajor(id);
  }, []);

  if (!major) {
    return <Spin size="large" />;
  }

  return (
    <>
      <div className="my-8 w-full px-12 py-5 bg-white">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to={RouteNames.HOME} className="md:text-xl text-lg">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to={RouteNames.HOME} className="md:text-xl text-lg">
                Major
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <p className="text-black md:text-xl text-lg">{major.name}</p>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex justify-center items-center">
          {majorIcons[major.id - 1]}
        </div>
        <div className="flex justify-center items-center">
          <h1 className="text-3xl font-bold mb-4">{major.name}</h1>
        </div>
      </div>
      <Container className="w-full p-15 bg-white" maxWidth="lg">
        {/*<p className="text-lg">{major.description}</p>*/}
        <ReactMarkdown
          components={{ a: CustomLink }}
          children={transformToMarkdown(major.description)}
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
        ></ReactMarkdown>
      </Container>
      <Container className="w-full p-15 mb-8" maxWidth="lg">
        <h1 className="text-3xl font-bold text-center mb-4">
          Interesting programmes for you
        </h1>
        <menu className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 justify-between items-start gap-10 mt-6">
          {loading ? (
            <ScholarshipProgramSkeleton />
          ) : scholarshipError ? (
            <p className="text-center text-[2rem] font-semibold md:col-span-3 lg:col-span-4">
              Error loading scholarship programs.
            </p>
          ) : scholarships.length == 0 ? (
            <p className="text-center text-[2rem] font-semibold md:col-span-3 lg:col-span-4">
              No scholarship programs found.
            </p>
          ) : (
            scholarships.map((service: any) => (
              <li key={service.id}>
                <Card {...service} />
              </li>
            ))
          )}
        </menu>
      </Container>
    </>
  );
};

export default Major;
