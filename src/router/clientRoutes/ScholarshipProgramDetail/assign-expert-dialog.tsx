import axios from "axios";
import {
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  TextField,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { BASE_URL } from "@/constants/api";
import { formatDate } from "@/lib/date-formatter";
import { notification } from "antd";
import { getAllReviewMilestonesByScholarship } from "@/services/ApiServices/reviewMilestoneService";
import { GridCloseIcon } from "@mui/x-data-grid";
import { format } from "date-fns";


const AssignExpertDialog = ({ open, onClose, scholarshipId }: any) => {
  const [experts, setExperts] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<any[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false)

  const [selectedReviewMilestone, setSelectedReviewMilestone] = useState<any>(null);

  // Fetch experts related to the scholarship program
  const fetchExperts = async () => {
    setLoading(true);
    try {
      const [response, reviewMilestones] = await Promise.all([axios.get(
        `${BASE_URL}/api/scholarship-programs/${scholarshipId}/experts`
      ),
      getAllReviewMilestonesByScholarship(scholarshipId)
      ]);
      console.log("Fetched Experts:", response.data);

      console.log("Fetched Applications:", reviewMilestones.data.find(
        (milestone: any) => new Date(milestone.fromDate) < new Date() && new Date(milestone.toDate) > new Date())
        ?? reviewMilestones.data[0]);
      setSelectedReviewMilestone(reviewMilestones.data.find(
        (milestone: any) => new Date(milestone.fromDate) < new Date() && new Date(milestone.toDate) > new Date())
        ?? reviewMilestones.data[0]);

      if (Array.isArray(response.data.data)) {
        setExperts(response.data.data);
      } else {
        setExperts([]);
      }
    } catch (error) {
      console.error("Failed to fetch experts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications for the scholarship program
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await
        axios.get(
          `${BASE_URL}/api/applications/get-by-scholarship/${scholarshipId}`
        );
      setApplications(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchExperts();
    }
  }, [open]);

  // Handle expert selection and move to Step 2
  const handleExpertSelection = (expert: any) => {
    setSelectedExpert(expert);
    fetchApplications();
    setStep(2);
  };

  const handleApplicationSelection = (applicationId: number) => {
    setSelectedApplications((prev) =>
      prev.includes(applicationId)
        ? prev.filter((id) => id !== applicationId)
        : [...prev, applicationId]
    );
  };


  const assignExpert = async () => {

    if (!selectedApplications.length || !selectedExpert) {
      alert("Please select an expert and applications before assigning.");
      return;
    }
    setAssignLoading(true)
    try {
      // Fetch scholarship program details
      const scholarshipResponse = await axios.get(
        `${BASE_URL}/api/scholarship-programs/${scholarshipId}`
      );

      const scholarshipData = scholarshipResponse.data.data;
      const reviewMilestones = scholarshipData.reviewMilestones;

      // Get current date and time
      const currentDate = new Date();

      let isFirstReview = true;

      if (reviewMilestones && reviewMilestones.length > 0) {

        const secondReviewMilestone = reviewMilestones.find(
          (milestone: any) =>
            milestone.description.toLowerCase() === "interview"
        );

        if (secondReviewMilestone) {
          const secondReviewStart = new Date(secondReviewMilestone.fromDate);
          const secondReviewEnd = new Date(secondReviewMilestone.toDate);


          if (
            currentDate >= secondReviewStart &&
            currentDate <= secondReviewEnd
          ) {
            isFirstReview = false;
          }
        }
      }

      const payload = {
        isFirstReview,
        reviewDate: currentDate.toISOString(),
        expertId: selectedExpert.id,
        applicationIds: selectedApplications,
      };

      const response = await axios.post(
        `${BASE_URL}/api/applications/reviews/assign-expert`,
        payload
      );
      setAssignLoading(false)

      if (response.status === 200) {
        notification.success({ message: "Expert successfully assigned!" });
        setStep(1);
        setSelectedExpert(null);
        setSelectedApplications([]);
        onClose();
      } else {
        notification.error({
          message: "Failed to assign expert. Please try again.",
        });
      }
    } catch (error: any) {
      notification.error({
        message: `Failed to assign expert: ${error.response?.data?.message || "Unknown error"
          }`,
      });
    }
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          borderRadius: "16px",
        },
      }}
    >
      <div className="p-6 space-y-4">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${step === 1 ? "bg-blue-600" : "bg-gray-300"}`}>
            1
          </div>
          <div className="h-1 w-20 bg-gray-300 mx-2"></div>
          <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${step === 2 ? "bg-blue-600" : "bg-gray-300"}`}>
            2
          </div>
          <div className="h-1 w-20 bg-gray-300 mx-2"></div>
          <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${step === 3 ? "bg-blue-600" : "bg-gray-300"}`}>
            3
          </div>
        </div>

        {/* Step 1: Select Expert */}
        {step === 1 && (
          <>
            <DialogTitle
              style={{
                fontWeight: 700,
                fontSize: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "1rem",
                backgroundColor: "#f0f4f8",
                borderRadius: "8px",
              }}
            >
              <span>Select Expert for{" "}
                <span className="text-sky-500">{selectedReviewMilestone?.description || ""}</span>
              </span>
              <IconButton
                edge="end"
                color="inherit"
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "40px",
                  padding: 0,
                  color: "#0369a1",
                  fontSize: "2rem",
                }}
              >
                <GridCloseIcon style={{ fontSize: "inherit" }} />
              </IconButton>
            </DialogTitle>

            {loading ? (
              <div className="flex justify-center items-center">
                <CircularProgress style={{ color: "#0ea5e9" }} />
              </div>
            ) : (
              <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
                {/* Search Bar */}
                <TextField
                  fullWidth
                  placeholder="Search Experts"
                  variant="outlined"
                  onChange={(e) => {
                    const searchValue = e.target.value.toLowerCase();
                    setExperts((prevExperts) =>
                      prevExperts.map((expert) => ({
                        ...expert,
                        isVisible: expert.username.toLowerCase().includes(searchValue),
                      }))
                    );
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon style={{ color: "#0ea5e9" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  className="w-2/3"
                  style={{
                    marginBottom: "1rem",
                    borderColor: "#0ea5e9",
                  }}
                />

                {/* Experts List */}
                <List>
                  {experts
                    .filter((expert) => expert.isVisible !== false)
                    .map((expert: any) => (
                      <ListItem
                        key={expert.id}
                        component="div"
                        onClick={() => handleExpertSelection(expert)}
                        style={{
                          cursor: "pointer",
                          border: "1px solid #dbeafe",
                          borderRadius: "8px",
                          marginBottom: "0.5rem",
                          padding: "0.8rem",
                          transition: "all 0.2s ease-in-out",
                          backgroundColor: "#f9fafb",
                        }}
                        className="hover:bg-sky-100"
                      >
                        <ListItemText
                          primary={
                            <span style={{ fontWeight: "bold", color: "#0369a1" }}>
                              {expert.username}
                            </span>
                          }
                          secondary={`Major: ${expert.major || "N/A"}`}
                        />
                      </ListItem>
                    ))}

                  {experts.every((expert) => expert.isVisible === false) && (
                    <p className="text-center text-gray-500">No experts match your search.</p>
                  )}
                </List>
              </div>
            )}
          </>


        )}

        {/* Step 2: Select Applications */}
        {step === 2 && (
          <>
            <DialogTitle
              style={{
                fontWeight: 700,
                fontSize: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "1rem",
                backgroundColor: "#f0f4f8",
                borderRadius: "8px",
              }}
            >
              Select Applications
            </DialogTitle>
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
              <List>
                {applications.map((application: any) => (
                  <ListItem
                    key={application.id}
                    style={{
                      border: "1px solid #dbeafe",
                      borderRadius: "8px",
                      marginBottom: "0.5rem",
                      padding: "0.8rem",
                      transition: "all 0.2s ease-in-out",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <Checkbox
                      checked={selectedApplications.includes(application.id)}
                      onChange={() => handleApplicationSelection(application.id)}
                      style={{ color: "#0369a1" }}
                    />
                    <ListItemText
                      primary={
                        <span style={{ color: "#0369a1", fontWeight: "bold" }}>
                          {application.applicant.username}
                        </span>
                      }
                      secondary={
                        <>
                          Applied on{" "}
                          {application.appliedDate
                            ? format(new Date(application.appliedDate), "MM/dd/yyyy")
                            : "Not specified"}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </div>
            <div className="flex justify-between mt-4">
              <Button
                variant="outlined"
                onClick={() => setStep(1)}
                style={{
                  borderColor: "#0369a1",
                  color: "#0369a1",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#0ea5e9",
                  color: "white",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
                onClick={() => setStep(3)}
                disabled={!selectedApplications.length}
              >
                Next
              </Button>
            </div>
          </>
        )}

        {/* Step 3: Confirm Assignment */}
        {step === 3 && (
          <>
            <DialogTitle
              style={{
                fontWeight: 700,
                fontSize: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "1rem",
                backgroundColor: "#f0f4f8",
                borderRadius: "8px",
              }}
            >
              Assign Expert
            </DialogTitle>
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
              <div className="space-y-2">
                <p>
                  <strong style={{ color: "#0369a1" }}>Expert:</strong>{" "}
                  {selectedExpert.username}
                </p>
                <p>
                  <strong style={{ color: "#0369a1" }}>Applications:</strong>{" "}
                  {selectedApplications.length} selected
                </p>
              </div>
            </div>
            <br />
            <div className="flex justify-between mt-4">
              <Button
                variant="outlined"
                onClick={() => setStep(2)}
                style={{
                  borderColor: "#0369a1",
                  color: "#0369a1",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#0ea5e9",
                  color: "white",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
                onClick={assignExpert}
                disabled={assignLoading}
              >
                {assignLoading ? (
                  <div
                    className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin"
                    aria-hidden="true"
                  ></div>
                ) : (
                  <span>Assign</span>
                )}
              </Button>
            </div>
          </>
        )}

      </div>
      {/* {loading && <ScreenSpinner/>} */}
    </Dialog>
  );
};

export default AssignExpertDialog;
