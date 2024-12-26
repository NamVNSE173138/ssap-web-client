import { uploadFile } from "@/services/ApiServices/fileUploadService";
import { getRequestById, updateRequest } from "@/services/ApiServices/requestService";
import { RootState } from "@/store/store";
import { AddComment } from "@mui/icons-material";
import { Box, Button, CircularProgress, Dialog, DialogTitle } from "@mui/material";
import { notification } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FaCommentDots } from "react-icons/fa";
import { IoCloudUpload } from "react-icons/io5";
import { useSelector } from "react-redux";

const AddCommentRequest = ({
    selectedRequestId,
    setSelectedRequestId
}: {
    selectedRequestId: number | null;
    setSelectedRequestId: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
    const user = useSelector((state: RootState) => state.token.user);
    const [commentText, setCommentText] = useState("");
    const [commentFile, setCommentFile] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCommentFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setCommentFile(Array.from(event.target.files));
        }
    };

    console.log(selectedRequestId)

    const handleSubmitComment = async () => {
        if (selectedRequestId === null) return;
        if (!user) return null;
        setIsSubmitting(true);
        try {
            const existingApplicantResponse = await getRequestById(selectedRequestId);
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
                    serviceResultDetails[0].requestFileUrls.push(...fileUrls.data);
                }

                const updatedRequest = {
                    ...existingApplicantResponse.data,
                    serviceResultDetails,
                };

                await updateRequest(selectedRequestId, updatedRequest);

                notification.success({ message: "Comment successfully!" });
                setSelectedRequestId(null);
                setCommentText("");
            } else {
                console.error(`Request details for applicant id:${setSelectedRequestId} not found`);
                notification.error({message: "Comment failed!"})
            }
        } catch (error) {
            console.error("Failed to update applicant status", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        selectedRequestId !== null && (
            <Dialog
                open={true}
                onClose={() => setSelectedRequestId(null)}
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
                        <label className=" text-gray-700 font-medium mb-2 flex items-center gap-2">
                            <IoCloudUpload className="text-blue-500" />
                            Add updated file (Optional):
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
                        <label className=" text-gray-700 font-medium mb-2 flex items-center gap-2">
                            <AddComment className="text-blue-500" />
                            Add your comment:
                        </label>

                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Type your comment here..."
                            className="w-full p-2 mb-2 border border-gray-300 rounded-lg resize-y min-h-[100px] hover:border-blue-400 focus:border-blue-500 transition-all"
                        />
                    </div>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button
                            onClick={() => setSelectedRequestId(null)} // Close dialog
                            color="secondary"
                            variant="outlined"
                        >
                            <AiOutlineCloseCircle style={{ marginRight: "5px" }} />
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitComment}
                            color="primary"
                            variant="contained"
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
        )
    );
};

export default AddCommentRequest;
