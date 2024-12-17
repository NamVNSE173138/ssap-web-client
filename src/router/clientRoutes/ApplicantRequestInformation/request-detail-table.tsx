import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  IconButton,
  styled,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { updateFinishRequest } from "@/services/ApiServices/requestService";
import { useEffect, useState } from "react";
import {
  addFeedback,
  notifyFeedbackSuccess,
  updateFeedback,
} from "@/services/ApiServices/feedbackService";
import { Star } from "lucide-react";
import { Edit, StarBorder } from "@mui/icons-material";
import { getServiceById } from "@/services/ApiServices/serviceService";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ChatIcon from "@mui/icons-material/Chat";
import { getAllScholarshipProgram } from "@/services/ApiServices/scholarshipProgramService";
import { toast } from "react-toastify";
import { notification } from "antd";

const RequestDetailTable = ({
  showButtons,
  request,
  fetchRequest,
  requestDetails,
}: {
  showButtons: boolean;
  request: any;
  fetchRequest: () => void;
  requestDetails: any;
  description: string;
}) => {
  const user = useSelector((state: any) => state.token.user);
  const navigate = useNavigate();

  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [openUserFeedbackDialog, setOpenUserFeedbackDialog] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [userFeedback, setUserFeedback] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [_scholarships, setScholarships] = useState<
    { id: number; name: string }[]
  >([]);
  const [hasFeedback, setHasFeedback] = useState(false);
  const [finishDate, setFinishDate] = useState<Date | null>(null);
  const [canProvideFeedback, setCanProvideFeedback] = useState(true);

  if (!requestDetails || requestDetails.length === 0) {
    return (
      <Paper
        elevation={3}
        style={{ padding: "20px", textAlign: "center", borderRadius: "8px" }}
      >
        <Typography variant="h5" color="textSecondary">
          No request details available.
        </Typography>
      </Paper>
    );
  }

  const StyledLink = styled(Link)(() => ({
    color: "#4A90E2",
    textDecoration: "underline",
    "&:hover": {
      color: "#FF6347",
    },
  }));

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await getAllScholarshipProgram();
        setScholarships(response.data.items);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      }
    };

    fetchScholarships();
  }, []);

  const handleFinish = async () => {
    try {
      if (!request.id) {
        console.error("Request ID is missing.");
        return;
      }

      notification.success({ message: "Finished successfully!" });
      await updateFinishRequest(request.id);
      setFinishDate(new Date());
      await fetchRequest();
    } catch (error) {
      console.error("Failed to update request status", error);
      toast.error("Failed to update request status. Please try again.");
    }
  };

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const serviceId = request.requestDetails[0]?.serviceId;
        if (serviceId) {
          const fetchedService = await getServiceById(serviceId);
          console.log(fetchedService);
          const userFeedback = fetchedService.data.feedbacks.find(
            (feedback: any) => feedback.applicantId == user.id
          );
          if (userFeedback) {
            setUserFeedback(userFeedback);
            setRating(userFeedback.rating);
            setComment(userFeedback.content);
            setHasFeedback(true);
          }
        }
      } catch (error) {
        console.error("Error fetching service data", error);
      }
    };

    fetchServiceData();
  }, [request, user.id]);

  useEffect(() => {
    if (finishDate) {
      const diffInTime = new Date().getTime() - finishDate.getTime();
      const diffInDays = diffInTime / (1000 * 3600 * 24);
      if (diffInDays > 3) {
        setCanProvideFeedback(false);
      }
    }
  }, [finishDate]);

  const handleFeedbackSubmit = async () => {
    if (hasFeedback) {
      notification.error({
        message: "You have already feedback this service!",
      });
      return;
    }

    if (rating === null || !comment.trim()) {
      notification.error({ message: "Please provide a rating and a comment!" });
      return;
    }

    if (rating !== null && comment) {
      const feedbackData = {
        content: comment,
        rating,
        applicantId: user.id,
        feedbackDate: new Date().toISOString(),
        serviceId: request.requestDetails[0].serviceId,
      };

      const serviceInfo = await getServiceById(request.requestDetails[0].serviceId);
      const serviceNameInfo = serviceInfo.data.name;
      const providerIdServiceInfo = serviceInfo.data.providerId;

      try {
        await addFeedback(feedbackData);
        const notificationData = {
          providerId: providerIdServiceInfo,
          serviceName: serviceNameInfo,
        };
        await notifyFeedbackSuccess(notificationData);
        setOpenFeedbackDialog(false);
        setHasFeedback(true);
        notification.success({ message: "Feedback successfully!" });
        navigate("/services");
      } catch (error) {
        console.error("Failed to submit feedback", error);
      }
    } else {
      console.error("Rating and comment are required.");
    }
  };

  const handleEditFeedback = () => {
    setIsEditing(true);
    setOpenUserFeedbackDialog(true);
  };

  const handleSaveFeedback = async () => {
    if (!userFeedback) return;
    try {
      await updateFeedback(userFeedback.id, {
        content: comment,
        rating,
      });
      notification.success({ message: "Feedback updated successfully." });
      setIsEditing(false);
      setOpenUserFeedbackDialog(false);
    } catch (error) {
      console.error("Failed to update feedback", error);
    }
  };

  const isFinished = request.status === "Finished";

  const handleChatClick = () => {
    const chatUserId =
      user.role === "Applicant"
        ? request.requestDetails[0].service.providerId
        : request.applicantId;
    console.log(request);
    navigate(`/chat?id=${chatUserId}`);
  };
  console.log(requestDetails);

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: "12px", marginTop: "20px", padding: "20px" }}
      >
        <Table sx={{ minWidth: 1000 }} aria-label="request details table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#4A90E2" }}
                >
                  Id
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#4A90E2" }}
                >
                  Applicant Description
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#4A90E2" }}
                >
                  Request File
                </Typography>
              </TableCell>
              <TableCell sx={{ color: "#FF6347" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Provider Updated File
                </Typography>
              </TableCell>
              <TableCell sx={{ color: "#FF6347" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Provider Notes
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requestDetails.map((detail: any) => (
              <TableRow
                key={detail.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "#f9f9f9" },
                }}
              >
                <TableCell>
                  <Typography variant="body1" sx={{ color: "#333" }}>
                    {detail.requestId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" sx={{ color: "#333" }}>
                    {request.description || "No description provided"}
                  </Typography>
                </TableCell>
                <TableCell>
                  {detail.requestDetailFiles.filter(
                    (a: any) => a.uploadedBy == "Applicant"
                  ).length > 0 ? (
                    detail.requestDetailFiles
                      .filter((a: any) => a.uploadedBy == "Applicant")
                      .map((fileUrl: any, index: any) => {
                        if (fileUrl.fileUrl.startsWith("https://")) {
                          return (
                            <StyledLink
                              className="block"
                              target="_blank"
                              to={fileUrl.fileUrl}
                            >
                              File {index + 1}
                            </StyledLink>
                          );
                        }
                        return null;
                      })
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No file uploaded yet
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {detail.requestDetailFiles.filter(
                    (a: any) => a.uploadedBy == "Provider"
                  ).length > 0 ? (
                    detail.requestDetailFiles
                      .filter((a: any) => a.uploadedBy == "Provider")
                      .map((fileUrl: any, index: any) => {
                        if (fileUrl.fileUrl.startsWith("https://")) {
                          return (
                            <div key={index}>
                              <StyledLink target="_blank" to={fileUrl.fileUrl}>
                                File {index + 1}
                              </StyledLink>
                            </div>
                          );
                        }
                        return null;
                      })
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No file uploaded yet
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body1" sx={{ color: "#333" }}>
                    {detail.comment || "No comment yet"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {user.role === "Applicant" && (
        <>
          {showButtons && (
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                color="primary"
                disabled={isFinished}
                onClick={handleChatClick}
                sx={{
                  borderRadius: "25px",
                  padding: "12px 24px",
                  fontSize: "16px",
                  marginRight: "10px",
                  boxShadow: 3,
                  "&:hover": { boxShadow: 6 },
                  backgroundColor: "#4A90E2",
                  color: "#fff",
                  "&:disabled": { backgroundColor: "#C5CAE9" },
                }}
                startIcon={<ChatIcon />}
              >
                Chat
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFinish}
                disabled={isFinished}
                sx={{
                  borderRadius: "25px",
                  padding: "12px 24px",
                  fontSize: "16px",
                  boxShadow: 3,
                  "&:hover": { boxShadow: 6 },
                  backgroundColor: "#4A90E2",
                  color: "#fff",
                  "&:disabled": { backgroundColor: "#C5CAE9" },
                }}
                startIcon={<CheckCircleOutlineIcon />}
              >
                Finish
              </Button>
              {isFinished && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    if (hasFeedback) {
                      notification.error({
                        message: "You have already given feedback!",
                      });
                    } else {
                      setOpenFeedbackDialog(true);
                    }
                  }}
                  disabled={hasFeedback || !canProvideFeedback}
                  sx={{
                    borderRadius: "25px",
                    padding: "12px 24px",
                    fontSize: "16px",
                    marginLeft: "10px",
                    boxShadow: 3,
                    "&:hover": { boxShadow: 6 },
                    backgroundColor: "#FF9800",
                    color: "#fff",
                    "&:disabled": { backgroundColor: "#F5CBE1" },
                  }}
                  startIcon={<FeedbackIcon />}
                >
                  Feedback
                </Button>
              )}
              {hasFeedback && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setOpenUserFeedbackDialog(true)}
                  sx={{
                    borderRadius: "25px",
                    padding: "12px 24px",
                    fontSize: "16px",
                    marginLeft: "10px",
                    boxShadow: 3,
                    "&:hover": { boxShadow: 6 },
                    backgroundColor: "#FF9800",
                    color: "#fff",
                  }}
                  startIcon={<RateReviewIcon />}
                >
                  Your Feedback
                </Button>
              )}
            </Box>
          )}
          <Dialog
            open={openFeedbackDialog}
            onClose={() => setOpenFeedbackDialog(false)}
          >
            <DialogTitle>Feedback</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please give us feedback to help us improve our service.
              </DialogContentText>
              <Box display="flex" alignItems="center" mt={2}>
                {[...Array(5)].map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setRating(index + 1)}
                    sx={{
                      cursor: "pointer",
                      color: (rating ?? 0) >= index + 1 ? "gold" : "#e0e0e0",
                    }}
                  >
                    <Star />
                  </Box>
                ))}
              </Box>
              <TextField
                autoFocus
                margin="dense"
                id="comment"
                label="Comment"
                type="text"
                fullWidth
                variant="outlined"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ marginTop: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenFeedbackDialog(false)}
                color="secondary"
              >
                Cancel
              </Button>
              <Button onClick={handleFeedbackSubmit} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      <Dialog
        open={openUserFeedbackDialog}
        onClose={() => setOpenUserFeedbackDialog(false)}
      >
        <DialogTitle>
          Your Feedback
          {isEditing ? null : (
            <IconButton onClick={handleEditFeedback}>
              <Edit fontSize="small" />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isEditing ? "Edit your feedback:" : "Your feedback details"}
          </DialogContentText>
          <Box display="flex" alignItems="center" mt={2}>
            {[...Array(5)].map((_, index) => (
              <Box
                key={index}
                onClick={() => isEditing && setRating(index + 1)}
                sx={{
                  cursor: "pointer",
                  color: index < (rating || 0) ? "gold" : "#e0e0e0",
                }}
              >
                {index < (rating || 0) ? (
                  <Star style={{ color: "gold" }} />
                ) : (
                  <StarBorder />
                )}
              </Box>
            ))}
          </Box>
          <TextField
            margin="dense"
            label="Comment"
            type="text"
            fullWidth
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={!isEditing}
            sx={{ marginTop: 2 }}
          />
        </DialogContent>
        <DialogActions>
          {isEditing ? (
            <>
              <Button onClick={() => setIsEditing(false)} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleSaveFeedback} color="primary">
                Save
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setOpenUserFeedbackDialog(false)}
              color="primary"
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestDetailTable;
