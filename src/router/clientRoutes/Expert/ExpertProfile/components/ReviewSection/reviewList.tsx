import React, { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "@/constants/api";
import axios from "axios";
import { notification } from "antd";

type ApprovalItem = {
  id: number;
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
  applicationReviews?: {
    id: number;
    applicantName: string;
    description: string;
    score: number;
    expertId: number;
    status: string;
  }[];  
};



const ReviewList: React.FC = () => {
  const [applications, setApplications] = useState<ApprovalItem[]>([]);
  const user = useSelector((state: any) => state.token.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {id} = useParams();

  const handleRowClick = (item: ApprovalItem, review: any) => {
    if (review.expertId !== user.id) return;
    const isScored =
      review.score !== null && review.score !== undefined && review.score > 0;

    if (isScored) {
      notification.info({
        message:
          "This application has already been scored. You cannot score it again.",
      });
      return; // Prevent opening dialog
    }
    // onRowClick(item, review);
    window.open(item.documentUrl, "_blank");
  };

  const fetchApplicationReview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/experts/${user.id}/assigned-applications`
      );
      const expertAssign = response.data.data;
      console.log("API response:", expertAssign);  
      
      const scholarshipId = id;
      console.log("scholarshipId:", scholarshipId);  

      const filteredApplications = expertAssign.filter((app: any) => {
        console.log("app.scholarshipProgram.id:", app.scholarshipProgramId);
        console.log("scholarshipId:", scholarshipId);
        
        return Number(app.scholarshipProgramId) == Number(scholarshipId);
      });
      console.log("filter",filteredApplications);
      
  
      const detailedApplications = await Promise.all(
        expertAssign
          .filter((app: any) => app.scholarshipProgramId == scholarshipId)  
          .map(async (app: any) => {
            const applicantResponse = await axios.get(
              `${BASE_URL}/api/accounts/${app.applicantId}`
            );
            const scholarshipResponse = await axios.get(
              `${BASE_URL}/api/scholarship-programs/${app.scholarshipProgramId}`
            );
            return {
              id: app.id,
              applicantName: applicantResponse.data.username,
              scholarshipProgramId: app.scholarshipProgramId,
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
            };
          })
      );
      setApplications(detailedApplications);
      console.log("detailapplication",detailedApplications);
      
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
  return (
    <div className="space-y-8">
      <div className="overflow-auto bg-white shadow rounded-lg">
        <h1 className="text-lg p-4 text-green-700">
          Review Milestone: Application Review
        </h1>
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                #
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Applicant Name
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Scholarship Name
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                University
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Applied On
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Score
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {applications && applications.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  No applicants to review
                </td>

              </tr>
            ) : Array.isArray(applications) && applications.length > 0 ? (
              applications.map((item, index) => (
                <Fragment key={item.id}>
                  {item.applicationReviews
                    ?.filter((app) => app.description === "Application Review")
                    .map((review) => {
                      if (review.expertId != user.id) return null;
                      const isScored =
                        review.score !== null &&
                        review.score !== undefined &&
                        review.score > 0;
                      const score =
                        review.score !== undefined
                          ? review.score
                          : "Not Scored";
                      return (
                        <tr
                          key={review.id}
                          onClick={() => handleRowClick(item, review)}
                          className="hover:bg-gray-50"
                        >
                          <td className="p-4 text-sm text-gray-800">
                            {index + 1}
                          </td>
                          <td className="p-4 text-sm text-gray-800">
                          {item.applicationReviews ? item.applicationReviews[0].applicantName : ""}
                          </td>
                          <td className="p-4 text-sm text-gray-800">
                            {item.scholarshipName}
                          </td>
                          <td className="p-4 text-sm text-gray-800">
                            {item.university}
                          </td>
                          <td className="p-4 text-sm text-gray-800">
                            {new Date(item.appliedDate).toLocaleDateString(
                              "en-US"
                            )}
                          </td>
                          <td className="p-4 text-sm text-gray-800">{score}</td>
                          <td
                            className={`p-4 text-sm font-medium ${
                              review.status === "Approved"
                                ? "text-green-600"
                                : review.status === "Failed"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {review.status}
                          </td>
                          <td className="p-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Button
                                className={`w-full h-full ${
                                  isScored
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-500 text-white"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isScored) handleRowClick(item, review);
                                }}
                                disabled={isScored}
                              >
                                <Link
                                  to={item.documentUrl ?? " "}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block rounded-lg"
                                >
                                  Review Document
                                </Link>
                              </Button>
                              <Button
                                className={`w-full h-full ${
                                  isScored
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-green-500 text-white"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isScored) handleRowClick(item, review);
                                }}
                                disabled={isScored}
                              >
                                {isScored ? "Scored" : "Score"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-auto bg-white shadow rounded-lg">
        <h1 className="text-lg p-4 text-green-700">
          Review Milestone: Interview
        </h1>
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                #
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Applicant Name
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Scholarship Name
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                University
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Applied On
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Score
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {applications && applications.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  No applicants to review
                </td>
              </tr>
            ) : Array.isArray(applications) && applications.length > 0 ? (
              applications.map((item, index) => (
                <Fragment key={item.id}>
                  {item.applicationReviews
                    ?.filter((app) => app.description === "Interview")
                    .map((review) => {
                      if (review.expertId != user.id) return null;
                      const isScored =
                        review.score !== null &&
                        review.score !== undefined &&
                        review.score > 0;
                      const score =
                        review.score !== undefined
                          ? review.score
                          : "Not Scored";
                      return (
                        <tr
                          key={review.id}
                          onClick={() => handleRowClick(item, review)}
                          className="hover:bg-gray-50"
                        >
                          <td className="p-4 text-sm text-gray-800">
                            {index + 1}
                          </td>

                          <td className="p-4 text-sm text-gray-800">
                            {item.applicationReviews ? item.applicationReviews[0].applicantName : ""}
                          </td>
                          <td className="p-4 text-sm text-gray-800">
                            {item.scholarshipName}
                          </td>
                          <td className="p-4 text-sm text-gray-800">
                            {item.university}
                          </td>
                          <td className="p-4 text-sm text-gray-800">
                            {new Date(item.appliedDate).toLocaleDateString(
                              "en-US"
                            )}
                          </td>
                          <td className="p-4 text-sm text-gray-800">{score}</td>
                          <td
                            className={`p-4 text-sm font-medium ${
                              review.status === "Approved"
                                ? "text-green-600"
                                : review.status === "Failed"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {review.status}
                          </td>
                          <td className="p-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Button
                                className={`w-full h-full ${
                                  isScored
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-500 text-white"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isScored) handleRowClick(item, review);
                                }}
                                disabled={isScored}
                              >
                                <Link
                                  to={item?.documentUrl ?? " "}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block rounded-lg"
                                >
                                  Review Document
                                </Link>
                              </Button>
                              <Button
                                className={`w-full h-full ${
                                  isScored
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-green-500 text-white"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isScored) handleRowClick(item, review);
                                }}
                                disabled={isScored}
                              >
                                {isScored ? "Scored" : "Score"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default ReviewList;
