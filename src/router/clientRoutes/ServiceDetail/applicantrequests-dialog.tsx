import { formatDate } from "@/lib/date-formatter";
import { getRequestById, updateRequest } from "@/services/ApiServices/requestService";
import { deleteFile, uploadFile } from "@/services/ApiServices/testService";
import {
    Button,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tabs,
    Tab,
    Tooltip,
    Typography,
    Box,
    Snackbar,
    Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { FaCommentDots, FaEye, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Applicant {
    id: number;
    status: "Pending" | "Finished";
    requestDate: string;
    applicant: {
        avatarUrl: string;
        username: string;
    };
}

interface AccountApplicantDialogProps {
    open: boolean;
    onClose: () => void;
    applications: Applicant[];
    fetchApplications: () => void;
}

const AccountApplicantDialog: React.FC<AccountApplicantDialogProps> = ({ open, onClose, applications, fetchApplications }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [applicants, setApplicants] = useState({
        pending: [] as Applicant[],
        finished: [] as Applicant[],
    });

    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(null);
    const [commentText, setCommentText] = useState("");
    const navigate = useNavigate();
    const [commentWithFile, setCommentWithFile] = useState(0);
    const [commentFile, setCommentFile] = useState<any>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        setApplicants({
            pending: applications.filter(app => app.status === "Pending"),
            finished: applications.filter(app => app.status === "Finished"),
        });
    }, [applications]);

    const handleOpenCommentDialog = (applicantId: number) => {
        setSelectedApplicantId(applicantId);
        setCommentDialogOpen(true);
    };

    const handleCommentFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setCommentFile(Array.from(event.target.files));
        }
    };

    const handleSubmitComment = async () => {
        if (selectedApplicantId === null) return;

        try {
            const existingApplicantResponse = await getRequestById(selectedApplicantId);
            const requestDetail = existingApplicantResponse.data.requestDetails[0];

            if (requestDetail) {
                const serviceResultDetails = [
                    {
                        comment: commentText,
                        serviceId: requestDetail.serviceId,
                        requestFileUrls: [] as string[],
                    },
                ];

                if (commentFile) {
                    const fileUrls = await uploadFile(commentFile);
                    serviceResultDetails[0].requestFileUrls.push(...fileUrls.urls);
                }

                const updatedRequest = {
                    ...existingApplicantResponse.data,
                    serviceResultDetails,
                };

                await updateRequest(selectedApplicantId, updatedRequest);

                const updatedApplicants = {
                    ...applicants,
                    pending: applicants.pending.map((app) =>
                        app.id === selectedApplicantId ? { ...app, status: app.status } : app
                    ),
                };

                setApplicants(updatedApplicants);

                setSnackbarMessage("Comment successfully!");
                setCommentDialogOpen(false);
                setSnackbarOpen(true);

                setCommentText("");
                setCommentFile(null);

            } else {
                console.error(`Request details for applicant id:${selectedApplicantId} not found`);
            }
        } catch (error) {
            console.error("Failed to update applicant status", error);
        }
    };

    const renderApplicants = (applicantsList: Applicant[]) => (
        <Box>
            {applicantsList.length > 0 ? (
                applicantsList.map((app) => (
                    <ListItem
                        key={app.id}
                        disableGutters
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 3,
                            p: 3,
                            borderRadius: "12px",
                            bgcolor: "background.paper",
                            boxShadow: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                                boxShadow: 6,
                                transform: "scale(1.02)",
                            },
                        }}
                    >
                        {/* Avatar */}
                        <ListItemAvatar>
                            <img
                                src={app.applicant?.avatarUrl ?? "https://github.com/shadcn.png"}
                                alt={`${app.applicant?.username}'s avatar`}
                                className="rounded-full"
                                style={{ width: "48px", height: "48px" }}
                            />
                        </ListItemAvatar>

                        {/* User Info */}
                        <ListItemText
                            primary={
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 600,
                                        fontFamily: "Poppins, sans-serif",
                                    }}
                                >
                                    {app.applicant.username}
                                </Typography>
                            }
                            secondary={
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {formatDate(app.requestDate)}
                                </Typography>
                            }
                            sx={{ flex: 1, ml: 2 }}
                        />

                        {/* Actions */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {/* View Request Button */}
                            <Button
                                onClick={() => navigate(`/provider/requestinformation/${app.id}`)}
                                variant="contained"
                                size="small"
                                sx={{
                                    bgcolor: "primary.main",
                                    color: "white",
                                    borderRadius: "20px",
                                    textTransform: "capitalize",
                                    fontFamily: "Roboto, sans-serif",
                                    fontSize: "0.875rem",
                                    "&:hover": {
                                        bgcolor: "primary.dark",
                                    },
                                }}
                            >
                                <FaEye style={{ marginRight: "8px" }} />
                                View Request
                            </Button>

                            {/* Add Comment Button (if Pending) */}
                            {app.status === "Pending" && (
                                <Button
                                    onClick={() => handleOpenCommentDialog(app.id)}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        borderRadius: "20px",
                                        textTransform: "capitalize",
                                        fontFamily: "Roboto, sans-serif",
                                        fontSize: "0.875rem",
                                        borderColor: "primary.main",
                                        color: "primary.main",
                                        "&:hover": {
                                            borderColor: "primary.dark",
                                            bgcolor: "action.hover",
                                        },
                                    }}
                                >
                                    <FaCommentDots style={{ marginRight: "8px" }} />
                                    Add Comment
                                </Button>
                            )}
                        </Box>
                    </ListItem>
                ))
            ) : (
                <ListItem>
                    <ListItemText
                        primary={
                            <Typography
                                variant="body1"
                                align="center"
                                sx={{
                                    fontFamily: "Poppins, sans-serif",
                                    fontWeight: 500,
                                    color: "text.secondary",
                                }}
                            >
                                No requests available
                            </Typography>
                        }
                    />
                </ListItem>
            )}
        </Box>

    );


    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <Dialog
                onClose={onClose}
                open={open}
                fullWidth
                maxWidth="sm"
            >
                {/* Dialog Title */}
                <DialogTitle
                    sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.25rem",
                        fontFamily: "Poppins, sans-serif",
                        color: "text.primary",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                    }}
                >
                    <FaInfoCircle
                        style={{
                            color: "#0078d4",
                            fontSize: "1.5rem",
                        }}
                    />
                    Applicants Request Information
                </DialogTitle>

                {/* Tabs for Switching */}
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    centered
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        "& .MuiTab-root": {
                            fontFamily: "Lato, sans-serif",
                            fontWeight: 500,
                            textTransform: "capitalize",
                        },
                    }}
                >
                    <Tab label="Pending" />
                    <Tab label="Finished" />
                </Tabs>

                {/* Applicants List */}
                <List
                    sx={{
                        maxHeight: 400,
                        overflowY: "auto",
                        p: 2,
                        bgcolor: "background.default",
                    }}
                >
                    {activeTab === 0 ? (
                        renderApplicants(applicants.pending)
                    ) : (
                        renderApplicants(applicants.finished)
                    )}
                </List>
            </Dialog>


            <Dialog
                open={commentDialogOpen}
                onClose={() => setCommentDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                {/* Dialog Title */}
                <DialogTitle
                    sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: "bold",
                        fontSize: "1.25rem",
                        color: "#333",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        justifyContent: "center",
                    }}
                >
                    <FaCommentDots
                        style={{
                            color: "#0078d4",
                            fontSize: "1.5rem",
                        }}
                    />
                    Add Comment
                </DialogTitle>

                {/* Dialog Body */}
                <Box sx={{ p: 3 }}>
                    {/* File Input */}
                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: "Roboto, sans-serif",
                            fontWeight: "500",
                            mb: 1,
                        }}
                    >
                        Add updated file:
                    </Typography>
                    <input
                        type="file"
                        multiple
                        onChange={handleCommentFile}
                        style={{
                            marginTop: "8px",
                            marginBottom: "20px",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            fontSize: "1rem",
                        }}
                    />

                    {/* Comment Textarea */}
                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: "Roboto, sans-serif",
                            fontWeight: "500",
                            mb: 1,
                        }}
                    >
                        Add your comment:
                    </Typography>
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Type your comment here..."
                        style={{
                            width: "100%",
                            height: "100px",
                            marginTop: "8px",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            fontSize: "1rem",
                            fontFamily: "Roboto, sans-serif",
                            resize: "none",  // Disable resize
                        }}
                    />

                    {/* Action Buttons */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button
                            onClick={() => setCommentDialogOpen(false)}
                            color="secondary"
                            variant="outlined"
                            sx={{
                                mr: 1,
                                borderRadius: "20px",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "0.875rem",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    backgroundColor: "#f5f5f5",
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitComment}
                            color="primary"
                            variant="contained"
                            sx={{
                                borderRadius: "20px",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "0.875rem",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    backgroundColor: "#0064d2",
                                },
                            }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Dialog>


            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>

    );
};

export default AccountApplicantDialog;
