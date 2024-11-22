// import { formatDate } from "@/lib/date-formatter";
// import { getAllMajors } from "@/services/ApiServices/majorService";
// import { Autocomplete, Box, Button, Dialog, DialogTitle, InputAdornment, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, styled, TextField } from "@mui/material";
// import { ArrowLeftIcon, ArrowRightIcon, SearchIcon } from "lucide-react";
// import { useEffect, useState } from "react";
// import { BiRightArrow } from "react-icons/bi";
// import { Link, useNavigate } from "react-router-dom";

// const StyledAutocomplete = styled(Autocomplete)({
//   "& .MuiAutocomplete-popupIndicator": {
//     display: "none"
//   }
// });

// // Custom Paper component to control dropdown height and scroll
// const CustomPaper = (props: any) => (
//   <Paper
//     {...props}
//     style={{
//       maxHeight: 200, // Set your desired height here
//       overflowY: "auto", // Enables scrolling when options exceed max height
//     }}
//   />
// );

// const AssignExpertDialog = ({ open, onClose, experts }: any) => {
//     const navigate = useNavigate();
//     const [majors, setMajors] = useState<any>([]);
//     const [selectedMajor, setSelectedMajor] = useState<any>(null);

//     const [error, setError] = useState<string>("");
//     const [loading, setLoading] = useState<boolean>(true);

//   const fetchMajors = async () => {
//     try {
//       const response = await getAllMajors();
//       //console.log(response);
//       if (response.statusCode == 200) {
//         setMajors(response.data.items);
//       } else {
//         setError("Failed to get applicants");
//       }
//     } catch (error) {
//       setError((error as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     setSelectedMajor(null)
//     fetchMajors();
//   }, []);
    
//   return (
//     <Dialog onClose={() => {onClose(); setSelectedMajor(null)}} open={open} fullWidth>
//       <DialogTitle className="flex items-center gap-5 flex-wrap">
//         {selectedMajor && 
//             <Button startIcon={<ArrowLeftIcon/>} onClick={() => setSelectedMajor(null)}>
//                 Back
//             </Button>
//         }
//         <div>Assign Expert</div>
//         {selectedMajor && 
//             <div>Major in {selectedMajor.name}</div>
//         }
//       </DialogTitle>
//         {!selectedMajor && (<>
//             {experts.length === 0 && 
//             <p className="p-10 text-center text-gray-500 font-semibold text-xl">
//                 No applicants applied for this scholarship
//             </p>}
//             <List sx={{ pt: 0 }}>
//                 <p className="text-lg font-semibold pl-5">
//                     Choose the major of the expert you want to review applications
//                 </p>
//                 {majors.length === 0 && 
//                 <p className="p-10 text-center text-gray-500 font-semibold text-xl">
//                     No majors
//                 </p>}
//                 {majors && majors.map((major:any) => (
//                   <ListItem disableGutters key={major.id}>
//                     <ListItemButton onClick={() => setSelectedMajor(major)}>
//                       <ListItemText primary={major.name} />
//                       <ArrowRightIcon/>
//                     </ListItemButton>
//                   </ListItem>
//                 ))}
//             </List>
//         </>)}
//         {experts && selectedMajor &&
//         <div className="h-full">
//          <StyledAutocomplete
//             sx={{ height: "200px"  }}
//             open={open}
//             disableCloseOnSelect
//             options={experts}
//             //PaperComponent={CustomPaper}
//             getOptionLabel={(option: any) => option.username}
//             renderOption={(props: any, option: any) => {
//                 const { key, ...optionProps } = props;
//                 return (
//                   <Box
//                     key={key}
//                     component="li"
//                     sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
//                     {...optionProps}
//                   >
//                    <div className="flex w-full justify-between">
//                        <div className="flex items-center gap-5">
//                             <img
//                               loading="lazy"
//                               width="20"
//                               height="20"
//                               className="rounded-full"
//                               srcSet={option.avatarUrl ?? "https://github.com/shadcn.png"}
//                               src={option.avatarUrl ?? "https://github.com/shadcn.png"}
//                               alt=""
//                             />
//                             {option.username}
//                         </div>
//                         <Link target="_blank" to={`/profile/${option.id}`} className="text-blue-500 underline">
//                             View profile
//                         </Link>
//                     </div>
//                   </Box>
//                 );
//               }}
//             renderInput={(params) => <TextField {...params} 
//                 label="Search" 
//                 InputProps={{
//                     ...params.InputProps,
//                     startAdornment:(
//                         <InputAdornment position="start">
//                             <SearchIcon/>
//                         </InputAdornment>
//                     )
//                 }}
//             />}
//           /> 
//           <div className="w-full flex justify-end pr-5 mb-5">
//           <Button onClick={() => {}} 
//             className="w-1/3"
//             variant="contained">Assign</Button>
//           </div>
//           </div>
//         }
//     </Dialog>
//   )
// }

// export default AssignExpertDialog;
















import axios from "axios";
import { getAllMajors } from "@/services/ApiServices/majorService";
import { Autocomplete, Box, Button, Dialog, DialogTitle, InputAdornment, List, ListItem, ListItemButton, ListItemText, Paper, styled, TextField } from "@mui/material";
import { ArrowLeftIcon, ArrowRightIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { BiRightArrow } from "react-icons/bi";
import { FaBook, FaCheckCircle, FaUniversity, FaUsers } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import { useNavigate } from "react-router-dom";


const StyledAutocomplete = styled(Autocomplete)({
  "& .MuiAutocomplete-popupIndicator": {
    display: "none",
  },
});

// Custom Paper component to control dropdown height and scroll
const CustomPaper = (props: any) => (
  <Paper
    {...props}
    style={{
      maxHeight: 200, // Set your desired height here
      overflowY: "auto", // Enables scrolling when options exceed max height
    }}
  />
);


// const AssignExpertDialog = ({ open, onClose, experts, applicantId }: any) => {
//   const [majors, setMajors] = useState<any>([]);
//   const [selectedMajor, setSelectedMajor] = useState<any>(null);
//   const [selectedExpert, setSelectedExpert] = useState<any>(null);

const AssignExpertDialog = ({ open, onClose, experts, applicantId }: any) => {
  const navigate = useNavigate();
  const [majors, setMajors] = useState<any>([]);
  const [selectedMajor, setSelectedMajor] = useState<any>(null);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);


  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMajors = async () => {
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

  const assignExpert = async () => {
    if (!selectedExpert) {
      alert("Please select an expert!");
      return;
    }

    if (!applicantId) {
      alert("Applicant ID is missing!");
      return;
    }

    const payload = {
      description: "Review assignment",
      reviewDate: new Date().toISOString(),
      expertId: selectedExpert.id,
      applicationId: applicantId  
    };

    try {
      const response = await axios.post(
        "http://localhost:5254/api/applications/reviews/assign-expert",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        alert("Expert successfully assigned!");
        onClose();
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error: any) {
      console.error("Error assigning expert:", error.response?.data || error.message);
      alert(`Failed to assign expert: ${error.response?.data?.message || "Unknown error"}`);
    }
  };

  useEffect(() => {
    setSelectedMajor(null);
    setSelectedExpert(null);
    fetchMajors();
  }, []);

  return (

    //<Dialog
      //onClose={() => {
       // onClose();
       // setSelectedMajor(null);
     // }}
     // open={open}
     // fullWidth
   // >
     // <DialogTitle className="flex items-center gap-5 flex-wrap">
      //  {selectedMajor && (
       //   <Button startIcon={<ArrowLeftIcon />} onClick={() => setSelectedMajor(null)}>
        //    Back
       //   </Button>
      //  )}
      //  <div>Assign Expert</div>
     //   {selectedMajor && <div>Major in {selectedMajor.name}</div>}
     // </DialogTitle>
   //   {!selectedMajor && (

    <Dialog onClose={() => { onClose(); setSelectedMajor(null) }} open={open} fullWidth maxWidth="md">
      <DialogTitle className="flex items-center justify-between gap-5 flex-wrap bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 shadow-lg">
        <div className="flex items-center gap-4">
          {selectedMajor &&
            <Button
              startIcon={<ArrowLeftIcon />}
              onClick={() => setSelectedMajor(null)}
              className="bg-transparent text-white hover:bg-white hover:text-black transition duration-200 rounded-full p-2"
            >
              Back
            </Button>
          }
          <div className="font-bold text-2xl text-shadow-lg">Assign Expert</div>
        </div>
        {selectedMajor &&
          <div className="font-semibold text-lg text-gray-200">Major: {selectedMajor.name}</div>
        }
      </DialogTitle>

      {!selectedMajor ? (

        <>
          {experts.length === 0 && (
            <p className="p-10 text-center text-gray-500 font-semibold text-xl">
              No applicants applied for this scholarship
            </p>
          )}

          {/* <List sx={{ pt: 0 }}> */}
          {/* //  <p className="text-lg font-semibold pl-5"> */}
           {/* //   Choose the major of the expert you want to review applications */}
           {/* // </p> */}
           {/* // {majors.length === 0 && ( */}
          {/* //    <p className="p-10 text-center text-gray-500 font-semibold text-xl">No majors</p> */}
          {/* //  )} */}
         {/* //   {majors && */}
         {/* //     majors.map((major: any) => ( */}
          {/* //      <ListItem disableGutters key={major.id}> */}
          {/* //        <ListItemButton onClick={() => setSelectedMajor(major)}> */}
          {/* //          <ListItemText primary={major.name} /> */}
          {/* //          <ArrowRightIcon /> */}
           {/* //       </ListItemButton> */}
          {/* //      </ListItem> */}
          {/* //    ))} */}
         {/* // </List> */}
      {/* //  </> */}
    {/* //  )} */}
    {/* //  {experts && selectedMajor && ( */}
    {/* //    <div className="h-full"> */}


          <List sx={{ pt: 0 }} className="space-y-5">
            <p className="text-xl font-bold flex items-center justify-center bg-gradient-to-r text-blue-500 p-4 rounded-lg shadow-lg mt-5 mb-5">
              <FaBook className="mr-3 text-blue text-3xl" />
              <span>Choose the major of the expert you want to review applications</span>
            </p>


            {majors.length === 0 && (
              <p className="p-10 text-center text-gray-500 font-semibold text-xl">
                No majors available
              </p>
            )}

            {majors && majors.map((major: any) => (
              <ListItem
                disableGutters
                key={major.id}
                className="hover:bg-blue-50 transition duration-300 rounded-lg shadow-sm"
              >
                <ListItemButton onClick={() => setSelectedMajor(major)} className="flex items-center gap-6 px-4 py-3 hover:bg-blue-100 rounded-lg">
                  <div className="flex items-center gap-4">
                    <FaUniversity className="text-blue-600 text-3xl" />
                    <ListItemText
                      primary={major.name}
                      className="text-xl font-medium text-gray-800 font-poppins"
                    />
                  </div>
                  <MdArrowForward className="text-blue-500 text-2xl" />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <div className="h-full p-5 space-y-4">

          <StyledAutocomplete
            sx={{ height: "200px" }}
            open={open}
            disableCloseOnSelect
            options={experts}
            getOptionLabel={(option: any) => option.username}

          //  onChange={(_, value) => setSelectedExpert(value)}
         //   renderOption={(props: any, option: any) => {
          //    const { key, ...optionProps } = props;
           //   return (
            //    <Box
             //     key={key}
             //     component="li"
             //     sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            //     {...optionProps}
             //   >
            //      <div className="flex w-full justify-between">
            //        <div className="flex items-center gap-5">
            //          <img
            //            loading="lazy"
             //           width="20"
               //         height="20"
                //        className="rounded-full"
               //         srcSet={option.avatarUrl ?? "https://github.com/shadcn.png"}
               //         src={option.avatarUrl ?? "https://github.com/shadcn.png"}
             //           alt=""
             //         />
             //         {option.username}
              //      </div>
             //       <Link target="_blank" to={`/profile/${option.id}`} className="text-blue-500 underline">
              //        View profile
             //       </Link>

            renderOption={(props, option: any) => {
              const { key, ...optionProps } = props;
              return (
                <Box key={key} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...optionProps}>
                  <div className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-5">
                      <img
                        loading="lazy"
                        width="35"
                        height="35"
                        className="rounded-full border-2 border-gray-200"
                        src={option.avatarUrl ?? "https://github.com/shadcn.png"}
                        alt=""
                      />
                      <span className="font-semibold text-lg">{option.username}</span>
                    </div>
                    <a href={`/profile/${option.id}`} target="_blank" rel="noopener noreferrer">
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

             //   label="Search"

                label="Search Experts"

                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}

            //  />
          //  )}
        //  />
        //  <div className="w-full flex justify-end pr-5 mb-5">
         //   <Button
         //     onClick={assignExpert}
         //     className="w-1/3"
         //     variant="contained"
        //    >
       //       Assign
       //     </Button>
       //   </div>

                className="bg-gray-100 rounded-full"
              />
            )}
          />
          <br></br>
          <div className="w-full flex justify-end mr-10 mb-5">
            <Button
              onClick={() => { }}
              className="w-2/5 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-2 rounded-lg shadow-xl hover:from-cyan-400 hover:to-blue-400 transition duration-300"
              variant="contained"
            >
              <FaCheckCircle className="mr-3 text-white text-lg" />
              <span className="text-white text-lg font-semibold">Assign Expert</span>
            </Button>
          </div>


        </div>
      )}
    </Dialog>
  );
};

export default AssignExpertDialog;
