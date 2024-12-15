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
} from "@mui/material";
import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { BASE_URL } from "@/constants/api";
import { formatDate } from "@/lib/date-formatter";
import { notification } from "antd";
import { getAllReviewMilestonesByScholarship } from "@/services/ApiServices/reviewMilestoneService";

const AssignExpertDialog = ({ open, onClose, scholarshipId }: any) => {
  const [experts, setExperts] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<any[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

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
  
      if (response.status === 200) {
        notification.success({ message: "Expert successfully assigned!" });
        onClose();
      } else {
        notification.error({
          message: "Failed to assign expert. Please try again.",
        });
      }
    } catch (error: any) {
      notification.error({
        message: `Failed to assign expert: ${
          error.response?.data?.message || "Unknown error"
        }`,
      });
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      
      <div className="p-5">
        {/* Step 1: Select Expert */}
        {step === 1 && (
          <>
            {/* <h3>Select Expert:</h3> */}
            <DialogTitle>Select Expert for 
            <span className="text-sky-500">{selectedReviewMilestone && 
            ` ${selectedReviewMilestone.description}`}</span>
            </DialogTitle>
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                {/* Search Bar */}
                <TextField
                  fullWidth
                  placeholder="Search Experts"
                  onChange={(e) => {
                    const searchValue = e.target.value.toLowerCase();
                    setExperts((prevExperts) =>
                      prevExperts.map((expert) => ({
                        ...expert,
                        isVisible: expert.username
                          .toLowerCase()
                          .includes(searchValue),
                      }))
                    );
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
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
                        style={{ cursor: "pointer" }}
                      >
                        <ListItemText
                          primary={expert.username}
                          secondary={`Major: ${expert.major || "N/A"}`}
                        />
                      </ListItem>
                    ))}

                  {experts.every((expert) => expert.isVisible === false) && (
                    <p>No experts match your search.</p>
                  )}
                </List>
              </>
            )}
          </>
        )}

        {/* Step 2: Select Applications */}
        {step === 2 && (
          <>
            <DialogTitle>Select Applications</DialogTitle>
            <List>
              {applications.map((application: any) => (
                <ListItem key={application.id}>
                  <Checkbox
                    checked={selectedApplications.includes(application.id)}
                    onChange={() => handleApplicationSelection(application.id)}
                  />
                  <ListItemText
                    primary={application.applicant.username}
                    secondary={`Applied on: ${formatDate(
                      application.appliedDate
                    )}`}
                  />
                </ListItem>
              ))}
            </List>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              <Button variant="outlined" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                variant="contained"
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
            <DialogTitle>Assign Expert</DialogTitle>
            <p>
              <strong>Expert:</strong> {selectedExpert.username}
            </p>
            <p>
              <strong>Applications:</strong> {selectedApplications.length}{" "}
              selected
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              <Button variant="outlined" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={assignExpert}
              >
                Assign
              </Button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default AssignExpertDialog;
