import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Link, useParams } from "react-router-dom"
import SchoolLogo from "../ScholarshipProgramDetail/logo"
import { useEffect, useState } from "react"
import NotFound from "@/router/commonRoutes/404"
import { Spin } from "antd"
import { formatOnlyDate } from "@/lib/date-formatter"
import { getRequestWithApplicantAndRequestDetails } from "@/services/ApiServices/requestService"
import RequestDetailTable from "./request-detail-table"
import { useSelector } from "react-redux"
import { FaBirthdayCake, FaFlag, FaTransgender, FaUsers } from "react-icons/fa"

const ApplicantRequestInfo = ({ showButtons = true, requestId = null }: any) => {
  const { id } = requestId ?? useParams<{ id: string }>();
  const [request, setRequest] = useState<any>(null);
  const [applicant, setApplicant] = useState<any>(null);
  const [applicantProfile, setApplicantProfile] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [requestDetails, setRequestDetails] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: any) => state.token.user);

  const fetchRequest = async () => {
    try {
      if (!id) return;
      const request = await getRequestWithApplicantAndRequestDetails(parseInt(id));
      console.log(request);
      console.log(request.data)

      if (request.statusCode == 200) {
        setRequest(request.data);
        setApplicant(request.data.applicant);
        setApplicantProfile(request.data.applicant.applicantProfile);
        setRequestDetails(request.data.requestDetails);
        setService(request.data.requestDetails[0].service);
      } else {
        setError("Failed to get request");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
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
                    to="/services"
                    className=" text-white md:text-xl text-lg"
                  >
                    Services
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    to={`/services/${service.id}`}
                    className=" text-white md:text-xl text-lg"
                  >
                    {service.name}
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    to={`/services/${service.id}`}
                    className=" text-white md:text-xl text-lg"
                  >
                    Requests
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    to={user.role === 'Applicant' ? `/applicant/requestinformation/${request.id}` : `/provider/requestinformation/${request.id}`}
                    className="text-white md:text-xl text-lg"
                  >
                    {applicant.username}
                  </Link>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="w-full">
            <div className="lg:flex-row items-center :lg:items-center flex-row flex gap-[20px] ">
              <SchoolLogo imageUrl={applicant.avatarUrl ?? "https://github.com/shadcn.png"} />
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
      <div className="bg-white lg:bg-white drop-shadow-[0_0_5px_rgba(0,0,0,0.1)] lg:drop-shadow-[0_5px_25px_rgba(0,0,0,0.05)] relative rounded-lg overflow-hidden">
        <section className="max-w-container flex items-center justify-center mx-auto py-[24px] lg:py-[40px] px-4 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] lg:gap-[40px]">
            <div className="flex items-center mr-30 gap-3 flex-col lg:flex-row">
              <FaFlag className="text-indigo-600 text-3xl" />
              <div>
                <p className="block mb-[4px] lg:mb-[8px] font-semibold text-lg text-gray-600">Nationality</p>
                <p className="text-heading-6 text-gray-800">{applicantProfile ? applicantProfile.nationality : "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center ml-30 gap-3 flex-col lg:flex-row">
              <FaUsers className="text-green-600 text-3xl" />
              <div>
                <p className="block mb-[4px] lg:mb-[8px] font-semibold text-lg text-gray-600">Ethnicity</p>
                <p className="text-heading-6 text-gray-800">{applicantProfile ? applicantProfile.ethnicity : "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center mr-30 gap-3 flex-col lg:flex-row">
              <FaTransgender className="text-purple-600 text-3xl" />
              <div>
                <p className="block mb-[4px] lg:mb-[8px] font-semibold text-lg text-gray-600">Gender</p>
                <p className="text-heading-6 text-gray-800">{applicantProfile ? applicantProfile.gender : "N/A"}</p>
              </div>
            </div>

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
      <section className="bg-white lg:bg-grey-lightest py-[40px] md:py-[60px]">
        <div className="max-w-[1216px] mx-auto">
          <div className="mb-[24px] px-[16px] xsm:px-[24px] 2xl:px-0">
            <p className="text-4xl mb-8">
              Request Details
              <span className="block bg-sky-500 w-[24px] h-[6px] rounded-[8px] mt-[4px]"></span>
            </p>
            <RequestDetailTable showButtons={showButtons} request={request} fetchRequest={fetchRequest} requestDetails={requestDetails} description={request.description} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default ApplicantRequestInfo;
