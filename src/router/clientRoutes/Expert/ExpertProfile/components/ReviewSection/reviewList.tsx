import React, { Fragment } from "react";
import { formatDate } from "@/lib/date-formatter";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

type ApprovalItem = {
  id: number;
  applicantName: string;
  scholarshipProgramId: number;
  scholarshipName: string;
  university: string;
  appliedDate: string;
  status: "Reviewing" | "Approved" | "Rejected";
  details: string;
  documentUrl?: string;
  applicationReviews?: { id: number, description: string, score: number, expertId: number, status: string }[];

};

type ApprovalTableProps = {
  applications: ApprovalItem[];
  onRowClick: (item: ApprovalItem, review: any) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  document: any;
};

const ReviewList: React.FC<ApprovalTableProps> = ({
  applications,
  onRowClick,
  document,
}) => {
  const user = useSelector((state: any) => state.token.user);
  return (
    <div className="space-y-8">
      <div className="overflow-auto bg-white shadow rounded-lg">
        <h1 className="text-lg p-4 text-green-700">Review Milestone: Application Review</h1>
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">#</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Applicant</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Scholarship Name</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">University</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Applied On</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Score</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">No applicants to review</td>
              </tr>
            ) : (
              applications.map((item,index) => (
                <Fragment key={item.id}>
                  {item.applicationReviews?.filter((app) => app.description === "Application Review").map((review) => {
                    if (review.expertId != user.id) return null;
                    const isScored = review.score !== null && review.score !== undefined && review.score > 0;
                    const score = review.score !== undefined ? review.score : "Not Scored";
                    return (
                      <tr key={review.id} onClick={() => onRowClick(item, review)} className="hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-800">{index + 1}</td>
                        <td className="p-4 text-sm text-gray-800">{item.applicantName}</td>
                        <td className="p-4 text-sm text-gray-800">{item.scholarshipName}</td>
                        <td className="p-4 text-sm text-gray-800">{item.university}</td>
                        <td className="p-4 text-sm text-gray-800">{new Date(item.appliedDate).toLocaleDateString("en-US")}</td>
                        <td className="p-4 text-sm text-gray-800">{score}</td>
                        <td className={`p-4 text-sm font-medium ${review.status === "Passed" ? "text-green-600" : review.status === "Failed" ? "text-red-600" : "text-yellow-600"}`}>
                          {review.status}
                        </td>
                        <td className="p-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Button className={`w-full h-full ${isScored ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"}`} onClick={(e) => { e.stopPropagation(); if (!isScored) onRowClick(item, review); }} disabled={isScored}>
                              <Link to={document} target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg">Review Document</Link>
                            </Button>
                            <Button className={`w-full h-full ${isScored ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-500 text-white"}`} onClick={(e) => { e.stopPropagation(); if (!isScored) onRowClick(item, review); }} disabled={isScored}>
                              {isScored ? "Scored" : "Score"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-auto bg-white shadow rounded-lg">
        <h1 className="text-lg p-4 text-green-700">Review Milestone: Interview</h1>
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">#</th>

              <th className="p-4 text-left text-sm font-semibold text-gray-600">Applicant</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Scholarship Name</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">University</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Applied On</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Score</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">No applicants to review</td>
              </tr>
            ) : (
              applications.map((item,index) => (
                <Fragment key={item.id}>
                  {item.applicationReviews?.filter((app) => app.description === "Interview").map((review) => {
                    if (review.expertId != user.id) return null;
                    const isScored = review.score !== null && review.score !== undefined && review.score > 0;
                    const score = review.score !== undefined ? review.score : "Not Scored";
                    return (
                      <tr key={review.id} onClick={() => onRowClick(item, review)} className="hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-800">{index + 1}</td>

                        <td className="p-4 text-sm text-gray-800">{item.applicantName}</td>
                        <td className="p-4 text-sm text-gray-800">{item.scholarshipName}</td>
                        <td className="p-4 text-sm text-gray-800">{item.university}</td>
                        <td className="p-4 text-sm text-gray-800">{new Date(item.appliedDate).toLocaleDateString("en-US")}</td>
                        <td className="p-4 text-sm text-gray-800">{score}</td>
                        <td className={`p-4 text-sm font-medium ${review.status === "Passed" ? "text-green-600" : review.status === "Failed" ? "text-red-600" : "text-yellow-600"}`}>
                          {review.status}
                        </td>
                        <td className="p-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Button className={`w-full h-full ${isScored ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"}`} onClick={(e) => { e.stopPropagation(); if (!isScored) onRowClick(item, review); }} disabled={isScored}>
                              <Link to={document} target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg">Review Document</Link>
                            </Button>
                            <Button className={`w-full h-full ${isScored ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-500 text-white"}`} onClick={(e) => { e.stopPropagation(); if (!isScored) onRowClick(item, review); }} disabled={isScored}>
                              {isScored ? "Scored" : "Score"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewList;
