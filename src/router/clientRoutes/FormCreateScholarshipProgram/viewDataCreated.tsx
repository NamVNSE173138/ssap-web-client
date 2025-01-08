import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import SchoolLogo from "../ScholarshipProgramDetail/logo";
import {
  FaAward,
  FaBook,
  FaCalendarAlt,
  FaCertificate,
  FaClipboardList,
  FaCode,
  FaCreditCard,
  FaDollarSign,
  FaExclamationCircle,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaRegListAlt,
  FaTag,
  FaUniversity,
  FaUserAlt,
} from "react-icons/fa";
import { format } from "date-fns";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { List, Paper } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { useEffect, useState } from "react";

const ViewDataCreated = ({ formData, onBack }: { formData: any; onBack: (data: any) => void; }) => {
  const user = useSelector((state: any) => state.token.user);
  const isApplicant = user?.role;
  const [categories, setCategories] = useState<any>(null);
  const [majors, setMajors] = useState<any>(null);
  const [universities, setUniversities] = useState<any>(null);
  const [certificates, setCertificates] = useState<any>(null);
  const fetchCategories = async (categoryId : number) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/categories/${categoryId}`);
      console.log("category", response.data.data);

      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };
  const fetchMajors = async (majorId : number) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/majors/${majorId}`);
      console.log("major", response.data.data);

      setMajors(response.data.data);
    } catch (error) {
      console.error("Error fetching majors", error);
    }
  };
  const fetchUniversities = async (universityId : number) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/universities/${universityId}`);
      console.log("university", response.data.data);

      setUniversities(response.data.data);
    } catch (error) {
      console.error("Error fetching university", error);
    }
  };
  const fetchCertificates = async (certificatesId : number) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/certificates/${certificatesId}`);
      console.log("certificate", response.data.data);

      setCertificates(response.data.data);
    } catch (error) {
      console.error("Error fetching university", error);
    }
  };

  useEffect(() => {
    fetchCategories(formData.scholarshipType);
    fetchMajors(formData.major);
    fetchUniversities(formData.university);
    fetchCertificates(formData.certificate);
  }, []);
  return (
    <div>
      <div>
        <div className=" overflow-y-scroll">
          <div className="relative max-w-[280vh]  p-10 ">
            <ScholarshipProgramBackground />
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-start p-[40px] z-10">
              <div className="lg:flex-row ml-5 items-center lg:items-center flex-row flex gap-[20px] lg:gap-[20px] ">
                <SchoolLogo imageUrl={formData.imageUrl} />
                <div>
                  <p className="text-[#000] text-2xl md:text-3xl lg:text-4xl  lg:line-clamp-3 line-clamp-5 font-medium">
                    {formData.scholarshipName}
                  </p>
                  <p className="text-[#000] text-lg md:text-xl lg:text-2xl text-heading-5 hidden lg:block mt-[12px]">
                    {formData.description.length > 50
                      ? `${formData.description.substring(0, 50)}...`
                      : formData.description}
                  </p>
                </div>
              </div>
              <span className="flex justify-start ps-5 pt-5 gap-2 items-center">
                <span className="relative flex h-3 w-3">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 bg-green-500`}
                  ></span>
                </span>
                <span className={`text-green-500 text-2xl font-medium`}>
                  {formData.status}
                </span>
              </span>
            </div>
            <div className="bg-white lg:bg-white drop-shadow-[0_0_5px_rgba(0,0,0,0.1)] lg:drop-shadow-[0_5px_25px_rgba(0,0,0,0.05)] relative ">
              <section className="w-full max-w-none flex justify-between items-center mx-auto py-6 lg:py-10 px-4 lg:px-0">
                <div className="flex w-full justify-around gap-12">
                  <div className="flex items-center gap-3">
                    <FaUserAlt className="text-[#1eb2a6] text-xl" />
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-500">
                        Funder name
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formData.funderName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaCreditCard className="text-[#1eb2a6] text-xl" />
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-500">
                        Funding Type
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {"Wallet or Cash"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-[#1eb2a6] text-xl" />
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-500">
                        Created At
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {/* {formData.deadline
                    ? format(new Date(formData.createdAt), "MM/dd/yyyy")
                    : "Not specified"} */}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-[#1eb2a6] text-xl" />
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-500">
                        Application Deadline
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formData.deadline &&
                          !isNaN(new Date(formData.deadline).getTime())
                          ? format(new Date(formData.deadline), "MM/dd/yyyy")
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaAward className="text-[#1eb2a6] text-xl" />
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-500">
                        Value of Award
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        ${formData.value}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

          </div>
          <section className="bg-white lg:bg-grey-lightest py-[40px] md:py-[60px]">
            <div className="max-w-7xl mx-auto p-6 bg-[rgba(255,255,255,0.75)] shadow-lg rounded-md">
              <div className="max-w-[1216px] mx-auto ">
                <div className="mb-6 px-4 sm:px-6 xl:px-0">
                  <div className="relative flex items-center gap-3">
                    <div className="p-2 bg-[#1eb2a6] rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="white"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 9.75L15.75 15.75M15.75 9.75L9.75 15.75M6 4.5H18M6 19.5H18M3 9H21M3 15H21"
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                      About the Scholarship
                    </h2>
                  </div>
                  <div className="bg-[#1eb2a6] w-12 h-1 rounded-full mt-3 transition-all duration-300 ease-in-out"></div>
                </div>
                <br></br>
                <div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  style={{ transform: "translateX(50px)" }}
                >
                  <div className="flex flex-col gap-6">
                    <div className="lg:col-span-1 px-[16px] xsm:px-[24px] 2xl:px-0">
                      <div className="lg:pe-[112px]">
                        <Accordion defaultExpanded={false}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            className="bg-blue-50 hover:bg-blue-100 transition-all rounded-t-lg"
                          >
                            <h3 className="text-[#1eb2a6] font-semibold text-lg flex items-center gap-2">
                              <FaInfoCircle className="text-[#1eb2a6]" />
                              Overview
                            </h3>
                          </AccordionSummary>
                          <AccordionDetails className="bg-white p-6 rounded-b-lg shadow-lg">
                            {/* Awarding institution & Applications */}
                            <div className="flex gap-4 flex-wrap justify-between mb-6">
                              <div className="md:w-[48%] w-full bg-gray-50 p-4 rounded-lg shadow-sm">
                                <p className="text-gray-700 font-bold flex items-center gap-2">
                                  <FaUniversity className="text-gray-500" />
                                  Awarding institution:
                                </p>
                                <Link
                                  to=""
                                  className="text-blue-500 hover:underline"
                                >
                                  {formData.scholarshipName}
                                </Link>
                              </div>
                              <div className="md:w-[48%] w-full bg-gray-50 p-4 rounded-lg shadow-sm">
                                <p className="text-gray-700 font-bold flex items-center gap-2">
                                  <FaInfoCircle className="text-gray-500" />
                                  Funding details:
                                </p>
                                <span>{formData.description}</span>
                              </div>
                            </div>

                            {/* Qualification & Number of awards */}
                            <div className="flex gap-4 flex-wrap justify-between mb-6">
                              <div className="md:w-[48%] w-full bg-gray-50 p-4 rounded-lg shadow-sm">
                                <p className="text-gray-700 font-bold flex items-center gap-2">
                                  <FaDollarSign className="text-gray-500" />
                                  Value of Award:
                                </p>
                                <span>
                                  $
                                  {formData.value && !isNaN(formData.value)
                                    ? formData.value.toLocaleString("en-US")
                                    : "N/A"}
                                </span>
                              </div>
                              <div className="md:w-[48%] w-full bg-gray-50 p-4 rounded-lg shadow-sm">
                                <p className="text-gray-700 font-bold flex items-center gap-2">
                                  <FaRegListAlt className="text-gray-500" />
                                  Number of awards available:
                                </p>
                                <span>{formData.numberOfScholarships}</span>
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="criteria-content"
                            id="criteria-header"
                            className="bg-yellow-50 hover:bg-yellow-100 transition-all rounded-t-lg"
                          >
                            <h3 className="text-[#1eb2a6] font-semibold text-lg flex items-center gap-2">
                              <FaClipboardList className="text-[#1eb2a6]" />
                              Eligibility Criteria
                            </h3>
                          </AccordionSummary>
                          <AccordionDetails className="bg-white p-6 rounded-b-lg shadow-lg">
                            {formData.criteria &&
                              formData.criteria.length > 0 ? (
                              <div className="flex flex-col gap-4">
                                {formData.criteria.map((criteria: any) => (
                                  <div
                                    key={criteria.name}
                                    className="p-4 bg-gray-50 rounded-lg shadow-sm"
                                  >
                                    <div>
                                      <p className="text-gray-700 font-bold text-md">
                                        {criteria.name}
                                      </p>
                                      <p className="text-gray-600 text-sm">
                                        {criteria.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center text-center gap-2">
                                <FaExclamationCircle className="text-red-500 text-4xl" />
                                <p className="text-gray-600 italic">
                                  No eligibility criteria specified.
                                </p>
                              </div>
                            )}
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                            className="bg-green-50 hover:bg-green-100 transition-all rounded-t-lg"
                          >
                            <h3 className="text-[#1eb2a6] font-semibold text-lg flex items-center gap-2">
                              <FaTag className="text-[#1eb2a6]" />
                              Scholarship Category
                            </h3>
                          {/* {JSON.stringify(categories)} */}
                          </AccordionSummary>
                          <AccordionDetails className="bg-white p-6 rounded-b-lg shadow-lg">
                            {/* Category Name */}
                            <div className="w-full flex items-start gap-3 mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                              <FaInfoCircle className="text-gray-400 text-2xl mt-1" />
                              <div>
                                <p className="text-gray-700 font-bold">
                                  Category Name:
                                </p>
                                <p className="text-gray-600">
                                  {categories ? categories.name : ""}
                                </p>
                              </div>
                            </div>

                            {/* Description */}
                            <div className="w-full flex items-start gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
                              <FaInfoCircle className="text-gray-400 text-2xl mt-1" />
                              <div>
                                <p className="text-gray-700 font-bold">
                                  Description:
                                </p>
                                <p className="text-gray-600">
                                {categories ? categories.description : ""}
                                </p>
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    </div>
                  </div>

                  {/* Cột bên phải */}
                  <div className="flex flex-col gap-6">
                    <div className="lg:col-span-1 px-[16px] xsm:px-[24px] 2xl:px-0">
                      <div className="lg:pe-[112px]">
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3-content"
                            id="panel3-header"
                            className="bg-blue-50 hover:bg-blue-100 transition-all rounded-t-lg"
                          >
                            <h3 className="text-[#1eb2a6] font-semibold text-lg flex items-center gap-2">
                              <FaBook className="text-[#1eb2a6]" />
                              Applicable Majors & Skills
                            </h3>
                            {/* {JSON.stringify(majors)} */}

                          </AccordionSummary>

                          <AccordionDetails className="bg-white p-6 rounded-b-lg shadow-lg">
                            {formData?.major ? (
                              <Accordion key={formData.major.id}>
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls={`major-${formData.major.id}-content`}
                                  id={`major-${formData.major.id}-header`}
                                  className="bg-gray-100 hover:bg-gray-200 transition-all rounded-lg"
                                >
                                  <h4 className="font-bold text-gray-700 flex items-center gap-2">
                                    <FaBook className="text-gray-500" />
                                    {majors ? majors.name : ""}
                                  </h4>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <div className="w-full flex items-start gap-3 p-4 bg-gray-50 rounded-lg shadow-sm mb-4">
                                    <FaInfoCircle className="text-gray-400 text-xl mt-1" />
                                    <div>
                                      <p className="text-gray-700 font-bold">
                                        Description:
                                      </p>
                                      <p className="text-gray-600">
                                      {majors ? majors.description : ""}
                                      </p>
                                    </div>
                                  </div>

                                  {/* <div className="w-full">
                                      <h5 className="font-bold text-gray-700 mb-3">
                                        Skills:
                                      </h5>

                                      <div>
                                        {majors.map(
                                          (skill: any) => (
                                            <Accordion key={skill.id}>
                                              <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`skill-${skill.id}-content`}
                                                id={`skill-${skill.id}-header`}
                                                className="bg-gray-100 hover:bg-gray-200 transition-all rounded-lg"
                                              >
                                                <h6 className="font-bold text-gray-700 flex items-center gap-2">
                                                  <FaCode className="text-gray-500" />
                                                  {skill.name}
                                                </h6>
                                              </AccordionSummary>
                                              <AccordionDetails>
                                                <div className="w-full flex items-start gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
                                                  <FaInfoCircle className="text-gray-400 text-xl mt-1" />
                                                  <div>
                                                    <p className="text-gray-700 font-bold">
                                                      Description:
                                                    </p>
                                                    <p className="text-gray-600">
                                                      {skill.description}
                                                    </p>
                                                  </div>
                                                </div>
                                              </AccordionDetails>
                                            </Accordion>
                                          )
                                        )}
                                      </div>
                                    </div> */}
                                </AccordionDetails>
                              </Accordion>
                            ) : (
                              <p className="text-gray-600 italic">
                                No majors or skills available at the moment.
                              </p>
                            )}
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3-content"
                            id="panel3-header"
                            className="bg-yellow-50 hover:bg-yellow-100 transition-all rounded-t-lg"
                          >
                            <h3 className="text-[#1eb2a6] font-semibold text-lg flex items-center gap-2">
                              <FaUniversity className="text-[#1eb2a6]" />
                              Applicable University
                            </h3>
                            {/* {JSON.stringify(universities)} */}
                          </AccordionSummary>

                          <AccordionDetails className="bg-white p-6 rounded-b-lg shadow-lg">
                            {formData?.university ? (
                              <Accordion key={formData.university.id}>
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls={`university-${formData.university.id}-content`}
                                  id={`university-${formData.university.id}-header`}
                                  className="bg-gray-100 hover:bg-gray-200 transition-all rounded-lg"
                                >
                                  <div className="flex flex-col">
                                    <h4 className="font-bold text-gray-700 flex items-center gap-2">
                                      <FaUniversity className="text-gray-500" />
                                      {universities ? universities.name : ""}
                                    </h4>
                                    <span className="text-gray-600 flex items-center gap-1">
                                      <FaMapMarkerAlt className="text-gray-400" />
                                      {universities ? universities.city : ""}
                                    </span>
                                  </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <div className="w-full flex items-start gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <FaInfoCircle className="text-gray-400 text-xl mt-1" />
                                    <div>
                                      <p className="text-gray-700 font-bold">
                                        Description:
                                      </p>
                                      <p className="text-gray-600">
                                      {universities ? universities.description : ""}
                                      </p>
                                    </div>
                                  </div>
                                </AccordionDetails>
                              </Accordion>
                            ) : (
                              <p className="text-gray-600 italic">
                                No applicable universities available at the
                                moment.
                              </p>
                            )}
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3-content"
                            id="panel3-header"
                            className="bg-green-50 hover:bg-green-100 transition-all rounded-t-lg"
                          >
                            <h3 className="text-[#1eb2a6] font-semibold text-lg flex items-center gap-2">
                              <FaCertificate className="text-[#1eb2a6]" />
                              Required Certificates
                            </h3>
                            {/* {JSON.stringify(certificates)} */}
                          </AccordionSummary>
                          <AccordionDetails className="bg-white p-6 rounded-b-lg shadow-lg">
                            {formData.certificates &&
                              formData.certificates.length > 0 ? (
                              formData.certificates.map(
                                (certificate: any) => (
                                  <Accordion
                                    key={certificate.id}
                                    className="mt-4"
                                  >
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls={`certificate-${certificate.id}-content`}
                                      id={`certificate-${certificate.id}-header`}
                                      className="bg-gray-100 hover:bg-gray-200 transition-all rounded-lg"
                                    >
                                      <div className="flex items-center gap-2">
                                        <FaCertificate className="text-gray-500" />
                                        <span className="font-bold text-gray-700">
                                        {certificates ? certificates.name : ""}
                                        </span>
                                      </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <div className="w-full flex flex-col gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                                        <div className="flex items-start gap-3">
                                          <FaInfoCircle className="text-gray-400 text-xl mt-1" />
                                          <div>
                                            <p className="text-gray-700 font-bold">
                                              Description:
                                            </p>
                                            <p className="text-gray-600">
                                            {certificates ? certificates.description : ""}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                          <FaTag className="text-gray-400 text-xl mt-1" />
                                          <div>
                                            <p className="text-gray-700 font-bold">
                                              Type:
                                            </p>
                                            <p className="text-gray-600">
                                            {certificates ? certificates.type : ""}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </AccordionDetails>
                                  </Accordion>
                                )
                              )
                            ) : (
                              <p className="text-gray-600 italic">
                                No certificates required.
                              </p>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isApplicant == "Funder" && (
              <div>
                <div className="max-w-7xl mt-10 mx-auto p-6 bg-[rgba(255,255,255,0.75)] shadow-lg rounded-md">
                  <div className="max-w-[1216px] mx-auto">
                    <div className="mb-6 px-4 sm:px-6 xl:px-0">
                      <div className="relative flex items-center gap-3">
                        <div className="p-2 bg-[#1eb2a6] rounded-full">
                          <FaCalendarAlt className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                          Review Milestone
                        </h2>
                      </div>
                      <div className="bg-[#1eb2a6] w-12 h-1 rounded-full mt-3 transition-all duration-300 ease-in-out"></div>
                    </div>
                    <br />
                    <List sx={{ pt: 0 }}>
                      {!formData.reviewMilestones ||
                        formData.reviewMilestones.length === 0 ? (
                        <p className="p-10 text-center text-gray-500 font-semibold text-xl">
                          No review milestones for this scholarship
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                          {formData.reviewMilestones.map((milestone: any) => (
                            <Paper
                              elevation={3}
                              key={milestone.id}
                              className="p-6 flex flex-col gap-4 justify-between items-start rounded-xl shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-white to-gray-50 border border-gray-200"
                            >
                              {/* Title */}
                              <p className="font-bold text-2xl text-gray-900 mb-2">
                                {milestone.description}
                              </p>

                              {/* Date Range */}
                              <div className="flex flex-col gap-2 w-full">
                                <div className="flex justify-between">
                                  <p className="text-gray-600 font-semibold">
                                    Start Date:
                                  </p>
                                  <p className="text-gray-700">
                                    {format(
                                      new Date(milestone.fromDate),
                                      "MM/dd/yyyy"
                                    )}
                                  </p>
                                </div>
                                <div className="flex justify-between">
                                  <p className="text-gray-600 font-semibold">
                                    End Date:
                                  </p>
                                  <p className="text-gray-700">
                                    {format(
                                      new Date(milestone.toDate),
                                      "MM/dd/yyyy"
                                    )}
                                  </p>
                                </div>
                              </div>

                              {/* Divider */}
                              <div className="w-full h-[1px] bg-gray-300 my-2"></div>
                            </Paper>
                          ))}
                        </div>
                      )}
                    </List>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ViewDataCreated;
