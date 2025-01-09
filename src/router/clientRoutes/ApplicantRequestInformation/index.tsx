import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useParams } from "react-router-dom";
import SchoolLogo from "../ScholarshipProgramDetail/logo";
import { useEffect, useState } from "react";
import NotFound from "@/router/commonRoutes/404";
import { Spin } from "antd";
import { getRequestWithApplicantAndRequestDetails } from "@/services/ApiServices/requestService";
import RequestDetailTable from "./request-detail-table";
import { useSelector } from "react-redux";
import { FaEnvelope, FaUserCircle } from "react-icons/fa";
import { getApplicantProfileById } from "@/services/ApiServices/applicantProfileService";

const ApplicantRequestInfo = ({
  showButtons = true,
  requestId = null,
}: any) => {
  const { id } = requestId ?? useParams<{ id: string }>();
  const [request, setRequest] = useState<any>(null);
  const [applicant, setApplicant] = useState<any>(null);
  const [_applicantProfile, setApplicantProfile] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [requestDetails, setRequestDetails] = useState<any>(null);
  const [_error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: any) => state.token.user);

  const fetchRequest = async () => {
    try {
      if (!id) return;
      const request = await getRequestWithApplicantAndRequestDetails(
        parseInt(id)
      );
      console.log(request);
      console.log(request.data);

      if (request.statusCode == 200) {
        setRequest(request.data);

        console.log(request.data.applicant);
        const applicantProfileResponse = await getApplicantProfileById(
          request.data.applicant.id
        );
        const fullName = `${applicantProfileResponse.data.firstName} ${applicantProfileResponse.data.lastName}`;
        setApplicant({ ...request.data.applicant, fullName });
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
  }, []);
  if (!id) return <NotFound />;
  if (loading) {
    return <Spin size="large" />;
  }
  return (
    <div>
      <div className="relative">
        <ScholarshipProgramBackground />
        <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-between items-start p-[40px] z-10">
          <div>
            <Breadcrumb className="">
              <BreadcrumbList className="text-black">
                <BreadcrumbItem>
                  <Link to="/" className="md:text-xl text-lg ">
                    Home
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    to="/services"
                    className=" text-[#000] md:text-xl font-medium text-lg"
                  >
                    Services
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    to={`/services/${service.id}`}
                    className=" text-[#000] md:text-lg text-md font-semibold"
                  >
                    {service.name}
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    to={`/services/${service.id}`}
                    className=" text-[#000] md:text-xl text-lg font-bold"
                  >
                    Requests
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    to={
                      user.role === "Applicant"
                        ? `/applicant/requestinformation/${request.id}`
                        : `/provider/requestinformation/${request.id}`
                    }
                    className="text-[#000] md:text-xl text-lg font-extrabold"
                  >
                    {applicant.fullName}
                  </Link>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="w-full">
            <div className="lg:flex-row items-center :lg:items-center flex-row flex gap-[20px] ">
              <SchoolLogo
                imageUrl={
                  applicant.avatarUrl ?? "https://github.com/shadcn.png"
                }
              />
              <div>
                <p className="text-white text-4xl font-semibold hover:text-indigo-300 transition-colors duration-300">
                  <FaUserCircle className="inline-block mr-2 text-indigo-200" />
                  {applicant.fullName}
                </p>
                <p className="text-white text-xl mt-2 flex items-center space-x-2">
                  <FaEnvelope className="text-indigo-200" />
                  <span className="lg:block hidden">{applicant.email}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white lg:bg-white drop-shadow-[0_0_5px_rgba(0,0,0,0.1)] lg:drop-shadow-[0_5px_25px_rgba(0,0,0,0.05)] relative ">
        <section className="max-w-container flex items-center justify-center mx-auto py-[24px] lg:py-[40px] px-4 lg:px-0">
          <div className="text-center">
            <h2 className="text-4xl md:text-4xl font-semibold text-gray-800 mb-4">
              {applicant.fullName}'s Request Details
            </h2>
            <p className="text-xl md:text-2xl text-gray-600">
              Review request details here.
            </p>
          </div>
        </section>
      </div>
      <section className="bg-white lg:bg-grey-lightest py-[40px] md:py-[60px]">
        <div className="max-w-[1216px] mx-auto">
          <div className="mb-[24px] px-[16px] xsm:px-[24px] 2xl:px-0">
            <p className="text-4xl md:text-4xl font-semibold text-gray-800 mb-4">
              Request Details for {service.name}
              <span className="block bg-sky-500 w-[24px] h-[6px] rounded-[8px] mt-[4px]"></span>
            </p>
            <RequestDetailTable
              showButtons={showButtons}
              request={request}
              fetchRequest={fetchRequest}
              requestDetails={requestDetails}
              description={request.description}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApplicantRequestInfo;
