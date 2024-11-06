import { formatDate } from "@/lib/date-formatter";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from "@mui/material";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getRequestById, updateRequest } from "@/services/ApiServices/requestService";
import { useEffect, useState } from "react";
import { addFeedback } from "@/services/ApiServices/feedbackService";
import { Star } from "lucide-react";
import { StarBorder } from "@mui/icons-material";
import { getServiceById } from "@/services/ApiServices/serviceService";

const RequestDetailTable = ({ showButtons, request, requestDetails, description }: { showButtons: boolean, request: any, requestDetails: any; description: string }) => {
    const { id } = useParams<{ id: string }>();
    const user = useSelector((state: any) => state.token.user);
    const navigate = useNavigate();

    const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState<string>("");
    const [hasFeedback, setHasFeedback] = useState(false);

    if (!requestDetails || requestDetails.length === 0) {
        return (
            <Paper elevation={3} style={{ padding: "20px", textAlign: "center", borderRadius: '8px' }}>
                <Typography variant="h5" color="textSecondary">
                    No request details available.
                </Typography>
            </Paper>
        );
    }

    const handleFinish = async () => {
        try {
            if (!id) {
                return null;
            }
            const existingRequestResponse = await getRequestById(parseInt(id));
            const requestDetail = existingRequestResponse.data.requestDetails[0];
            console.log(requestDetail)

            if (requestDetail) {
                const updatedRequest = {
                    description: existingRequestResponse.data.description,
                    requestDate: existingRequestResponse.data.requestDate,
                    status: "Finished",
                    applicantId: existingRequestResponse.data.applicantId,
                    requestDetails: [
                        {
                            id: requestDetail.id,
                            expectedCompletionTime: requestDetail.expectedCompletionTime,
                            applicationNotes: requestDetail.applicationNotes,
                            scholarshipType: requestDetail.scholarshipType,
                            applicationFileUrl: requestDetail.applicationFileUrl,
                            serviceId: requestDetail.serviceId,
                        }
                    ]
                };

                await updateRequest(existingRequestResponse.data.id, updatedRequest);
                console.log("Request finished", updatedRequest);
            } else {
                console.error(`Request details for id:${id} not found`);
            }
        } catch (error) {
            console.error("Failed to finish request", error);
        }
    };

    useEffect(() => {
        const fetchServiceData = async () => {
          try {
            const serviceId = request.requestDetails[0]?.serviceId;
            if (serviceId) {
              const fetchedService = await getServiceById(serviceId);
              console.log(fetchedService)
              const userFeedback = fetchedService.data.feedbacks.find(
                (feedback:any) => feedback.applicantId == user.id
              );
              if (userFeedback) {
                setHasFeedback(true);
              }
            }
          } catch (error) {
            console.error("Error fetching service data", error);
          }
        };
    
        fetchServiceData();
      }, [request, user.id]);

    const handleFeedbackSubmit = async () => {
        if (hasFeedback) {
            alert("You have already feedback this service!");
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

            try {
                await addFeedback(feedbackData);
                setOpenFeedbackDialog(false);
                setHasFeedback(true);
                navigate("/services");
            } catch (error) {
                console.error("Failed to submit feedback", error);
            }
        } else {
            console.error("Rating and comment are required.");
        }
    };

    const isFinished = request.status === "Finished";
    const isPaid = request.status === "Paid";

    const handleChatClick = () => {
        const chatUserId = user.role === "APPLICANT" ? request.requestDetails[0].service.id : request.applicantId;
        navigate(`/chat?id=${chatUserId}`);
    };


    return (
        <Box>
            <TableContainer component={Paper} elevation={3} style={{ borderRadius: '8px', marginTop: '20px' }}>
                <Table sx={{ minWidth: 650 }} aria-label="request details table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="h6" style={{ fontWeight: 'bold' }}>Request File</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="h6" style={{ fontWeight: 'bold' }}>Scholarship Type</Typography>
                            </TableCell>
                            <TableCell align="right" style={{ color: 'red' }}>
                                <Typography variant="h6" style={{ fontWeight: 'bold' }}>Provider Updated File</Typography>
                            </TableCell>
                            <TableCell align="right" style={{ color: 'red' }}>
                                <Typography variant="h6" style={{ fontWeight: 'bold' }}>Provider Notes</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="h6" style={{ fontWeight: 'bold' }}>Expected Completion Time</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requestDetails.map((detail: any) => (
                            <TableRow key={detail.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                <TableCell align="right">
                                    {detail.applicationFileUrl ? (
                                        detail.applicationFileUrl.split(", ").map((fileUrl: any, index: any) => {
                                            if (fileUrl.startsWith("https://")) {
                                                return (
                                                    <div key={index}>
                                                        <Link target="_blank" className="text-blue-500 underline hover:text-blue-700" to={fileUrl}>
                                                            File {index + 1}
                                                        </Link>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">No file uploaded</Typography>
                                    )}
                                </TableCell>

                                <TableCell align="right">
                                    <Typography variant="body1">{detail.scholarshipType}</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    {detail.applicationNotes ? (
                                        detail.applicationNotes.split(", ").map((note: any, index: any) => {
                                            if (note.startsWith("https://")) {
                                                return (
                                                    <div key={index}>
                                                        <Link target="_blank" className="text-blue-500 underline hover:text-blue-700" to={note}>
                                                            File {index + 1}
                                                        </Link>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">No file uploaded</Typography>
                                    )}
                                </TableCell>
                                <TableCell align="right" className="max-w-[500px]" component="th" scope="row">
                                    <Typography variant="body2">
                                        {detail.applicationNotes && detail.applicationNotes.length > 0
                                            ? detail.applicationNotes.split(", ").pop()
                                            : "No notes uploaded"}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2" color="textSecondary">{formatDate(detail.expectedCompletionTime)}</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {user.role === "APPLICANT" && (
                <>
                    {showButtons && (
                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={isFinished }
                                onClick={handleChatClick}
                                sx={{
                                    borderRadius: '25px',
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    marginRight: '10px',
                                    boxShadow: 3,
                                    '&:hover': {
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                Chat
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleFinish}
                                disabled={isFinished || isPaid}
                                sx={{
                                    borderRadius: '25px',
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    boxShadow: 3,
                                    '&:hover': {
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                Finish
                            </Button>
                            {isFinished && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                        if (hasFeedback) {
                                          alert("You have already feedback this service!");
                                        } else {
                                          setOpenFeedbackDialog(true);
                                        }
                                      }}
                                      disabled={hasFeedback}
                                    sx={{
                                        borderRadius: '25px',
                                        padding: '10px 20px',
                                        fontSize: '16px',
                                        marginLeft: '10px',
                                        boxShadow: 3,
                                        '&:hover': {
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    Feedback
                                </Button>
                            )}
                        </Box>
                    )}
                    <Dialog open={openFeedbackDialog} onClose={() => setOpenFeedbackDialog(false)}>
                        <DialogTitle>Feedback</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please give us feedback so we can improve in the future.
                            </DialogContentText>
                            <Box display="flex" alignItems="center" mt={2}>
                                {[...Array(5)].map((_, index) => (
                                    <Box
                                        key={index}
                                        onClick={() => setRating(index + 1)}
                                        style={{ cursor: 'pointer' }}
                                    >{rating !== null && index < rating ? <Star style={{ color: 'gold' }} /> : <StarBorder />}                                        
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
                            <Button onClick={() => setOpenFeedbackDialog(false)} color="secondary">Cancel</Button>
                            <Button onClick={handleFeedbackSubmit} color="primary">Submit</Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Box>
    );
};

export default RequestDetailTable;
