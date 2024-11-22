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
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
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
import { deleteApplication, getApplicationByApplicantIdAndScholarshipId } from "@/services/ApiServices/applicationService";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '../../../components/ui/alert-dialog';;
import { AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import AwardDialog from "./award-dialog";
import ApplicationStatus from "@/constants/applicationStatus";
import { getAwardMilestoneByScholarship } from "@/services/ApiServices/awardMilestoneService";
import { formatDate, formatOnlyDate } from "@/lib/date-formatter";
import { FaCheckCircle, FaEdit, FaEye, FaTrash, FaTrophy, FaUserTie } from "react-icons/fa";

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
  const [applicantDialogOpen, setApplicantDialogOpen] = useState<boolean>(false);

  const [experts, setExperts] = useState<any>(null);
  const [assignExpertDialogOpen, setAssignExpertDialogOpen] = useState<boolean>(false);

  const [reviewMilestones, setReviewMilestones] = useState<any>(null);
  const [reviewMilestoneDialogOpen, setReviewMilestoneDialogOpen] = useState<boolean>(false);

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
        setWinningApplications(response.data.filter((application: any) => application.status === "APPROVED"));
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
      const response = await deleteApplication(existingApplication[0].id)
      if (response) {
        await fetchData();
      } else {
        setError("Failed to delete scholarship")
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
      const response = await axios.delete(`${BASE_URL}/api/scholarship-programs/${id}`)
      if (response.data.statusCode == 200) {
        setData(response.data.data)
        navigate(RouteNames.ACTIVITY)
      } else {
        setError("Failed to delete scholarship")
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <Spinner size="large" />;

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

            <div className="text-white text-center flex flex-wrap h-[50px] mt-[26px] w-full">
              {isApplicant == "APPLICANT" || !user ? (
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
                      {existingApplication[0].status == ApplicationStatus.Submitted &&
                        (new Date(awardMilestones.fromDate) < new Date() && new Date() < new Date(awardMilestones.toDate) ) && (
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
        <section className="max-w-container mx-auto py-[24px] lg:py-[40px]">
          <div className="grid grid-cols-2 mx-[150px] lg:px-0 lg:flex gap-[30px] flex-row flex-wrap justify-between lg:gap-[40px]">
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Location
              </p>
              <p className="text-heading-6">VietNam</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Qualification
              </p>
              <p className="text-heading-6">VietNam</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Funding type
              </p>
              <p className="text-heading-6">VietNam</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Deadline
              </p>
              <p className="text-heading-6">VietNam</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Value of Award
              </p>
              <p className="text-heading-6">VietNam</p>
            </div>
          </div>
        </section>
      </div>
      <section className="bg-white lg:bg-grey-lightest py-[40px] md:py-[60px]">
        <div className="max-w-[1216px] mx-auto">
          <div className="mb-[24px] px-[16px] xsm:px-[24px] 2xl:px-0">
            <p className="text-4xl">
              About the scholarship
              <span className="block bg-[#1eb2a6] w-[24px] h-[6px] rounded-[8px] mt-[4px]"></span>
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="lg:col-span-3 px-[16px] xsm:px-[24px] 2xl:px-0">
              <div className="lg:pe-[112px]">
                <Accordion defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    Overview
                  </AccordionSummary>
                  <AccordionDetails>
                    <div>
                      <div className="flex gap-[16px] flex-wrap justify-between mb-[20px] md:mb-[40px]">
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Awarding institution:
                          </p>
                          <Link to="" className="hover:underline">
                            {data.name}
                          </Link>
                        </div>
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Average applications per year:
                          </p>
                          Not specified
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-[16px] flex-wrap justify-between mb-[20px] md:mb-[40px]">
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Qualification:
                          </p>
                          Not specified
                        </div>
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Number of awards available:
                          </p>
                          {data.numberOfScholarships}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-[16px] flex-wrap justify-between mb-[20px] md:mb-[40px]">
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Value of Award
                          </p>
                          {data.scholarshipAmount}
                        </div>
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Eligible intake:
                          </p>
                          Not specified
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-[16px] flex-wrap justify-between mb-[20px] md:mb-[40px]">
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Funding details:
                          </p>
                          {data.description}
                        </div>
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Funding type:
                          </p>
                          Not specified
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-[16px] flex-wrap justify-between mb-[20px] md:mb-[40px]">
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Delivery mode:
                          </p>
                          Not specified
                        </div>
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Course/offer application deadline:
                          </p>
                          Not specified
                        </div>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                  >
                    Scholarship Category
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="w-full flex gap-3 flex-wrap">
                      <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                        Category Name:
                      </p>
                      {data.category.name}
                    </div>
                    <div className="w-full flex gap-3 flex-wrap">
                      <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                        Description:
                      </p>
                      {data.category.description}
                    </div>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                  >
                    Applicable Majors &amp; Skills
                  </AccordionSummary>
                  <AccordionDetails>
                    {data.major && [data.major].map((major: any) => (
                      <Accordion key={major.id}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel3-content"
                          id="panel3-header"
                        >
                          <span className="font-bold mr-2">{major.name} </span>
                        </AccordionSummary>
                        <AccordionDetails>

                          <div className="w-full flex gap-3 flex-wrap">
                            <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                              Description:
                            </p>
                            {major.description}
                          </div>
                          <div className="w-full mt-3 flex gap-3 flex-wrap">
                            <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                              Skills:
                            </p>
                            <div>
                              {major.skills.map((skill: any) => (
                                <Accordion key={skill.id}>
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3-content"
                                    id="panel3-header"
                                  >
                                    <span className="font-bold mr-2">{skill.name} </span>
                                  </AccordionSummary>
                                  <AccordionDetails>

                                    <div className="w-full flex gap-3 flex-wrap">
                                      <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                                        Description:
                                      </p>
                                      {skill.description}
                                    </div>

                                  </AccordionDetails>
                                </Accordion>
                              ))}
                            </div>
                          </div>

                        </AccordionDetails>
                      </Accordion>

                    ))}
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3-content"
                    id="panel3-header"
                  >
                    Applicable Universities
                  </AccordionSummary>
                  <AccordionDetails>
                    {data?.universities?.map((university: any) => (
                      <Accordion key={university.id}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel3-content"
                          id="panel3-header"
                        >
                          <span className="font-bold mr-2">{university.name} </span>
                          <span>at {university.city}</span>
                        </AccordionSummary>
                        <AccordionDetails>

                          <div className="w-full flex gap-3 flex-wrap">
                            <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                              Description:
                            </p>
                            {university.description}
                          </div>

                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3-content"
                    id="panel3-header"
                  >
                    Required Certificates
                  </AccordionSummary>
                  <AccordionDetails>
                    {data.certificates.map((certificate: any) => (
                      <Accordion key={certificate.id}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel3-content"
                          id="panel3-header"
                        >
                          <span className="font-bold mr-2">{certificate.name} </span>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="w-full flex gap-3 flex-wrap">
                            <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                              Description:
                            </p>
                            {certificate.description}
                          </div>
                          <div className="w-full flex gap-3 flex-wrap">
                            <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                              Type:
                            </p>
                            {certificate.type}
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <div className="p-12 flex flex-col justify-start gap-4">
        <section className="flex flex-col-reverse md:grid md:grid-cols-2 justify-between gap-8 md:p-12 p-8 rounded-3xl shadow shadow-gray-400">
          {loading ? (
            <Spinner size="large" />
          ) : error ? (
            <p className="text-center text-[2rem] font-semibold md:col-span-3 lg:col-span-4">
              Error loading scholarship programs detail.
            </p>
          ) : (
            <div className="columns-1 flex flex-col justify-between">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl">{data.name}</h2>
                <div>
                  <p>{data.description}</p>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-4">
                <div className="flex justify-between md:w-1/3 w-[80%] md:mt-0 mt-3">
                  <div className="flex justify-start items-center gap-2">
                    <p>{data.name}</p>
                    <FaStar color="#FFB142" size={24} />
                  </div>
                  <div className="w-[1px] bg-gray-400"></div>
                  <p>{data.numberOfScholarships} Đã đặt</p>
                  <div className="w-[1px] bg-gray-400"></div>
                  <p>{data.scholarshipAmount} VND</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div> */}

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
