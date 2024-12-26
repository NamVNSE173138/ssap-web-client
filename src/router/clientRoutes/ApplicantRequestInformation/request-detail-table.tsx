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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
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
import { Button, DialogActions } from '@mui/material';
import { Cancel, Save, Close, Send } from '@mui/icons-material';
import { IoIosAddCircleOutline, IoMdAddCircle } from "react-icons/io";
import AccountApplicantDialog from "../ServiceDetail/applicantrequests-dialog";
import AddCommentRequest from "../ServiceDetail/add-comment-request";

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
  const maxCharacters = 100;
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

  const handleOpenCommentDialog = (requestId: number) => {
    setSelectedRequestId(requestId);
    console.log(setSelectedRequestId)
  };

  console.log(request)
  console.log(requestDetails)

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

    if (comment.length > maxCharacters) {
      notification.error({ message: "Comment is around 100 characters!" });
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
    if (rating === null || !comment.trim()) {
      notification.error({ message: "Please provide a rating and a comment!" });
      return;
    }

    if (comment.length > maxCharacters) {
      notification.error({ message: "Comment is around 100 characters!" });
      return;
    }
    try {
      await updateFeedback(userFeedback.id, {
        content: comment,
        rating,
        applicantId: user.id,
        feedbackDate: new Date().toISOString(),
        serviceId: request.requestDetails[0].serviceId,
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
      {requestDetails.map((detail: any) => (
        <button
          onClick={() => handleOpenCommentDialog(detail.requestId)}
          className="flex mb-5 mr-2 items-center gap-3 bg-blue-500 text-white hover:bg-[#1eb2a6] hover:text-white transition-all duration-300 px-5 py-2 rounded-lg shadow-md active:scale-95 ml-auto"
        >
          <IoIosAddCircleOutline className="text-2xl" />
          <span className="text-lg font-medium">Add comment</span>
        </button>
      ))}

      <br></br>
      <Paper
        elevation={3}
        style={{
          padding: '20px',
          borderRadius: '10px',
          backgroundColor: '#fafafa',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            fontWeight: 'bold',
            backgroundColor: '#f1f1f1',
            padding: '12px 20px',
            borderRadius: '8px',
            marginBottom: '15px',
            color: '#4A90E2',
            textTransform: 'uppercase',
          }}
        >
          <div style={{ flex: '0.5', marginLeft: '20px' }}>Id</div>
          <div style={{ flex: '2.5', textAlign: 'left', marginRight: '20px' }}>Applicant Description</div>
          <div style={{ flex: '1', textAlign: 'left' }}>Request File</div>
          <div style={{ flex: '1', color: "#FF6347", textAlign: 'left' }}>Provider Updated File</div>
          <div style={{ flex: '2', color: "#FF6347", textAlign: 'left' }}>Provider Notes</div>
        </div>

        {/* Loop through requestDetails to display each row */}
        {requestDetails.map((detail: any, index: any) => (
          <div
            key={detail.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px 20px',
              backgroundColor: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              marginBottom: '15px',
              transition: 'all 0.3s ease',
              boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0px 4px 20px rgba(0, 0, 0, 0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0px 2px 10px rgba(0, 0, 0, 0.05)')}
          >
            {/* No. */}
            <div style={{ flex: '0.5', marginLeft: '20px', color: '#333', fontWeight: '500' }}>
              {index + 1}
            </div>

            {/* Applicant Description */}
            <div style={{ flex: '2.5', color: '#333', fontWeight: '500', fontSize: '16px', marginRight: '20px' }}>
              <div style={{ fontSize: '14px', color: '#999', fontWeight: '700' }}>{request.description || 'No description provided'}</div>
            </div>

            {/* Request File */}
            <div style={{ flex: '1', color: '#555' }}>
              {detail.requestDetailFiles.filter((a: any) => a.uploadedBy === 'Applicant').length > 0 ? (
                detail.requestDetailFiles
                  .filter((a: any) => a.uploadedBy === 'Applicant')
                  .map((fileUrl: any, index: any) => {
                    if (fileUrl.fileUrl.startsWith('https://')) {
                      return (
                        <div key={index} style={{ marginBottom: '5px' }}>
                          <a
                            className="block"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={fileUrl.fileUrl}
                            style={{
                              color: '#1E88E5',
                              textDecoration: 'none',
                              fontSize: '14px',
                              fontWeight: '500',
                            }}
                          >
                            File {index + 1}
                          </a>
                        </div>
                      );
                    }
                    return null;
                  })
              ) : (
                <div style={{ flex: '1', color: '#333', fontSize: '16px' }}>
                  <div style={{ fontSize: '14px', color: '#999', fontWeight: '500' }}>No file uploaded yet</div>
                </div>
              )}
            </div>

            {/* Provider Updated File */}
            <div style={{ flex: '1', color: '#555' }}>
              {detail.requestDetailFiles.filter((a: any) => a.uploadedBy === 'Provider').length > 0 ? (
                detail.requestDetailFiles
                  .filter((a: any) => a.uploadedBy === 'Provider')
                  .map((fileUrl: any, index: any) => {
                    if (fileUrl.fileUrl.startsWith('https://')) {
                      return (
                        <div key={index} style={{ marginBottom: '5px' }}>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={fileUrl.fileUrl}
                            style={{
                              color: '#1E88E5',
                              textDecoration: 'none',
                              fontSize: '14px',
                              fontWeight: '500',
                            }}
                          >
                            File {index + 1}
                          </a>
                        </div>
                      );
                    }
                    return null;
                  })
              ) : (
                <div style={{ flex: '1', color: '#333', fontSize: '16px' }}>
                  <div style={{ fontSize: '14px', color: '#999', fontWeight: '500' }}>No file uploaded yet</div>
                </div>
              )}
            </div>

            {/* Provider Notes */}
            <div style={{ flex: '2', color: '#333', fontSize: '16px' }}>
              <div style={{ fontSize: '14px', color: '#999', fontWeight: '700' }}>{detail.comment || 'No description provided'}</div>
            </div>
          </div>
        ))}
      </Paper>

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
                  borderRadius: "50px",  // Bo góc mạnh mẽ hơn, tạo hình tròn mượt mà
                  padding: "12px 28px",  // Tăng khoảng cách giữa các chữ và viền
                  fontSize: "18px",       // Chữ lớn hơn một chút để dễ đọc
                  fontWeight: "600",      // Chữ đậm hơn để làm nổi bật
                  marginRight: "12px",    // Khoảng cách với các nút khác
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",  // Bóng đổ nhẹ, không quá mạnh
                  transition: "all 0.3s ease",  // Thêm hiệu ứng chuyển động mượt mà
                  backgroundColor: "#4A90E2",   // Màu nền chính
                  color: "#fff",          // Màu chữ trắng
                  "&:hover": {
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",  // Bóng đổ khi hover mạnh hơn
                    backgroundColor: "#0066cc",  // Thay đổi màu khi hover
                    transform: "scale(1.05)",  // Phóng to nút một chút khi hover
                  },
                  "&:disabled": {
                    backgroundColor: "#C5CAE9",  // Màu nền khi bị vô hiệu hóa
                    color: "#888",   // Màu chữ khi vô hiệu hóa
                    boxShadow: "none",  // Không bóng đổ khi vô hiệu hóa
                  },
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
                  borderRadius: "50px",  // Bo góc mạnh mẽ hơn
                  padding: "12px 28px",  // Tăng khoảng cách để nút rộng hơn và dễ nhìn
                  fontSize: "18px",       // Tăng kích thước chữ để dễ đọc
                  fontWeight: "600",      // Chữ đậm hơn
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",  // Bóng đổ nhẹ
                  transition: "all 0.3s ease",  // Hiệu ứng chuyển động mượt mà
                  backgroundColor: "#4A90E2",   // Màu nền chính
                  color: "#fff",          // Chữ trắng
                  "&:hover": {
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",  // Bóng đổ đậm khi hover
                    backgroundColor: "#0066cc",  // Màu nền thay đổi khi hover
                    transform: "scale(1.05)",  // Tăng kích thước khi hover
                  },
                  "&:disabled": {
                    backgroundColor: "#C5CAE9",  // Màu nền khi disabled
                    color: "#888",   // Màu chữ khi disabled
                    boxShadow: "none",  // Không bóng đổ khi disabled
                  },
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
                    borderRadius: "50px", // Bo góc mềm mại hơn
                    padding: "12px 28px", // Tăng khoảng cách cho nút rộng hơn
                    fontSize: "18px", // Tăng kích thước chữ để dễ nhìn hơn
                    fontWeight: "600", // Chữ đậm hơn
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Bóng đổ nhẹ
                    transition: "all 0.3s ease", // Hiệu ứng chuyển động mượt mà
                    backgroundColor: "#FF9800", // Màu nền chính
                    color: "#fff", // Chữ trắng
                    "&:hover": {
                      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)", // Bóng đổ mạnh hơn khi hover
                      backgroundColor: "#F57C00", // Màu nền thay đổi khi hover
                      transform: "scale(1.05)", // Tăng kích thước khi hover
                    },
                    "&:disabled": {
                      backgroundColor: "#F5CBE1", // Màu nền khi disabled
                      color: "#888", // Màu chữ khi disabled
                      boxShadow: "none", // Không bóng đổ khi disabled
                    },
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
              <Typography
                variant="body2"
                sx={{
                  color: comment.length > maxCharacters ? 'red' : 'black',
                  marginTop: 1
                }}
              >
                {comment.length}/{maxCharacters}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', padding: 2 }}>
              <Button
                onClick={() => setOpenFeedbackDialog(false)}
                color="error"
                variant="outlined"
                startIcon={<Cancel />}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f44336',
                    color: 'white'
                  },
                  borderRadius: '8px',
                  marginRight: 1
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleFeedbackSubmit}
                color="primary"
                variant="contained"
                startIcon={<Send />}
                sx={{
                  '&:hover': {
                    backgroundColor: '#1976d2',
                    boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)',
                  },
                  borderRadius: '8px',
                  marginLeft: 'auto',
                  padding: '8px 16px'
                }}
              >
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
          <Typography
            variant="body2"
            sx={{
              color: comment.length > maxCharacters ? 'red' : 'black',
              marginTop: 1
            }}
          >
            {comment.length}/{maxCharacters}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', padding: 2 }}>
          {isEditing ? (
            <>
              <Button
                onClick={() => setIsEditing(false)}
                color="error"
                variant="outlined"
                startIcon={<Cancel />}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f44336',
                    color: 'white'
                  },
                  borderRadius: '8px',
                  marginRight: 1
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveFeedback}
                color="primary"
                variant="contained"
                startIcon={<Save />}
                sx={{
                  '&:hover': {
                    backgroundColor: '#1976d2',
                    boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)',
                  },
                  borderRadius: '8px',
                  marginLeft: 1
                }}
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setOpenUserFeedbackDialog(false)}
              color="primary"
              variant="contained"
              startIcon={<Close />}
              sx={{
                '&:hover': {
                  backgroundColor: '#1976d2',
                  boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)',
                },
                borderRadius: '8px',
                marginLeft: 'auto',
                padding: '8px 16px'
              }}
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <AddCommentRequest
        selectedRequestId={selectedRequestId}
        setSelectedRequestId={setSelectedRequestId}
      />
    </Box>
  );
};

export default RequestDetailTable;
