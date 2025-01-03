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
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ListIcon, SearchIcon } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import React from "react";
import ApplicationStatus from "@/constants/applicationStatus";

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
      const response = await axios.get(
        `${BASE_URL}/api/scholarship-programs/${scholarshipId}/experts`
      );

      if (Array.isArray(response.data.data)) {
        setExperts(response.data.data);
        
        
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
      //fetchExperts();
      fetchReviewingExperts();
    }
  }, [open]);

  const fetchReviewingExperts = async () => {
    let applications = await fetchApplications();
    const experts = await fetchExperts();
    const reviewMilestones = await getAllReviewMilestonesByScholarship(scholarshipId);
    let milestone = reviewMilestones.data
      .filter((milestone: any) => new Date(milestone.fromDate) > new Date())
      .sort((a: any, b: any) => 
        new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime()
      )[0];
    if(reviewMilestones.data.some((milestone: any) => 
        new Date(milestone.fromDate) <= new Date() && 
        new Date(milestone.toDate) >= new Date())
    ){
        const happeningReviewMilestone = reviewMilestones.data.find((milestone: any) => 
            new Date(milestone.fromDate) <= new Date() && 
            new Date(milestone.toDate) >= new Date())
        notification.error({message:happeningReviewMilestone.description+" is happening, you can not assign now."});
        setSelectedReviewMilestone(null);
        setApplications([])
        return;
    }
    else if(!milestone)
    {
        notification.error({message:"All review milestone is over."});
        setSelectedReviewMilestone(null);
        setApplications([])
        return;
    }
    setSelectedReviewMilestone(milestone);
    if(milestone.description == "Application Review")
    {
        /*applications = applications.filter((application: any) => 
            application.status == ApplicationStatus.Reviewing ||
            application.status == ApplicationStatus.Submitted)*/
    }
    else if(milestone.description == "Interview")
    {
        const reviewedApplications = applications.filter((application: any) => 
            application.applicationReviews.find((review: any) => 
            review.description == "Application Review"));
        //console.log("passedApplications",reviewedApplications);
        
        applications = reviewedApplications.filter((application: any) => application.applicationReviews
            .find((review: any) => review.status == "Approved") != null );
    }
    setApplications(applications)
    //console.log("Applications",applications);
    

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

  /*const handleMilestoneSelection = (milestone: any) => {
    setSelectedReviewMilestone(milestone);
    fetchReviewingExperts(milestone);
    setStep(2);
  };*/

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
          {/*<div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${step === 1 ? "bg-blue-600" : "bg-gray-300"}`}>
            1
          </div>
          <div className="h-1 w-20 bg-gray-300 mx-2"></div>*/}
          <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${step === 1 ? "bg-blue-600" : "bg-gray-300"}`}>
            1
          </div>
          <div className="h-1 w-20 bg-gray-300 mx-2"></div>
          <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${step === 2 ? "bg-blue-600" : "bg-gray-300"}`}>
            2
          </div>
        </div>


        {/* Step Subtitles */}
      <div className="flex justify-center">
        {/*<div className="text-center w-32">
          <p className={`text-sm font-medium ${step === 1 ? "text-blue-600" : "text-gray-500"}`}>Review Milestone</p>
        </div>*/}
        <div className="text-center w-32">
          <p className={`text-sm font-medium ${step === 1 ? "text-blue-600" : "text-gray-500"}`}>Assign</p>
        </div>
        <div className="text-center w-32">
          <p className={`text-sm font-medium ${step === 2 ? "text-blue-600" : "text-gray-500"}`}>Choose Date &amp; Confirm</p>
        </div>
      </div>

      
        {/* Step 1: Select Review Milestone */}
        

        {/* Step 1: Assign Expert*/}
        {step === 1 && value && (
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
              <span className="text-sky-500 ml-1">{selectedReviewMilestone?.description || ""}</span>
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
              {selectedReviewMilestone && selectedReviewMilestone.description == "Application Review" && <div>You can only assign 1 expert for this review</div>}
              {applications.length === 0 && selectedReviewMilestone && selectedReviewMilestone.description == "Application Review" && (
                  <p className="text-center text-gray-500">No applications yet.</p>
                )}
              {applications.length === 0 && selectedReviewMilestone && selectedReviewMilestone.description == "Interview" && (
                  <p className="text-center text-gray-500">No applications passed Application Review yet.</p>
                )}
                {applications.length === 0 && !selectedReviewMilestone && (
                  <p className="text-center text-gray-500">You can not assign expert now.</p>
                )}  
              {selectedReviewMilestone && <List>
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
                            isFirstReview: selectedReviewMilestone.description === "Application Review",
                            expertIds: changedValue.map((option) =>({ 
                                id: option.expertId,
                                deadlineDate: format(new Date().setDate(new Date().getDate() + 7), "yyyy-MM-dd"),
                            })),
                          },
                        ]);
                        //console.log(submitAssignExperts);
                        setValue((prevValue:any) => {
                            prevValue[application.id] = [...changedValue, ...reviewingExperts[application.id]];
                            setChangedValue((cv:any) => {
                                cv[application.id] = changedValue;
                                return cv
                            });
                            return prevValue;
                        })
                      }}
                      options={selectedReviewMilestone.description == "Application Review" ?
                        (value[application.id].length === 0 ?
                        experts.filter((expert) => !value[application.id].map((item: any) => item.expertId)
                        ?.includes(expert.expertId)) : []) : 
                        experts.filter((expert) => !value[application.id].map((item: any) => item.expertId)
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
                    <div>
                        <Link
                          target="_blank"
                          to={`/funder/application/${application.id}`}
                          className="flex my-auto items-center gap-2 text-sky-500 underline hover:text-sky-600 transition-all mt-4"
                        >
                          <FaUser className="text-sky-500" />
                          <span className="text-sm">View Detail</span>
                        </Link>
                        <Link
                          target="_blank"
                          to={`/funder/choose-winners/${scholarshipId}`}
                          className="flex my-auto items-center gap-2 text-sky-500 underline hover:text-sky-600 transition-all mt-4"
                        >
                          <ListIcon className="text-sky-500" />
                          <span className="text-sm">View Result</span>
                        </Link>
                    </div>
                  </ListItem>
                ))}
              </List>}
            {applications.length > 0 && selectedReviewMilestone && <div className="flex justify-between mt-4">
              <div></div>
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
                    //console.log(value)
                    if(Object.values(changedValue).every((value) => Array.isArray(value) && value.length === 0)){
                        notification.error({message: "You haven't made any changes."})
                        return;
                    }
                    if(selectedReviewMilestone.description === "Interview"){
                        if(Object.values(value).every((value) => Array.isArray(value) && (value.length < 2 || value.length % 2 == 0))){
                            notification.error({message: "You need to assign an odd number of experts (at least 3) for Interview round."})
                            return;
                        }
                    }
                    setStep(2) 
                }}
                //disabled={!selectedApplications.length}
              >
                Next
              </Button>
            </div>}
          </>
        )}

        {/* Step 3: Confirm Assignment */}
        {step === 2 && (
          <>
            <DialogTitle
              style={{
                fontWeight: 700,
                fontSize: "1.5rem",
                display: "flex",
                //justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "1rem",
                backgroundColor: "#f0f4f8",
                borderRadius: "8px",
              }}
            >
              Assign Expert for
              <span className="text-sky-500 ml-1">{selectedReviewMilestone?.description || ""}</span>
            </DialogTitle>
              {applications.map((application:any, index: number) => (
              <div key={application.id}>
                 {changedValue[application.id].length > 0 && 
                  <>
                  <div className="space-y-2">
                      <p style={{fontSize: "20px"}}>
                        <strong style={{ color: "#0369a1" }}>{index+1 + ". " + "Application"}:</strong>{" "}
                          {application.applicant.username}
                        </p>
                      <p className="flex gap-3">
                        <strong style={{ color: "#0369a1" }}>Experts:</strong>{" "}
                        <Paper
                          elevation={3}
                          style={{
                            padding: '10px',
                            borderRadius: '10px',
                            backgroundColor: '#fafafa',
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                            width: '100%',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              fontWeight: 'bold',
                              backgroundColor: '#f1f1f1',
                              padding: '10px',
                              borderRadius: '8px',
                              marginBottom: '10px',
                            }}
                          >
                            <div style={{ flex: 0.5 }}>Name</div>
                            <div style={{ flex: 0.5 }}>Review Deadline Date</div>
                          </div>

                        {changedValue[application.id].map((expert:any) => (
                            <span className="flex items-center mb-3" key={expert.expertId}>
                                <span style={{flex: 0.5, paddingLeft: '10px'}}>{expert.username}</span>
                                <Input
                                    style={{flex: 0.5}}
                                    type="date"
                                    value={submitAssignExperts
                                    .find((app:any) => app.applicationId == application.id)?.expertIds
                                    .find((e:any) => e.id == expert.expertId).deadlineDate}
                                    
                                    
                                    onChange={(e) => {
                                        const newReviewDate = e.target.value;

                                        setSubmitAssignExperts((prevSubmit: any) => {
                                          console.log(submitAssignExperts)
                                          return prevSubmit.map((app: any) => {
                                            if (app.applicationId === application.id) {
                                              return {
                                                ...app,
                                                expertIds: app.expertIds.map((exp: any) => {
                                                  if (exp.id === expert.expertId) {
                                                    return {
                                                      ...exp,
                                                      deadlineDate: newReviewDate,
                                                    };
                                                  }
                                                  return exp;
                                                }),
                                              };
                                            }
                                            return app;
                                          });
                                        });
                                      }
                                    }
                                  />
                            </span>
                        ))}
                        </Paper>
                      </p>
                  </div>
                  <div className="h-px bg-gray-200 my-4"></div></>
                  }
              </div>
              ))}
            <br />
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
