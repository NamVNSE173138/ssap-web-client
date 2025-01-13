import React, { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "@/constants/api";
import axios from "axios";
import { notification } from "antd";
import * as Dialog from "@radix-ui/react-dialog";
import * as Card from "@radix-ui/react-slot";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ScreenSpinner from "@/components/ScreenSpinner";
import { z } from "zod";

type ApprovalItem = {
  id: number;
  applicantId: number;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
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
  criteria?: {
    name: string;
    description: string;
    percentage: string;
  }[];
  applicationDocuments?: {
    applicationId: number;
    type: string;
    name: string;
    fileUrl: string;
  }[];
  applicationReviews?: {
    id: number;
    applicantName: string;
    description: string;
    score: number;
    expertId: number;
    status: string;
  }[];
  updatedAt: string;
};

const expertReviewSchema = z.object({
  score: z.string().min(1).max(100, "Score must be between 1 and 100"),
  description: z.string().min(1, "Description is required"),
});

const ReviewList: React.FC = () => {
  const [applications, setApplications] = useState<ApprovalItem[]>([]);
  const user = useSelector((state: any) => state.token.user);
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [comment, setComment] = useState("");
  const [score, setScore] = useState<number | string>("");
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [criteriaScores, setCriteriaScores] = useState<{
    [key: string]: number;
  }>({});

  const calculateTotalScore = () => {
    if (!selectedItem?.criteria) return 0;

    const totalWeightedScore = selectedItem.criteria.reduce(
      (acc, criterion) => {
        const criterionScore = criteriaScores[criterion.name] || 0; // Lấy điểm cho tiêu chí (mặc định 0 nếu không có)
        return acc + (criterionScore * parseFloat(criterion.percentage)) / 100; // Nhân với phần trăm
      },
      0
    );

    const totalPercentage = selectedItem.criteria.reduce(
      (acc, criterion) => acc + parseFloat(criterion.percentage),
      0
    );

    return totalPercentage > 0 ? totalWeightedScore.toFixed(2) : 0; // Tránh chia cho 0
  };

  const handleCriterionScoreChange = (name: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setCriteriaScores((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  console.log("select", selectedItem);

  const handleRowClick = (item: ApprovalItem, review: any) => {
    if (review.expertId != user.id) return;

    const isScored =
      review.score !== null && review.score !== undefined && review.score > 0;

    if (isScored) {
      notification.info({
        message:
          "This application has already been scored. You cannot score it again.",
      });
      return;
    }
    setSelectedItem(item);
    setSelectedReview(review);
    // window.open(item.documentUrl, "_blank");
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

      // const scholarshipResponse = await axios.get(
      //   `${BASE_URL}/api/scholarship-programs/${expertAssign[2].scholarshipProgramId}`
      //   // `${BASE_URL}/api/scholarship-programs/${applications[0].scholarshipProgramId}`
      // );
      // console.log("ScPL", scholarshipResponse.data.data);

      const detailedApplications = await Promise.all(
        expertAssign
          .filter((app: any) => app.scholarshipProgramId == scholarshipId)
          .map(async (app: any) => {
            const applicantResponse = await axios.get(
              `${BASE_URL}/api/accounts/${app.applicantId}`
            );
            console.log("APpppppppppppp", applicantResponse.data);
            const scholarshipResponse = await axios.get(
              `${BASE_URL}/api/scholarship-programs/${app.scholarshipProgramId}`
              // `${BASE_URL}/api/scholarship-programs/${applications[0].scholarshipProgramId}`
            );
            console.log("ScPL", scholarshipResponse.data.data);
            return {
              id: app.id,
              applicantName: app.applicantName,
              applicantPhone: applicantResponse.data.phoneNumber,
              applicantEmail: applicantResponse.data.email,
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
              criteria: scholarshipResponse.data.data.criteria,
              applicationReviews: app.applicationReviews,
              applicationDocuments: app.applicationDocuments,
            };
          })
      );
      setApplications(detailedApplications);
      console.log("detail", detailedApplications);
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

  const handleScoreSubmit = async () => {
    const totalScore = calculateTotalScore(); // Tính total score
    setScore(totalScore);

    if (!selectedItem || !selectedReview || totalScore === "") {
      notification.error({ message: "Please input a score" });
      return;
    }
    setIsLoading(true);
    try {
      expertReviewSchema.parse({
        score: score.toString(),
        description: comment,
      });

      const reviewId = selectedReview.id;
      if (!reviewId) {
        console.error("Review ID not found.");
        return;
      }

      let isReview = true;

      if (selectedReview.description.toLowerCase() === "application review") {
        isReview = true;
      } else {
        isReview = false;
      }

      const numericScore = Number(score);
      const payload = {
        applicationReviewId: reviewId,
        comment,
        isPassed: numericScore >= 50,
        score: numericScore,
        isFirstReview: isReview,
      };
      await axios.put(`${BASE_URL}/api/applications/reviews/result`, payload);
      notification.success({ message: "Review submitted successfully" });
      setIsLoading(false);
      setSelectedItem(null);
      await fetchApplicationReview();
      setScore("");
      setComment("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map((err) => err.message).join(", ");
        notification.error({ message: `Validation failed: ${errorMessage}` });
      } else {
        notification.error({ message: "Failed to submit review" });
      }
      setIsLoading(false);
    }
  };
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
                        <tr key={review.id} className="hover:bg-gray-50">
                          <td className="p-4 text-sm text-gray-800">
                            {index + 1}
                          </td>
                          <td className="p-4 text-sm text-gray-800">
                            {item.applicationReviews
                              ? item.applicationReviews[0].applicantName
                              : ""}
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
                              review.status === "Approved" ||
                              review.status === "Passed"
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
                          onClick={(e) => e.stopPropagation()}
                          //onClick={() =>  handleRowClick(item, review)}
                          className="hover:bg-gray-50"
                        >
                          <td className="p-4 text-sm text-gray-800">
                            {index + 1}
                          </td>

                          <td className="p-4 text-sm text-gray-800">
                            {item.applicationReviews
                              ? item.applicationReviews[0].applicantName
                              : ""}
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
                              review.status === "Passed" ||
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
                              {/* <Button
                                className={`w-full h-full ${
                                  isScored
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-500 text-white"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isScored) handleRowClick(item, review);
                                }}
                                // disabled={isScored}
                              >
                                
                                Review Document
                              </Button> */}
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
      <Dialog.Root
        open={!!selectedItem}
        onOpenChange={() => setSelectedItem(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray p-6 rounded-lg shadow-lg max-w-[800px] w-full">
            {selectedItem && (
              <div>
                <Dialog.Title className="text-2xl font-bold text-black">
                  Application Review
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-gray-600">
                  {" "}
                </Dialog.Description>
                <div className="border border-gray-300 "> </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="grid grid-rows-2 gap-3">
                    <Card.Slot>
                      <div className="bg-white mt-4 rounded-lg shadow-3 p-3 space-y-1 ">
                        <h3 className="text-lg font-semibold text-black mb-4">
                          Applicant Information
                        </h3>
                        <p>
                          <strong>Name:</strong> {selectedItem.applicantName}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedItem.applicantEmail}
                        </p>
                        <p>
                          <strong>Phone:</strong> {selectedItem.applicantPhone}
                        </p>
                        <p>
                          <strong>University:</strong> {selectedItem.university}
                        </p>
                        <p>
                          <strong>Scholarship Program:</strong>{" "}
                        </p>
                        {selectedItem.scholarshipName}
                        <p>
                          <strong>Applied On:</strong>{" "}
                          {new Date(
                            selectedItem.appliedDate
                          ).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </Card.Slot>
                    <Card.Slot>
                      <div className=" bg-white rounded-lg shadow-3 p-3">
                        <h3 className="text-lg font-semibold text-black relative">
                          Submitted Documents{" "}
                          <span className="absolute top-0 text-xs ml-1 text-red-500">
                            ({selectedItem?.applicationDocuments?.length})
                          </span>
                        </h3>
                        <div className="max-h-48 overflow-y-auto overflow-hidden mt-3">
                          {selectedItem?.applicationDocuments ? (
                            selectedItem.applicationDocuments.length > 0 ? (
                              <ul className=" space-y-1">
                                {selectedItem.applicationDocuments.map(
                                  (doc) => (
                                    <li
                                      key={doc.applicationId + doc.name}
                                      className="flex items-center justify-between p-2 rounded-lg"
                                    >
                                      <Link
                                        to={doc.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                      >
                                        <span>- {doc.name}</span>
                                      </Link>
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No documents available.
                              </p>
                            )
                          ) : (
                            <p className="text-sm text-gray-500">
                              Loading documents...
                            </p>
                          )}
                        </div>
                      </div>
                    </Card.Slot>
                  </div>

                  {/* Add form for scoring */}
                  <div className="col-span-2">
                    <Card.Slot>
                      <div className="bg-white mt-4 rounded-lg shadow-3 p-3">
                        <div>
                          <h3 className="text-lg font-semibold text-black relative">
                            Scoring Criteria{" "}
                            <span className="absolute top-0 text-xs ml-1 text-red-500">
                              ({selectedItem?.criteria?.length})
                            </span>
                          </h3>
                          <div className="max-h-[150px] overflow-y-auto overflow-hidden mt-3 shadow-2 rounded-md">
                            {selectedItem?.criteria ? (
                              selectedItem.criteria.length > 0 ? (
                                <ul className="space-y-1">
                                  {selectedItem.criteria.map((criteria) => (
                                    <li
                                      key={criteria.name}
                                      className="flex items-center justify-between p-2 rounded-lg"
                                    >
                                      <p className="font-semibold">
                                        {" "}
                                        {criteria.name}{" "}
                                        <span className="text-sm">
                                          {" "}
                                          ({criteria.percentage} %)
                                        </span>
                                      </p>
                                      <span>
                                        <Input
                                          type="number"
                                          min={0}
                                          max={100}
                                          value={
                                            criteriaScores[criteria.name] || ""
                                          }
                                          onChange={(e) =>
                                            handleCriterionScoreChange(
                                              criteria.name,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No criteria available.
                                </p>
                              )
                            ) : (
                              <p className="text-sm text-gray-500">
                                Loading criteria...
                              </p>
                            )}
                          </div>
                          <div className="flex justify-end items-center gap-5">
                            <Label className=" text-md font-semibold text-black">
                              Total Score
                            </Label>
                            <Input
                              value={calculateTotalScore()}
                              readOnly
                              className="w-2/3 h-full p-3 mt-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="">
                          {/* <Label className="block text-sm font-medium text-gray-700">
                            Score
                          </Label>
                          <Input
                            type="number"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            className="w-full h-full p-3 mt-2 border border-gray-300 rounded-lg"
                            placeholder="Enter score (1-100)"
                            min={1}
                            max={100}
                          /> */}

                          <Label className="block text-lg font-semibold text-black mt-7">
                            Comment
                          </Label>
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-4 mt-2 border border-gray-300 rounded-lg"
                            placeholder="Enter comment"
                            rows={5}
                          />
                          <div className="flex justify-end">
                            <Button
                              onClick={handleScoreSubmit}
                              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg"
                            >
                              Submit Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card.Slot>
                  </div>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
        {isLoading && <ScreenSpinner />}
      </Dialog.Root>
    </div>
  );
};

export default ReviewList;
