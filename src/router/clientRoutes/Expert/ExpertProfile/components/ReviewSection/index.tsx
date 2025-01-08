import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { useSelector } from "react-redux";
import ReviewList from "./reviewList";
import { formatDate } from "@/lib/date-formatter";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as Tabs from "@radix-ui/react-tabs";
import ScreenSpinner from "@/components/ScreenSpinner";
import { notification } from "antd";
import { getAllReviewMilestonesByScholarship } from "@/services/ApiServices/reviewMilestoneService";
import { z } from "zod";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { formatNaturalDate } from "@/lib/dateUtils";
import formatCurrency from "@/lib/currency-formatter";
import { Link } from "react-router-dom";
import RouteNames from "@/constants/routeNames";

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
    description: string;
    score: number;
    expertId: number;
    status: string;
  }[];
};

const expertReviewSchema = z.object({
  score: z.string(),
  description: z.string(),
});

const ApprovalList: React.FC = () => {
  const user = useSelector((state: any) => state.token.user);
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<ApprovalItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [score, setScore] = useState<number | string>("");
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  // const handleRowClick = (item: ApprovalItem, review: any) => {
  //   if (review.expertId != user.id) return;
  //   const isScored =
  //     review.score !== null && review.score !== undefined && review.score > 0;

  //   if (isScored) {
  //     notification.info({
  //       message:
  //         "This application has already been scored. You cannot score it again.",
  //     });
  //     return; 
  //   }
  //   setSelectedItem(item);
  //   setSelectedReview(review);
  //   setScore("");
  //   setComment("");
  //   window.open(item.documentUrl, "_blank");
  // };

  // const handleApprove = async (id: number) => {
  //   try {
  //     await axios.put(`${BASE_URL}/api/applications/${id}`, {
  //       status: "Approved",
  //     });
  //     setApplications((prev) =>
  //       prev.map((app) =>
  //         app.id === id ? { ...app, status: "Approved" } : app
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Failed to approve application:", error);
  //   }
  // };

  // const handleReject = async (id: number) => {
  //   try {
  //     await axios.put(`${BASE_URL}/api/applications/${id}`, {
  //       status: "Rejected",
  //     });
  //     setApplications((prev) =>
  //       prev.map((app) =>
  //         app.id === id ? { ...app, status: "Rejected" } : app
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Failed to reject application:", error);
  //   }
  // };

  // const handleScoreSubmit = async () => {
  //   if (!selectedItem || !selectedReview || score === "") {
  //     notification.error({ message: "Please input a score" });
  //     return;
  //   }
  //   setIsLoading(true);
  //   try {
  //     expertReviewSchema.parse({
  //       score: score.toString(),
  //       description: comment,
  //     });

  //     const reviewId = selectedReview.id;
  //     if (!reviewId) {
  //       console.error("Review ID not found.");
  //       return;
  //     }

  //     const reviewMilestone = await getAllReviewMilestonesByScholarship(
  //       selectedItem.scholarshipProgramId
  //     );

  //     const currentDate = new Date();
  //     let isReview = true;
  //     reviewMilestone?.data.forEach((review: any) => {
  //       if (
  //         new Date(review.fromDate) < currentDate &&
  //         new Date(review.toDate) > currentDate
  //       ) {
  //         if (review.description.toLowerCase() === "application review") {
  //           isReview = true;
  //         } else {
  //           isReview = false;
  //         }
  //       }
  //     });

  //     const numericScore = Number(score);
  //     const payload = {
  //       applicationReviewId: reviewId,
  //       comment,
  //       isPassed: numericScore >= 50,
  //       score: numericScore,
  //       isFirstReview: isReview,
  //     };
  //     await axios.put(`${BASE_URL}/api/applications/reviews/result`, payload);
  //     notification.success({ message: "Review submitted successfully" });
  //     setIsLoading(false);
  //     setSelectedItem(null);
  //     fetchApplicationReview();
  //     setScore("");
  //     setComment("");
  //   } catch (error) {
  //     if (error instanceof z.ZodError) {
  //       const errorMessage = error.errors.map((err) => err.message).join(", ");
  //       notification.error({ message: `Validation failed: ${errorMessage}` });
  //     } else {
  //       notification.error({ message: "Failed to submit review" });
  //     }
  //     setIsLoading(false);
  //   }
  // };

  const filteredApplications = applications.filter((app) =>
    [app.applicantName, app.scholarshipName, app.university].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Grouping applications by scholarship name
  const groupedApplications = filteredApplications.reduce((acc, app) => {
    if (!acc[app.scholarshipProgramId]) {
      acc[app.scholarshipProgramId] = [];
    }
    acc[app.scholarshipProgramId].push(app);
    return acc;
  }, {} as Record<string, ApprovalItem[]>);

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
            Object.entries(groupedApplications).map(
              ([scholarshipName, apps]) => (
                <div key={scholarshipName}>
                  <Link to={`/expert/review-application/scholarshipProgram/${apps[0]?.scholarshipProgramId}`}>
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
                                    app.scholarshipProgramId == scholarshipName
                                )?.scholarshipName
                              }
                            </h2>
                          </div>
                          <div className="flex items-center gap-6 mt-2 text-sm text-gray-500">
                            <div className="flex flex-col">
                              <h3 className="text-sm font-semibold">
                                Deadline
                              </h3>
                              <span className="text-sm text-black font-semibold">
                                {apps[0]?.scholarshipDeadline
                                  ? formatNaturalDate(
                                      apps[0].scholarshipDeadline
                                    )
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            )
          )}

          {/* Chấm điểm phần */}
          <Dialog.Root
            open={!!selectedItem}
            onOpenChange={() => setSelectedItem(null)}
          >
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-md">
                {selectedItem && (
                  <div>
                    <Dialog.Title className="text-2xl font-bold">
                      {selectedItem.scholarshipName}
                    </Dialog.Title>
                    <Dialog.Description className="mt-2 text-sm text-gray-600">
                      {selectedItem.details}
                    </Dialog.Description>

                    <div className="mt-4">
                      <p>
                        <strong>Applicant:</strong> {selectedItem.applicantName}
                      </p>
                      <p>
                        <strong>University:</strong> {selectedItem.university}
                      </p>
                      <p>
                        <strong>Applied On:</strong>{" "}
                        {formatDate(selectedItem.appliedDate)}
                      </p>
                    </div>

                    {/* Add form for scoring */}
                    <div className="mt-4">
                      <Label className="block text-sm font-medium text-gray-700">
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
                      />

                      <Label className="block text-sm font-medium text-gray-700 mt-4">
                        Comment
                      </Label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                        placeholder="Enter comment"
                      />

                      <Button
                        // onClick={handleScoreSubmit}
                        className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg"
                      >
                        Submit Review
                      </Button>
                    </div>
                  </div>
                )}
              </Dialog.Content>
            </Dialog.Portal>
            {isLoading && <ScreenSpinner />}
          </Dialog.Root>
        </div>
      </div>
    </Tabs.Content>
  );
};

export default ApprovalList;

{
  /* <ReviewList
                      applications={apps}
                      onRowClick={handleRowClick}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      document={selectedItem?.documentUrl}
                    /> */
}
