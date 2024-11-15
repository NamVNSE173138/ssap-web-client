import { formatDate } from "@/lib/date-formatter";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, IconButton, styled } from "@mui/material";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getRequestById, updateRequest } from "@/services/ApiServices/requestService";
import { useEffect, useState } from "react";
import { addFeedback, updateFeedback } from "@/services/ApiServices/feedbackService";
import { Star } from "lucide-react";
import { Edit, StarBorder } from "@mui/icons-material";
import { getServiceById } from "@/services/ApiServices/serviceService";
import RateReviewIcon from '@mui/icons-material/RateReview';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ChatIcon from '@mui/icons-material/Chat';
import { getAllScholarshipProgram } from "@/services/ApiServices/scholarshipProgramService";
import { toast } from "react-toastify";

const RequestDetailTable = ({ showButtons, request, fetchRequest, requestDetails, description }: { showButtons: boolean, request: any, fetchRequest: () => void, requestDetails: any; description: string }) => {
    const user = useSelector((state: any) => state.token.user);
    const navigate = useNavigate();

    const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
    const [openUserFeedbackDialog, setOpenUserFeedbackDialog] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState<string>("");
    const [userFeedback, setUserFeedback] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [scholarships, setScholarships] = useState<{ id: number; name: string }[]>([]);

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

    const StyledLink = styled(Link)(({ theme }) => ({
        color: '#4A90E2',
        textDecoration: 'underline',
        '&:hover': {
            color: '#FF6347',
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
                return null;
            }
            console.log(request.id)
            const existingRequestResponse = await getRequestById(parseInt(request.id));
            const requestDetail = existingRequestResponse.data.requestDetails[0];

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
                await fetchRequest();

            } else {
                console.error(`Request details for id:${request.id} not found`);
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

    const handleFeedbackSubmit = async () => {
        if (hasFeedback) {
            toast.error("You have already feedback this service!");
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
            toast.success("Feedback updated successfully.");
            setIsEditing(false);
            setOpenUserFeedbackDialog(false);
        } catch (error) {
            console.error("Failed to update feedback", error);
        }
    };

    const isFinished = request.status === "Finished";
    const isPaid = request.status === "Paid";
    console.log(scholarships)

    const handleChatClick = () => {
        const chatUserId = user.role === "APPLICANT" ? request.requestDetails[0].service.providerId : request.applicantId;
        console.log(request)
        navigate(`/chat?id=${chatUserId}`);
    };

    return (
        <Box>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '12px', marginTop: '20px', padding: '20px' }}>
                <Table sx={{ minWidth: 1000 }} aria-label="request details table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4A90E2' }}>Id</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4A90E2' }}>Applicant Description</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4A90E2' }}>Request File</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4A90E2' }}>Scholarship Type</Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ color: '#FF6347' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Provider Updated File</Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ color: '#FF6347' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Provider Notes</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4A90E2' }}>Expected Completion Time</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requestDetails.map((detail: any) => (
                            <TableRow key={detail.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#f9f9f9' } }}>
                                <TableCell align="right">
                                    <Typography variant="body1" sx={{ color: '#333' }}>{detail.id}</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body1" sx={{ color: '#333' }}>{request.description || "No description provided"}</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    {detail.applicationFileUrl ? (
                                        detail.applicationFileUrl.split(", ").map((fileUrl: any, index: any) => {
                                            if (fileUrl.startsWith("https://")) {
                                                return (
                                                    <StyledLink target="_blank" to={fileUrl}>
                                                        File {index + 1}
                                                    </StyledLink>
                                                );
                                            }
                                            return null;
                                        })
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">No file uploaded</Typography>
                                    )}
                                </TableCell>

                                <TableCell align="right">
                                    <Typography variant="body1" sx={{ color: '#333' }}>
                                        {detail.scholarshipType
                                            ? (
                                                <Link to={`/scholarship-program/${detail.scholarshipType}`} style={{ color: '#4A90E2', textDecoration: 'underline' }}>
                                                    {scholarships.find((scholarship) => scholarship.id == detail.scholarshipType)?.name || "Unknown"}
                                                </Link>
                                            )
                                            : "No scholarship"}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    {detail.applicationNotes ? (
                                        detail.applicationNotes.split(", ").map((note: any, index: any) => {
                                            if (note.startsWith("https://")) {
                                                return (
                                                    <div key={index}>
                                                        <StyledLink target="_blank" to={note}>
                                                            File {index + 1}
                                                        </StyledLink>
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
                                    <Typography variant="body2" sx={{ color: '#333' }}>
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
                                disabled={isFinished}
                                onClick={handleChatClick}
                                sx={{
                                    borderRadius: '25px',
                                    padding: '12px 24px',
                                    fontSize: '16px',
                                    marginRight: '10px',
                                    boxShadow: 3,
                                    '&:hover': { boxShadow: 6 },
                                    backgroundColor: '#4A90E2',
                                    color: '#fff',
                                    '&:disabled': { backgroundColor: '#C5CAE9' },
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
                                    borderRadius: '25px',
                                    padding: '12px 24px',
                                    fontSize: '16px',
                                    boxShadow: 3,
                                    '&:hover': { boxShadow: 6 },
                                    backgroundColor: '#4A90E2',
                                    color: '#fff',
                                    '&:disabled': { backgroundColor: '#C5CAE9' },
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
                                            toast.error("You have already given feedback!");
                                        } else {
                                            setOpenFeedbackDialog(true);
                                        }
                                    }}
                                    disabled={hasFeedback}
                                    sx={{
                                        borderRadius: '25px',
                                        padding: '12px 24px',
                                        fontSize: '16px',
                                        marginLeft: '10px',
                                        boxShadow: 3,
                                        '&:hover': { boxShadow: 6 },
                                        backgroundColor: '#FF9800',
                                        color: '#fff',
                                        '&:disabled': { backgroundColor: '#F5CBE1' },
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
                                        borderRadius: '25px',
                                        padding: '12px 24px',
                                        fontSize: '16px',
                                        marginLeft: '10px',
                                        boxShadow: 3,
                                        '&:hover': { boxShadow: 6 },
                                        backgroundColor: '#FF9800',
                                        color: '#fff',
                                    }}
                                    startIcon={<RateReviewIcon />}
                                >
                                    Your Feedback
                                </Button>
                            )}
                        </Box>
                    )}
                    <Dialog open={openFeedbackDialog} onClose={() => setOpenFeedbackDialog(false)}>
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
                                        sx={{ cursor: 'pointer', color: (rating ?? 0) >= index + 1 ? 'gold' : '#e0e0e0' }}
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
                            <Button onClick={() => setOpenFeedbackDialog(false)} color="secondary">Cancel</Button>
                            <Button onClick={handleFeedbackSubmit} color="primary">Submit</Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}

            <Dialog open={openUserFeedbackDialog} onClose={() => setOpenUserFeedbackDialog(false)}>
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
                            <Box key={index} onClick={() => isEditing && setRating(index + 1)} sx={{ cursor: 'pointer', color: index < (rating || 0) ? 'gold' : '#e0e0e0' }}>
                                {index < (rating || 0) ? <Star style={{ color: 'gold' }} /> : <StarBorder />}
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
                            <Button onClick={() => setIsEditing(false)} color="secondary">Cancel</Button>
                            <Button onClick={handleSaveFeedback} color="primary">Save</Button>
                        </>
                    ) : (
                        <Button onClick={() => setOpenUserFeedbackDialog(false)} color="primary">Close</Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>


    );
};

export default RequestDetailTable;
