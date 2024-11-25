// import axios from "axios";
// import { getAllMajors } from "@/services/ApiServices/majorService";
// import {
//   Autocomplete,
//   Box,
//   Button,
//   Dialog,
//   DialogTitle,
//   InputAdornment,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Paper,
//   styled,
//   TextField,
// } from "@mui/material";
// import { ArrowLeftIcon, ArrowRightIcon, SearchIcon } from "lucide-react";
// import { useEffect, useState } from "react";

// import { Link } from "react-router-dom";

// import { BiRightArrow } from "react-icons/bi";
// import { FaBook, FaCheckCircle, FaUniversity, FaUsers } from "react-icons/fa";
// import { MdArrowForward } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { BASE_URL } from "@/constants/api";

// const StyledAutocomplete = styled(Autocomplete)({
//   "& .MuiAutocomplete-popupIndicator": {
//     display: "none",
//   },
// });

// const CustomPaper = (props: any) => (
//   <Paper
//     {...props}
//     style={{
//       maxHeight: 200,
//       overflowY: "auto",
//     }}
//   />
// );

// const AssignExpertDialog = ({ open, onClose, experts, scholarshipId }: any) => {
//   const navigate = useNavigate();
//   const [majors, setMajors] = useState<any>([]);
//   const [selectedMajor, setSelectedMajor] = useState<any>(null);
//   const [selectedExpert, setSelectedExpert] = useState<any>(null);
//   const [applicationId, setApplicationId] = useState<number | null>(null); // For storing applicationId
//   const [error, setError] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(true);

// const fetchMajors = async () => {
//   try {
//     const response = await getAllMajors();
//     if (response.statusCode === 200) {
//       setMajors(response.data.items);
//     } else {
//       setError("Failed to get majors");
//     }
//   } catch (error) {
//     setError((error as Error).message);
//   } finally {
//     setLoading(false);
//   }
// };

//   const fetchApplicationId = async () => {
//     if (!scholarshipId) {
//       console.error("Scholarship ID is invalid or not provided.");
//       alert("Scholarship ID is missing. Please check and try again.");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `${BASE_URL}/api/applications/get-by-scholarship/${scholarshipId}`
//       );

//       console.log("API Response for Application ID:", response.data);

//       if (response.status === 200 && response.data?.length > 0) {
//         const firstApplication = response.data[0];
//         setApplicationId(firstApplication.id);
//         console.log("Fetched Application ID:", firstApplication.id);
//       } else {
//         console.warn("No applications found for this scholarship.");
//         alert(
//           "No applications found for this scholarship. Please ensure applicants exist."
//         );
//         setApplicationId(null);
//       }
//     } catch (error: any) {
//       console.error("Error fetching application ID:", error.response?.data || error.message);
//       alert(
//         `Failed to fetch application ID. Error: ${
//           error.response?.data?.message || "Unknown error"
//         }`
//       );
//       setApplicationId(null);
//     }
//   };

//   const assignExpert = async () => {
//     if (!applicationId) {
//       alert(
//         "Application ID is not available. Please ensure applications exist for this scholarship."
//       );
//       return;
//     }

//     if (!selectedExpert) {
//       alert("Please select an expert!");
//       return;
//     }

//     const payload = {
//       description: "Review assignment",
//       reviewDate: new Date().toISOString(),
//       expertId: selectedExpert.id,
//       applicationId, // Use the fetched applicationId
//     };

//     try {
//       const response = await axios.post(
//         `${BASE_URL}/api/applications/reviews/assign-expert`,
//         payload,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       if (response.status === 200) {
//         alert("Expert successfully assigned!");
//         onClose();
//       } else {
//         console.error("Unexpected response:", response);
//         alert("Failed to assign expert. Please try again.");
//       }
//     } catch (error: any) {
//       console.error("Error assigning expert:", error.response?.data || error.message);
//       alert(
//         `Failed to assign expert: ${
//           error.response?.data?.message || "Unknown error"
//         }`
//       );
//     }
//   };

//   useEffect(() => {
//     console.log("Opening dialog for scholarshipId:", scholarshipId); // Check scholarshipId
//     setSelectedMajor(null);
//     setSelectedExpert(null);
//     fetchMajors();
//     fetchApplicationId(); // Fetch the application ID when the component mounts
//   }, [scholarshipId]);

//   return (
//     <Dialog
//       onClose={() => {
//         onClose();
//         setSelectedMajor(null);
//       }}
//       open={open}
//       fullWidth
//       maxWidth="md"
//     >
//       <DialogTitle className="flex items-center justify-between gap-5 flex-wrap bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 shadow-lg">
//         <div className="flex items-center gap-4">
//           {selectedMajor && (
//             <Button
//               startIcon={<ArrowLeftIcon />}
//               onClick={() => setSelectedMajor(null)}
//               className="bg-transparent text-white hover:bg-white hover:text-black transition duration-200 rounded-full p-2"
//             >
//               Back
//             </Button>
//           )}
//           <div className="font-bold text-2xl text-shadow-lg">Assign Expert</div>
//         </div>
//         {selectedMajor && (
//           <div className="font-semibold text-lg text-gray-200">
//             Major: {selectedMajor.name}
//           </div>
//         )}
//       </DialogTitle>

//       {!selectedMajor ? (
//         <>
//           {experts.length === 0 && (
//             <p className="p-10 text-center text-gray-500 font-semibold text-xl">
//               No applicants applied for this scholarship
//             </p>
//           )}

//           <List sx={{ pt: 0 }} className="space-y-5">
//             <p className="text-xl font-bold flex items-center justify-center bg-gradient-to-r text-blue-500 p-4 rounded-lg shadow-lg mt-5 mb-5">
//               <FaBook className="mr-3 text-blue text-3xl" />
//               <span>
//                 Choose the major of the expert you want to review applications
//               </span>
//             </p>

//             {majors.length === 0 && (
//               <p className="p-10 text-center text-gray-500 font-semibold text-xl">
//                 No majors available
//               </p>
//             )}

//             {majors &&
//               majors.map((major: any) => (
//                 <ListItem
//                   disableGutters
//                   key={major.id}
//                   className="hover:bg-blue-50 transition duration-300 rounded-lg shadow-sm"
//                 >
//                   <ListItemButton
//                     onClick={() => setSelectedMajor(major)}
//                     className="flex items-center gap-6 px-4 py-3 hover:bg-blue-100 rounded-lg"
//                   >
//                     <div className="flex items-center gap-4">
//                       <FaUniversity className="text-blue-600 text-3xl" />
//                       <ListItemText
//                         primary={major.name}
//                         className="text-xl font-medium text-gray-800 font-poppins"
//                       />
//                     </div>
//                     <MdArrowForward className="text-blue-500 text-2xl" />
//                   </ListItemButton>
//                 </ListItem>
//               ))}
//           </List>
//         </>
//       ) : (
//         <div className="h-full p-5 space-y-4">
//           <StyledAutocomplete
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
//           />

//           <br></br>
//           <div className="w-full flex justify-end mr-10">
//             <Button
//               onClick={assignExpert}
//               className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-2 rounded-lg"
//             >
//               <FaCheckCircle className="mr-2" />
//               Assign Expert
//             </Button>
//           </div>
//         </div>
//       )}
//     </Dialog>
//   );
// };

// export default AssignExpertDialog;

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
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  styled,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { IoIosEye } from "react-icons/io";
import { FaCheckCircle, FaUniversity } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import { SearchIcon } from "lucide-react";
import { BASE_URL } from "@/constants/api";
import { formatDate } from "@/lib/date-formatter";
import { getAllMajors } from "@/services/ApiServices/majorService";
import { FaBook, FaUsers } from "react-icons/fa";

const StyledAutocomplete = styled(Autocomplete)(() => ({
  "& .MuiAutocomplete-popupIndicator": {
    display: "none",
  },
}));

const CustomPaper = (props: any) => (
  <Paper
    {...props}
    style={{
      maxHeight: 150,
      overflowY: "auto",
    }}
  />
);

const AssignExpertDialog = ({
  open,
  onClose,
  resetMajor,
  experts,
  scholarshipId,
}: any) => {
  const [majors, setMajors] = useState<any>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<any[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [selectedMajor, setSelectedMajor] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (open) {
      if (!scholarshipId) {
        console.warn("scholarshipId is null or undefined. Cannot fetch data.");
        return;
      }
      console.log("Fetching data for scholarshipId:", scholarshipId); // Debugging
      fetchApplications();
      fetchMajors();
    }
  }, [open, scholarshipId]);

  const fetchMajors = async () => {
    setLoading(true);
    try {
      const response = await getAllMajors();
      if (response.statusCode === 200) {
        setMajors(response.data.items);
      } else {
        setError("Failed to get majors");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/applications/get-by-scholarship/${scholarshipId}`
      );
      console.log("Applications API Response:", response.data.data); // Debugging
      setApplications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError("Failed to fetch applications.");
    }
  };

  const toggleApplicationSelection = (applicationId: number) => {
    setSelectedApplications((prev) =>
      prev.includes(applicationId)
        ? prev.filter((id) => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleNext = () => {
    if (selectedApplications.length === 0) {
      alert("Please select at least one application!");
      return;
    }
    setStep(2); // Go to major selection step
  };

  const handleMajorSelection = (major: any) => {
    setSelectedMajor(major);
    setStep(3); // Go to expert selection step
  };

  const resetForm = () => {
    setSelectedApplications([]);
    setSelectedExpert(null);
    setSelectedMajor(null);
    setStep(1);
  };

  const assignExpert = async () => {
    if (!selectedExpert) {
      alert("Please select an expert!");
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
        resetForm();
        onClose(); // Close dialog after success
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      className="p-5"
    >
      <DialogTitle className="flex items-center justify-between gap-5 flex-wrap bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 shadow-lg">
        {step === 1
          ? "Assign Expert"
          : step === 2
          ? "Assign Expert"
          : "Assign Expert"}
      </DialogTitle>
      <div className="p-5 space-y-4">
        {/* Step 1: Applications List */}
        {step === 1 ? (
          <>
            <p className="text-xl font-bold flex items-center justify-center bg-gradient-to-r text-blue-500 p-4 rounded-lg shadow-lg mt-5 mb-5">
              {/* <FaBook className="mr-3 text-blue text-3xl" /> */}
              <span>Select Applications</span>
            </p>
            {applications.length === 0 ? (
              <p className="text-gray-500">
                No applications found for this scholarship.
              </p>
            ) : (
              <List>
                {applications.map((application: any) => (
                  <ListItem
                    key={application.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedApplications.includes(application.id)}
                        onChange={() =>
                          toggleApplicationSelection(application.id)
                        }
                      />
                      <ListItemAvatar>
                        <img
                          className="w-12 h-12 rounded-full"
                          src={application.applicant.avatarUrl || ""}
                          alt={application.applicant.username}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={application.applicant.username}
                        secondary={`Applied on: ${formatDate(
                          application.appliedDate
                        )}`}
                      />
                    </div>
                    <Button
                      onClick={() =>
                        window.open(
                          `/funder/application/${application.id}`,
                          "_blank"
                        )
                      }
                      variant="contained"
                      color="primary"
                      className="hover:bg-blue-700"
                    >
                      <IoIosEye className="mr-2" /> View
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              className="bg-blue-600 text-white hover:bg-blue-700 mt-4"
            >
              <MdArrowForward className="mr-2" />
              Next
            </Button>
          </>
        ) : step === 2 ? (
          /* Step 2: Major Selection */
          <>
            <p className="text-xl font-bold flex items-center justify-center bg-gradient-to-r text-blue-500 p-4 rounded-lg shadow-lg mt-5 mb-5">
              <FaBook className="mr-3 text-blue text-3xl" />
              <span>
                Choose the major of the expert you want to review applications
              </span>
            </p>
            {loading ? (
              <CircularProgress className="m-auto" />
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : majors.length === 0 ? (
              <p className="text-gray-500">No majors available.</p>
            ) : (
              <List>
                {majors.map((major: any) => (
                  <ListItem
                    key={major.id}
                    className="px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleMajorSelection(major)}
                  >
                    <ListItemAvatar>
                      <FaUniversity className="text-blue-600 text-3xl"/>
                    </ListItemAvatar>
                    <ListItemText primary={major.name} className="text-xl font-medium text-gray-800 font-poppins"/>
                    <MdArrowForward className="text-blue-500 text-2xl" />
                  </ListItem>
                ))}
              </List>
            )}
          </>
        ) : (
          /* Step 3: Expert Selection */
          <>
            <h3 className="font-semibold text-gray-700">Select an Expert:</h3>
            {/* <StyledAutocomplete
            sx={{ height: "200px" }}
              options={experts}
              getOptionLabel={(option: any) => option.username}
              value={selectedExpert}
              onChange={(e, newValue) => setSelectedExpert(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Experts"
                  variant="outlined"
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
              PaperComponent={CustomPaper}
            /> */}
                       <StyledAutocomplete
            sx={{ height: "200px" }}
            open={open}
            disableCloseOnSelect
            options={experts}
            value={selectedExpert}
            onChange={(event, newValue) => setSelectedExpert(newValue)}
            getOptionLabel={(option: any) => option.username}
            renderOption={(props, option: any) => {
              const { key, ...optionProps } = props;
              return (
                <Box
                  key={key}
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...optionProps}
                >
                  <div className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-5">
                      <img
                        loading="lazy"
                        width="35"
                        height="35"
                        className="rounded-full border-2 border-gray-200"
                        src={
                          option.avatarUrl ?? "https://github.com/shadcn.png"
                        }
                        alt=""
                      />
                      <span className="font-semibold text-lg">
                        {option.username}
                      </span>
                    </div>
                    <a
                      href={`/profile/${option.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h2 className="flex items-center text-base font-semibold text-gray-800 bg-gradient-to-r from-cyan-500 to-blue-500 p-1 rounded-lg shadow-xl">
                        <FaUsers className="mr-3 text-white text-2xl" />
                        <span className="text-white">View Profile</span>
                      </h2>
                    </a>
                  </div>
                </Box>
              );
            }}
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
                className="bg-gray-100 rounded-full"
              />
            )}
            PaperComponent={CustomPaper}
          />
          </>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end p-4 gap-4">
        {step === 1 ? (
          <Button
            variant="outlined"
            onClick={onClose}
            className="border-gray-500 text-gray-500 hover:bg-gray-100"
          >
            Cancel
          </Button>
        ) : step === 2 ? (
          <Button
            variant="outlined"
            onClick={() => setStep(1)}
            className="border-gray-500 text-gray-500 hover:bg-gray-100"
          >
            Back
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={() => setStep(2)}
            className="border-gray-500 text-gray-500 hover:bg-gray-100"
          >
            Back
          </Button>
        )}

        {step === 3 && (
          <Button
            variant="contained"
            color="primary"
            onClick={assignExpert}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Assign Expert
          </Button>
        )}
      </div>
    </Dialog>
  );
};

export default AssignExpertDialog;
