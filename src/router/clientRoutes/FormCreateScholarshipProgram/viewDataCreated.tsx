import {
  FaBook,
  FaCalendarAlt,
  FaCertificate,
  FaClipboardList,
  FaDollarSign,
  FaExclamationCircle,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaRegListAlt,
  FaTag,
  FaUniversity,
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

const ViewDataCreated = ({ formData }: { formData: any }) => {
  const user = useSelector((state: any) => state.token.user);
  const isApplicant = user?.role;
  const [categories, setCategories] = useState<any>(null);
  const [majors, setMajors] = useState<any>(null);
  const [universities, setUniversities] = useState<any>(null);
  const [certificates, setCertificates] = useState<any>(null);
  const fetchCategories = async (categoryId: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/categories/${categoryId}`
      );
      console.log("category", response.data.data);

      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };
  const fetchMajors = async (majorId: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/majors/${majorId}`);
      console.log("major", response.data.data);

      setMajors(response.data.data);
    } catch (error) {
      console.error("Error fetching majors", error);
    }
  };
  const fetchUniversities = async (universityId: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/universities/${universityId}`
      );
      console.log("university", response.data.data);

      setUniversities(response.data.data);
    } catch (error) {
      console.error("Error fetching university", error);
    }
  };
  const fetchCertificates = async (certificatesId: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/certificates/${certificatesId}`
      );
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
    <>
      <div className=" overflow-y-scroll">
        <section className="bg-white py-[40px] md:py-[60px]">
          <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-md">
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

              <div className="w-full h-full justify-center items-center z-10">
                <div className="w-full bg-white p-6">
                  <div className=" pr-8 flex flex-col justify-between">
                    <div className="mb-3">
                      <p className="text-[#1a202c] text-4xl font-semibold leading-tight">
                        {formData.scholarshipName}
                      </p>
                      <span className="flex items-center mt-2">
                        <span
                          className={`px-4 py-2 rounded-full text-base font-medium ${
                            formData.status === "Open"
                              ? "bg-green-200 text-green-800"
                              : formData.status === "Closed"
                              ? "bg-red-200 text-red-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {formData.status}
                        </span>
                      </span>
                      {/* Description Section */}
                      <div className="max-w-full mt-4">
                        <p className="text-md text-gray-500 text-[#2d3748] break-words">
                          {formData.description.length > 150
                            ? `${formData.description.substring(0, 150)}...`
                            : formData.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
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
                        <AccordionDetails className="bg-white p-6 rounded-b-lg">
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
                              <span className="text-lg text-[#2d3748] break-words">
                                {formData.description.length > 60
                                  ? `${formData.description.substring(
                                      0,
                                      60
                                    )}...`
                                  : formData.description}
                              </span>
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
                        <AccordionDetails className="bg-white p-6 rounded-b-lg">
                          {formData.criteria && formData.criteria.length > 0 ? (
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
                        </AccordionSummary>
                        <AccordionDetails className="bg-white p-6 rounded-b-lg">
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
                        </AccordionSummary>

                        <AccordionDetails className="bg-white p-6 rounded-b-lg">
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
                        </AccordionSummary>

                        <AccordionDetails className="bg-white p-6 rounded-b-lg">
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
                                      {universities
                                        ? universities.description
                                        : ""}
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
                        </AccordionSummary>
                        <AccordionDetails className="bg-white p-6 rounded-b-lg">
                          {formData.certificates &&
                          formData.certificates.length > 0 ? (
                            formData.certificates.map((certificate: any) => (
                              <Accordion key={certificate.id} className="mt-4">
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
                                          {certificates
                                            ? certificates.description
                                            : ""}
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
                                          {certificates
                                            ? certificates.type
                                            : ""}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </AccordionDetails>
                              </Accordion>
                            ))
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
              <div className="max-w-7xl mt-10 mx-auto p-6 bg-white shadow-md rounded-md">
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
    </>
  );
};

export default ViewDataCreated;
