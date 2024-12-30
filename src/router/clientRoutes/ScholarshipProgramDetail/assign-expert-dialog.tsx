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
  ListItemButton,
  ListItemAvatar,
  Avatar,
  Typography,
  Autocomplete,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { BASE_URL } from "@/constants/api";
import { notification } from "antd";
import { getAllReviewMilestonesByScholarship } from "@/services/ApiServices/reviewMilestoneService";
import { GridCloseIcon } from "@mui/x-data-grid";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { assignExpertsToApplicationApi, getReviewsOfApplications } from "@/services/ApiServices/applicationService";


const AssignExpertDialog = ({ open, onClose, scholarshipId }: any) => {
  const token = useSelector((state: RootState) => state.token.token);
  const [experts, setExperts] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false)

  const [selectedReviewMilestone, setSelectedReviewMilestone] = useState<any>(null);
  const [reviewMilestone, setReviewMilestones] = useState<any[]>([]);
  const [value, setValue] = useState<any>({}
    /*{
      applicationId: [experts],
    }*/
  );

  const [changedValue, setChangedValue] = useState<any>({}
    /*{
      applicationId: [experts],
    }*/
  );

  const [submitAssignExperts, setSubmitAssignExperts] = useState<any[]>([
    /*{
      "applicationId": 0,
      "reviewDate": "2024-12-29T16:01:43.380Z",
      "isFirstReview": true,
      "expertIds": [
        0
      ]
    }*/
  ]);

  const [reviewingExperts, setReviewingExperts] = useState<any>(null
    /*{
      applicationId: [experts],
    }*/
  );
  // Fetch experts related to the scholarship program
  const fetchExperts = async () => {
    setLoading(true);
    try {
      const [response, reviewMilestones] = await Promise.all([axios.get(
        `${BASE_URL}/api/scholarship-programs/${scholarshipId}/experts`
      ),
      getAllReviewMilestonesByScholarship(scholarshipId),
      ]);

      if (Array.isArray(response.data.data)) {
        setExperts(response.data.data);
        setReviewMilestones(reviewMilestones.data);
        
      } else {
        setExperts([]);
      }
      return response.data.data;
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
      setValue(
      response.data.data.reduce((acc: any, application: any) => {
        acc[application.id] = [];
        return acc;
      }, {}));
      setChangedValue(
      response.data.data.reduce((acc: any, application: any) => {
        acc[application.id] = [];
        return acc;
      }, {}));

      setReviewingExperts(
      response.data.data.reduce((acc: any, application: any) => {
        acc[application.id] = [];
        return acc;
      }, {}));
      return response.data.data;
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

  const fetchReviewingExperts = async (milestone:any) => {
    const applications = await fetchApplications();
    const experts = await fetchExperts();

    for(const application of applications) {
        const reviewingExpertIds = application.applicationReviews
           .filter((review: any) => review.description == milestone.description)
           .map((review: any) => review.expertId);
        setReviewingExperts((reviewingExpert:any) => {
            reviewingExpert[application.id] = experts.filter((expert:any) => reviewingExpertIds.includes(expert.expertId));
            setValue((value:any) => {
                value[application.id] = reviewingExpert[application.id];
                return value;
            });
            return reviewingExpert;
        });
        
    } 
  }

  const handleMilestoneSelection = (milestone: any) => {
    setSelectedReviewMilestone(milestone);
    fetchReviewingExperts(milestone);
    setStep(2);
  };

  const assignExpertsToApplication = async () => {
    try{
        setAssignLoading(true);
        //remove unecessary update
        submitAssignExperts.forEach((assign: any) => {
            assign.expertIds.length == 0 ? submitAssignExperts.splice(submitAssignExperts.indexOf(assign), 1) : null
        })
        const response = await assignExpertsToApplicationApi(submitAssignExperts, token??"");
        if(response.statusCode == 200){
            notification.success({ message: "Experts successfully assigned!" });
            setStep(1);
            setSubmitAssignExperts([]);
            setValue(null);
            //setSelectedExpert(null);
            //setSelectedApplications([]);
            onClose();
        }
        setAssignLoading(false);
    }
    catch(err){
        notification.error({ message: "Failed to assign expert. Please try again." });
        console.log(err);
    }
    finally{
        setAssignLoading(false);
    }
  }


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


        {/* Step Subtitles */}
      <div className="flex justify-center">
        <div className="text-center w-32">
          <p className={`text-sm font-medium ${step === 1 ? "text-blue-600" : "text-gray-500"}`}>Step 1: Details</p>
        </div>
        <div className="text-center w-32">
          <p className={`text-sm font-medium ${step === 2 ? "text-blue-600" : "text-gray-500"}`}>Step 2: Review</p>
        </div>
        <div className="text-center w-32">
          <p className={`text-sm font-medium ${step === 3 ? "text-blue-600" : "text-gray-500"}`}>Step 3: Confirm</p>
        </div>
      </div>

      
        {/* Step 1: Select Review Milestone */}
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
              <span>Select Review Milestone{" "}
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
                <List>
                  {reviewMilestone
                    //.filter((expert) => expert.isVisible !== false)
                    .map((review: any) => (
                      <ListItemButton
                        key={review.id}
                        component="div"
                        onClick={() => handleMilestoneSelection(review)}
                        disabled={new Date(review.toDate) < new Date()}
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
                              {review.description}
                            </span>
                          }
                          secondary={
                            <span>
                              From Date: {format(review.fromDate, "MM/dd/yyyy")}
                              <br />
                              To Date: {format(review.toDate, "MM/dd/yyyy")}
                            </span>
                          }
                          
                        />
                      </ListItemButton>
                    ))}

                  {/*experts.every((expert) => expert.isVisible === false) && (
                    <p className="text-center text-gray-500">No experts match your search.</p>
                  )*/}
                </List>
              </div>
            )}
          </>
        )}

        {/* Step 2: Assign Expert*/}
        {step === 2 && reviewingExperts && (
          <>
            <DialogTitle
              style={{
                fontWeight: 700,
                fontSize: "1.5rem",
                display: "flex",
                //justifyContent: "space-between",
                gap: 3,
                alignItems: "center",
                paddingBottom: "1rem",
                backgroundColor: "#f0f4f8",
                borderRadius: "8px",
              }}
            >
              Assign Expert for 
              <span className="text-sky-500">{selectedReviewMilestone?.description || ""}</span>
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
                      gap: "30px",
                      alignContent: "center",
                    }}
                  >
                  <ListItemAvatar>
                      <Avatar
                        alt={application.applicant.username}
                        src={
                          application.applicant.avatarUrl ??
                          "https://github.com/shadcn.png"
                        }
                        sx={{ width: 60, height: 60 }}
                      />
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <span className="font-bold text-sky-600">
                          {application.applicant.username}
                        </span>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: "text.primary", display: "inline" }}
                        >
                          {application.applicant.email}
                        </Typography>
                      }
                    />
                    <Autocomplete
                      multiple
                      value={value[application.id]}
                      onChange={(event, newValue) => {
                        const changedValue = newValue.filter((option) => !reviewingExperts[application.id]?.includes(option));
                        setSubmitAssignExperts((submit:any) => [
                           ...submit.filter((item: any) => item.applicationId !== application.id),
                          {
                            applicationId: application.id,
                            reviewDate: "2024-12-29T17:30:50.283Z",
                            isFirstReview: selectedReviewMilestone.description === "Application Review",
                            expertIds: changedValue.map((option) => option.expertId),
                          },
                        ]);
                        console.log(submitAssignExperts);
                        setValue((prevValue:any) => {
                            prevValue[application.id] = [...changedValue, ...reviewingExperts[application.id]];
                            setChangedValue((cv:any) => {
                                cv[application.id] = changedValue;
                                return cv
                            });
                            return prevValue;
                        })
                      }}
                      options={experts.filter((expert) => !value[application.id].map((item: any) => item.expertId)
                        ?.includes(expert.expertId))}
                      getOptionLabel={(option) => option.username}
                      renderOption={(props, option, { selected }) => {
                          const { key, ...restProps } = props; // Extract key and the rest of the props
                          return (
                            <li key={key} style={{display: "block"}} {...restProps}>
                                <div className="flex gap-2">
                                  <Avatar
                                    alt={option.username}
                                    src={
                                      option.avatarUrl ??
                                      "https://github.com/shadcn.png"
                                    }
                                    sx={{ width: 30, height: 30 }}
                                  />
                                  {option.username}
                                </div>
                                <div className="flex gap-2">
                                  <span className="font-bold">Major:</span>
                                  {option.major}
                                </div>
                            </li>
                          )
                        }
                      }
                      ListboxProps={{
                        style: {
                          maxHeight: 200, // Adjust the height as needed
                          overflow: "auto",
                        },
                      }}
                      renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return (
                            <Chip
                              key={key}
                              label={option.username}
                              {...tagProps}
                              disabled={reviewingExperts[application.id].includes(option)}
                            />
                          );
                        })
                      }
                      style={{ width: "40%" }}
                      renderInput={(params) => (
                        <TextField {...params} label="Assign Expert" placeholder="Search" />
                      )}
                    />
                    <Link
                      target="_blank"
                      to={`/funder/application/${application.id}`}
                      className="flex my-auto items-center gap-2 text-sky-500 underline hover:text-sky-600 transition-all mt-4"
                    >
                      <FaUser className="text-sky-500" />
                      <span className="text-sm">View Profile</span>
                    </Link>
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
                onClick={() => { 
                    //Check if there is no changes
                    if(Object.values(changedValue).every((value) => Array.isArray(value) && value.length === 0)){
                        notification.error({message: "You haven't made any changes."})
                        return;
                    }
                    setStep(3) 
                }}
                //disabled={!selectedApplications.length}
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
              {applications.map((application) => (
              <div key={application.id}>
                 {changedValue[application.id].length > 0 && 
                  <><div className="space-y-2">
                      <p>
                        <strong style={{ color: "#0369a1" }}>Application:</strong>{" "}
                          {application.applicant.username}
                        </p>
                      <p>
                        <strong style={{ color: "#0369a1" }}>Experts:</strong>{" "}
                        {changedValue[application.id].map((expert:any) => expert.username).join(", ")}
                      </p>
                      <p>
                        <strong style={{ color: "#0369a1" }}>Review Milestone:</strong>{" "}
                        {selectedReviewMilestone.description}
                      </p>
                  </div>
                  <div className="h-px bg-gray-200 my-4"></div></>
                  }
              </div>
              ))}
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
                onClick={assignExpertsToApplication}
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
