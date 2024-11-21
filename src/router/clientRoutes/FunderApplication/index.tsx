import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Link, useParams } from "react-router-dom"
import SchoolLogo from "../ScholarshipProgramDetail/logo"
import { useEffect, useState } from "react"
import { extendApplication, getApplicationWithDocumentsAndAccount, updateApplication } from "@/services/ApiServices/applicationService"
import NotFound from "@/router/commonRoutes/404"
import { getAllScholarshipProgram, getScholarshipProgram } from "@/services/ApiServices/scholarshipProgramService"
import { Spin } from "antd"
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

    const [awardMilestones, setAwardMilestones] = useState<any>(null);

    const [rowId, setRowId] = useState<number>(0);
      const [rows, setRows] = useState<any[]>([
        //{ id: 1, name: 'CV', type: "PDF", file: null, isNew: false },
        //{ id: 2, name: 'IELTS', type: "PDF", file: null, isNew: false }
      ]);

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
        if(!id) return;
        try {
            if(rows.length === 0) {

                return;
            }
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
          setApplyLoading(true);

            const applicationDocuments = [];
            for (const row of rows) {
              if (!row.name || !row.type || !row.file) return;
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

            const response = await extendApplication({
                applicationId: parseInt(id),
                documents: applicationDocuments
            })
            setRows([]);

            await fetchApplication();
        } catch (error) {
          console.error("Error submitting application:", error);
        }
        finally{
            setApplyLoading(false)
        }

      }

      const handleApproveExtend = async () => {
        try {
          if(!id) return;
          setApplyLoading(true);
          const response = await updateApplication(parseInt(id), {
              status: ApplicationStatus.Approved
          });
          await fetchApplication();
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setApplyLoading(false);
        }
      };


      const handlePayAwardProgress = async (data: any) => {
          if(!id) return;
          setApplyLoading(true);
          const response = await transferMoney(data);
          const res = await updateApplication(parseInt(id), {
              status: ApplicationStatus.Awarded
          });
          await fetchApplication();
      };


    const fetchApplication = async () => {
        try {
          if(!id) return;
          const response = await getApplicationWithDocumentsAndAccount(parseInt(id));
          const scholarship = await getScholarshipProgram(response.data.scholarshipProgramId);
          const award = await getAwardMilestoneByScholarship(parseInt(id));
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

    useEffect(() => {
      fetchApplication();
    }, [])
    if(!id) return <NotFound />
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
                  <SchoolLogo imageUrl={applicant.avatarUrl} />
                  <div>
                    <p className="text-white text-5xl  lg:line-clamp-3 line-clamp-5">
                      {applicant.username}
                    </p>
                    <p className="text-white text-3xl  text-heading-5 hidden lg:block mt-[12px]">
                      {applicant.email}
                    </p>
                  </div>
                </div>    
              </div>
          </div>
        </div>
        <div className="bg-white lg:bg-white drop-shadow-[0_0_5px_rgba(0,0,0,0.1)] lg:drop-shadow-[0_5px_25px_rgba(0,0,0,0.05)] relative">
        <section className="max-w-container mx-auto py-[24px] lg:py-[40px]">
          <div className="grid grid-cols-2 mx-[150px] lg:px-0 lg:flex gap-[30px] flex-row flex-wrap justify-between lg:gap-[40px]">
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Nationality
              </p>
              <p className="text-heading-6">{applicantProfile ? applicantProfile.nationality : "N/A"}</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Ethnicity
              </p>
              <p className="text-heading-6">{applicantProfile ? applicantProfile.ethnicity : "N/A"}</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Gender
              </p>
              <p className="text-heading-6">{applicantProfile ? applicantProfile.gender: "N/A"}</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Birth Date
              </p>
              <p className="text-heading-6">{applicantProfile ? formatOnlyDate(applicantProfile.birthDate) : "N/A"}</p>
            </div>
          </div>
        </section>
      </div>
      <section className="bg-white lg:bg-grey-lightest py-[40px] md:py-[60px]">
        <div className="max-w-[1216px] mx-auto">
            <div className="mb-[24px] px-[16px] xsm:px-[24px] 2xl:px-0">
                <div className="flex justify-between">
                    <p className="text-4xl mb-8">
                      Documents
                      <span className="block bg-sky-500 w-[24px] h-[6px] rounded-[8px] mt-[4px]"></span>
                    </p>
                    {application.status == ApplicationStatus.NeedExtend && user?.role == RoleNames.APPLICANT &&
                    <Button onClick={handleAddRow} className="bg-yellow-500 hover:bg-yellow-600">Add Extend Document</Button>}
                </div>
                <DocumentTable documents={documents}
                    awardMilestones={awardMilestones}
                    rows={rows}
                    setRows={setRows}
                    handleDeleteRow={handleDeleteRow}
                    handleInputChange={handleDocumentInputChange}
                />
                {application.status == ApplicationStatus.Submitted && user?.role == "Funder" && 
                awardMilestones.some((milestone: any) => new Date(milestone.fromDate) < new Date() && new Date() < new Date(milestone.toDate)) &&
                (<div className="flex justify-end mt-[24px]">
                 <AlertDialog>
                    <AlertDialogTrigger disabled={applyLoading}>
                          <Button
                        disabled={applyLoading}
                        //onClick={handleApproveExtend} 
                        className="bg-blue-500 hover:bg-blue-600">
                        {applyLoading ? <div
                            className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin"
                            aria-hidden="true"></div>:
                        "Approve Extend Application"}
                    </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you sure to approve this application?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Approve this application will extend this applicants scholarship.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                   No 
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleApproveExtend}
                                >
                                    Yes
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>)}
            </div>
        </div>
        <div className="max-w-[1216px] mx-auto">
            <div className="mb-[24px] px-[16px] xsm:px-[24px] 2xl:px-0">
                <p className="text-4xl mb-8">
                  Award Progress
                  <span className="block bg-sky-500 w-[24px] h-[6px] rounded-[8px] mt-[4px]"></span>
                </p>
                <AwardProgressTable awardMilestone={awardMilestones} application={application}/>
                {application.status == ApplicationStatus.NeedExtend && user?.role == RoleNames.APPLICANT &&
                <div className="flex justify-end mt-[24px]">
                    <Button
                        disabled={applyLoading}
                        onClick={handleSubmit} 
                        className="bg-blue-500 hover:bg-blue-600">
                        {applyLoading ? <div
                            className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin"
                            aria-hidden="true"></div>:
                        "Submit"}
                    </Button>
                </div>}
                {application.status == ApplicationStatus.Approved && user?.role == "Funder" &&
                awardMilestones.some((milestone: any) => new Date(milestone.fromDate) < new Date() && new Date() < new Date(milestone.toDate)) &&
                <div className="flex justify-end mt-[24px]">
                    <AlertDialog>
                    <AlertDialogTrigger disabled={applyLoading}>
                          <Button
                        disabled={applyLoading}
                        //onClick={handleSubmit} 
                        className="bg-blue-500 hover:bg-blue-600">
                        {applyLoading ? <div
                            className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin"
                            aria-hidden="true"></div>:
                        "Pay for this award progress"}
                    </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {`Are you sure to pay $`+
                                    `${awardMilestones.find((milestone: any) => new Date(milestone.fromDate) < new Date() && new Date() < new Date(milestone.toDate)).amount}`+ 
                                    ` this application?`}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Approve this application will extend this applicants scholarship.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                   No 
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => setOpenPayDialog(true)}
                                >
                                    Yes
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>}

            </div>
        </div>
        <PayAwardDialog isOpen={openPayDialog} setIsOpen={setOpenPayDialog} application={application} 
        scholarship={scholarship}
        awardName={awardMilestones.findIndex((milestone: any) => new Date(milestone.fromDate) < new Date() && new Date() < new Date(milestone.toDate))+1}
        handlePayAwardProgress={handlePayAwardProgress}
        amount={awardMilestones.find((milestone: any) => new Date(milestone.fromDate) < new Date() && new Date() < new Date(milestone.toDate)).amount}/>

        
      </section>

    </div>
    )
  }

  export default FunderApplication
