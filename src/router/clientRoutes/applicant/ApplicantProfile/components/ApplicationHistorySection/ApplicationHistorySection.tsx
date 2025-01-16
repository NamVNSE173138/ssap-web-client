import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { getApplicationsByApplicant } from "@/services/ApiServices/applicantProfileService";
import { notification } from "antd";
import { compareDate, formatNaturalDate } from "@/lib/dateUtils";
import formatCurrency from "@/lib/currency-formatter";

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
  const [_loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(applications?.length / ITEMS_PER_PAGE);
  const paginatedmApplications = applications?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const applicant = useSelector((state: any) => state.token.user);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getApplicationsByApplicant(
          Number(applicant?.id)
        );

        const data = response.data.sort((a: any, b: any) =>
          compareDate(a.appliedDate, b.appliedDate)
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

            <option value="Submitted">Submitted</option>
            <option value="NeedExtend">NeedExtend</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="w-full flex flex-col gap-6 p-6">
          {!paginatedmApplications ||
            (paginatedmApplications.length === 0 && (
              <p className="text-gray-600">No applications found.</p>
            ))}

          {paginatedmApplications.map((application) => (
            <Link
              key={application.id}
              to={`/scholarship-program/${application.scholarshipProgram.id}`}
              className="w-full flex items-center justify-between bg-white rounded-lg shadow-md hover:bg-teal-100 p-4 border border-gray-200 transform transition duration-300 animate-fadeIn"
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
                          application.scholarshipProgram.deadline
                        )}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-sm font-semibold">Award</h3>
                      <span className="text-sm text-black font-semibold">
                        $
                        {formatCurrency(
                          application.scholarshipProgram.scholarshipAmount,
                          "USD"
                        )}{" "}
                        per winner
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
                        <ul className="list-none">
                          {application.applicationDocuments.length === 0 && (
                            <span>No Submitted Documents</span>
                          )}
                          {application.applicationDocuments.map(
                            (doc, index) => (
                              <li key={index} className="mb-2">
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700 underline transition duration-200 ease-in-out hover:scale-105"
                                >
                                  {`${index + 1}. ${doc.type}`}
                                </a>
                              </li>
                            )
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
      <div
        style={{
          marginTop: "20px",
          marginBottom: "10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              backgroundColor:
                currentPage === index + 1 ? "#419f97" : "#f1f1f1",
              color: currentPage === index + 1 ? "white" : "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </Tabs.Content>
  );
};

export default ApplicationHistorySection;
