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
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Applicant {
    id: number;
    status: "Pending" | "Accepted" | "Rejected";
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
        accepted: [] as Applicant[],
        rejected: [] as Applicant[],
    });
    
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(null);
    const [commentText, setCommentText] = useState("");
    const navigate = useNavigate();

    const [commentWithFile, setCommentWithFile] = useState(0);
    const [commentFile, setCommentFile] = useState<any>(null);

    useEffect(() => {
        setApplicants({
            pending: applications.filter(app => app.status === "Pending"),
            accepted: applications.filter(app => app.status === "Accepted"),
            rejected: applications.filter(app => app.status === "Rejected"),
        });
    }, [applications]);

    const handleStatusUpdate = async (id: number, status: "Accepted" | "Rejected") => {
        try {
            const existingApplicantResponse = await getRequestById(id);
            
            const requestDetail = existingApplicantResponse.data.requestDetails[0]; 
    
            if (requestDetail) {
                const updatedRequest = {
                    description: existingApplicantResponse.data.description, 
                    requestDate: existingApplicantResponse.data.requestDate,
                    status: status,
                    applicantId: existingApplicantResponse.data.applicantId,
                    requestDetails: [
                        {
                            id:requestDetail.id,
                            expectedCompletionTime: requestDetail.expectedCompletionTime,
                            applicationNotes: requestDetail.applicationNotes,
                            scholarshipType: requestDetail.scholarshipType,
                            applicationFileUrl: requestDetail.applicationFileUrl,
                            serviceId: requestDetail.serviceId,
                        }
                    ]
                };
    
                await updateRequest(id, updatedRequest);

                /*const updatedApplicants = {
                    ...applicants,
                    [status.toLowerCase() as keyof typeof applicants]: [
                        ...applicants[status.toLowerCase() as keyof typeof applicants],
                        { ...existingApplicantResponse.data, status }
                    ],
                    pending: applicants.pending.filter(app => app.id !== id),
                };*/
                fetchApplications();
                //setApplicants(updatedApplicants);
            } else {
                console.error(`Request details for applicant id:${id} not found`);
            }
        } catch (error) {
            console.error("Failed to update applicant status", error);
        }
    };

    const handleOpenCommentDialog = (applicantId: number) => {
        setSelectedApplicantId(applicantId);
        setCommentDialogOpen(true);
    };

    const handleCommentFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setCommentFile(event.target.files[0]);
        }
    };

    const handleSubmitComment = async () => {
        if (selectedApplicantId === null) return;

        try {
            const existingApplicantResponse = await getRequestById(selectedApplicantId);
            const requestDetail = existingApplicantResponse.data.requestDetails[0];
            
            if (requestDetail) {
                if(requestDetail.applicationNotes.startsWith("https://")) {
                    //split file url and comment
                    try{
                    await deleteFile(requestDetail.applicationNotes.split(", ")[0]
                            //get publicId from url
                            .split("/").pop());
                    }catch(error){
                    }
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
                if(commentFile){
                    const formData = new FormData();
                    formData.append("File", commentFile);
                    const fileUrl = await uploadFile(formData);
                    updatedRequest.requestDetails[0].applicationNotes = fileUrl.url + updatedRequest.requestDetails[0].applicationNotes;
                }

                await updateRequest(selectedApplicantId, updatedRequest);

                const updatedApplicants = {
                    ...applicants,
                    pending: applicants.pending.map(app =>
                        app.id === selectedApplicantId ? { ...app, status: app.status } : app
                    ),
                };

                setApplicants(updatedApplicants);

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
                        {app.status === "Accepted" && (
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
                        {app.status === "Pending" && (
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Tooltip title="Accept the applicant" arrow>
                                    <Button
                                        onClick={() => handleStatusUpdate(app.id, "Accepted")}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                    >
                                        Accept
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Reject the applicant" arrow>
                                    <Button
                                        onClick={() => handleStatusUpdate(app.id, "Rejected")}
                                        color="secondary"
                                        variant="outlined"
                                        size="small"
                                    >
                                        Reject
                                    </Button>
                                </Tooltip>
                            </Box>
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
                    <Tab label="Accepted" />
                    <Tab label="Rejected" />
                </Tabs>
                <List sx={{ maxHeight: 400, overflow: "auto", p: 2 }}>
                    {activeTab === 0 && renderApplicants(applicants.pending)}
                    {activeTab === 1 && renderApplicants(applicants.accepted)}
                    {activeTab === 2 && renderApplicants(applicants.rejected)}
                </List>
            </Dialog>

            <Dialog open={commentDialogOpen} onClose={() => setCommentDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Comment</DialogTitle>
                <Box sx={{ p: 3 }}>
                    <Typography variant="body1">Add updated file:</Typography>
                    <input
                        type="file"
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
        </>
    );
};

export default AccountApplicantDialog;
