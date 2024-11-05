import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Link, useParams } from "react-router-dom"
import SchoolLogo from "../ScholarshipProgramDetail/logo"
import { useEffect, useState } from "react"
import { getApplicationWithDocumentsAndAccount } from "@/services/ApiServices/applicationService"
import NotFound from "@/router/commonRoutes/404"
import { getAllScholarshipProgram, getScholarshipProgram } from "@/services/ApiServices/scholarshipProgramService"
import { Spin } from "antd"
import { formatOnlyDate } from "@/lib/date-formatter"
import DocumentTable from "./document-table"

  const FunderApplication = () => {
    const { id } = useParams<{ id: string }>();
    const [application, setApplication] = useState<any>(null);
    const [applicant, setApplicant] = useState<any>(null);
    const [applicantProfile, setApplicantProfile] = useState<any>(null);
    const [scholarship, setScholarship] = useState<any>(null);
    const [documents, setDocuments] = useState<any>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const fetchApplication = async () => {
        try {
          if(!id) return;
          const response = await getApplicationWithDocumentsAndAccount(parseInt(id));
          const scholarship = await getScholarshipProgram(response.data.scholarshipProgramId);
          //console.log(response);
          //console.log(scholarship);
          if (response.statusCode == 200) {
            setApplication(response.data);
            setApplicant(response.data.applicant);
            setApplicantProfile(response.data.applicant.applicantProfile);
            setDocuments(response.data.applicationDocuments);
            setScholarship(scholarship.data);
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
              <p className="text-heading-6">{applicantProfile.nationality}</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Ethnicity
              </p>
              <p className="text-heading-6">{applicantProfile.ethnicity}</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Gender
              </p>
              <p className="text-heading-6">{applicantProfile.gender}</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Birth Date
              </p>
              <p className="text-heading-6">{formatOnlyDate(applicantProfile.birthDate)}</p>
            </div>
          </div>
        </section>
      </div>
      <section className="bg-white lg:bg-grey-lightest py-[40px] md:py-[60px]">
        <div className="max-w-[1216px] mx-auto">
            <div className="mb-[24px] px-[16px] xsm:px-[24px] 2xl:px-0">
                <p className="text-4xl mb-8">
                  Documents
                  <span className="block bg-sky-500 w-[24px] h-[6px] rounded-[8px] mt-[4px]"></span>
                </p>
                <DocumentTable documents={documents}/>
            </div>
        </div>
      </section>

    </div>
    )
  }

  export default FunderApplication
