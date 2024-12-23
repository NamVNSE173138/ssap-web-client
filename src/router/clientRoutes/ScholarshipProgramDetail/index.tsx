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
import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchoolLogo from "./logo";
import { useSelector } from "react-redux";
import RouteNames from "@/constants/routeNames";
import { BASE_URL } from "@/constants/api";
import { RootState } from "@/store/store";
import AccountDialog from "./applicant-dialog";
import { getApplicationsByScholarship } from "@/services/ApiServices/accountService";
import { getAllExperts } from "@/services/ApiServices/expertService";
import AssignExpertDialog from "./assign-expert-dialog";
import ReviewMilestoneDialog from "./review-milestone-dialog";
import ReviewingApplicationDialog from "./expert-reviewing-dialog";
import { getAllReviewMilestonesByScholarship } from "@/services/ApiServices/reviewMilestoneService";

import { format } from "date-fns";
import {
  deleteApplication,
  getApplicationByApplicantIdAndScholarshipId,
} from "@/services/ApiServices/applicationService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";

import AwardDialog from "./award-dialog";
import ApplicationStatus from "@/constants/applicationStatus";
import { getAwardMilestoneByScholarship } from "@/services/ApiServices/awardMilestoneService";
import { formatDate } from "@/lib/date-formatter";
import AwardMilestoneDialog from "./award-milestone-dialog";

import {
  FaAward,
  FaBook,
  FaCalendarAlt,
  FaCertificate,
  FaCheckCircle,
  FaClipboardList,
  FaCode,
  FaCreditCard,
  FaDollarSign,
  FaExclamationCircle,
  FaEye,
  FaGraduationCap,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaRegListAlt,
  FaRocket,
  FaTag,
  FaTrash,
  FaTrophy,
  FaUniversity,
  FaUserTie,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { notification } from "antd";
import AccelaratePhaseDialog from "./accelarate-phase";

const ScholarshipProgramDetail = () => {
  const { id } = useParams<{ id: string }>();
  const token = useSelector((state: RootState) => state.token.token);
  const [data, setData] = useState<ScholarshipProgramType | null>(null);
  const [authorized, setAuthorized] = useState<string | null>(null);
  const [_loading, setLoading] = useState<boolean>(true);
  const [_error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.token.user);
  const isApplicant = user?.role;

  const [applicants, setApplicants] = useState<any>(null);
  const [applicantDialogOpen, setApplicantDialogOpen] =
    useState<boolean>(false);

  const [_experts, setExperts] = useState<any>(null);
  const [assignExpertDialogOpen, setAssignExpertDialogOpen] =
    useState<boolean>(false);

  const [reviewingDialogOpen, setReviewingDialogOpen] =
    useState<boolean>(false);
  // const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const selectedExpert: any = null;

  const [reviewMilestones, setReviewMilestones] = useState<any>(null);
  const [reviewMilestoneDialogOpen, setReviewMilestoneDialogOpen] =
    useState<boolean>(false);

  const [winningApplications, setWinningApplications] = useState<any>(null);
  const [awardDialogOpen, setAwardDialogOpen] = useState<boolean>(false);
  // const [reviewingDialogOpen, setReviewingDialogOpen] = useState<boolean>(false);

  const [existingApplication, setExistingApplication] = useState<any>(null);

  const [awardMilestones, setAwardMilestones] = useState<any>(null);
  const [extendBeforeDate, setExtendBeforeDate] = useState<string>("");

  const [awardMilestoneDialogOpen, setAwardMilestoneDialogOpen] =
    useState<boolean>(false);

  const [accelaratePhaseDialogOpen, setAccelaratePhaseDialogOpen] =
    useState<boolean>(false);

  const [cancelLoading, setCancelLoading] = useState<boolean>(false);

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
        console.log(response.data.data);

        setAuthorized(response.data.message);
        if (user) {
          // <!--           const application = await getApplicationByApplicantIdAndScholarshipId(
          //             parseInt(user?.id),
          //             response.data.data.id
          //           );
          //           setExistingApplication(application.data); -->

          const application = await getApplicationByApplicantIdAndScholarshipId(
            parseInt(user?.id),
            response.data.data.id
          );
          setExistingApplication(application.data);
          const award = await getAwardMilestoneByScholarship(
            response.data.data.id
          );
          //setAwardMilestones(award.data.find((milestone: any) => new Date(milestone.fromDate) < new Date() && new Date(milestone.toDate) > new Date()));
          //console.log(application.data);

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
      const response = await getApplicationsByScholarship(scholarshipId);
      console.log("fetchApplicant", response);
      if (response.statusCode == 200) {
        setApplicants(response.data);
      } else {
        setError("Failed to get applicants");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
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

  const fetchExperts = async () => {
    try {
      const response = await getAllExperts();
      //console.log(response);
      if (response.statusCode == 200) {
        setExperts(response.data);
      } else {
        setError("Failed to get applicants");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewMilestones = async (scholarshipId: number) => {
    try {
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
      setLoading(false);
    }
  };

  const fetchWinningApplications = async (scholarshipId: number) => {
    try {
      const response = await getApplicationsByScholarship(scholarshipId);
      //console.log(response);
      if (response.statusCode == 200) {
        //  setWinningApplications(
        //   response.data.filter(
        //    (application: any) => application.status === "APPROVED"
        //   )
        //);

        setWinningApplications(
          response.data.filter(
            (application: any) =>
              application.status === ApplicationStatus.Approved ||
              application.status === ApplicationStatus.Awarded ||
              application.status === ApplicationStatus.NeedExtend ||
              new Date(application.updatedAt) > new Date(data!.deadline)
          )
        );
      } else {
        setError("Failed to get applicants");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignExpertDialog = async () => {
    if (!data) return;
    if (new Date(data?.deadline) > new Date()) {
      notification.error({ message: "You can not assign before deadline" });
      return;
    }
    setAssignExpertDialogOpen(true);
    setLoading(true);
    if (!data) return;
    await fetchExperts();
    setLoading(false);
  };

  const handleOpenApplicantDialog = async () => {
    setApplicantDialogOpen(true);
    setLoading(true);
    if (!data) return;
    await fetchApplicants(parseInt(data?.id));
    setLoading(false);
  };

  const handleOpenReviewMilestoneDialog = async () => {
    setReviewMilestoneDialogOpen(true);
    setLoading(true);
    if (!data) return;
    await fetchReviewMilestones(parseInt(data?.id));
    await fetchAwardMilestones(parseInt(data?.id));
    setLoading(false);
  };

  const handleOpenAwardMilestoneDialog = async () => {
    setAwardMilestoneDialogOpen(true);
    setLoading(true);
    if (!data) return;
    await fetchAwardMilestones(parseInt(data?.id));
    setLoading(false);
  };

  const handleOpenAwardDialog = async () => {
    setAwardDialogOpen(true);
    setLoading(true);
    if (!data) return;
    await fetchWinningApplications(parseInt(data?.id));
    setLoading(false);
  };

  const handleOpenAccelarateDialog = async () => {
    setAccelaratePhaseDialogOpen(true);
    setLoading(true);
    if (!data) return;
    //await fetchWinningApplications(parseInt(data?.id));
    setLoading(false);
  };

  // const handleOpenReviewingDialog = async () => {
  //   setSelectedExpert(experts);
  //   setReviewingDialogOpen(true);
  // };

  const cancelApplication = async () => {
    try {
      if (!existingApplication[0]) return;
      setCancelLoading(true);
      const response = await deleteApplication(existingApplication[0].id);
      if (response) {
        await fetchData();
      } else {
        setError("Failed to delete scholarship");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
      setCancelLoading(false);
    }
  };

  const deleteScholarship = async () => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/scholarship-programs/${id}`
      );
      if (response.data.statusCode == 200) {
        setData(response.data.data);
        navigate(RouteNames.ACTIVITY);
      } else {
        setError("Failed to delete scholarship");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  console.log("IMAGE", data?.imageUrl);

  if (!data) return <Spinner size="large" />;

  return (
    <div>
      <div className="relative">
        <ScholarshipProgramBackground />
        <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-between items-start p-[40px]  z-10">
          <div className="">
            <Breadcrumb className="">
              <BreadcrumbList className="text-[#000]">
                <BreadcrumbItem>
                  <Link to="/" className="md:text-xl text-lg">
                    Home
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    to="/scholarship-program"
                    className=" text-[#000] md:text-xl font-medium text-lg"
                  >
                    Scholarship Program
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <p className="text-[#000] md:text-xl text-lg font-semibold">
                    {data.name}
                  </p>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="">
            <div className="lg:flex-row items-center lg:items-center flex-row flex gap-[20px] lg:gap-[25px] ">
              <SchoolLogo
                imageUrl={data.imageUrl || "https://github.com/shadcn.png"}
              />
              <div>
                <p className="text-[#000] text-3xl md:text-4xl lg:text-5xl  lg:line-clamp-3 line-clamp-5 font-medium">
                  {data.name}
                </p>
                <p className="text-[#000] text-xl md:text-2xl lg:text-3xl text-heading-5 hidden lg:block mt-[12px]">
                  {data.description.length > 50
                    ? `${data.description.substring(0, 50)}...`
                    : data.description}
                </p>
              </div>
              
            </div>
            <span className="flex justify-start ps-5 pt-5 gap-2 items-center">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 bg-green-500`}></span>
                </span>
                <span className={`text-green-500 text-2xl font-medium`}>
                    {data.status}
                </span>
              </span>


            <div className="text-white text-center flex flex-wrap h-[40px] lg:h-[50px] mt-[26px] w-full">
              {isApplicant == "Applicant" || !user ? (
                <>
                  {existingApplication &&
                    existingApplication.length == 0 &&
                    data.status != "FINISHED" &&
                    new Date(data.deadline) > new Date() && (
                      <Button
                        onClick={() =>
                          navigate(`/scholarship-program/${id}/application`)
                        }
                        className="flex-1 text-lg lg:text-xl w-full h-full bg-[#1eb2a6] hover:bg-[#179d8f] "
                      >
                        Apply now{" "}
                      </Button>
                    )}

                  {existingApplication && existingApplication.length > 0 && (
                    <>
                      <Button
                        onClick={() =>
                          navigate(
                            `/funder/application/${existingApplication[0].id}`
                          )
                        }
                        className="flex-1 text-xl w-full bg-[#1eb2a6] hover:bg-[#0d978b] h-full mr-3"
                      >
                        View applications{" "}
                      </Button>
                      {existingApplication[0].status ==
                        ApplicationStatus.NeedExtend && (
                          <Button
                            onClick={() =>
                              navigate(
                                `/funder/application/${existingApplication[0].id}`
                              )
                            }
                            className="flex-1 text-xl w-full bg-yellow-500 h-full mr-3"
                          >
                            Extend Application{" "}
                          </Button>
                        )}

                      {/*JSON.stringify(awardMilestones)*/}
                      {existingApplication[0].status ==
                        ApplicationStatus.Submitted &&
                        new Date(existingApplication[0].updatedAt) <
                        new Date(data.deadline) && (
                          <AlertDialog>
                            <AlertDialogTrigger
                              className="flex-1 text-xl w-full h-full bg-transparent border text-red-700 hover:bg-red-800 hover:text-white border-red-700 rounded-[5px] cursor-pointer flex justify-center items-center"
                              disabled={cancelLoading}
                            >
                              {cancelLoading ? (
                                <div
                                  className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin"
                                  aria-hidden="true"
                                ></div>
                              ) : (
                                <span>Cancel applications </span>
                              )}
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  You wanna cancel your application?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cancel will delete your application.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>No</AlertDialogCancel>
                                <AlertDialogAction onClick={cancelApplication}>
                                  Yes
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                    </>
                  )}
                </>
              ) : (
                authorized != "Unauthorized" &&
                user.id == data.funderId && (
                  <div className="flex justify-between w-full gap-3">
                    <Button
                      onClick={() => handleOpenApplicantDialog()}
                      className="flex-1 text-lg bg-[#1eb2a6] hover:bg-[#0d978b] w-full h-full flex items-center justify-center"
                    >
                      <FaEye className="mr-2" /> View Applications
                    </Button>
                    <Button
                      onClick={() => handleAssignExpertDialog()}
                      className="flex-1 text-lg bg-[#1eb2a6] hover:bg-[#0d978b] w-full h-full flex items-center justify-center"
                    >
                      <FaUserTie className="mr-2" /> Assign Expert
                    </Button>
                    <Button
                      onClick={() => handleOpenAccelarateDialog()}
                      className="flex-1 text-lg bg-[#1eb2a6] hover:bg-[#0d978b] w-full h-full flex items-center justify-center"
                    >
                      <FaRocket className="mr-2" /> Accelarate Phase
                    </Button>
                    <Button
                      onClick={() => handleOpenReviewMilestoneDialog()}
                      className="flex-1 text-lg bg-[#1eb2a6] hover:bg-[#0d978b] w-full h-full flex items-center justify-center"
                    >
                      <FaCheckCircle className="mr-2" /> Review Milestones
                    </Button>
                    <Button
                      onClick={() => handleOpenAwardMilestoneDialog()}
                      className="flex-1 text-lg bg-[#1eb2a6] hover:bg-[#0d978b] w-full h-full flex items-center justify-center"
                    >
                      <FaTrophy className="mr-2" /> Award Milestones
                    </Button>
                    <Button
                      onClick={() => handleOpenAwardDialog()}
                      className="flex-1 text-lg bg-[#1eb2a6] hover:bg-[#0d978b] w-full h-full flex items-center justify-center"
                    >
                      <FaTrophy className="mr-2" /> Award Progress
                    </Button>
                    {/* <Button
                      onClick={() => handleOpenReviewingDialog()}
                      className="flex-1 text-lg bg-blue-700 hover:bg-blue-600 w-full h-full flex items-center justify-center"
                    >
                      <FaTrophy className="mr-2" /> Expert Reviewing
                    </Button> */}
                    <Button
                      onClick={deleteScholarship}
                      className="flex-1 text-lg bg-transparent text-red-700 border border-red-700 hover:bg-red-800 hover:text-white w-full h-full  flex items-center justify-center"
                    >
                      <FaTrash className="mr-2" /> Delete
                    </Button>
                  </div>
                )
              )}
            </div>

            {data.status == "FINISHED" && (
              <div className="text-xl font-semibold mr-3">
                This scholarship has finished
              </div>
            )}
            {existingApplication &&
              existingApplication.length > 0 &&
              existingApplication[0].status == ApplicationStatus.Submitted &&
              data.status != "FINISHED" && (
                <div className="text-xl font-semibold mr-3">
                  Your application is being reviewed
                </div>
              )}
            {existingApplication &&
              existingApplication.length > 0 &&
              existingApplication[0].status == ApplicationStatus.Rejected && (
                <div className="text-xl font-semibold mr-3">
                  Your application to this scholarship have not been approved
                </div>
              )}
            {existingApplication &&
              existingApplication.length > 0 &&
              existingApplication[0].status == ApplicationStatus.Approved && (
                <div className="text-xl font-semibold mr-3">
                  You have won this scholarship
                </div>
              )}
            {existingApplication &&
              existingApplication.length > 0 &&
              existingApplication[0].status == ApplicationStatus.NeedExtend && (
                <div className="text-xl font-semibold mr-3">
                  You need to extend this scholarship before{" "}
                  {formatDate(extendBeforeDate)}
                </div>
              )}
          </div>
        </div>
      </div>
      <div className="bg-white lg:bg-white drop-shadow-[0_0_5px_rgba(0,0,0,0.1)] lg:drop-shadow-[0_5px_25px_rgba(0,0,0,0.05)] relative">
        <section className="w-full max-w-none flex justify-between items-center mx-auto py-6 lg:py-10 px-4 lg:px-0">
          <div className="flex w-full justify-around gap-12">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-[#1eb2a6] text-xl" />
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-500">Location</p>
                <p className="text-lg font-semibold text-gray-800">
                  {"VietNam"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaGraduationCap className="text-[#1eb2a6] text-xl" />
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-500">
                  Qualification
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {data.category.description || "Not specified"}
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
                <p className="text-sm font-semibold text-gray-500">Created At</p>
                <p className="text-lg font-semibold text-gray-800">
                  {data.deadline
                    ? format(new Date(data.createdAt), "MM/dd/yyyy")
                    : "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-[#1eb2a6] text-xl" />
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-500">Deadline</p>
                <p className="text-lg font-semibold text-gray-800">
                  {data.deadline
                    ? format(new Date(data.deadline), "MM/dd/yyyy")
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
                  {data.scholarshipAmount || "Not specified"}$
                </p>
              </div>
            </div>
          </div>
        </section>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              style={{ transform: "translateX(50px)" }}>
              {/* Cột bên trái */}
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
                            <Link to="" className="text-blue-500 hover:underline">
                              {data.name}
                            </Link>
                          </div>
                          <div className="md:w-[48%] w-full bg-gray-50 p-4 rounded-lg shadow-sm">
                            <p className="text-gray-700 font-bold flex items-center gap-2">
                              <FaInfoCircle className="text-gray-500" />
                              Funding details:
                            </p>
                            <span>{data.description}</span>
                          </div>
                        </div>

                        {/* Qualification & Number of awards */}
                        <div className="flex gap-4 flex-wrap justify-between mb-6">
                          <div className="md:w-[48%] w-full bg-gray-50 p-4 rounded-lg shadow-sm">
                            <p className="text-gray-700 font-bold flex items-center gap-2">
                              <FaDollarSign className="text-gray-500" />
                              Value of Award:
                            </p>
                            <span>{data.scholarshipAmount}$</span>
                          </div>
                          <div className="md:w-[48%] w-full bg-gray-50 p-4 rounded-lg shadow-sm">
                            <p className="text-gray-700 font-bold flex items-center gap-2">
                              <FaRegListAlt className="text-gray-500" />
                              Number of awards available:
                            </p>
                            <span>{data.numberOfScholarships}</span>
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
                      <AccordionDetails className="bg-white p-6 rounded-b-lg shadow-lg">
                        {/* Category Name */}
                        <div className="w-full flex items-start gap-3 mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                          <FaInfoCircle className="text-gray-400 text-2xl mt-1" />
                          <div>
                            <p className="text-gray-700 font-bold">
                              Category Name:
                            </p>
                            <p className="text-gray-600">{data.category.name}</p>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="w-full flex items-start gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
                          <FaInfoCircle className="text-gray-400 text-2xl mt-1" />
                          <div>
                            <p className="text-gray-700 font-bold">Description:</p>
                            <p className="text-gray-600">
                              {data.category.description}
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

                      <AccordionDetails className="bg-white p-6 rounded-b-lg shadow-lg">
                        {data?.major ? (
                          <Accordion key={data.major.id}>
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

                      <AccordionDetails className="bg-white p-6 rounded-b-lg shadow-lg">
                        {data?.university ? (
                          <Accordion key={data.university.id}>
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
                      <AccordionDetails className="bg-white p-6 rounded-b-lg shadow-lg">
                        {data.certificates && data.certificates.length > 0 ? (
                          data.certificates.map((certificate) => (
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

          </div>
        </div>
      </section>

      {authorized != "Unauthorized" && (
        <AccountDialog
          open={applicantDialogOpen}
          onClose={() => setApplicantDialogOpen(false)}
          applications={applicants ?? []}
          scholarship={data}
        />
      )}
      {authorized != "Unauthorized" && (
        <AssignExpertDialog
          open={assignExpertDialogOpen}
          onClose={() => setAssignExpertDialogOpen(false)}
          // resetMajor={null}
          // experts={experts ?? []}
          scholarshipId={id}
        />
      )}
      {authorized != "Unauthorized" && (
        <ReviewMilestoneDialog
          open={reviewMilestoneDialogOpen}
          onClose={(open: boolean) => setReviewMilestoneDialogOpen(open)}
          scholarship={data}
          awardMilestones={awardMilestones ?? []}
          reviewMilestones={reviewMilestones ?? []}
          fetchReviewMilestones={async () => {
            if (!data) return;
            await fetchReviewMilestones(parseInt(data?.id));
          }}
        />
      )}
      {authorized != "Unauthorized" && (
        <AwardDialog
          isOpen={awardDialogOpen}
          setIsOpen={(open: boolean) => setAwardDialogOpen(open)}
          winningApplications={winningApplications ?? []}
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
      {authorized != "Unauthorized" && (
        <AccelaratePhaseDialog
          isOpen={accelaratePhaseDialogOpen}
          setIsOpen={(open: boolean) => setAccelaratePhaseDialogOpen(open)}
          //winningApplications={winningApplications ?? []}
        />
      )}
    </div>
  );
};

export default ScholarshipProgramDetail;
