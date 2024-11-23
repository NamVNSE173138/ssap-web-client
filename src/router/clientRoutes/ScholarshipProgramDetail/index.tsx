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
import { getAllReviewMilestonesByScholarship } from "@/services/ApiServices/reviewMilestoneService";
import { format } from 'date-fns';
import { deleteApplication, getApplicationByApplicantIdAndScholarshipId } from "@/services/ApiServices/applicationService";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '../../../components/ui/alert-dialog';;
import { AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import AwardDialog from "./award-dialog";
import ApplicationStatus from "@/constants/applicationStatus";
import { getAwardMilestoneByScholarship } from "@/services/ApiServices/awardMilestoneService";
import { formatDate, formatOnlyDate } from "@/lib/date-formatter";
import { FaAward, FaBook, FaCalendarAlt, FaCertificate, FaCheckCircle, FaCode, FaCreditCard, FaDollarSign, FaEdit, FaEye, FaGraduationCap, FaInfoCircle, FaMapMarkerAlt, FaMoneyBillWave, FaRegListAlt, FaTag, FaTrash, FaTrophy, FaUniversity, FaUserTie } from "react-icons/fa";


const ScholarshipProgramDetail = () => {
  const { id } = useParams<{ id: string }>();
  const token = useSelector((state: RootState) => state.token.token);
  const [data, setData] = useState<ScholarshipProgramType | null>(null);
  const [authorized, setAuthorized] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.token.user);
  const isApplicant = user?.role;

  const [applicants, setApplicants] = useState<any>(null);
  const [applicantDialogOpen, setApplicantDialogOpen] =
    useState<boolean>(false);

  const [experts, setExperts] = useState<any>(null);
  const [assignExpertDialogOpen, setAssignExpertDialogOpen] =
    useState<boolean>(false);

  const [reviewMilestones, setReviewMilestones] = useState<any>(null);
  const [reviewMilestoneDialogOpen, setReviewMilestoneDialogOpen] =
    useState<boolean>(false);

  const [winningApplications, setWinningApplications] = useState<any>(null);
  const [awardDialogOpen, setAwardDialogOpen] = useState<boolean>(false);

  const [existingApplication, setExistingApplication] = useState<any>(null);

  const [awardMilestones, setAwardMilestones] = useState<any>(null);
  const [extendBeforeDate, setExtendBeforeDate] = useState<string>("");

  const [cancelLoading, setCancelLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/scholarship-programs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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

          const application = await getApplicationByApplicantIdAndScholarshipId(parseInt(user?.id), response.data.data.id);
          setExistingApplication(application.data);
          const award = await getAwardMilestoneByScholarship(response.data.data.id);
          setAwardMilestones(award.data.find((milestone: any) => new Date(milestone.fromDate) < new Date() && new Date(milestone.toDate) > new Date()));
          //console.log(application.data);
          if (application.data[0].status == ApplicationStatus.NeedExtend) {
            award.data.forEach((milestone: any) => {
              if (new Date(milestone.fromDate) > new Date() || new Date() > new Date(milestone.toDate)) {
                return;
              }
              setExtendBeforeDate(milestone.fromDate);
            })
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
      //console.log(response);
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
        setWinningApplications(response.data.filter((application: any) => application.status === ApplicationStatus.Approved || application.status === ApplicationStatus.Awarded));
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
    setLoading(false);
  };

  const handleOpenAwardDialog = async () => {
    setAwardDialogOpen(true);
    setLoading(true);
    if (!data) return;
    await fetchWinningApplications(parseInt(data?.id));
    setLoading(false);
  };

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

  if (!data) return <Spinner size="large" />;
  console.log("MAJOR", data?.major);
  console.log("UNIVERSITY", data?.university);
  console.log("iUser", user);
  console.log("authorize", authorized);


  return (
    <div>
      <div className="relative">
        <ScholarshipProgramBackground />
        <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-start items-start p-[70px] gap-[170px]  z-10">
          <div>
            <Breadcrumb className="">
              <BreadcrumbList className="text-white">
                <BreadcrumbItem>
                  <Link to="/" className="md:text-xl text-lg">
                    Home
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    to="/scholarship-program"
                    className=" text-white md:text-xl text-lg"
                  >
                    Scholarship Program
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <p className="text-white md:text-xl text-lg">{data.name}</p>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="">
            <div className="lg:flex-row items-center :lg:items-center flex-row flex gap-[20px] ">
              <SchoolLogo imageUrl={data.imageUrl || "https://github.com/shadcn.png"} />
              <div>
                <p className="text-white text-5xl  lg:line-clamp-3 line-clamp-5">
                  {data.name}
                </p>
                <p className="text-white text-3xl text-heading-5 hidden lg:block mt-[12px]">
                  {data.description.length > 50 ? `${data.description.substring(0, 50)}...` : data.description}
                </p>

              </div>
            </div>

            {/* {data.status == "FINISHED" && (
              <div className="text-xl font-semibold mr-3">
                This scholarship has finished
              </div>
            )}  */}
            {/* <!--             {existingApplication &&
              existingApplication.length > 0 &&
              existingApplication[0].status == "PENDING" &&
              data.status != "FINISHED" && (
                <div className="text-xl font-semibold mr-3">
                  Your application is being reviewed
                </div>
              )} --> */}
            {/* <!--             {existingApplication &&
              existingApplication.length > 0 &&
              existingApplication[0].status != "APPROVED" && (
                <div className="text-xl font-semibold mr-3">
                  Your application to this scholarship have not been approved
                </div>
              )} --> */}
            {/* <!--             {existingApplication &&
              existingApplication.length > 0 &&
              existingApplication[0].status == "APPROVED" && (
                <div className="text-xl font-semibold mr-3">
                  You have won this scholarship
                </div>
              )} --> */}

            {/* <!--             <div className="text-white text-center flex h-[50px] mt-[26px] "> -->
<!--               {isApplicant == "Applicant"  ? ( -->
<!--                 <> -->
<!--                   {existingApplication && -->
<!--                     existingApplication.length == 0 && -->
<!--                     data.status != "FINISHED" && ( -->
<!--                       <button -->
<!--                         onClick={() => -->
<!--                           navigate(`/scholarship-program/${id}/application`) -->
<!--                         } -->
<!--                         className=" text-xl w-full bg-[#1eb2a6] hover:bg-[#179d8f] rounded-[25px]" -->
<!--                       > -->
<!--                         Apply now{" "} -->
<!--                       </button> -->
<!--                     )} -->
<!--                   {existingApplication && existingApplication.length > 0 && ( -->
<!--                     <> -->
<!--                       <button -->
<!--                         onClick={() => -->
<!--                           navigate( -->
<!--                             `/funder/application/${existingApplication[0].id}` -->
<!--                           ) -->
<!--                         } -->
<!--                         className=" text-xl w-full bg-green-700 rounded-[25px] mr-3" -->
<!--                       > -->
<!--                         View applications{" "} -->
<!--                       </button> -->
<!--                       {existingApplication[0].status != "APPROVED" && ( --> */}
            {/* <!--                         <AlertDialog> -->
<!--                           <AlertDialogTrigger -->
<!--                             className="text-xl w-full bg-red-700 rounded-[25px] cursor-pointer flex justify-center items-center" -->
<!--                             disabled={cancelLoading} -->
<!--                           > -->
<!--                             {cancelLoading ? ( -->
<!--                               <div -->
<!--                                 className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin" -->
<!--                                 aria-hidden="true" -->
<!--                               ></div> -->
<!--                             ) : ( -->
<!--                               <span>Cancel applications </span> -->
<!--                             )} -->
<!--                           </AlertDialogTrigger> -->
<!--                           <AlertDialogContent>
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
                      )} --> */}


            <div className="text-white text-center flex flex-wrap h-[50px] mt-[26px] w-full">
              { isApplicant == "Applicant" || !user ? (
                <>
                  {existingApplication && existingApplication.length == 0 && data.status != "FINISHED" && (
                    <button
                      onClick={() => navigate(`/scholarship-program/${id}/application`)}
                      className="flex-1 text-xl w-full bg-[#1eb2a6] hover:bg-[#179d8f] rounded-[25px]"
                    >
                      Apply now{" "}
                    </button>
                  )}
                  {existingApplication && existingApplication.length > 0 && (
                    <>
                      <button
                        onClick={() => navigate(`/funder/application/${existingApplication[0].id}`)}
                        className="flex-1 text-xl w-full bg-green-700 rounded-[25px] mr-3"
                      >
                        View applications{" "}
                      </button>
                      {existingApplication[0].status == ApplicationStatus.NeedExtend && (
                        <button
                          onClick={() => navigate(`/funder/application/${existingApplication[0].id}`)}
                          className="flex-1 text-xl w-full bg-yellow-500 rounded-[25px] mr-3"
                        >
                          Extend Application{" "}
                        </button>
                      )}
                      {/*JSON.stringify(awardMilestones)*/}
                      {existingApplication[0].status == ApplicationStatus.Submitted && 
                        (new Date(awardMilestones?.fromDate) < new Date() && new Date() < new Date(awardMilestones.toDate) ) && (
                          <AlertDialog>
                            <AlertDialogTrigger
                              className="flex-1 text-xl w-full bg-red-700 rounded-[25px] cursor-pointer flex justify-center items-center"
                              disabled={cancelLoading}
                            >
                              {cancelLoading ? (
                                <div
                                  className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin"
                                  aria-hidden="true"
                                ></div>
                              ) : (
                                <span>Cancel applications{" "}</span>
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
                authorized != "Unauthorized" && (

                  // <!--                   <div className="flex justify-between w-full gap-10">
                  //                     <button
                  //                       onClick={() => navigate("")}
                  //                       className=" text-xl w-full  bg-blue-700 rounded-[25px]"
                  //                     >
                  //                       Edit{" "}
                  //                     </button>
                  //                     <button
                  //                       onClick={deleteScholarship}
                  //                       className=" text-xl w-full  bg-red-900 rounded-[25px]"
                  //                     >
                  //                       Delete{" "}
                  //                     </button>
                  //                     <button
                  //                       onClick={() => handleOpenApplicantDialog()}
                  //                       className=" text-xl w-full bg-green-700 rounded-[25px]"
                  //                     >
                  //                       View applications{" "}
                  //                     </button>
                  //                     <button
                  //                       onClick={() => handleAssignExpertDialog()}
                  //                       className=" text-xl w-full bg-green-700 rounded-[25px]"
                  //                     >
                  //                       Assign Expert{" "}
                  //                     </button>
                  //                     <button
                  //                       onClick={() => handleOpenReviewMilestoneDialog()}
                  //                       className=" text-xl w-full bg-green-700 rounded-[25px]"
                  //                     >
                  //                       Review Milestones{" "} -->

                  <div className="flex justify-between w-full gap-3">
                    <button
                      onClick={() => navigate("")}
                      className="flex-1 text-lg bg-blue-700 hover:bg-blue-600 rounded-xl py-2 transition duration-300 flex items-center justify-center"
                    >
                      <FaEdit className="mr-2" /> Edit
                    </button>
                    <button
                      onClick={deleteScholarship}
                      className="flex-1 text-lg bg-red-900 hover:bg-red-800 rounded-xl py-2 transition duration-300 flex items-center justify-center"
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                    <button
                      onClick={() => handleOpenApplicantDialog()}
                      className="flex-1 text-lg bg-green-700 hover:bg-green-600 rounded-xl py-2 transition duration-300 flex items-center justify-center"
                    >
                      <FaEye className="mr-2" /> View Applications
                    </button>
                    <button
                      onClick={() => handleAssignExpertDialog()}
                      className="flex-1 text-lg bg-green-700 hover:bg-green-600 rounded-xl py-2 transition duration-300 flex items-center justify-center"
                    >
                      <FaUserTie className="mr-2" /> Assign Expert
                    </button>
                    <button
                      onClick={() => handleOpenReviewMilestoneDialog()}
                      className="flex-1 text-lg bg-green-700 hover:bg-green-600 rounded-xl py-2 transition duration-300 flex items-center justify-center"
                    >
                      <FaCheckCircle className="mr-2" /> Review Milestones
                    </button>
                    <button
                      onClick={() => handleOpenAwardDialog()}
                      className="flex-1 text-lg bg-blue-700 hover:bg-blue-600 rounded-xl py-2 transition duration-300 flex items-center justify-center"
                    >
                      <FaTrophy className="mr-2" /> Award Progress

                    </button>
                  </div>
                )
              )}
            </div>


            {data.status == "FINISHED" &&
              <div className="text-xl font-semibold mr-3">This scholarship has finished</div>
            }
            {existingApplication && existingApplication.length > 0 && existingApplication[0].status == ApplicationStatus.Submitted &&
              data.status != "FINISHED" &&
              <div className="text-xl font-semibold mr-3">Your application is being reviewed</div>
            }
            {existingApplication && existingApplication.length > 0 && existingApplication[0].status == ApplicationStatus.Rejected &&
              <div className="text-xl font-semibold mr-3">Your application to this scholarship have not been approved</div>
            }
            {existingApplication && existingApplication.length > 0 && existingApplication[0].status == ApplicationStatus.Approved &&
              <div className="text-xl font-semibold mr-3">You have won this scholarship</div>
            }
            {existingApplication && existingApplication.length > 0 && existingApplication[0].status == ApplicationStatus.NeedExtend &&
              <div className="text-xl font-semibold mr-3">You need to extend this scholarship before {formatDate(extendBeforeDate)}</div>
            }
          </div>
        </div>
      </div>
      <div className="bg-white lg:bg-white drop-shadow-[0_0_5px_rgba(0,0,0,0.1)] lg:drop-shadow-[0_5px_25px_rgba(0,0,0,0.05)] relative">
        <section className="max-w-container flex justify-center mx-auto py-6 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4 lg:px-0">

            <div className="flex mr-55 items-center gap-3">
              <FaMapMarkerAlt className="text-[#1eb2a6] text-xl" />
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-500">Location</p>
                <p className="text-lg font-semibold text-gray-800">{'VietNam'}</p>
              </div>
            </div>

            <div className="flex ml-40 items-center gap-3">
              <FaGraduationCap className="text-[#1eb2a6] text-xl" />
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-500">Qualification</p>
                <p className="text-lg font-semibold text-gray-800">{data.category.description || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaCreditCard className="text-[#1eb2a6] text-xl" />
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-500">Funding Type</p>
                <p className="text-lg font-semibold text-gray-800">{'Not specified'}</p>
              </div>
            </div>

            <div className="flex ml-40 items-center gap-3">
              <FaCalendarAlt className="text-[#1eb2a6] text-xl" />
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-500">Deadline</p>
                <p className="text-lg font-semibold text-gray-800">
                  {data.deadline ? format(new Date(data.deadline), 'dd/MM/yyyy') : 'Not specified'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaAward className="text-[#1eb2a6] text-xl" />
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-500">Value of Award</p>
                <p className="text-lg font-semibold text-gray-800">{data.scholarshipAmount || 'Not specified'}$</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white lg:bg-grey-lightest py-[40px] md:py-[60px]">
        <div className="max-w-[1216px] mx-auto">
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

          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="lg:col-span-3 px-[16px] xsm:px-[24px] 2xl:px-0">
              <div className="lg:pe-[112px]">
                <Accordion defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    className="bg-blue-50 hover:bg-blue-100 transition-all rounded-t-lg"
                  >
                    <h3 className="text-blue-600 font-semibold text-lg flex items-center gap-2">
                      <FaInfoCircle className="text-blue-500" />
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
                          <FaRegListAlt className="text-gray-500" />
                          Average applications per year:
                        </p>
                        <span>Not specified</span>
                      </div>
                    </div>

                    {/* Qualification & Number of awards */}
                    <div className="flex gap-4 flex-wrap justify-between mb-6">
                      <div className="md:w-[48%] w-full bg-gray-50 p-4 rounded-lg shadow-sm">
                        <p className="text-gray-700 font-bold flex items-center gap-2">
                          <FaAward className="text-gray-500" />
                          Qualification:
                        </p>
                        <span>Not specified</span>
                      </div>
                      <div className="md:w-[48%] w-full bg-gray-50 p-4 rounded-lg shadow-sm">
                        <p className="text-gray-700 font-bold flex items-center gap-2">
                          <FaRegListAlt className="text-gray-500" />
                          Number of awards available:
                        </p>
                        <span>{data.numberOfScholarships}</span>
                      </div>
                    </div>

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
                          <FaInfoCircle className="text-gray-500" />
                          Eligible intake:
                        </p>
                        <span>Not specified</span>
                      </div>
                    </div>

                    <div className="flex gap-4 flex-wrap justify-between mb-6">
                      <div className="md:w-[48%] w-full bg-gray-50 p-4 rounded-lg shadow-sm">
                        <p className="text-gray-700 font-bold flex items-center gap-2">
                          <FaInfoCircle className="text-gray-500" />
                          Funding details:
                        </p>
                        <span>{data.description}</span>
                      </div>
                      <div className="md:w-[48%] w-full bg-gray-50 p-4 rounded-lg shadow-sm">
                        <p className="text-gray-700 font-bold flex items-center gap-2">
                          <FaInfoCircle className="text-gray-500" />
                          Funding type:
                        </p>
                        <span>Not specified</span>
                      </div>
                    </div>

                    {/* Delivery mode & Deadline */}
                    <div className="flex gap-4 flex-wrap justify-between">
                      <div className="md:w-[48%] w-full bg-gray-50 p-4 rounded-lg shadow-sm">
                        <p className="text-gray-700 font-bold flex items-center gap-2">
                          <FaInfoCircle className="text-gray-500" />
                          Delivery mode:
                        </p>
                        <span>Not specified</span>
                      </div>
                      <div className="md:w-[48%] w-full bg-gray-50 p-4 rounded-lg shadow-sm">
                        <p className="text-gray-700 font-bold flex items-center gap-2">
                          <FaInfoCircle className="text-gray-500" />
                          Course/offer application deadline:
                        </p>
                        <span>Not specified</span>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    className="bg-green-50 hover:bg-green-100 transition-all rounded-t-lg"
                  >
                    <h3 className="text-green-600 font-semibold text-lg flex items-center gap-2">
                      <FaTag className="text-green-500" />
                      Scholarship Category
                    </h3>
                  </AccordionSummary>
                  <AccordionDetails className="bg-white p-6 rounded-b-lg shadow-lg">
                    {/* Category Name */}
                    <div className="w-full flex items-start gap-3 mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                      <FaInfoCircle className="text-gray-400 text-2xl mt-1" />
                      <div>
                        <p className="text-gray-700 font-bold">Category Name:</p>
                        <p className="text-gray-600">{data.category.name}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="w-full flex items-start gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
                      <FaInfoCircle className="text-gray-400 text-2xl mt-1" />
                      <div>
                        <p className="text-gray-700 font-bold">Description:</p>
                        <p className="text-gray-600">{data.category.description}</p>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    className="bg-blue-50 hover:bg-blue-100 transition-all rounded-t-lg"
                  >
                    <h3 className="text-blue-600 font-semibold text-lg flex items-center gap-2">
                      <FaBook className="text-blue-500" />
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
                              <p className="text-gray-700 font-bold">Description:</p>
                              <p className="text-gray-600">{data.major.description}</p>
                            </div>
                          </div>

                          <div className="w-full">
                            <h5 className="font-bold text-gray-700 mb-3">Skills:</h5>
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
                                        <p className="text-gray-600">{skill.description}</p>
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
                    <h3 className="text-yellow-600 font-semibold text-lg flex items-center gap-2">
                      <FaUniversity className="text-yellow-500" />
                      Applicable Universities
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
                              <p className="text-gray-700 font-bold">Description:</p>
                              <p className="text-gray-600">{data.university.description}</p>
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
                    <h3 className="text-green-600 font-semibold text-lg flex items-center gap-2">
                      <FaCertificate className="text-green-500" />
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
                                  <p className="text-gray-700 font-bold">Description:</p>
                                  <p className="text-gray-600">{certificate.description}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <FaTag className="text-gray-400 text-xl mt-1" />
                                <div>
                                  <p className="text-gray-700 font-bold">Type:</p>
                                  <p className="text-gray-600">{certificate.type}</p>
                                </div>
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      ))
                    ) : (
                      <p className="text-gray-600 italic">No certificates required.</p>
                    )}
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>
      {authorized != "Unauthorized" && (<AccountDialog open={applicantDialogOpen}
        onClose={() => setApplicantDialogOpen(false)}
        applications={applicants ?? []}
        scholarship={data} />)}
      {authorized != "Unauthorized" && (<AssignExpertDialog open={assignExpertDialogOpen}
        onClose={() => setAssignExpertDialogOpen(false)}
        resetMajor={null}
        experts={experts ?? []} />)}
      {authorized != "Unauthorized" && (<ReviewMilestoneDialog open={reviewMilestoneDialogOpen}
        onClose={(open: boolean) => setReviewMilestoneDialogOpen(open)}
        reviewMilestones={reviewMilestones ?? []}
        fetchReviewMilestones={async () => {
          if (!data) return;
          await fetchReviewMilestones(parseInt(data?.id));
        }} />)}
      {authorized != "Unauthorized" && (<AwardDialog isOpen={awardDialogOpen}
        setIsOpen={(open: boolean) => setAwardDialogOpen(open)}
        winningApplications={winningApplications ?? []} />
      )}


    </div>
  );
};

export default ScholarshipProgramDetail;
