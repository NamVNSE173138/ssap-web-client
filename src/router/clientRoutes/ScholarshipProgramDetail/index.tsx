import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import axios from "axios";
import { ScholarshipProgramType } from "../ScholarshipProgram/data";
import Spinner from "@/components/Spinner";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";
import { BASE_URL } from "@/constants/api";
import { RootState } from "@/store/store";
import {
  getAccountById,
  getApplicationsByScholarship,
} from "@/services/ApiServices/accountService";
import AssignExpertDialog from "./assign-expert-dialog";
import ReviewingApplicationDialog from "./expert-reviewing-dialog";
import { getAllReviewMilestonesByScholarship } from "@/services/ApiServices/reviewMilestoneService";

import { format } from "date-fns";
import { getApplicationByApplicantIdAndScholarshipId } from "@/services/ApiServices/applicationService";
import ApplicationStatus from "@/constants/applicationStatus";
import { getAwardMilestoneByScholarship } from "@/services/ApiServices/awardMilestoneService";
import { formatDate } from "@/lib/date-formatter";
import AwardMilestoneDialog from "./award-milestone-dialog";

import {
  FaAward,
  FaBook,
  FaCalendarAlt,
  FaCertificate,
  FaCode,
  FaExclamationCircle,
  FaGraduationCap,
  FaInfoCircle,
  FaListAlt,
  FaMapMarkerAlt,
  FaTag,
  FaTrashAlt,
  FaTrophy,
  FaUniversity,
  FaUserAlt,
  FaUsers,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { notification } from "antd";
import { IoIosAddCircleOutline, IoIosEye } from "react-icons/io";
import { List, Paper, Tab, Tabs } from "@mui/material";
import {
  getAllScholarshipProgramExperts,
  removeExpertsFromScholarshipProgram,
} from "@/services/ApiServices/scholarshipProgramService";
import { getApplicantProfileById } from "@/services/ApiServices/applicantProfileService";

const ITEMS_PER_PAGE = 5;

const ScholarshipProgramDetail = () => {
  const { id } = useParams<{ id: string }>();
  const token = useSelector((state: RootState) => state.token.token);
  const [data, setData] = useState<ScholarshipProgramType | null>(null);
  const [authorized, setAuthorized] = useState<string | null>(null);
  const [_loading, setLoading] = useState<boolean>(true);
  const [reviewMilestoneLoading, setReviewMilestoneLoading] =
    useState<boolean>(true);
  const [applicationLoading, setApplicationLoading] = useState<boolean>(true);
  const [expertLoading, setExpertLoading] = useState<boolean>(true);

  const [_error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.token.user);
  const isApplicant = user?.role;

  const [applicants, setApplicants] = useState<any>(null);

  const [_experts, setExperts] = useState<any>(null);
  const [assignExpertDialogOpen, setAssignExpertDialogOpen] =
    useState<boolean>(false);

  const [reviewingDialogOpen, setReviewingDialogOpen] =
    useState<boolean>(false);
  const selectedExpert: any = null;

  const [reviewMilestones, setReviewMilestones] = useState<any>(null);

  const [existingApplication, setExistingApplication] = useState<any>(null);

  const [awardMilestones, setAwardMilestones] = useState<any>(null);
  const [extendBeforeDate, setExtendBeforeDate] = useState<string>("");

  const [awardMilestoneDialogOpen, setAwardMilestoneDialogOpen] =
    useState<boolean>(false);

  const [funderName, setFunderName] = useState<any>();

  const [selectedTab, setSelectedTab] = useState(0);
  const submittingApplications = applicants?.filter(
    (application: any) =>
      (application.status === "Submitted" ||
        application.status === "Rejected" ||
        application.status === "Reviewing") &&
      new Date(application.updatedAt) < new Date(data!.deadline)
  );

  const winnersApplications = applicants?.filter(
    (application: any) =>
      application.status === "Approved" ||
      application.status === "Awarded" ||
      application.status === "NeedExtend" ||
      new Date(application.updatedAt) > new Date(data!.deadline)
  );

  const statusColor: any = {
    Submitted: "blue",
    Awarded: "green",
    Approved: "green",
    Rejected: "red",
    NeedExtend: "yellow",
    Reviewing: "yellow",
  };

  const [currentTabPageForSubmitting, setCurrentTabPageForSubmitting] =
    useState(1);
  const [currentTabPageForWinners, setCurrentTabPageForWinners] = useState(1);
  const totalTabPagesForSubmitting = Math.ceil(
    submittingApplications?.length / ITEMS_PER_PAGE
  );
  const totalTabPagesForWinners = Math.ceil(
    winnersApplications?.length / ITEMS_PER_PAGE
  );

  const paginatedTabData =
    selectedTab === 0
      ? submittingApplications?.slice(
          (currentTabPageForSubmitting - 1) * ITEMS_PER_PAGE,
          currentTabPageForSubmitting * ITEMS_PER_PAGE
        )
      : winnersApplications?.slice(
          (currentTabPageForWinners - 1) * ITEMS_PER_PAGE,
          currentTabPageForWinners * ITEMS_PER_PAGE
        );

  const handleTabPageChange = (page: number) => {
    if (selectedTab === 0) {
      setCurrentTabPageForSubmitting(page);
    } else {
      setCurrentTabPageForWinners(page);
    }
  };

  const [currentPageExpert, setCurrentPageExpert] = useState<number>(1);
  const totalExpertPages = Math.ceil(_experts?.length / ITEMS_PER_PAGE);
  const paginatedExpert = _experts?.slice(
    (currentPageExpert - 1) * ITEMS_PER_PAGE,
    currentPageExpert * ITEMS_PER_PAGE
  );

  const handlePageExpertsChange = (page: number) => {
    setCurrentPageExpert(page);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/scholarship-programs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        setData(response.data.data);
        //console.log(response.data.data);
        const nameOfFunder = await getAccountById(response.data.data.funderId);
        setFunderName(nameOfFunder.username);
        setAuthorized(response.data.message);
        if (user) {
          const application = await getApplicationByApplicantIdAndScholarshipId(
            parseInt(user?.id),
            response.data.data.id
          );
          setExistingApplication(application.data);
          const award = await getAwardMilestoneByScholarship(
            response.data.data.id
          );
          await fetchApplicants(Number(id)),
            await fetchReviewMilestones(Number(id)),
            await fetchExpertsByScholarshipId();
          if (application.data[0].status == ApplicationStatus.NeedExtend) {
            award.data.forEach((milestone: any) => {
              if (
                new Date(milestone.fromDate) > new Date() ||
                new Date() > new Date(milestone.toDate)
              ) {
                return;
              }
              setExtendBeforeDate(milestone.fromDate);
            });
          }
        }
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchApplicants = async (scholarshipId: number) => {
    try {
      setApplicationLoading(true);
      const response = await getApplicationsByScholarship(scholarshipId);
      //console.log("fetchApplicant", response);
      if (response.statusCode === 200) {
        // Duyệt qua từng ứng viên và gọi API để lấy thông tin profile
        const applicantsWithFullName = await Promise.all(
          response.data.map(async (application: any) => {
            const applicantId = application.applicantId;

            // Gọi API getApplicantProfileById để lấy thông tin fullName
            const profileResponse = await getApplicantProfileById(applicantId);
            const fullName = profileResponse.data
              ? `${profileResponse.data.firstName} ${profileResponse.data.lastName}`
              : "Unknown Name";

            return {
              ...application, // Giữ nguyên các thuộc tính hiện có
              applicant: {
                ...application.applicant,
                fullName, // Gán fullName từ API
              },
            };
          })
        );

        setApplicants(applicantsWithFullName);
      } else {
        setError("Failed to get applicants");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setApplicationLoading(false);
    }
  };

  const fetchAwardMilestones = async (scholarshipId: number) => {
    try {
      const response = await getAwardMilestoneByScholarship(scholarshipId);
      //console.log(response);
      if (response.statusCode == 200) {
        setAwardMilestones(response.data);
      } else {
        setError("Failed to get award milestones");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpertsByScholarshipId = async () => {
    try {
      setExpertLoading(true);
      const response = await getAllScholarshipProgramExperts(Number(id));
      //console.log(response);
      if (response.statusCode == 200) {
        setExperts(response.data);
      } else {
        setError("Failed to get applicants");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setExpertLoading(false);
    }
  };

  const fetchReviewMilestones = async (scholarshipId: number) => {
    try {
      setReviewMilestoneLoading(true);
      const response = await getAllReviewMilestonesByScholarship(scholarshipId);
      //console.log(response);
      if (response.statusCode == 200) {
        setReviewMilestones(response.data);
      } else {
        setError("Failed to get applicants");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setReviewMilestoneLoading(false);
    }
  };

  const handleAssignExpertDialog = async () => {
    if (!data) return;

    setAssignExpertDialogOpen(true);
    setLoading(true);
    if (!data) return;
    //await fetchExpertsByScholarshipId();
    setLoading(false);
  };

  const handleOpenAwardMilestoneDialog = async () => {
    setAwardMilestoneDialogOpen(true);
    setLoading(true);
    if (!data) return;
    await fetchAwardMilestones(parseInt(data?.id));
    setLoading(false);
  };

  const handleRemoveExperts = async (expertId: string) => {
    try {
      const response = await removeExpertsFromScholarshipProgram(Number(id), [
        expertId,
      ]);

      if (response.statusCode === 200) {
        notification.success({
          message: "Success",
          description: "Remove expert successful",
        });
        fetchExpertsByScholarshipId();
      } else {
        throw new Error(`Unexpected status code: ${response.statusCode}`);
      }
    } catch (error) {
      console.error(error);

      notification.error({
        message: "Error",
        description: "Remove failed",
      });
    }
  };

  console.log("IMAGE", data?.imageUrl);

  if (!data) return <Spinner size="large" />;
  if (_loading) return <Spinner size="large" />;

  return (
    <div className="bg-white mb-10">
      <Breadcrumb className="p-10">
        <BreadcrumbList className="text-[#000]">
          <BreadcrumbItem>
            <Link to="/" className="md:text-xl text-lg font-medium">
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link
              to="/scholarship-program"
              className="md:text-xl text-lg font-medium"
            >
              Scholarship Program
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <p className="text-[#1eb2a6] md:text-xl text-lg font-semibold">
              {data.name}
            </p>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="bg-white px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="mx-auto rounded-md">
          <div className="max-w-[100%] mx-auto">
            <section className="w-full max-w-none flex flex-col lg:flex-row justify-between items-center mx-auto py-6 lg:py-6 gap-6 lg:gap-10">
              {/* Left Section */}
              <div className="flex flex-col lg:w-[70%] gap-6">
                <p className="text-[#000] text-3xl md:text-4xl lg:text-5xl font-bold text-center lg:text-left">
                  {data.name}
                </p>
                <img
                  // src={data.imageUrl}
                  src="https://wallpapers.com/images/hd/harvard-university-gilman-hall-q5t2pnf1jbwhg6hk.jpg"
                  className="w-[100%] h-[300px] sm:w-[100%] sm:h-[300px] lg:h-[500px] lg:w-[100%] bg-white object-cover rounded-md"
                  alt="Scholarship Image"
                />
              </div>

              {/* Right Section */}
              <div className="flex flex-col w-full lg:w-[30%] gap-4 text-black font-semibold">
                <p className="text-xl sm:text-2xl text-center lg:text-left">
                  Award per winner
                </p>
                <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 justify-center lg:justify-start">
                  <p className="text-[#1eb2a6] text-3xl sm:text-4xl">
                    ${data.scholarshipAmount.toLocaleString("en-US")}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-md text-base sm:text-lg font-medium ${
                      data.status === "Open"
                        ? "bg-green-100 text-green-700"
                        : data.status === "Closed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {data.status}
                  </span>
                </div>

                <p className="flex items-center text-sm sm:text-base">
                  <FaUserAlt color="#1eb2a6" className="mr-2" />
                  Funded by:{" "}
                  <span className="font-normal ml-2">{funderName}</span>
                </p>
                <p className="flex items-center text-sm sm:text-base">
                  <FaListAlt color="#1eb2a6" className="mr-2" />
                  Category:{" "}
                  <span className="font-normal ml-2">{data.category.name}</span>
                </p>
                <p className="flex items-center text-sm sm:text-base">
                  <FaAward color="#1eb2a6" className="mr-2" />
                  Number of awards:{" "}
                  <span className="font-normal ml-2">
                    {data.numberOfScholarships} scholarships
                  </span>
                </p>
                <p className="flex items-center text-sm sm:text-base">
                  <FaGraduationCap color="#1eb2a6" className="mr-2" />
                  Education Level:{" "}
                  <span className="font-normal ml-2">
                    {data.educationLevel}
                  </span>
                </p>
                <p className="flex items-center text-sm sm:text-base">
                  <FaCalendarAlt color="#1eb2a6" className="mr-2" />
                  Deadline:{" "}
                  <span className="font-normal ml-2">
                    {data.deadline
                      ? format(new Date(data.createdAt), "MM/dd/yyyy")
                      : "Not specified"}
                  </span>
                </p>

                <div>
                  {isApplicant == "Applicant" || !user ? (
                    <>
                      {existingApplication &&
                        existingApplication.length === 0 &&
                        data.status !== "FINISHED" &&
                        new Date(data.deadline) > new Date() && (
                          <Button
                            onClick={() =>
                              navigate(`/scholarship-program/${id}/application`)
                            }
                            className="text-lg lg:text-xl w-full h-full bg-[#1eb2a6] hover:bg-[#179d8f]"
                          >
                            Apply now
                          </Button>
                        )}
                      {existingApplication &&
                        existingApplication.length > 0 && (
                          <>
                            {existingApplication[0].status ===
                              ApplicationStatus.NeedExtend && (
                              <Button
                                onClick={() =>
                                  navigate(
                                    `/funder/application/${existingApplication[0].id}`
                                  )
                                }
                                className="text-lg lg:text-xl w-full bg-yellow-500 h-full"
                              >
                                Extend Application
                              </Button>
                            )}
                            {existingApplication[0].status ===
                              ApplicationStatus.Reviewing && (
                              <Button
                                disabled
                                className="text-lg lg:text-xl w-full h-full"
                              >
                                Already Applied
                              </Button>
                            )}
                          </>
                        )}
                    </>
                  ) : (
                    authorized !== "Unauthorized" &&
                    user.id === data.funderId && (
                      <div className="flex justify-between w-full gap-3">
                        <Button
                          onClick={() => handleOpenAwardMilestoneDialog()}
                          className="text-lg bg-[#1eb2a6] hover:bg-[#0d978b] w-full h-full flex items-center justify-center"
                        >
                          <FaTrophy className="mr-2" /> Award Milestones
                        </Button>
                      </div>
                    )
                  )}
                </div>
                <div>
                  {data.status === "FINISHED" && !existingApplication && (
                    <div className="h-20 max-w-4xl font-semibold text-xl text-center">
                      This scholarship has finished
                    </div>
                  )}
                  {existingApplication &&
                    existingApplication.length > 0 &&
                    existingApplication[0].status ===
                      ApplicationStatus.Reviewing &&
                    data.status !== "FINISHED" && (
                      <div className="h-20 max-w-4xl font-semibold text-xl text-center">
                        Your application is being reviewed
                      </div>
                    )}
                  {existingApplication &&
                    existingApplication.length > 0 &&
                    existingApplication[0].status ==
                      ApplicationStatus.Rejected && (
                      <div className="h-20 max-w-4xl font-semibold text-xl text-center">
                        Your application to this scholarship have not been
                        approved
                      </div>
                    )}
                  {existingApplication &&
                    existingApplication.length > 0 &&
                    existingApplication[0].status ==
                      ApplicationStatus.Approved && (
                      <div className="h-20 max-w-4xl font-semibold text-xl text-center">
                        You have won this scholarship
                      </div>
                    )}
                  {existingApplication &&
                    existingApplication.length > 0 &&
                    existingApplication[0].status ==
                      ApplicationStatus.NeedExtend && (
                      <div className="h-20 max-w-4xl font-semibold text-xl text-center">
                        You need to extend this scholarship before{" "}
                        {formatDate(extendBeforeDate)}
                      </div>
                    )}
                  {/* Add more application status blocks here if needed */}
                </div>
              </div>
            </section>
            <div className="">
              <div className="mb-6">
                {/* Header Section */}
                <div className="flex items-center mt-6">
                  <div className="bg-[#1eb2a6] w-1 h-[calc(1em+20px)] rounded-full mr-2"></div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    About this Scholarship
                  </h2>
                </div>

                {/* Content Section */}
                <div className="mt-6 p-4 sm:p-6 lg:p-8 gap-6">
                  <p className="text-gray-500 text-sm md:text-base lg:text-lg">
                    {data.description}
                  </p>
                </div>
              </div>

              <div className="h-[100%] mb-6">
                <div className="flex items-center mt-6">
                  <div className="bg-[#1eb2a6] w-1 h-[calc(1em+20px)] rounded-full mr-2"></div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    Requirements
                  </h2>
                </div>
                <div className="mt-6">
                  {data.criteria && data.criteria.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {data.criteria.map((criterion) => (
                        <div
                          key={criterion.name}
                          className="p-4 bg-gray-50 rounded-lg shadow-sm"
                        >
                          <div>
                            <p className="text-gray-700 font-bold text-md">
                              {criterion.name}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {criterion.description}
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
                </div>
              </div>

              <div>
                <div className="flex items-center mb-6">
                  <div className="bg-[#1eb2a6] w-1 h-[calc(1em+20px)] rounded-full mr-2"></div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    Details
                  </h2>
                </div>
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
                    {data?.major ? (
                      <Accordion
                        key={data.major.id}
                        sx={{
                          border: "none",
                          boxShadow: "none",
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`major-${data.major.id}-content`}
                          id={`major-${data.major.id}-header`}
                          className="bg-gray-100 hover:bg-gray-200 transition-all rounded-lg"
                        >
                          <h4 className="font-bold text-gray-700 flex items-center gap-2">
                            <FaBook className="text-gray-500" />
                            {data.major.name}
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
                                {data.major.description}
                              </p>
                            </div>
                          </div>

                          <div className="w-full">
                            <h5 className="font-bold text-gray-700 mb-3">
                              Skills:
                            </h5>

                            <div>
                              {data.major.skills.map((skill) => (
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
                              ))}
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
                    {data?.university ? (
                      <Accordion
                        key={data.university.id}
                        sx={{
                          border: "none",
                          boxShadow: "none",
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`university-${data.university.id}-content`}
                          id={`university-${data.university.id}-header`}
                          className="bg-gray-100 hover:bg-gray-200 transition-all rounded-lg"
                        >
                          <div className="flex flex-col">
                            <h4 className="font-bold text-gray-700 flex items-center gap-2">
                              <FaUniversity className="text-gray-500" />
                              {data.university.name}
                            </h4>
                            <span className="text-gray-600 flex items-center gap-1">
                              <FaMapMarkerAlt className="text-gray-400" />
                              {data.university.city}
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
                                {data.university.description}
                              </p>
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    ) : (
                      <p className="text-gray-600 italic">
                        No applicable universities available at the moment.
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
                    {data.certificates && data.certificates.length > 0 ? (
                      data.certificates.map((certificate) => (
                        <Accordion
                          key={certificate.id}
                          className="mt-4"
                          sx={{
                            border: "none",
                            boxShadow: "none",
                          }}
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
                                {certificate.name}
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
                                    {certificate.description}
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
                                    {certificate.type}
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

        <br></br>
        <br></br>

        {isApplicant == "Funder" && data.funderId == user.id && (
          <div className="mt-6">
            <div className="mx-auto mt-6">
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
                {reviewMilestoneLoading ? (
                  <Spinner />
                ) : !reviewMilestones || reviewMilestones.length === 0 ? (
                  <p className="p-10 text-center text-gray-500 font-semibold text-xl">
                    No review milestones for this scholarship
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {reviewMilestones.map((milestone: any) => (
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
                              {format(new Date(milestone.toDate), "MM/dd/yyyy")}
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

            <br></br>
            <br></br>

            <div className="mx-auto mt-6">
              <div className="mb-6 px-4 sm:px-6 xl:px-0">
                <div className="relative flex items-center gap-3">
                  <div className="p-2 bg-[#1eb2a6] rounded-full">
                    <FaUsers className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    Applied Applicants
                  </h2>
                  {Array.isArray(applicants) && applicants.length !== 0 && (
                    <button
                      onClick={() =>
                        navigate(`/funder/choose-winners/${data.id}`)
                      }
                      className="flex mr-6 items-center gap-3 bg-blue-500 text-white hover:bg-[#1eb2a6] hover:text-white transition-all duration-300 px-5 py-2 rounded-lg shadow-md active:scale-95 ml-auto"
                    >
                      <IoIosAddCircleOutline className="text-2xl" />
                      <span className="text-lg font-medium">
                        Choose Winners
                      </span>
                    </button>
                  )}
                </div>
                <div className="bg-[#1eb2a6] w-12 h-1 rounded-full mt-3 transition-all duration-300 ease-in-out"></div>
              </div>

              {/* Tabs */}
              <Tabs
                value={selectedTab}
                onChange={(_, newValue) => setSelectedTab(newValue)}
                aria-label="Applications Tabs"
                className="bg-white shadow-sm"
                indicatorColor="primary"
                textColor="inherit"
                centered
              >
                <Tab
                  label="Submitting Applications"
                  sx={{
                    textTransform: "none",
                    color: "blue",
                    fontWeight: "bold",
                  }}
                />
                <Tab
                  label="Winners Applications"
                  sx={{
                    textTransform: "none",
                    color: "green",
                    fontWeight: "bold",
                  }}
                />
              </Tabs>

              {/* Paper */}
              <Paper
                elevation={3}
                style={{
                  padding: "20px",
                  borderRadius: "10px",
                  backgroundColor: "#fafafa",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Table Header */}
                <div
                  style={{
                    display: "flex",
                    fontWeight: "bold",
                    backgroundColor: "#f1f1f1",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 0.5 }}>No</div>
                  <div style={{ flex: 1 }}>Avatar</div>
                  <div style={{ flex: 1 }}>Name</div>
                  <div style={{ flex: 1 }}>Status</div>
                  <div style={{ flex: 1 }}>Applied At</div>
                  <div style={{ flex: 1 }}>Actions</div>
                </div>

                {/* Applicants List */}
                {applicationLoading ? (
                  <Spinner />
                ) : paginatedTabData?.length > 0 ? (
                  paginatedTabData.map((app: any, index: number) => (
                    <div
                      key={app.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#f9f9f9",
                        padding: "10px",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e3f2fd")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f9f9f9")
                      }
                    >
                      {/* Cột số thứ tự */}
                      <div style={{ flex: 0.5 }}>{index + 1}</div>

                      <div style={{ flex: 1 }}>
                        <img
                          src={
                            app.applicant.avatarUrl ||
                            "/path/to/default-avatar.jpg"
                          }
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid #0369a1",
                          }}
                        />
                      </div>

                      {/* Cột tên ứng viên */}
                      <div style={{ flex: 1 }}>{app.applicant.fullName}</div>

                      {/* Cột status */}
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span className="relative flex justify-center items-center gap-2">
                          {/* Hiệu ứng nhấp nháy */}
                          <span className="relative flex h-3 w-3">
                            <span
                              className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${
                                statusColor[app.status]
                              }-500 opacity-75`}
                            ></span>
                            <span
                              className={`relative inline-flex rounded-full h-3 w-3 bg-${
                                statusColor[app.status]
                              }-500`}
                            ></span>
                          </span>

                          {/* Tên trạng thái */}
                          <span
                            className={`text-${
                              statusColor[app.status]
                            }-500 font-medium`}
                          >
                            {app.status}
                          </span>
                        </span>
                      </div>

                      {/* Cột ngày nộp */}
                      <div style={{ flex: 1 }}>
                        {app.appliedDate
                          ? format(new Date(app.appliedDate), "MM/dd/yyyy")
                          : "N/A"}
                      </div>

                      {/* Cột actions */}
                      <div style={{ flex: 1 }}>
                        <Button
                          onClick={() =>
                            navigate(`/funder/application/${app.id}`)
                          }
                          style={{
                            backgroundColor: "#1e88e5",
                            color: "#fff",
                            padding: "6px 12px",
                            borderRadius: "5px",
                          }}
                        >
                          <IoIosEye style={{ marginRight: "8px" }} />
                          View application
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 font-semibold">
                    No applicants available.
                  </p>
                )}
                <div
                  style={{
                    marginTop: "20px",
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  {selectedTab === 0
                    ? Array.from(
                        { length: totalTabPagesForSubmitting },
                        (_, index) => (
                          <button
                            key={index}
                            onClick={() => handleTabPageChange(index + 1)}
                            style={{
                              margin: "0 5px",
                              padding: "5px 10px",
                              backgroundColor:
                                currentTabPageForSubmitting === index + 1
                                  ? "#419f97"
                                  : "#f1f1f1",
                              color:
                                currentTabPageForSubmitting === index + 1
                                  ? "white"
                                  : "black",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                          >
                            {index + 1}
                          </button>
                        )
                      )
                    : Array.from(
                        { length: totalTabPagesForWinners },
                        (_, index) => (
                          <button
                            key={index}
                            onClick={() => handleTabPageChange(index + 1)}
                            style={{
                              margin: "0 5px",
                              padding: "5px 10px",
                              backgroundColor:
                                currentTabPageForWinners === index + 1
                                  ? "#419f97"
                                  : "#f1f1f1",
                              color:
                                currentTabPageForWinners === index + 1
                                  ? "white"
                                  : "black",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                          >
                            {index + 1}
                          </button>
                        )
                      )}
                </div>
              </Paper>
            </div>

            <br></br>
            <br></br>

            <div className="mx-auto mt-6">
              <div className="mb-6 px-4 sm:px-6 xl:px-0">
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1eb2a6] rounded-full">
                      <FaCalendarAlt className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                      Expert List
                    </h2>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        navigate(`/funder/add-expert-to-scholarship/${id}`)
                      }
                      className="flex items-center gap-3 bg-blue-500 text-white hover:bg-[#1eb2a6] hover:text-white transition-all duration-300 px-5 py-2 rounded-lg shadow-md active:scale-95"
                    >
                      <IoIosAddCircleOutline className="text-2xl" />
                      <span className="text-lg font-medium">
                        Invite Experts
                      </span>
                    </button>

                    <button
                      onClick={() => handleAssignExpertDialog()}
                      className="flex items-center gap-3 bg-blue-500 text-white hover:bg-[#1eb2a6] hover:text-white transition-all duration-300 px-5 py-2 rounded-lg shadow-md active:scale-95"
                    >
                      <IoIosAddCircleOutline className="text-2xl" />
                      <span className="text-lg font-medium">
                        Assign Experts
                      </span>
                    </button>
                  </div>
                </div>
                <div className="bg-[#1eb2a6] w-12 h-1 rounded-full mt-3 transition-all duration-300 ease-in-out"></div>
              </div>

              {/* Experts Section */}
              <Paper
                elevation={3}
                style={{
                  padding: "20px",
                  borderRadius: "10px",
                  backgroundColor: "#fafafa",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontWeight: "bold",
                    backgroundColor: "#f1f1f1",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: "1 1 100px" }}>No</div>
                  <div style={{ flex: "1 1 100px" }}>Avatar</div>
                  <div style={{ flex: "1 1 150px" }}>Name</div>
                  <div style={{ flex: "1 1 200px" }}>Email</div>
                  <div style={{ flex: "1 1 150px" }}>Phone</div>
                  <div style={{ flex: "1 1 250px" }}>Major</div>
                  <div style={{ flex: "1 1 100px" }}>Action</div>
                </div>

                {/* Expert Cards */}
                {expertLoading ? (
                  <Spinner />
                ) : (
                  paginatedExpert?.map((expert: any, index: any) => (
                    <div
                      key={expert.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#f9f9f9",
                        padding: "10px",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        transition: "background-color 0.3s ease",
                        flexWrap: "wrap",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e3f2fd")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f9f9f9")
                      }
                    >
                      <div style={{ flex: "1 1 100px" }}>
                        {(currentPageExpert - 1) * ITEMS_PER_PAGE + index + 1}
                      </div>
                      <div style={{ flex: "1 1 100px" }}>
                        <img
                          src={
                            expert.avatarUrl || "/path/to/default-avatar.jpg"
                          }
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid #0369a1",
                          }}
                        />
                      </div>
                      <div style={{ flex: "1 1 150px" }}>
                        <span style={{ fontWeight: "bold", color: "#0369a1" }}>
                          {expert.name}
                        </span>
                      </div>
                      <div style={{ flex: "1 1 200px" }}>
                        <span style={{ fontWeight: "bold", color: "#0369a1" }}>
                          {expert.email}
                        </span>
                      </div>
                      <div style={{ flex: "1 1 150px" }}>
                        <span style={{ fontWeight: "bold", color: "#0369a1" }}>
                          {expert.phoneNumber}
                        </span>
                      </div>
                      <div style={{ flex: "1 1 250px" }}>
                        <span style={{ fontWeight: "bold", color: "#0369a1" }}>
                          {expert.major || "N/a"}
                        </span>
                      </div>
                      <div style={{ flex: "1 1 100px" }}>
                        <FaTrashAlt
                          style={{
                            cursor: "pointer",
                            color: "#e57373",
                            fontSize: "1.5rem",
                          }}
                          onClick={() => handleRemoveExperts(expert.expertId)}
                        />
                      </div>
                    </div>
                  ))
                )}

                {/* Pagination */}
                <div
                  style={{
                    marginTop: "20px",
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  {Array.from({ length: totalExpertPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageExpertsChange(index + 1)}
                      style={{
                        margin: "0 5px",
                        padding: "5px 10px",
                        backgroundColor:
                          currentPageExpert === index + 1
                            ? "#419f97"
                            : "#f1f1f1",
                        color:
                          currentPageExpert === index + 1 ? "white" : "black",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </Paper>
            </div>
          </div>
        )}
      </section>

      {authorized != "Unauthorized" && assignExpertDialogOpen && (
        <AssignExpertDialog
          open={assignExpertDialogOpen}
          onClose={() => setAssignExpertDialogOpen(false)}
          scholarshipId={id}
        />
      )}

      {authorized != "Unauthorized" && data && (
        <AwardMilestoneDialog
          open={awardMilestoneDialogOpen}
          onClose={(open: boolean) => setAwardMilestoneDialogOpen(open)}
          awardMilestones={awardMilestones ?? []}
          reviewMilestones={reviewMilestones ?? []}
          scholarship={data}
          fetchAwardMilestones={async () => {
            if (!data) return;
            await fetchAwardMilestones(parseInt(data?.id));
          }}
        />
      )}
      {authorized != "Unauthorized" && data && (
        <ReviewingApplicationDialog
          open={reviewingDialogOpen}
          onClose={(open: boolean) => setReviewingDialogOpen(open)}
          expert={selectedExpert}
          fetchApplications={async () => {
            if (!selectedExpert) return;
            const response = await axios.get(
              `${BASE_URL}/api/experts/${selectedExpert.id}/assigned-applications`
            );
            return response.data.data || [];
          }}
        />
      )}
    </div>
  );
};

export default ScholarshipProgramDetail;
