import { formatDate } from "@/lib/date-formatter";
import { getRequestById, updateRequest } from "@/services/ApiServices/requestService";
import { deleteFile, uploadFile } from "@/services/ApiServices/testService";
import { AddComment } from "@mui/icons-material";
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
    CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FaCommentDots, FaEye, FaInfoCircle } from "react-icons/fa";
import { HiOutlineUpload } from "react-icons/hi";
import { IoCloudUpload } from "react-icons/io5";
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
    const [commentFile, setCommentFile] = useState<File[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setIsSubmitting(true);
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

            } else {
                console.error(`Request details for applicant id:${selectedApplicantId} not found`);
            }
        } catch (error) {
            console.error("Failed to update applicant status", error);
        } finally {
            setIsSubmitting(false);
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
                sx={{
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                }}
            >
                <DialogTitle
                    sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        color: "#333",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        justifyContent: "center",
                        backgroundColor: "#f4f7fb",
                        borderBottom: "2px solid #ddd",
                    }}
                >
                    <FaCommentDots style={{ color: "#0078d4", fontSize: "1.8rem" }} />
                    Add Comment
                </DialogTitle>

                <Box sx={{ p: 3, backgroundColor: "#fff" }}>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                            <IoCloudUpload className="text-blue-500" />
                            Add updated file:
                        </label>

                        <div className="border border-dashed border-gray-300 p-4 rounded-lg text-center hover:bg-gray-50 transition-all">
                            <input
                                type="file"
                                multiple
                                className="w-full hidden"
                                id="file-upload"
                                onChange={handleCommentFile}
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer text-blue-500 hover:underline"
                            >
                                <IoCloudUpload className="text-4xl mx-auto text-gray-400 mb-2" />
                                Click to upload files
                            </label>
                        </div>

                        {commentFile.length > 0 && (
                            <div className="mt-4 text-gray-700">
                                <h3 className="font-medium">Selected Files:</h3>
                                <ul className="list-disc pl-5">
                                    {commentFile.map((file: File, index: number) => (
                                        <li key={index} className="text-sm">
                                            {file.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                            <AddComment className="text-blue-500" />
                            Add your comment:
                        </label>

                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Type your comment here..."
                            className="w-full p-2 mb-2 border border-gray-300 rounded-lg resize-y min-h-[100px] hover:border-blue-400 focus:border-blue-500 transition-all"
                        />

                        {commentText.length === 0 && (
                            <p className="text-sm text-gray-500 mt-1">Please enter your comment.</p>
                        )}
                    </div>
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
                                "&:disabled": {
                                    backgroundColor: "#e0e0e0",
                                    color: "#b0b0b0",
                                },
                            }}
                            disabled={isSubmitting}
                        >
                            <AiOutlineCloseCircle style={{ marginRight: "5px" }} />
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
                                "&:disabled": {
                                    backgroundColor: "#005bb5",
                                },
                            }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} sx={{ color: "#fff", mr: 1 }} />
                            ) : (
                                <AiOutlineCheckCircle style={{ marginRight: "5px" }} />
                            )}
                            {isSubmitting ? "Submitting..." : "Submit"}
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
