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
import { useNavigate } from "react-router-dom";

interface Applicant {
    id: number;
    status: "Pending" | "Paid" | "Finished";
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
            pending: applications.filter(app => app.status === "Pending"),
            paid: applications.filter(app => app.status === "Paid"),
            finished: applications.filter(app => app.status === "Finished"),
        });
    }, [applications]);

    // const handleStatusUpdate = async (id: number, status: "Accepted" | "Rejected") => {
    //     try {
    //         const existingApplicantResponse = await getRequestById(id);
    //         const requestDetail = existingApplicantResponse.data.requestDetails[0];

    //         if (requestDetail) {
    //             const updatedRequest = {
    //                 description: existingApplicantResponse.data.description,
    //                 requestDate: existingApplicantResponse.data.requestDate,
    //                 status: status,
    //                 applicantId: existingApplicantResponse.data.applicantId,
    //                 requestDetails: [
    //                     {
    //                         id: requestDetail.id,
    //                         expectedCompletionTime: requestDetail.expectedCompletionTime,
    //                         applicationNotes: requestDetail.applicationNotes,
    //                         scholarshipType: requestDetail.scholarshipType,
    //                         applicationFileUrl: requestDetail.applicationFileUrl,
    //                         serviceId: requestDetail.serviceId,
    //                     }
    //                 ]
    //             };

    //             await updateRequest(id, updatedRequest);
    //             fetchApplications();
    //         } else {
    //             console.error(`Request details for applicant id:${id} not found`);
    //         }
    //     } catch (error) {
    //         console.error("Failed to update applicant status", error);
    //     }
    // };

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
                    pending: applicants.pending.map(app =>
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
                            mb: 2,
                            p: 2,
                            borderRadius: 1,
                            bgcolor: "background.paper",
                            boxShadow: 1,
                        }}
                    >
                        <ListItemAvatar>
                            <img
                                className="rounded-full w-12 h-12"
                                src={app.applicant?.avatarUrl}
                                alt="avatar"
                                style={{ borderRadius: "50%", width: "48px", height: "48px" }}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Typography variant="subtitle1">{app.applicant.username}</Typography>}
                            secondary={formatDate(app.requestDate)}
                            sx={{ flex: 1 }}
                        />
                        <Button
                            onClick={() => navigate(`/provider/requestinformation/${app.id}`)}
                            variant="contained"
                            size="small"
                            sx={{ mr: 1 }}
                        >
                            View Request
                        </Button>
                        {app.status === "Paid" && (
                            <Button
                                onClick={() => handleOpenCommentDialog(app.id)}
                                color="primary"
                                variant="outlined"
                                size="small"
                                sx={{ mr: 1 }}
                            >
                                Add Comment
                            </Button>
                        )}
                    </ListItem>
                ))
            ) : (
                <ListItem>
                    <ListItemText
                        primary={
                            <Typography variant="body1" color="textSecondary" align="center">
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
                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>Applicants Request Information</DialogTitle>
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    centered
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                    <Tab label="Pending" />
                    <Tab label="Paid" />
                    <Tab label="Finished" />
                </Tabs>
                <List sx={{ maxHeight: 400, overflow: "auto", p: 2 }}>
                    {activeTab === 0 && renderApplicants(applicants.pending)}
                    {activeTab === 1 && renderApplicants(applicants.paid)}
                    {activeTab === 2 && renderApplicants(applicants.finished)}
                </List>
            </Dialog>

            <Dialog open={commentDialogOpen} onClose={() => setCommentDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Comment</DialogTitle>
                <Box sx={{ p: 3 }}>
                    <Typography variant="body1">Add updated file:</Typography>
                    <input
                        type="file"
                        multiple
                        onChange={handleCommentFile}
                        style={{ marginTop: "8px", marginBottom: "20px" }}
                    />
                    <Typography variant="body1">Add your comment:</Typography>
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Type your comment here..."
                        style={{ width: "100%", height: "100px", marginTop: "8px", padding: "8px" }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button onClick={() => setCommentDialogOpen(false)} color="secondary" variant="outlined" sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitComment} color="primary" variant="contained">
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
