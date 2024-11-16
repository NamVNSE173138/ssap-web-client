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
    status: "Paid" | "Finished";
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
        paid: [] as Applicant[],
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
            paid: applications.filter(app => app.status === "Paid"),
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
            setSnackbarOpen(true);
            const existingApplicantResponse = await getRequestById(selectedApplicantId);
            const requestDetail = existingApplicantResponse.data.requestDetails[0];

            if (requestDetail) {
                if (requestDetail.applicationNotes.startsWith("https://")) {
                    try {
                        await deleteFile(requestDetail.applicationNotes.split(", ")[0].split("/").pop());
                    } catch (error) {}
                }
                const updatedRequest = {
                    ...existingApplicantResponse.data,
                    requestDetails: [
                        {
                            ...requestDetail,
                            applicationNotes: `, ${commentText}`,
                        },
                    ],
                };
                if (commentFile) {
                    const fileUrls = await uploadFile(commentFile);
                    const fileUrlsString = fileUrls.urls.join(", ");
                    updatedRequest.requestDetails[0].applicationNotes = `${fileUrlsString}, ${commentText}`;
                }

                await updateRequest(selectedApplicantId, updatedRequest);

                const updatedApplicants = {
                    ...applicants,
                    paid: applicants.paid.map(app =>
                        app.id === selectedApplicantId ? { ...app, status: app.status } : app
                    ),
                };

                setApplicants(updatedApplicants);

                setSnackbarMessage("Comment successfully!");
                setSnackbarOpen(true);

                setCommentText("");
                setCommentFile(null);
                setCommentDialogOpen(false);
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
                applicantsList.map(app => (
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
                        <ListItemAvatar>
                            <img
                                className="rounded-full w-12 h-12"
                                src={app.applicant?.avatarUrl ?? "https://github.com/shadcn.png"}
                                alt="avatar"
                                style={{ borderRadius: "50%", width: "48px", height: "48px" }}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography variant="subtitle1" sx={{ fontWeight: "600", fontFamily: "Poppins, sans-serif" }}>
                                    {app.applicant.username}
                                </Typography>
                            }
                            secondary={
                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                    {formatDate(app.requestDate)}
                                </Typography>
                            }
                            sx={{ flex: 1 }}
                        />
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Button
                                onClick={() => navigate(`/provider/requestinformation/${app.id}`)}
                                variant="contained"
                                size="small"
                                sx={{
                                    backgroundColor: "#0078d4",
                                    borderRadius: "20px",
                                    fontFamily: "Roboto, sans-serif",
                                    fontSize: "0.875rem",
                                    "&:hover": {
                                        backgroundColor: "#005bb5",
                                    },
                                }}
                            >
                                <FaEye style={{ marginRight: "8px" }} />
                                View Request
                            </Button>
                            {app.status === "Paid" && (
                                <Button
                                    onClick={() => handleOpenCommentDialog(app.id)}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        borderRadius: "20px",
                                        fontFamily: "Roboto, sans-serif",
                                        fontSize: "0.875rem",
                                        borderColor: "#0078d4",
                                        "&:hover": {
                                            borderColor: "#005bb5",
                                            backgroundColor: "#f0f8ff",
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
                            <Typography variant="body1" color="text.secondary" align="center" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "500" }}>
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
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
        <DialogTitle sx={{
            textAlign: "center", 
            fontWeight: "bold", 
            fontSize: "1.25rem", 
            fontFamily: "Poppins, sans-serif", 
            color: "#333"
        }}>
            <FaInfoCircle style={{ marginRight: "8px", color: "#0078d4", fontSize: "1.5rem" }} />
            Applicants Request Information
        </DialogTitle>

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
                    fontWeight: "500"
                }
            }}
        >
            <Tab label="Paid" />
            <Tab label="Finished" />
        </Tabs>

        <List sx={{ maxHeight: 400, overflow: "auto", p: 2 }}>
            {activeTab === 0 && renderApplicants(applicants.paid)}
            {activeTab === 1 && renderApplicants(applicants.finished)}
        </List>
    </Dialog>

    <Dialog open={commentDialogOpen} onClose={() => setCommentDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "bold", 
            fontSize: "1.25rem",
            color: "#333"
        }}>
            <FaCommentDots style={{ marginRight: "8px", color: "#0078d4", fontSize: "1.5rem" }} />
            Add Comment
        </DialogTitle>

        <Box sx={{ p: 3 }}>
            <Typography variant="body1" sx={{ fontFamily: "Roboto, sans-serif", fontWeight: "500" }}>Add updated file:</Typography>
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
                    fontSize: "1rem"
                }}
            />
            <Typography variant="body1" sx={{ fontFamily: "Roboto, sans-serif", fontWeight: "500" }}>Add your comment:</Typography>
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
                    fontFamily: "Roboto, sans-serif"
                }}
            />

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
                            backgroundColor: "#f5f5f5"
                        }
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
                            backgroundColor: "#0064d2"
                        }
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
