import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Link, useParams } from "react-router-dom"
import SchoolLogo from "../ScholarshipProgramDetail/logo"
import { useEffect, useState } from "react"
import { extendApplication, getApplicationWithDocumentsAndAccount, updateApplication } from "@/services/ApiServices/applicationService"
import NotFound from "@/router/commonRoutes/404"
import { getAllScholarshipProgram, getScholarshipProgram } from "@/services/ApiServices/scholarshipProgramService"
import { notification, Spin, Tag } from "antd"
import { formatOnlyDate } from "@/lib/date-formatter"
import DocumentTable from "./document-table"
import AwardProgressTable from "./award-progress-table"
import { getAwardMilestoneByScholarship } from "@/services/ApiServices/awardMilestoneService"
import { Button } from "@/components/ui/button"
import ApplicationStatus from "@/constants/applicationStatus"
import { uploadFile } from "@/services/ApiServices/testService"
import Application from "../Application"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import RoleNames from "@/constants/roleNames"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { transferMoney } from "@/services/ApiServices/paymentService"
import PayAwardDialog from "./PayAwardDialog"
import { FaBirthdayCake, FaCheckCircle, FaClock, FaCross, FaDollarSign, FaEnvelope, FaFileAlt, FaFlag, FaPaperPlane, FaQuestionCircle, FaStopCircle, FaTransgender, FaUserCircle, FaUsers } from "react-icons/fa"
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { SendNeedExtendReason, SendNotificationAndEmail } from "@/services/ApiServices/notification"
import { getMessaging, onMessage } from "firebase/messaging"
import scholarshipProgram from "../ScholarshipProgram/data"
import SendReasonDialog from "./send-email-more-doc"

const FunderApplication = () => {
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.token.user);
  const [application, setApplication] = useState<any>(null);
  const [applicant, setApplicant] = useState<any>(null);
  const [applicantProfile, setApplicantProfile] = useState<any>(null);
  const [scholarship, setScholarship] = useState<any>(null);
  const [documents, setDocuments] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [applyLoading, setApplyLoading] = useState<boolean>(false);

  const [openPayDialog, setOpenPayDialog] = useState<boolean>(false);

  const [openSendReasonDialog, setOpenSendReasonDialog] = useState<boolean>(false);
  const [reasonStatus, setReasonStatus] = useState<string>("");

  const [isPayAll, setIsPayAll] = useState<boolean>(false);

  const [awardMilestones, setAwardMilestones] = useState<any>(null);

  const [extendError, setExtendError] = useState<string>("");


  const [rowId, setRowId] = useState<number>(0);
  const [rows, setRows] = useState<any[]>([
    //{ id: 1, name: 'CV', type: "PDF", file: null, isNew: false },
    //{ id: 2, name: 'IELTS', type: "PDF", file: null, isNew: false }
  ]);

  const statusColor = {
    [ApplicationStatus.Submitted]: "blue",
    [ApplicationStatus.Awarded]: "green",
    [ApplicationStatus.Approved]: "blue",
    [ApplicationStatus.Rejected]: "red",
    [ApplicationStatus.NeedExtend]: "yellow",
    [ApplicationStatus.Reviewing]: "yellow",
  }

  const handleAddRow = () => {
    setRowId(rowId + 1);
    const newRow = { id: rowId + 1, name: "", type: "" }; // Blank row for user input
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleDocumentInputChange = (id: number, field: any, value: any) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleSubmit = async () => {
    if (!id) return;
    try {
      const applicationDocuments = [];
      setApplyLoading(true);
      if (rows.length !== 0) {
          setRows(
            rows.map((row) => ({
              ...row,
              errors: {
                name: !row.name,
                type: !row.type,
                file: !row.file,
              },
            }))
          );

          for (const row of rows) {
            if (!row.name || !row.type || !row.file) return;
            const currentAward = awardMilestones.find((milestone: any) => new Date(milestone.fromDate) < new Date(application.updatedAt) &&
                new Date(application.updatedAt) < new Date(milestone.toDate)
            )
            //console.log(new Set(rows.map((row: any) => row.type)))
            //console.log(new Set(new Set(currentAward.awardMilestoneDocuments.map((doc: any) => doc.type))))
            const areSetsEqual = (setA: Set<any>, setB: Set<any>): boolean =>
                setA.size === setB.size && [...setA].every(item => setB.has(item));
            if(currentAward.awardMilestoneDocuments.length != 0 && !areSetsEqual(new Set(rows.map((row: any) => row.type)), new Set(currentAward.awardMilestoneDocuments.map((doc: any) => doc.type)))) {
                setExtendError("Please only upload required documents of types " + currentAward.awardMilestoneDocuments.map((doc: any) => doc.type).join(", "));
                return;
            }

            const formData = new FormData();
            formData.append("File", row.file);
            const name = await uploadFile(formData);

            const documentData = {
              name: row.name,
              type: row.type,
              fileUrl: name.urls[0],
            };
            applicationDocuments.push(documentData);
          }
      }
      else{
         const currentAward = awardMilestones.find((milestone: any) => new Date(milestone.fromDate) < new Date(application.updatedAt) &&
                new Date(application.updatedAt) < new Date(milestone.toDate)
          )
          if(currentAward.awardMilestoneDocuments.length != 0) {
            setExtendError("Please upload required documents of types " + currentAward.awardMilestoneDocuments.map((doc: any) => doc.type).join(", "));
            return;
          }
      }

      const response = await extendApplication({
        applicationId: parseInt(id),
        documents: applicationDocuments
      })
      setRows([]);
      notification.success({message: "Submit successfully!"})
      await SendNotificationAndEmail({
        topic: scholarship.funderId.toString(),
        link: "/funder/application/"+application.id,
        title: "Extend Application Submitted",
        body: `Extend application of ${applicant.username} for ${scholarship.name} has been submitted.`,
      })

      await fetchApplication();
    } catch (error) {
      console.error("Error submitting application:", error);
    }
    finally {
      setApplyLoading(false)
    }

  }

  const handleApproveExtend = async (status: string) => {
    try {
      
      if (!id) return;
      setApplyLoading(true);
      const response = await updateApplication(parseInt(id), {
        status: status,
        updatedAt: new Date(),
      });
      notification.success({message: "Change successfully!"})
      await SendNotificationAndEmail({
        topic: applicant.id.toString(),
        link: "/funder/application/"+application.id,
        title: "Application has been updated",
        body: `Your application for ${scholarship.name} has been updated.`,
      })
      await fetchApplication();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setApplyLoading(false);
    }
  };

  const handleNeedExtend = async (status: string,data: any) => {
     try {
      if (!id) return;
      setApplyLoading(true);
      const response = await updateApplication(parseInt(id), {
        status: status,
        updatedAt: new Date(),
      });
      notification.success({message: "Change successfully!"})
      await SendNeedExtendReason(data)
      await fetchApplication();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setApplyLoading(false);
    } 
  }


  const handlePayAwardProgress = async (data: any) => {
    if (!id) return;
    setApplyLoading(true);
    const response = await transferMoney(data);
    const res = await updateApplication(parseInt(id), {
      status: ApplicationStatus.Awarded
    });
    notification.success({message: "Pay successfully!"})
    await SendNotificationAndEmail({
        topic: applicant.id.toString(),
        link: "/wallet",
        title: "Your scholarship has been awarded",
        body: `Your application for ${scholarship.name} for Progress ${awardMilestones.findIndex((milestone: any) => 
            new Date(milestone.fromDate) < new Date(application.updatedAt) &&
            new Date(application.updatedAt) < new Date(milestone.toDate)) + 1} has been awarded, please check your wallet.`,
      })

    await fetchApplication();
  };

  const handlePayAllAwardProgress = async (data: any) => {
    if (!id) return;
    setApplyLoading(true);
    const response = await transferMoney(data);
    const res = await updateApplication(parseInt(id), {
      status: ApplicationStatus.Awarded,
      updatedAt: new Date(new Date(awardMilestones[awardMilestones.length - 1].toDate).setDate(
        new Date(awardMilestones[awardMilestones.length - 1].toDate).getDate() + 1
      )),
    });
    await SendNotificationAndEmail({
        topic: applicant.id.toString(),
        link: "/wallet",
        title: "Your scholarship has been awarded",
        body: `Your application for ${scholarship.name} has been awarded for all progress, please check your wallet.`,
      })
    await fetchApplication();
  };


    const fetchApplication = async () => {
        try {
          if(!id) return;
          const response = await getApplicationWithDocumentsAndAccount(parseInt(id));
          const scholarship = await getScholarshipProgram(response.data.scholarshipProgramId);
          const award = await getAwardMilestoneByScholarship(response.data.scholarshipProgramId);
          //console.log(response);
          //console.log(scholarship);
          if (response.statusCode == 200) {
            setApplication(response.data);
            setApplicant(response.data.applicant);
            setApplicantProfile(response.data.applicant.applicantProfile);
            setDocuments(response.data.applicationDocuments);
            setScholarship(scholarship.data);
            setAwardMilestones(award.data);
          } else {
            setError("Failed to get applicants");
          }
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      };

      const messaging = getMessaging();
      navigator.serviceWorker.addEventListener('message', (event) => {
          
        if (event.data.notification && event.data.data.topic == user?.id) {
          fetchApplication();
        }
      });

      onMessage(messaging, (payload: any) => {
        if (payload.notification && payload.data.topic == user?.id) {
          fetchApplication();
        }
      });


  useEffect(() => {
    fetchApplication();
  }, [])
  if (!id) return <NotFound />
  if (loading) {
    return <Spin size="large" />;
  }
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
                  <Link
                    to={`/scholarship-program/${scholarship.id}`}
                    className=" text-white md:text-xl text-lg"
                  >
                    {scholarship.name}
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    to={`/scholarship-program/${scholarship.id}`}
                    className=" text-white md:text-xl text-lg"
                  >
                    Applications
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    to={`/funder/application/${application.id}`}
                    className=" text-white md:text-xl text-lg"
                  >
                    {applicant.username}
                  </Link>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="w-full">
            <div className="lg:flex-row items-center :lg:items-center flex-row flex gap-[20px] ">
              <SchoolLogo imageUrl={applicant.avatarUrl || "https://github.com/shadcn.png"} />
              <div>
                <p className="text-white text-4xl font-semibold hover:text-indigo-300 transition-colors duration-300">
                  <FaUserCircle className="inline-block mr-2 text-indigo-200" />
                  {applicant.username}
                </p>
                <p className="text-white text-xl mt-2 flex items-center space-x-2">
                  <FaEnvelope className="text-indigo-200" />
                  <span className="lg:block hidden">{applicant.email}</span>
                </p>

                <p className="text-white text-xl mt-2 flex items-center space-x-2">
                <span className="flex justify-end gap-2 items-center">
                        <span className="relative flex h-3 w-3">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${statusColor[application.status]}-500 opacity-75`}></span>
                          <span className={`relative inline-flex rounded-full h-3 w-3 bg-${statusColor[application.status]}-500`}></span>
                        </span>
                        <span className={`text-${statusColor[application.status]}-500 font-medium`}>{application.status}</span>
                      </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white lg:bg-white drop-shadow-[0_0_5px_rgba(0,0,0,0.1)] lg:drop-shadow-[0_5px_25px_rgba(0,0,0,0.05)] relative rounded-lg overflow-hidden">
        <section className="max-w-container flex items-center justify-center mx-auto py-[24px] lg:py-[40px] px-4 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] lg:gap-[40px]">
            {/* Nationality */}
            <div className="flex items-center mr-30 gap-3 flex-col lg:flex-row">
              <FaFlag className="text-indigo-600 text-3xl" />
              <div>
                <p className="block mb-[4px] lg:mb-[8px] font-semibold text-lg text-gray-600">Nationality</p>
                <p className="text-heading-6 text-gray-800">{applicantProfile ? applicantProfile.nationality : "N/A"}</p>
              </div>
            </div>

            {/* Ethnicity */}
            <div className="flex items-center ml-30 gap-3 flex-col lg:flex-row">
              <FaUsers className="text-green-600 text-3xl" />
              <div>
                <p className="block mb-[4px] lg:mb-[8px] font-semibold text-lg text-gray-600">Ethnicity</p>
                <p className="text-heading-6 text-gray-800">{applicantProfile ? applicantProfile.ethnicity : "N/A"}</p>
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-center mr-30 gap-3 flex-col lg:flex-row">
              <FaTransgender className="text-purple-600 text-3xl" />
              <div>
                <p className="block mb-[4px] lg:mb-[8px] font-semibold text-lg text-gray-600">Gender</p>
                <p className="text-heading-6 text-gray-800">{applicantProfile ? applicantProfile.gender : "N/A"}</p>
              </div>
            </div>

            {/* Birth Date */}
            <div className="flex items-center ml-30 gap-3 flex-col lg:flex-row">
              <FaBirthdayCake className="text-orange-600 text-3xl" />
              <div>
                <p className="block mb-[4px] lg:mb-[8px] font-semibold text-lg text-gray-600">Birth Date</p>
                <p className="text-heading-6 text-gray-800">{applicantProfile ? formatOnlyDate(applicantProfile.birthDate) : "N/A"}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section className="bg-white lg:bg-gray-50 py-[40px] md:py-[60px]">
        <div className="max-w-[1216px] mx-auto">
          <div className="mb-[24px] px-[16px] xsm:px-[24px] 2xl:px-0">
            <div className="flex justify-between items-center">
              <p className="text-4xl mb-8 flex items-center">
                <FaFileAlt className="mr-2 text-sky-500 text-3xl" />
                Documents
                <span className="block bg-sky-500 w-[24px] h-[6px] rounded-[8px] mt-[4px]"></span>
              </p>
              {application.status === ApplicationStatus.NeedExtend && (user?.role === RoleNames.APPLICANT || user?.role === "Applicant") &&
              awardMilestones.some((milestone: any) => new Date(milestone.fromDate) < new Date(application.updatedAt) && new Date(application.updatedAt) < new Date(milestone.toDate)
              ) &&
                <div className="flex items-center gap-2">
                    <p className="text-lg">Required Documents: </p>
                    {awardMilestones.find((milestone: any) => new Date(milestone.fromDate) < new Date(application.updatedAt) &&
                        new Date(application.updatedAt) < new Date(milestone.toDate)
                    )?.awardMilestoneDocuments.map((doc: any) => (
                        <div className="flex items-center gap-2" key={doc.id}>
                            <Tag color="magenta">{doc.type}</Tag>
                        </div>
                    ))}
                    <Button onClick={handleAddRow} className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2">
                      <HiOutlinePlusCircle className="text-lg" /> Add Extend Document
                    </Button>
                </div>
              }
            </div>
            <DocumentTable
              documents={documents}
              awardMilestones={awardMilestones}
              documentType={awardMilestones.find((milestone: any) => new Date(milestone.fromDate) < new Date(application.updatedAt) &&
                new Date(application.updatedAt) < new Date(milestone.toDate)
              ).awardMilestoneDocuments.map((doc: any) => doc.type)}
              rows={rows}
              setRows={setRows}
              handleDeleteRow={handleDeleteRow}
              handleInputChange={handleDocumentInputChange}
            />

            {application.status === ApplicationStatus.Submitted && (user?.role === "Funder" || user?.role === "FUNDER") &&
              awardMilestones.some((milestone: any) => new Date(milestone.fromDate) < new Date(application.updatedAt) && new Date(application.updatedAt) < new Date(milestone.toDate)
              ) && new Date(application.updatedAt) > new Date(scholarship.deadline) &&
              <div className="flex justify-end mt-[24px] gap-5">
                <AlertDialog>
                  <AlertDialogTrigger disabled={applyLoading}>
                    <Button disabled={applyLoading} className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2">
                      {applyLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin" aria-hidden="true"></div> : <FaCheckCircle className="text-lg" />}
                      Approve Application
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure to approve this application?</AlertDialogTitle>
                      <AlertDialogDescription>Approve this application will extend this applicants scholarship.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleApproveExtend(ApplicationStatus.Approved)}>Yes</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger disabled={applyLoading}>
                    <Button disabled={applyLoading} className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2">
                      {applyLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin" aria-hidden="true"></div> : <FaStopCircle className="text-lg" />}
                      Reject Application
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure to reject this application?</AlertDialogTitle>
                      <AlertDialogDescription>This applicant will no longer receive money.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {
                          setReasonStatus("Rejected")
                          setOpenSendReasonDialog(true)}}>Yes</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger disabled={applyLoading}>
                    <Button disabled={applyLoading} className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2">
                      {applyLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin" aria-hidden="true"></div> : <FaQuestionCircle className="text-lg" />}
                      Require more documents 
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure to require more documents this application?</AlertDialogTitle>
                      <AlertDialogDescription>Approve this application will require more documents this applicants scholarship.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {/*handleApproveExtend(ApplicationStatus.NeedExtend)*/
                            setReasonStatus("NeedExtend")
                            setOpenSendReasonDialog(true)
                        }}>Yes</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            }
          </div>
        </div>

        <div className="max-w-[1216px] mx-auto">
          <div className="mb-[24px] px-[16px] xsm:px-[24px] 2xl:px-0">
            <p className="text-4xl mb-8 flex items-center">
              <FaClock className="mr-2 text-sky-500 text-3xl" />
              Award Progress
              <span className="block bg-sky-500 w-[24px] h-[6px] rounded-[8px] mt-[4px]"></span>
            </p>
            <AwardProgressTable awardMilestone={awardMilestones} application={application} />

            {application.status === ApplicationStatus.NeedExtend && (user?.role === RoleNames.APPLICANT || user?.role === "Applicant") &&
            awardMilestones.some((milestone: any) => new Date(milestone.fromDate) < new Date(application.updatedAt) && new Date(application.updatedAt) < new Date(milestone.toDate)
            ) &&
              <div className="flex justify-between mt-[24px]">

                <div className="text-red-500">{extendError}</div>
                <Button
                  disabled={applyLoading}
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2">
                  {applyLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin" aria-hidden="true"></div> : <FaPaperPlane className="text-lg" />}
                  Submit
                </Button>
              </div>
            }

            {application.status === ApplicationStatus.Approved && (user?.role === "Funder" || user?.role === "FUNDER") &&
              awardMilestones.some((milestone: any) => new Date(milestone.fromDate) < new Date(application.updatedAt) && new Date(application.updatedAt) < new Date(milestone.toDate)
              ) &&
              <div className="flex justify-end mt-[24px] gap-5">
                <AlertDialog>
                  <AlertDialogTrigger disabled={applyLoading}>
                    <Button disabled={applyLoading} className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2">
                      {applyLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin" aria-hidden="true"></div> : <FaDollarSign className="text-lg" />}
                      Pay for this award progress
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {`Are you sure to pay $${awardMilestones.find((milestone: any) => new Date(milestone.fromDate) < new Date(application.updatedAt) && new Date(application.updatedAt) < new Date(milestone.toDate)).amount} for this application?`}
                      </AlertDialogTitle>
                      <AlertDialogDescription>Approve this payment to extend the applicant's scholarship.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No</AlertDialogCancel>
                      <AlertDialogAction onClick={() => setOpenPayDialog(true)}>Yes</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger disabled={applyLoading}>
                    <Button disabled={applyLoading} className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
                      {applyLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin" aria-hidden="true"></div> : <FaDollarSign className="text-lg" />}
                      Pay for all award progress
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {`Are you sure to pay $${awardMilestones.filter((milestone: any) =>
                            new Date(application.updatedAt) < new Date(milestone.toDate))
                            .reduce((sum:any,milestone: any) => sum + milestone.amount, 0)} for all award progress?`}
                      </AlertDialogTitle>
                      <AlertDialogDescription>Approve this payment to extend the applicant's scholarship.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {
                          setIsPayAll(true)
                          setOpenPayDialog(true)
                      }}>Yes</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

            }
          </div>
        </div>

        {/* Pay Award Dialog */}
        {openPayDialog && <PayAwardDialog
          isOpen={openPayDialog}
          setIsOpen={setOpenPayDialog}
          application={application}
          scholarship={scholarship}
          awardName={isPayAll ? "All Award Progress" : (awardMilestones.findIndex((milestone: any) => 
            new Date(milestone.fromDate) < new Date(application.updatedAt) &&
            new Date(application.updatedAt) < new Date(milestone.toDate)) + 1)}
          handlePayAwardProgress={isPayAll ? handlePayAllAwardProgress : handlePayAwardProgress}
          amount={isPayAll ? awardMilestones.filter((milestone: any) => new Date(application.updatedAt) < new Date(milestone.toDate))
            .reduce((sum:any,milestone: any) => sum + milestone.amount, 0) : 
            awardMilestones.find((milestone: any) => new Date(milestone.fromDate) < new Date(application.updatedAt) 
            && new Date(application.updatedAt) < new Date(milestone.toDate))?.amount}
        />}

        {/* Send Reason Dialog */}
        {openSendReasonDialog && <SendReasonDialog
          status={reasonStatus}
          isOpen={openSendReasonDialog}
          setIsOpen={setOpenSendReasonDialog}
          application={application}
          handleNeedExtend={handleNeedExtend}
        />}
      </section>

    </div>
  )
}

export default FunderApplication
