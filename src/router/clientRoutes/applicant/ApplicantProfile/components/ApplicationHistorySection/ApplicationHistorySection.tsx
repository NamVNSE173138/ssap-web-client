import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { getApplicationsByApplicant } from "@/services/ApiServices/applicantProfileService";
import { notification } from "antd";
import { compareDate, formatNaturalDate } from "@/lib/dateUtils";

interface ApplicationDocument {
  id: number;
  name: string;
  type: string;
  fileUrl: string;
  applicationId: number;
}

interface Application {
  id: number;
  appliedDate: string;
  status: string;
  applicantId: number;
  scholarshipProgram: any;
  applicationDocuments: ApplicationDocument[];
  applicationReviews: any[];
}

const ApplicationHistorySection = (_props: any) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const applicant = useSelector((state: any) => state.token.user);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getApplicationsByApplicant(
          Number(applicant?.id),
        );

        const data = response.data.sort((a: any, b: any) =>
          compareDate(a.appliedDate, b.appliedDate),
        );

        const filteredApplications = data.filter((application: any) => {
          const matchesSearch = application.scholarshipProgram.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const matchesStatus =
            statusFilter === "" || application.status === statusFilter;

          return matchesSearch && matchesStatus;
        });

        setApplications(filteredApplications);
        // if (data && Array.isArray(data.data)) {
        //   setApplications(data.data);
        // } else {
        //   setApplications([]);
        // }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [searchTerm, statusFilter]);

  // if (loading) return <Spinner />;

  if (error) {
    notification.error({
      message: "Error",
      description: error,
    });
  }

  return (
    <Tabs.Content value="application-history" className="pt-4">
      {/* <div className="grid grid-cols-12"> */}
      {/*   <div className="col-span-12 p-10"> */}
      {/*     <h2 className="text-3xl font-bold text-black mb-6 animate-slideIn"> */}
      {/*       Application History */}
      {/*     </h2> */}
      {/*     {applications.length === 0 ? ( */}
      {/*       <p className="text-gray-600">No applications found.</p> */}
      {/*     ) : ( */}
      {/*       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"> */}
      {/*         {applications.map((application) => ( */}
      {/*           <Link */}
      {/*             to={`/scholarship-program/${application.scholarshipProgramId}`} */}
      {/*             key={application.id} */}
      {/*             className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 transform transition duration-300 hover:scale-105 hover:shadow-2xl animate-fadeIn" */}
      {/*           > */}
      {/*             <p className="text-lg font-semibold text-gray-800 mb-1"></p> */}
      {/*             <p className="text-sm text-gray-500 mb-2"> */}
      {/*               <strong className="text-black">Applied Date:</strong>{" "} */}
      {/*               {new Date(application.appliedDate).toLocaleDateString()} */}
      {/*             </p> */}
      {/*             <p */}
      {/*               className={`text-sm font-semibold mb-4 ${ */}
      {/*                 application.status === "APPROVED" || "Approved" */}
      {/*                   ? "text-green-600" */}
      {/*                   : application.status === "PENDING" */}
      {/*                     ? "text-yellow-500" */}
      {/*                     : "text-red-600" */}
      {/*               }`} */}
      {/*             > */}
      {/*               {application.status === "APPROVED" && ( */}
      {/*                 <FaCheckCircle className="text-green-600" /> */}
      {/*               )} */}
      {/*               {application.status === "PENDING" && ( */}
      {/*                 <FaClock className="text-yellow-500" /> */}
      {/*               )} */}
      {/*               {application.status === "REJECTED" && ( */}
      {/*                 <FaTimesCircle className="text-red-600" /> */}
      {/*               )} */}
      {/*               <strong className="text-black">Status:</strong>{" "} */}
      {/*               {application.status} */}
      {/*             </p> */}
      {/**/}
      {/*             <h4 className="text-sm font-semibold  mb-2 flex items-center gap-2"> */}
      {/*               <FaFileAlt className="text-[#1eb2a6]" /> */}
      {/*               <p className="text-black">Documents:</p> */}
      {/*             </h4> */}
      {/*             <ul className="space-y-1"> */}
      {/*               {application.applicationDocuments.map((doc) => ( */}
      {/*                 <li key={doc.id}> */}
      {/*                   <a */}
      {/*                     href={doc.fileUrl} */}
      {/*                     target="_blank" */}
      {/*                     rel="noopener noreferrer" */}
      {/*                     className="text-blue-500 hover:text-blue-700 underline transition duration-200 ease-in-out hover:scale-105" */}
      {/*                   > */}
      {/*                     {doc.name}{" "} */}
      {/*                     <span className="text-gray-400">({doc.type})</span> */}
      {/*                   </a> */}
      {/*                 </li> */}
      {/*               ))} */}
      {/*             </ul> */}
      {/*           </Link> */}
      {/*         ))} */}
      {/*       </div> */}
      {/*     )} */}
      {/*   </div> */}
      {/* </div> */}

      {/* New Section */}
      {/* Search bar and filter */}

      <div>
        <h1 className="text-3xl font-bold text-black mb-3">My Applications</h1>

        <div className="w-1/2 flex items-center gap-4 mb-6">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search by scholarship name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
          />

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option disabled>All Statuses</option>
            <option value="">Any</option>

            <option value="Pending">Submitted</option>
            <option value="Approved">NeedExtend</option>
          </select>
        </div>

        <div className="w-full flex flex-col gap-6 p-6">
          {!applications ||
            (applications.length === 0 && (
              <p className="text-gray-600">No applications found.</p>
            ))}

          {applications.map((application) => (
            <Link
              key={application.id}
              to={`/scholarship-program/${application.scholarshipProgram.id}`}
              className="w-full flex items-center justify-between bg-white rounded-lg shadow-lg p-4 border border-gray-200 transform transition duration-300 hover:scale-105 hover:shadow-2xl animate-fadeIn"
            >
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center">
                  <img
                    src={application.scholarshipProgram.imageUrl}
                    alt="Scholarship Logo"
                    className="rounded-md object-cover"
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <h2 className="text-lg text-black font-semibold">
                      {application.scholarshipProgram.name}
                    </h2>
                    <span className="w-fit px-4 py-1 text-sm font-semibold text-slate-500 bg-gray-100 rounded-full">
                      Applied on: {formatNaturalDate(application.appliedDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 mt-2 text-sm text-gray-500">
                    <div className="flex flex-col">
                      <h3 className="text-sm font-semibold">Deadline</h3>
                      <span className="text-sm text-black font-semibold">
                        {formatNaturalDate(
                          application.scholarshipProgram.deadline,
                        )}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-sm font-semibold">Award</h3>
                      <span className="text-sm text-black font-semibold">
                        ${application.scholarshipProgram.scholarshipAmount} per
                        winner
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-sm font-semibold">Education Level</h3>
                      <span className="text-sm text-black font-semibold">
                        {application.scholarshipProgram.educationLevel}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-sm font-semibold">
                        Your Submitted Documents
                      </h3>

                      <span className="text-sm text-black font-semibold">
                        <ul className="list-none inline-flex">
                          {application.applicationDocuments.length === 0 && (
                            <span>No Submitted Documents</span>
                          )}
                          {application.applicationDocuments.map(
                            (doc, index) => (
                              <div>
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700 underline transition duration-200 ease-in-out hover:scale-105"
                                >
                                  {doc.type}
                                </a>
                                {index <
                                  application.applicationDocuments.length -
                                    1 && (
                                  <span className="text-blue-500">,&nbsp;</span>
                                )}
                              </div>
                            ),
                          )}
                        </ul>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="w-fit px-4 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
                  {application.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Tabs.Content>
  );
};

export default ApplicationHistorySection;
