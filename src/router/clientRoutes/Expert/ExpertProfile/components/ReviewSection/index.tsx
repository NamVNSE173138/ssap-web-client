import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import * as Tabs from "@radix-ui/react-tabs";

import { formatNaturalDate } from "@/lib/dateUtils";
import formatCurrency from "@/lib/currency-formatter";
import { Link } from "react-router-dom";

type ApprovalItem = {
  id: number;
  applicantId: number;
  applicantName: string;
  scholarshipProgramId: number;
  scholarshipName: string;
  scholarshipImage?: string;
  scholarshipDeadline?: string;
  scholarshipAmount?: string;
  university: string;
  appliedDate: string;
  status: "Reviewing" | "Approved" | "Rejected";
  details: string;
  documentUrl?: string;
  applicationDocs?: {
    applicationId: number;
    type: string;
    name: string;
    fileUrl: string;
  }[];
  applicationReviews?: {
    id: number;
    description: string;
    score: number;
    expertId: number;
    status: string;
  }[];
  updatedAt: string;
};

const ApprovalList: React.FC = () => {
  const user = useSelector((state: any) => state.token.user);

  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<ApprovalItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchApplicationReview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/experts/${user.id}/assigned-applications`
      );
      const rawApplications = response.data.data;

      const detailedApplications = await Promise.all(
        rawApplications.map(async (app: any) => {
          const applicantResponse = await axios.get(
            `${BASE_URL}/api/accounts/${app.applicantId}`
          );
          const scholarshipResponse = await axios.get(
            `${BASE_URL}/api/scholarship-programs/${app.scholarshipProgram.id}`
          );
          console.log("Scholarship Program:", app.scholarshipProgram);
          return {
            id: app.id,
            applicantName: applicantResponse.data.username,
            scholarshipProgramId: app.scholarshipProgram.id,
            scholarshipName: app.scholarshipProgram.name,
            scholarshipImage: app.scholarshipProgram.imageUrl,
            scholarshipDeadline: app.scholarshipProgram.deadline,
            scholarshipAmount: app.scholarshipProgram.scholarshipAmount,
            university: scholarshipResponse.data.data.university.name,
            appliedDate: app.appliedDate,
            status: app.status,
            details: scholarshipResponse.data.data.description,
            documentUrl: app.applicationDocuments?.[0]?.fileUrl,
            applicationReviews: app.applicationReviews,
            updatedAt: app.updatedAt,
            applicationDocuments: app.applicationDocuments,
          };
        })
      );
      console.log("rawApplications", rawApplications);
      console.log("detailedApplications", detailedApplications);

      setApplications(detailedApplications);
    } catch (err) {
      setError("Failed to fetch applications. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationReview();
  }, [user.id]);

  const filteredApplications = applications.filter((app) =>
    [app.applicantName, app.scholarshipName, app.university].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const groupedApplications = filteredApplications
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .reduce((acc, app) => {
      if (!acc[app.scholarshipProgramId]) {
        acc[app.scholarshipProgramId] = [];
      }
      acc[app.scholarshipProgramId].push(app);
      return acc;
    }, {} as Record<string, ApprovalItem[]>);

  console.log("GROUP", groupedApplications);

  // Sắp xếp lại các nhóm dựa trên appliedDate của ứng dụng đầu tiên trong mỗi nhóm
  const sortedGroupedApplications = Object.entries(groupedApplications).sort(
    ([, appsA], [, appsB]) => {
      const latestUpdatedAtA = Math.max(
        ...appsA.map((app) => new Date(app.updatedAt).getTime())
      );
      const latestUpdatedAtB = Math.max(
        ...appsB.map((app) => new Date(app.updatedAt).getTime())
      );

      return latestUpdatedAtB - latestUpdatedAtA;
    }
  );

  console.log("Sort", sortedGroupedApplications);

  return (
    <Tabs.Content value="review" className="pt-4">
      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-start-1 col-end-13 space-y-6">
          <h1 className="text-3xl font-bold">Awaiting Review List</h1>

          <Input
            type="text"
            placeholder="Search by applicant, scholarship, or university..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          {error && <div className="p-4 bg-red-100 text-red-800">{error}</div>}

          {loading ? (
            <p className="text-center text-lg">Loading...</p>
          ) : (
            sortedGroupedApplications.map(([scholarshipId, apps]) => (
              <div key={scholarshipId}>
                <Link
                  to={`/expert/review-application/scholarshipProgram/${apps[0]?.scholarshipProgramId}`}
                >
                  <div className="w-full flex items-center justify-between bg-white rounded-lg shadow-lg p-4 border border-gray-200 transform transition duration-300 hover:scale-105 hover:shadow-2xl animate-fadeIn">
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center">
                        <img
                          src={apps[0]?.scholarshipImage}
                          alt="Scholarship Logo"
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <h2 className="text-xl font-semibold">
                            {
                              apps.find(
                                (app: any) =>
                                  app.scholarshipProgramId == scholarshipId
                              )?.scholarshipName
                            }
                          </h2>
                        </div>
                        <div className="flex items-center gap-6 mt-2 text-sm text-gray-500">
                          <div className="flex flex-col">
                            <h3 className="text-sm font-semibold">Deadline</h3>
                            <span className="text-sm text-black font-semibold">
                              {apps[0]?.scholarshipDeadline
                                ? formatNaturalDate(apps[0].scholarshipDeadline)
                                : "No deadline available"}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-sm font-semibold">Award</h3>
                            <span className="text-sm text-black font-semibold">
                              {apps[0]?.scholarshipAmount &&
                              !isNaN(Number(apps[0]?.scholarshipAmount))
                                ? `$${formatCurrency(
                                    Number(apps[0]?.scholarshipAmount),
                                    "USD"
                                  )}`
                                : "No award available"}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-sm font-semibold">
                              Updated At
                            </h3>
                            <span className="text-sm text-black font-semibold">
                              {apps[0]?.appliedDate
                                ? formatNaturalDate(apps[0].appliedDate)
                                : "No updated date available"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </Tabs.Content>
  );
};

export default ApprovalList;
