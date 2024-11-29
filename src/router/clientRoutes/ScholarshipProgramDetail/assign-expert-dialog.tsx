// import axios from "axios";
// import {
//   Autocomplete,
//   Box,
//   Button,
//   Checkbox,
//   Dialog,
//   DialogTitle,
//   InputAdornment,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemButton,
//   ListItemText,
//   Paper,
//   styled,
//   TextField,
//   CircularProgress,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import { IoIosEye } from "react-icons/io";
// import { FaCheckCircle, FaUniversity } from "react-icons/fa";
// import { MdArrowForward } from "react-icons/md";
// import { SearchIcon } from "lucide-react";
// import { BASE_URL } from "@/constants/api";
// import { formatDate } from "@/lib/date-formatter";
// import { getAllMajors } from "@/services/ApiServices/majorService";
// import { FaBook, FaUsers } from "react-icons/fa";

// const StyledAutocomplete = styled(Autocomplete)(() => ({
//   "& .MuiAutocomplete-popupIndicator": {
//     display: "none",
//   },
// }));

// const CustomPaper = (props: any) => (
//   <Paper
//     {...props}
//     style={{
//       maxHeight: 150,
//       overflowY: "auto",
//     }}
//   />
// );

// const AssignExpertDialog = ({
//   open,
//   onClose,
//   resetMajor,
//   experts,
//   scholarshipId,
// }: any) => {
//   const [majors, setMajors] = useState<any>([]);
//   const [applications, setApplications] = useState<any[]>([]);
//   const [selectedApplications, setSelectedApplications] = useState<any[]>([]);
//   const [selectedExpert, setSelectedExpert] = useState<any>(null);
//   const [selectedMajor, setSelectedMajor] = useState<any>(null);
//   const [error, setError] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [step, setStep] = useState<1 | 2 | 3>(1);

//   useEffect(() => {
//     if (open) {
//       if (!scholarshipId) {
//         console.warn("scholarshipId is null or undefined. Cannot fetch data.");
//         return;
//       }
//       console.log("Fetching data for scholarshipId:", scholarshipId);
//       fetchApplications();
//       fetchMajors();
//     }
//   }, [open, scholarshipId]);

//   const fetchMajors = async () => {
//     setLoading(true);
//     try {
//       const response = await getAllMajors();
//       if (response.statusCode === 200) {
//         setMajors(response.data.items);
//       } else {
//         setError("Failed to get majors");
//       }
//     } catch (error) {
//       setError((error as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchApplications = async () => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/api/applications/get-by-scholarship/${scholarshipId}`
//       );
//       console.log("Applications API Response:", response.data.data);
//       setApplications(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching applications:", error);
//       setError("Failed to fetch applications.");
//     }
//   };

//   const toggleApplicationSelection = (applicationId: number) => {
//     setSelectedApplications((prev) =>
//       prev.includes(applicationId)
//         ? prev.filter((id) => id !== applicationId)
//         : [...prev, applicationId]
//     );
//   };

//   const handleNext = () => {
//     if (selectedApplications.length === 0) {
//       alert("Please select at least one application!");
//       return;
//     }
//     setStep(2); // Go to major selection step
//   };

//   const handleMajorSelection = (major: any) => {
//     setSelectedMajor(major);
//     setStep(3); // Go to expert selection step
//   };

//   const resetForm = () => {
//     setSelectedApplications([]);
//     setSelectedExpert(null);
//     setSelectedMajor(null);
//     setStep(1);
//   };

//   const assignExpert = async () => {
//     if (!selectedExpert) {
//       alert("Please select an expert!");
//       return;
//     }

//     const payload = {
//       description: "Review assignment",
//       reviewDate: new Date().toISOString(),
//       expertId: selectedExpert.id,
//       applicationIds: selectedApplications,
//     };

//     try {
//       const response = await axios.post(
//         `${BASE_URL}/api/applications/reviews/assign-expert`,
//         payload
//       );
//       if (response.status === 200) {
//         alert("Expert successfully assigned!");
//         resetForm();
//         onClose(); // Close dialog after success
//       } else {
//         alert("Failed to assign expert. Please try again.");
//       }
//     } catch (error: any) {
//       alert(
//         `Failed to assign expert: ${
//           error.response?.data?.message || "Unknown error"
//         }`
//       );
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullWidth
//       maxWidth="lg"
//       className="p-5"
//     >
//       <DialogTitle className="flex items-center justify-between gap-5 flex-wrap bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 shadow-lg">
//         {step === 1
//           ? "Assign Expert"
//           : step === 2
//           ? "Assign Expert"
//           : "Assign Expert"}
//       </DialogTitle>
//       <div className="p-5 space-y-4">
//         {/* Step 1: Applications List */}
//         {step === 1 ? (
//           <>
//             <p className="text-xl font-bold flex items-center justify-center bg-gradient-to-r text-blue-500 p-4 rounded-lg shadow-lg mt-5 mb-5">
//               {/* <FaBook className="mr-3 text-blue text-3xl" /> */}
//               <span>Select Applications</span>
//             </p>
//             {applications.length === 0 ? (
//               <p className="text-gray-500">
//                 No applications found for this scholarship.
//               </p>
//             ) : (
//               <List>
//                 {applications.map((application: any) => (
//                   <ListItem
//                     key={application.id}
//                     className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-200"
//                   >
//                     <div className="flex items-center gap-4">
//                       <Checkbox
//                         checked={selectedApplications.includes(application.id)}
//                         onChange={() =>
//                           toggleApplicationSelection(application.id)
//                         }
//                       />
//                       <ListItemAvatar>
//                         <img
//                           className="w-12 h-12 rounded-full"
//                           src={application.applicant.avatarUrl || ""}
//                           alt={application.applicant.username}
//                         />
//                       </ListItemAvatar>
//                       <ListItemText
//                         primary={application.applicant.username}
//                         secondary={`Applied on: ${formatDate(
//                           application.appliedDate
//                         )}`}
//                       />
//                     </div>
//                     <Button
//                       onClick={() =>
//                         window.open(
//                           `/funder/application/${application.id}`,
//                           "_blank"
//                         )
//                       }
//                       variant="contained"
//                       color="primary"
//                       className="hover:bg-blue-700"
//                     >
//                       <IoIosEye className="mr-2" /> View
//                     </Button>
//                   </ListItem>
//                 ))}
//               </List>
//             )}
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               className="bg-blue-600 text-white hover:bg-blue-700 mt-4"
//             >
//               <MdArrowForward className="mr-2" />
//               Next
//             </Button>
//           </>
//         ) : step === 2 ? (
//           /* Step 2: Major Selection */
//           <>
//             <p className="text-xl font-bold flex items-center justify-center bg-gradient-to-r text-blue-500 p-4 rounded-lg shadow-lg mt-5 mb-5">
//               <FaBook className="mr-3 text-blue text-3xl" />
//               <span>
//                 Choose the major of the expert you want to review applications
//               </span>
//             </p>
//             {loading ? (
//               <CircularProgress className="m-auto" />
//             ) : error ? (
//               <p className="text-red-500">{error}</p>
//             ) : majors.length === 0 ? (
//               <p className="text-gray-500">No majors available.</p>
//             ) : (
//               <List>
//                 {majors.map((major: any) => (
//                   <ListItem
//                     key={major.id}
//                     className="px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
//                     onClick={() => handleMajorSelection(major)}
//                   >
//                     <ListItemAvatar>
//                       <FaUniversity className="text-blue-600 text-3xl"/>
//                     </ListItemAvatar>
//                     <ListItemText primary={major.name} className="text-xl font-medium text-gray-800 font-poppins"/>
//                     <MdArrowForward className="text-blue-500 text-2xl" />
//                   </ListItem>
//                 ))}
//               </List>
//             )}
//           </>
//         ) : (
//           /* Step 3: Expert Selection */
//           <>
//             <h3 className="font-semibold text-gray-700">Select an Expert:</h3>
//             {/* <StyledAutocomplete
//             sx={{ height: "200px" }}
//               options={experts}
//               getOptionLabel={(option: any) => option.username}
//               value={selectedExpert}
//               onChange={(e, newValue) => setSelectedExpert(newValue)}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Search Experts"
//                   variant="outlined"
//                   InputProps={{
//                     ...params.InputProps,
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <SearchIcon />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               )}
//               PaperComponent={CustomPaper}
//             /> */}
//                        <StyledAutocomplete
//             sx={{ height: "200px" }}
//             open={open}
//             disableCloseOnSelect
//             options={experts}
//             value={selectedExpert}
//             onChange={(event, newValue) => setSelectedExpert(newValue)}
//             getOptionLabel={(option: any) => option.username}
//             renderOption={(props, option: any) => {
//               const { key, ...optionProps } = props;
//               return (
//                 <Box
//                   key={key}
//                   component="li"
//                   sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
//                   {...optionProps}
//                 >
//                   <div className="flex w-full justify-between items-center">
//                     <div className="flex items-center gap-5">
//                       <img
//                         loading="lazy"
//                         width="35"
//                         height="35"
//                         className="rounded-full border-2 border-gray-200"
//                         src={
//                           option.avatarUrl ?? "https://github.com/shadcn.png"
//                         }
//                         alt=""
//                       />
//                       <span className="font-semibold text-lg">
//                         {option.username}
//                       </span>
//                     </div>
//                     <a
//                       href={`/profile/${option.id}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <h2 className="flex items-center text-base font-semibold text-gray-800 bg-gradient-to-r from-cyan-500 to-blue-500 p-1 rounded-lg shadow-xl">
//                         <FaUsers className="mr-3 text-white text-2xl" />
//                         <span className="text-white">View Profile</span>
//                       </h2>
//                     </a>
//                   </div>
//                 </Box>
//               );
//             }}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Search Experts"
//                 InputProps={{
//                   ...params.InputProps,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//                 className="bg-gray-100 rounded-full"
//               />
//             )}
//             PaperComponent={CustomPaper}
//           />
//           </>
//         )}
//       </div>

//       {/* Footer Actions */}
//       <div className="flex justify-end p-4 gap-4">
//         {step === 1 ? (
//           <Button
//             variant="outlined"
//             onClick={onClose}
//             className="border-gray-500 text-gray-500 hover:bg-gray-100"
//           >
//             Cancel
//           </Button>
//         ) : step === 2 ? (
//           <Button
//             variant="outlined"
//             onClick={() => setStep(1)}
//             className="border-gray-500 text-gray-500 hover:bg-gray-100"
//           >
//             Back
//           </Button>
//         ) : (
//           <Button
//             variant="outlined"
//             onClick={() => setStep(2)}
//             className="border-gray-500 text-gray-500 hover:bg-gray-100"
//           >
//             Back
//           </Button>
//         )}

//         {step === 3 && (
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={assignExpert}
//             className="bg-blue-600 text-white hover:bg-blue-700"
//           >
//             Assign Expert
//           </Button>
//         )}
//       </div>
//     </Dialog>
//   );
// };

// export default AssignExpertDialog;

// =======================================================
import axios from "axios";
import {
  Autocomplete,
  Box,
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
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { BASE_URL } from "@/constants/api";
import { formatDate } from "@/lib/date-formatter";

// Styled Autocomplete component to hide popup indicator
const StyledAutocomplete = styled(Autocomplete)(() => ({
  "& .MuiAutocomplete-popupIndicator": {
    display: "none",
  },
}));

const AssignExpertDialog = ({ open, onClose, scholarshipId }: any) => {
  const [experts, setExperts] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<any[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  // Fetch experts related to the scholarship program
  const fetchExperts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/scholarship-programs/${scholarshipId}/experts`
      );
      console.log("Fetched Experts:", response.data); // Add this log to inspect the response
      if (Array.isArray(response.data.data)) {
        setExperts(response.data.data); // Assuming the experts are inside 'data'
      } else {
        setExperts([]); // If not an array, reset to an empty array
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
      const response = await axios.get(
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
      fetchExperts(); // Fetch experts when the dialog opens
    }
  }, [open]);

  // Handle expert selection and move to Step 2
  const handleExpertSelection = (expert: any) => {
    setSelectedExpert(expert);
    fetchApplications(); // Fetch applications after selecting an expert
    setStep(2); // Move to step 2 (Application Selection)
  };

  // Handle application selection (toggle selection)
  const handleApplicationSelection = (applicationId: number) => {
    setSelectedApplications((prev) =>
      prev.includes(applicationId)
        ? prev.filter((id) => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  // Handle assigning expert to applications
  const assignExpert = async () => {
    if (!selectedApplications.length || !selectedExpert) {
      alert("Please select an expert and applications before assigning.");
      return;
    }

    const payload = {
      description: "Review assignment",
      reviewDate: new Date().toISOString(),
      expertId: selectedExpert.id,
      applicationIds: selectedApplications,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/api/applications/reviews/assign-expert`,
        payload
      );
      if (response.status === 200) {
        alert("Expert successfully assigned!");
        onClose(); // Close dialog after assignment
      } else {
        alert("Failed to assign expert. Please try again.");
      }
    } catch (error: any) {
      alert(
        `Failed to assign expert: ${
          error.response?.data?.message || "Unknown error"
        }`
      );
    }
  };

  console.log("EXPERT", experts);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Assign Expert</DialogTitle>
      <div className="p-5">
        {/* Step 1: Select Expert */}
        {step === 1 && (
          <>
            <h3>Select Expert:</h3>
            {loading ? (
              <CircularProgress />
            ) : (
              <StyledAutocomplete
                options={experts} 
                getOptionLabel={(option: any) => option.username}
                onChange={(event, newValue) => handleExpertSelection(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Experts"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            )}
          </>
        )}

        {/* Step 2: Select Applications */}
        {step === 2 && (
          <>
            <h3>Select Applications:</h3>
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
            <Button
              variant="contained"
              onClick={() => setStep(3)}
              disabled={!selectedApplications.length}
            >
              Next
            </Button>
          </>
        )}

        {/* Step 3: Confirm Assignment */}
        {step === 3 && (
          <>
            <h3>Assign Expert:</h3>
            <p>
              <strong>Expert:</strong> {selectedExpert.username}
            </p>
            <p>
              <strong>Applications:</strong> {selectedApplications.length}{" "}
              selected
            </p>
            <Button variant="contained" color="primary" onClick={assignExpert}>
              Assign
            </Button>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default AssignExpertDialog;
