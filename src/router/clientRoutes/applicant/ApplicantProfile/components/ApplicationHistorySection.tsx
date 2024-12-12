import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "@/constants/api";

import { Link } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaFileAlt,
} from "react-icons/fa";

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
  scholarshipProgramId: number;
  applicationDocuments: ApplicationDocument[];
  applicationReviews: any[];
}

const ApplicationHistorySection = (_props: any) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applicant = useSelector((state: any) => state.token.user);
  const applicantId = applicant?.id;

  useEffect(() => {
    const fetchApplications = async () => {
      if (!applicantId) {
        setError("Applicant ID is not available.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}/api/applicants/${applicantId}/applications`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log("APPLICANT HISTORY", data.data);

        if (data && Array.isArray(data.data)) {
          setApplications(data.data);
        } else {
          setApplications([]);
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [applicantId]);

  if (loading)
    return (
      <div className="text-center text-blue-600 animate-pulse">Loading...</div>
    );
  if (error)
    return (
      <div className="text-center text-red-600 animate-fadeIn">
        Error: {error}
      </div>
    );

  return (
    <Tabs.Content value="application-history">
      <div className="grid grid-cols-12">
        <div className="col-span-12 p-10">
          <h2 className="text-3xl font-bold text-black mb-6 animate-slideIn">
            Application History
          </h2>
          {applications.length === 0 ? (
            <p className="text-gray-600">No applications found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {applications.map((application) => (
                <Link
                  to={`/scholarship-program/${application.scholarshipProgramId}`}
                  key={application.id}
                  className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 transform transition duration-300 hover:scale-105 hover:shadow-2xl animate-fadeIn"
                >
                  <p className="text-lg font-semibold text-gray-800 mb-1"></p>
                  <p className="text-sm text-gray-500 mb-2">
                    <strong className="text-black">Applied Date:</strong>{" "}
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </p>
                  <p
                    className={`text-sm font-semibold mb-4 ${
                      application.status === "APPROVED" || "Approved"
                        ? "text-green-600"
                        : application.status === "PENDING"
                        ? "text-yellow-500"
                        : "text-red-600"
                    }`}
                  >
                    {application.status === "APPROVED" && (
                      <FaCheckCircle className="text-green-600" />
                    )}
                    {application.status === "PENDING" && (
                      <FaClock className="text-yellow-500" />
                    )}
                    {application.status === "REJECTED" && (
                      <FaTimesCircle className="text-red-600" />
                    )}
                    <strong className="text-black">Status:</strong>{" "}
                    {application.status}
                  </p>

                  <h4 className="text-sm font-semibold  mb-2 flex items-center gap-2">
                    <FaFileAlt className="text-[#1eb2a6]" />
                    <p className="text-black">Documents:</p>
                  </h4>
                  <ul className="space-y-1">
                    {application.applicationDocuments.map((doc) => (
                      <li key={doc.id}>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 underline transition duration-200 ease-in-out hover:scale-105"
                        >
                          {doc.name}{" "}
                          <span className="text-gray-400">({doc.type})</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Tabs.Content>
  );
};

export default ApplicationHistorySection;
