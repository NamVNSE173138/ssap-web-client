// import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
// import {Breadcrumb,BreadcrumbItem,BreadcrumbList,BreadcrumbSeparator,} from "@/components/ui/breadcrumb";
// import { Link, useParams } from "react-router-dom";
// import SchoolLogo from "../ScholarshipProgramDetail/logo";
// import { useEffect, useState } from "react";
// import { BASE_URL } from "@/constants/api";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import scholarshipProgram, {ScholarshipProgramType,} from "../ScholarshipProgram/data";
// import Spinner from "@/components/Spinner";
// import {Avatar,Button,Divider,FormControl,InputAdornment,InputLabel,List,ListItem,ListItemAvatar,ListItemText,OutlinedInput,Paper,Typography,} from "@mui/material";
// import { getApplicationsByScholarship } from "@/services/ApiServices/accountService";
// import { DataGrid, GridColDef } from "@mui/x-data-grid";
// import { SendNotification } from "@/services/ApiServices/notification";
// import {getScholarshipProgram,updateScholarshipStatus,
// } from "@/services/ApiServices/scholarshipProgramService";
// import {FaAward,FaCalendarAlt,FaCheckCircle,FaCreditCard,FaExternalLinkAlt,FaGraduationCap,FaMapMarkerAlt,FaSearch,FaTimes,FaTrophy,
// } from "react-icons/fa";
// import { notification } from "antd";
// import ApplicationStatus from "@/constants/applicationStatus";
// import { format } from "date-fns";
// import * as Tabs from "@radix-ui/react-tabs";

// const ChooseWinner = () => {
//   const { id } = useParams<{ id: string }>();
//   const token = useSelector((state: RootState) => state.token.token);
//   const [data, setData] = useState<ScholarshipProgramType | null>(null);
//   const [applicants, setApplicants] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const [selectedRows, setSelectedRows] = useState<any[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [availableScholarships, setAvailableScholarships] = useState(0);
//   const [scholarshipWinners, setScholarshipWinners] = useState<any[]>([]);

//   const statusColor = {
//     [ApplicationStatus.Submitted]: "blue",
//     [ApplicationStatus.Awarded]: "green",
//     [ApplicationStatus.Approved]: "blue",
//     [ApplicationStatus.Rejected]: "red",
//     [ApplicationStatus.NeedExtend]: "yellow",
//     [ApplicationStatus.Reviewing]: "yellow",
//   };

//   const fetchApplicants = async (scholarshipId: number, data: any) => {
//     try {
//       const response = await getApplicationsByScholarship(scholarshipId);
//       if (!id) return;
//       const scholarship = await getScholarshipProgram(parseInt(id));
//       console.log("APPLICATION", response);
//       console.log("Scholarship", scholarship);
      
//       if (response.statusCode == 200) {
//         setApplicants(
//           response.data.filter(
//             (row: any) =>
//               row.status == "Submitted" &&
//               new Date(row.updatedAt) < new Date(scholarship.data.deadline)
//           )
//         );
//         if (data) {
//           setScholarshipWinners(
//             response.data.filter((row: any) => row.status == "Approved")
//           );
//           setAvailableScholarships(
//             data?.numberOfScholarships -
//               response.data.filter((row: any) => row.status == "Approved")
//                 .length
//           );
//         }
//       } else {
//         setError("Failed to get applicants");
//       }
//     } catch (error) {
//       setError((error as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyForSelectedWinners = async () => {
//     try {
//       setLoading(true);
//       const applyPromises = selectedRows.map(async (row) => {
//         const payload = {
//           id: row.id,
//           appliedDate: new Date().toISOString(),
//           status: "Approved",
//           applicantId: row.applicantId,
//           scholarshipProgramId: id,
//           applicationDocuments: [],
//           applicationReviews: [],
//         };

//         const response = await axios.put(
//           `${BASE_URL}/api/applications/${row.id}`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         return response;
//       });

//       await Promise.all(applyPromises);
//       if (availableScholarships == 0) {
//         await updateScholarshipStatus(Number(data?.id), "FINISHED");
//       }
//       notification.success({
//         message: "Selected applicants have been approved!",
//       });
//       await fetchData();
//       for (let row of selectedRows) {
//         await SendNotification({
//           topic: row.applicantId.toString(),
//           link: `/funder/application/${row.id}`,
//           title: "Your application has been approved",
//           body: `Your application for ${data?.name} has been approved.`,
//         });
//       }
//     } catch (error) {
//       setError("Failed to apply for selected winners.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns: GridColDef[] = [
//     { field: "id", headerName: "ID", width: 70 },
//     {
//       field: "avatarUrl",
//       headerName: "Avatar",
//       width: 130,
//       flex: 0.5,
//       renderCell: (params) => {
//         return (
//           <img
//             src={params.value}
//             alt="avatar"
//             style={{ width: 50, height: 50, borderRadius: 50 }}
//           />
//         );
//       },
//     },
//     { field: "username", headerName: "Username", width: 130, flex: 1 },
//     {
//       field: "status",
//       headerName: "Status",
//       width: 130,
//       flex: 0.5,
//       renderCell: (params) => {
//         console.log("PARAM",params)
//         return (
//           <span className="flex justify-end gap-2 items-center">
//             <span className="relative flex h-3 w-3">
//               <span
//                 className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${
//                   statusColor[params.row.status]
//                 }-500 opacity-75`}
//               ></span>
//               <span
//                 className={`relative inline-flex rounded-full h-3 w-3 bg-${
//                   statusColor[params.row.status]
//                 }-500`}
//               ></span>
//             </span>
//             <span
//               className={`text-${statusColor[params.value]}-500 font-medium`}
//             >
//               {params.value}
//             </span>
//           </span>
//         );
//       },
//     },
//     {field: "expertReview", headerName: "Reviewed by Expert", width: 130, flex: 1},
//     {
//       field: "score", headerName: "Score", width: 130, flex: 1
//     },
//     {
//       field: "link",
//       headerName: "Action",
//       renderCell: (params) => {
//         return (
//           <Link
//             target="_blank"
//             className="text-sky-500 underline"
//             to={`/funder/application/${params.row.id}`}
//           >
//             View Profile
//           </Link>
//         );
//       },
//       flex: 1,
//       width: 130,
//     },
//   ];

//   const paginationModel = { page: 0, pageSize: 5 };

//   const handleSelectionChange = (selectionModel: any) => {
//     const selectedRowData = applicants.filter((row: any) =>
//       selectionModel.includes(row.id)
//     );
//     //console.log(selectedRowData.slice(0, availableScholarships));

//     setSelectedRows(selectedRowData.slice(0, availableScholarships));
//     if (data)
//       setAvailableScholarships(
//         data?.numberOfScholarships -
//           applicants.filter((row: any) => row.status == "Approved").length -
//           selectedRowData.length <=
//           0
//           ? 0
//           : data?.numberOfScholarships -
//               applicants.filter((row: any) => row.status == "Approved").length -
//               selectedRowData.length
//       );
//   };

//   const handleClearSelection = async () => {
//     setSelectedRows([]);
//   };

//   // Filter rows based on search query
//   const filteredRows = applicants
//     ? applicants.filter(
//         (row: any) =>
//           row.applicant.username
//             .toLowerCase()
//             .includes(searchQuery.toLowerCase()) ||
//           row.id.toString().toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : [];

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/api/scholarship-programs/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (response.data.statusCode === 200) {
//         setData(response.data.data);
//         if (id) await fetchApplicants(parseInt(id), response.data.data);
//       } else {
//         setError("Failed to fetch data");
//       }
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [id]);

//   if (!data) return <Spinner size="large" />;

//   return (
//     <div>
//       <div className="relative">
//         <ScholarshipProgramBackground />
//         <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-between items-start p-[40px]   z-10">
//           <div>
//             <Breadcrumb className="">
//               <BreadcrumbList className="text-[#000]">
//                 <BreadcrumbItem>
//                   <Link to="/" className="md:text-xl text-lg">
//                     Home
//                   </Link>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator />
//                 <BreadcrumbItem>
//                   <Link
//                     to="/scholarship-program"
//                     className=" text-[#000] md:text-xl font-medium text-lg"
//                   >
//                     Scholarship Program
//                   </Link>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator />
//                 <BreadcrumbItem>
//                   <p className="text-[#000] md:text-xl text-lg font-semibold">
//                     {data?.name}
//                   </p>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb>
//           </div>
//           <div className="">
//             <div className="lg:flex-row items-center :lg:items-center flex-row flex gap-[20px] ">
//               <SchoolLogo
//                 imageUrl={data.imageUrl || "https://github.com/shadcn.png"}
//               />
//               <div>
//                 <p className="text-white text-5xl  lg:line-clamp-3 line-clamp-5">
//                   {data.name}
//                 </p>
//                 <p className="text-white text-3xl text-heading-5 hidden lg:block mt-[12px]">
//                   {data.description.length > 50
//                     ? `${data.description.substring(0, 50)}...`
//                     : data.description}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="bg-white lg:bg-white drop-shadow-[0_0_5px_rgba(0,0,0,0.1)] lg:drop-shadow-[0_5px_25px_rgba(0,0,0,0.05)] relative">
//         <section className="w-full max-w-none flex justify-between items-center mx-auto py-6 lg:py-10 px-4 lg:px-0">
//           <div className="flex w-full justify-around gap-12">
//             <div className="flex items-center gap-3">
//               <FaMapMarkerAlt className="text-[#1eb2a6] text-xl" />
//               <div className="flex flex-col">
//                 <p className="text-sm font-semibold text-gray-500">Location</p>
//                 <p className="text-lg font-semibold text-gray-800">
//                   {"VietNam"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <FaGraduationCap className="text-[#1eb2a6] text-xl" />
//               <div className="flex flex-col">
//                 <p className="text-sm font-semibold text-gray-500">
//                   Qualification
//                 </p>
//                 <p className="text-lg font-semibold text-gray-800">
//                   {data.category.description || "Not specified"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <FaCreditCard className="text-[#1eb2a6] text-xl" />
//               <div className="flex flex-col">
//                 <p className="text-sm font-semibold text-gray-500">
//                   Funding Type
//                 </p>
//                 <p className="text-lg font-semibold text-gray-800">
//                   {"Not specified"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <FaCalendarAlt className="text-[#1eb2a6] text-xl" />
//               <div className="flex flex-col">
//                 <p className="text-sm font-semibold text-gray-500">Deadline</p>
//                 <p className="text-lg font-semibold text-gray-800">
//                   {data.deadline
//                     ? format(new Date(data.deadline), "dd/MM/yyyy")
//                     : "Not specified"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <FaAward className="text-[#1eb2a6] text-xl" />
//               <div className="flex flex-col">
//                 <p className="text-sm font-semibold text-gray-500">
//                   Value of Award
//                 </p>
//                 <p className="text-lg font-semibold text-gray-800">
//                   {data.scholarshipAmount || "Not specified"}$
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//       <section className="bg-white lg:bg-gray-50 py-[40px] md:py-[60px]">
//         <div className="max-w-[1216px] mx-auto">
//           <div className="mb-[24px] px-[16px] xsm:px-[24px] 2xl:px-0">
//             {/* Title Section */}
//             <p className="text-4xl font-semibold text-sky-600 flex items-center gap-2">
//               <FaTrophy className="text-4xl text-sky-500" />
//               Choose Scholarship Winner
//               <span className="block bg-sky-500 w-[24px] h-[6px] rounded-[8px] mt-[4px]"></span>
//             </p>
//             <p className="text-lg font-semibold my-5 text-gray-700">
//               <span>The winners of this scholarship: </span>
//               <span className="text-sky-500">{scholarshipWinners.length}</span>
//             </p>

//             {/* Scholarship Winners List */}
//             <List sx={{ width: "100%", bgcolor: "background.paper" }}>
//               {scholarshipWinners.map((winner) => (
//                 <div key={winner.id}>
//                   <ListItem
//                     alignItems="flex-start"
//                     className="hover:bg-sky-50 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl"
//                   >
//                     <ListItemAvatar>
//                       <Avatar
//                         alt={winner.applicant.username}
//                         src={
//                           winner.applicant.avatarUrl ??
//                           "https://github.com/shadcn.png"
//                         }
//                       />
//                     </ListItemAvatar>
//                     <ListItemText
//                       primary={
//                         <span className="font-bold text-sky-600">
//                           {winner.applicant.username}
//                         </span>
//                       }
//                       secondary={
//                         <Typography
//                           component="span"
//                           variant="body2"
//                           sx={{ color: "text.primary", display: "inline" }}
//                         >
//                           {winner.applicant.email}
//                         </Typography>
//                       }
//                     />
//                     <Link
//                       target="_blank"
//                       to={`/funder/application/${winner.id}`}
//                       className="text-sky-500 underline hover:text-sky-600 transition-all"
//                     >
//                       <FaExternalLinkAlt className="inline-block text-sky-500 ml-2" />
//                       View Profile
//                     </Link>
//                   </ListItem>
//                   <Divider variant="inset" component="li" />
//                 </div>
//               ))}
//             </List>

//             <p className="text-lg font-semibold my-5 text-gray-700">
//               <span>Number of scholarships left: </span>
//               <span className="text-sky-500">{availableScholarships}</span>
//             </p>

//             <FormControl fullWidth sx={{ marginBottom: "20px" }}>
//               <InputLabel
//                 htmlFor="outlined-adornment-search"
//                 sx={{
//                   zIndex: 1,
//                   backgroundColor: "white",
//                   paddingLeft: "8px",
//                   paddingRight: "8px",
//                   top: "-8px",
//                   fontSize: "14px",
//                 }}
//               >
//                 Search Applicants
//               </InputLabel>
//               <OutlinedInput
//                 id="outlined-adornment-search"
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <FaSearch className="text-sky-500 transition-all duration-300 transform hover:scale-110" />
//                   </InputAdornment>
//                 }
//                 endAdornment={
//                   searchQuery && (
//                     <InputAdornment position="end">
//                       <FaTimes
//                         className="text-sky-500 cursor-pointer transition-all duration-300 transform hover:scale-110"
//                         onClick={() => setSearchQuery("")}
//                       />
//                     </InputAdornment>
//                   )
//                 }
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 label="Search Applicants"
//                 className="border-2 border-sky-500 rounded-md shadow-md transition-all duration-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hover:shadow-lg"
//                 sx={{
//                   paddingTop: "10px",
//                   paddingBottom: "10px",
//                 }}
//               />
//             </FormControl>

//             <Tabs.Root defaultValue="firstReview" className="w-full">
//               <Tabs.List className="flex space-x-4 border-b-2 my-5 bg-white shadow-2 rounded-lg w-full h-full">
//                 <Tabs.Trigger value="firstReview" className="px-4 py-2 text-lg font-semibold focus:outline-none data-[state=active]:border-b-2 data-[state=active]:text-[#1eb2a6]">First Review</Tabs.Trigger>
//                 <Tabs.Trigger value="secondReview" className="px-4 py-2 text-lg font-semibold focus:outline-none data-[state=active]:border-b-2 data-[state=active]:text-[#1eb2a6]">Second Review</Tabs.Trigger>
//                 <Tabs.Trigger value="finalReview" className="px-4 py-2 text-lg font-semibold focus:outline-none data-[state=active]:border-b-2 data-[state=active]:text-[#1eb2a6]">Final Review</Tabs.Trigger>
//               </Tabs.List>
//               <Tabs.Content value="firstReview">
                
//               </Tabs.Content>
//               <Tabs.Content value="secondReview">
//                 <p>Second Review Content Goes Here</p>
//               </Tabs.Content>
//               <Tabs.Content value="finalReview">
//               <Paper
//                   sx={{
//                     height: 400,
//                     width: "100%",
//                     borderRadius: "8px",
//                     boxShadow: 3,
//                   }}
//                 >
//                   {filteredRows.length > 0 ? (
//                     <DataGrid
//                       rows={filteredRows.map((app: any) => ({
//                         id: app.id,
//                         avatarUrl:
//                           app.applicant.avatarUrl ??
//                           "https://github.com/shadcn.png",
//                         username: app.applicant.username,
//                         status: app.status,
//                         choosable:
//                           availableScholarships > 0 ||
//                           selectedRows.includes(
//                             (row: any) => row.id === app.id
//                           ),
//                       }))}
//                       onRowSelectionModelChange={handleSelectionChange}
//                       columns={columns}
//                       initialState={{ pagination: { paginationModel } }}
//                       pageSizeOptions={[5, 10]}
//                       checkboxSelection
//                       sx={{ border: 0 }}
//                       isRowSelectable={(params) => params.row.choosable}
//                     />
//                   ) : (
//                     <p className="text-center text-gray-500 mt-4 text-xl">
//                       No scholarship applicants yet
//                     </p>
//                   )}
//                 </Paper>
//               </Tabs.Content>
//             </Tabs.Root>

//             <div className="my-4 text-lg text-gray-700">
//               Selected Winners:{" "}
//               {selectedRows.map((row: any, index: number) =>
//                 index > 0
//                   ? `, ${row.applicant.username}`
//                   : row.applicant.username
//               )}
//             </div>

//             <div className="flex justify-end mt-4 gap-5">
//               <Button
//                 variant="contained"
//                 color="warning"
//                 onClick={handleClearSelection}
//                 className="text-white flex items-center gap-3 py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500"
//               >
//                 <FaSearch className="text-white text-2xl" />
//                 <span className="text-lg font-semibold">Clear Selection</span>
//               </Button>

//               <Button
//                 variant="contained"
//                 color="primary"
//                 disabled={loading}
//                 onClick={applyForSelectedWinners}
//                 className="text-white flex items-center gap-3 py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500"
//               >
//                 {loading ? (
//                   <div
//                     className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin"
//                     aria-hidden="true"
//                   ></div>
//                 ) : (
//                   <FaCheckCircle className="text-white text-2xl" />
//                 )}
//                 <span className="text-lg font-semibold">Apply</span>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default ChooseWinner;

























// 



import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/constants/api";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {ScholarshipProgramType,} from "../ScholarshipProgram/data";
import Spinner from "@/components/Spinner";
import {Avatar,Button,Divider,FormControl,InputAdornment,InputLabel,List,ListItem,ListItemAvatar,ListItemText,OutlinedInput,Paper,Typography,} from "@mui/material";
import { getApplicationsByScholarship } from "@/services/ApiServices/accountService";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { SendNotification } from "@/services/ApiServices/notification";
import {getScholarshipProgram,updateScholarshipStatus,
} from "@/services/ApiServices/scholarshipProgramService";
import {FaCheckCircle,FaExternalLinkAlt,FaSearch,FaTimes,FaTrophy,
} from "react-icons/fa";
import { notification } from "antd";
import ApplicationStatus from "@/constants/applicationStatus";
import * as Tabs from "@radix-ui/react-tabs";
import FirstReview from "./firstReview";
import SecondReview from "./secondReview";

const ChooseWinner = () => {
  const { id } = useParams<{ id: string }>();
  const token = useSelector((state: RootState) => state.token.token);
  const [data, setData] = useState<ScholarshipProgramType | null>(null);
  const [applicants, setApplicants] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [_error, setError] = useState<string | null>(null);

  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableScholarships, setAvailableScholarships] = useState(0);
  const [scholarshipWinners, setScholarshipWinners] = useState<any[]>([]);

  const statusColor = {
    [ApplicationStatus.Submitted]: "blue",
    [ApplicationStatus.Awarded]: "green",
    [ApplicationStatus.Approved]: "blue",
    [ApplicationStatus.Rejected]: "red",
    [ApplicationStatus.NeedExtend]: "yellow",
    [ApplicationStatus.Reviewing]: "yellow",
  };

  const fetchApplicants = async (scholarshipId: number, data: any) => {
    try {
      const response = await getApplicationsByScholarship(scholarshipId);
      if (!id) return;
      const scholarship = await getScholarshipProgram(parseInt(id));
      console.log("APPLICATION", response);
      console.log("Scholarship", scholarship);
      
      if (response.statusCode == 200) {
        setApplicants(
          response.data.filter(
            (row: any) =>
              row.status == "Submitted" &&
              new Date(row.updatedAt) < new Date(scholarship.data.deadline)
          )
        );
        if (data) {
          setScholarshipWinners(
            response.data.filter((row: any) => row.status == "Approved")
          );
          setAvailableScholarships(
            data?.numberOfScholarships -
              response.data.filter((row: any) => row.status == "Approved")
                .length
          );
        }
      } else {
        setError("Failed to get applicants");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const applyForSelectedWinners = async () => {
    try {
      setLoading(true);
      const applyPromises = selectedRows.map(async (row) => {
        const payload = {
          id: row.id,
          appliedDate: new Date().toISOString(),
          status: "Approved",
          applicantId: row.applicantId,
          scholarshipProgramId: id,
          applicationDocuments: [],
          applicationReviews: [],
        };

        const response = await axios.put(
          `${BASE_URL}/api/applications/${row.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response;
      });

      await Promise.all(applyPromises);
      if (availableScholarships == 0) {
        await updateScholarshipStatus(Number(data?.id), "FINISHED");
      }
      notification.success({
        message: "Selected applicants have been approved!",
      });
      await fetchData();
      for (let row of selectedRows) {
        await SendNotification({
          topic: row.applicantId.toString(),
          link: `/funder/application/${row.id}`,
          title: "Your application has been approved",
          body: `Your application for ${data?.name} has been approved.`,
        });
      }
    } catch (error) {
      setError("Failed to apply for selected winners.");
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "avatarUrl",
      headerName: "Avatar",
      width: 130,
      flex: 0.5,
      renderCell: (params) => {
        return (
          <img
            src={params.value}
            alt="avatar"
            style={{ width: 50, height: 50, borderRadius: 50 }}
          />
        );
      },
    },
    { field: "username", headerName: "Username", width: 130, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      flex: 0.5,
      renderCell: (params) => {
        console.log("PARAM",params)
        return (
          <span className="flex justify-end gap-2 items-center">
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${
                  statusColor[params.row.status]
                }-500 opacity-75`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 bg-${
                  statusColor[params.row.status]
                }-500`}
              ></span>
            </span>
            <span
              className={`text-${statusColor[params.value]}-500 font-medium`}
            >
              {params.value}
            </span>
          </span>
        );
      },
    },
    {field: "expertReview", headerName: "Reviewed by Expert", width: 130, flex: 1},
    {
      field: "score", headerName: "Score", width: 130, flex: 1
    },
    {
      field: "link",
      headerName: "Action",
      renderCell: (params) => {
        return (
          <Link
            target="_blank"
            className="text-sky-500 underline"
            to={`/funder/application/${params.row.id}`}
          >
            View Profile
          </Link>
        );
      },
      flex: 1,
      width: 130,
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  const handleSelectionChange = (selectionModel: any) => {
    const selectedRowData = applicants.filter((row: any) =>
      selectionModel.includes(row.id)
    );
    //console.log(selectedRowData.slice(0, availableScholarships));

    setSelectedRows(selectedRowData.slice(0, availableScholarships));
    if (data)
      setAvailableScholarships(
        data?.numberOfScholarships -
          applicants.filter((row: any) => row.status == "Approved").length -
          selectedRowData.length <=
          0
          ? 0
          : data?.numberOfScholarships -
              applicants.filter((row: any) => row.status == "Approved").length -
              selectedRowData.length
      );
  };

  const handleClearSelection = async () => {
    setSelectedRows([]);
  };

  // Filter rows based on search query
  const filteredRows = applicants
    ? applicants.filter(
        (row: any) =>
          row.applicant.username
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          row.id.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/scholarship-programs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.statusCode === 200) {
        setData(response.data.data);
        if (id) await fetchApplicants(parseInt(id), response.data.data);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (!data) return <Spinner size="large" />;

  return (
    <div>
      <section className="bg-white lg:bg-gray-50 py-[40px] md:py-[60px]">
        <div className="max-w-[1216px] mx-auto">
          <div className="mb-[24px] px-[16px] xsm:px-[24px] 2xl:px-0">
            {/* Title Section */}
            <p className="text-4xl font-semibold text-sky-600 flex items-center gap-2">
              <FaTrophy className="text-4xl text-sky-500" />
              Choose Scholarship Winner
            </p>
            <div className="block bg-sky-500 w-[24px] h-[6px] rounded-[8px] mt-[4px] ml-12"></div>
            <p className="text-lg font-semibold my-5 text-gray-700">
              <span>The winners of this scholarship: </span>
              <span className="text-sky-500">{scholarshipWinners.length}</span>
            </p>

            {/* Scholarship Winners List */}
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {scholarshipWinners.map((winner) => (
                <div key={winner.id}>
                  <ListItem
                    alignItems="flex-start"
                    className="hover:bg-sky-50 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl"
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={winner.applicant.username}
                        src={
                          winner.applicant.avatarUrl ??
                          "https://github.com/shadcn.png"
                        }
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <span className="font-bold text-sky-600">
                          {winner.applicant.username}
                        </span>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: "text.primary", display: "inline" }}
                        >
                          {winner.applicant.email}
                        </Typography>
                      }
                    />
                    <Link
                      target="_blank"
                      to={`/funder/application/${winner.id}`}
                      className="text-sky-500 underline hover:text-sky-600 transition-all"
                    >
                      <FaExternalLinkAlt className="inline-block text-sky-500 ml-2" />
                      View Profile
                    </Link>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              ))}
            </List>

            <p className="text-lg font-semibold my-5 text-gray-700">
              <span>Number of scholarships left: </span>
              <span className="text-sky-500">{availableScholarships}</span>
            </p>

            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
              <InputLabel
                htmlFor="outlined-adornment-search"
                sx={{
                  zIndex: 1,
                  backgroundColor: "white",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  top: "-8px",
                  fontSize: "14px",
                }}
              >
                Search Applicants
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-search"
                startAdornment={
                  <InputAdornment position="start">
                    <FaSearch className="text-sky-500 transition-all duration-300 transform hover:scale-110" />
                  </InputAdornment>
                }
                endAdornment={
                  searchQuery && (
                    <InputAdornment position="end">
                      <FaTimes
                        className="text-sky-500 cursor-pointer transition-all duration-300 transform hover:scale-110"
                        onClick={() => setSearchQuery("")}
                      />
                    </InputAdornment>
                  )
                }
                onChange={(e) => setSearchQuery(e.target.value)}
                label="Search Applicants"
                className="border-2 border-sky-500 rounded-md shadow-md transition-all duration-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hover:shadow-lg"
                sx={{
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
              />
            </FormControl>

            <Tabs.Root defaultValue="firstReview" className="w-full">
              <Tabs.List className="flex space-x-4 border-b-2 my-5 bg-white shadow-2 rounded-lg w-full h-full">
                <Tabs.Trigger value="firstReview" className="px-4 py-2 text-lg font-semibold focus:outline-none data-[state=active]:border-b-2 data-[state=active]:text-[#1eb2a6]">First Review</Tabs.Trigger>
                <Tabs.Trigger value="secondReview" className="px-4 py-2 text-lg font-semibold focus:outline-none data-[state=active]:border-b-2 data-[state=active]:text-[#1eb2a6]">Second Review</Tabs.Trigger>
                <Tabs.Trigger value="finalReview" className="px-4 py-2 text-lg font-semibold focus:outline-none data-[state=active]:border-b-2 data-[state=active]:text-[#1eb2a6]">Final Review</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="firstReview">
              <FirstReview scholarshipId={id ?? ""} token={token ?? ""} />
              </Tabs.Content>
              <Tabs.Content value="secondReview">
              <SecondReview scholarshipId={id ?? ""} token={token ?? ""} />
              </Tabs.Content>
              <Tabs.Content value="finalReview">
              <Paper
                  sx={{
                    height: 400,
                    width: "100%",
                    borderRadius: "8px",
                    boxShadow: 3,
                  }}
                >
                  {filteredRows.length > 0 ? (
                    <DataGrid
                      rows={filteredRows.map((app: any) => ({
                        id: app.id,
                        avatarUrl:
                          app.applicant.avatarUrl ??
                          "https://github.com/shadcn.png",
                        username: app.applicant.username,
                        status: app.status,
                        expertReview: app.expertReview ?? "Not reviewed", 
  score: app.score ?? "N/A",
                        choosable:
                          availableScholarships > 0 ||
                          selectedRows.includes(
                            (row: any) => row.id === app.id
                          ),
                      }))}
                      onRowSelectionModelChange={handleSelectionChange}
                      columns={columns}
                      initialState={{ pagination: { paginationModel } }}
                      pageSizeOptions={[5, 10]}
                      checkboxSelection
                      sx={{ border: 0 }}
                      isRowSelectable={(params) => params.row.choosable}
                    />
                  ) : (
                    <p className="text-center text-gray-500 mt-4 text-xl">
                      No scholarship applicants yet
                    </p>
                  )}
                </Paper>
                <div className="flex justify-end mt-4 gap-5">
              <Button
                variant="contained"
                color="warning"
                onClick={handleClearSelection}
                className="text-white flex items-center gap-3 py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500"
              >
                <FaSearch className="text-white text-2xl" />
                <span className="text-lg font-semibold">Clear Selection</span>
              </Button>

              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={applyForSelectedWinners}
                className="text-white flex items-center gap-3 py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500"
              >
                {loading ? (
                  <div
                    className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin"
                    aria-hidden="true"
                  ></div>
                ) : (
                  <FaCheckCircle className="text-white text-2xl" />
                )}
                <span className="text-lg font-semibold">Apply</span>
              </Button>
            </div>
              </Tabs.Content>
              
            </Tabs.Root>

            <div className="my-4 text-lg text-gray-700">
              Selected Winners:{" "}
              {selectedRows.map((row: any, index: number) =>
                index > 0
                  ? `, ${row.applicant.username}`
                  : row.applicant.username
              )}
            </div>

            {/* <div className="flex justify-end mt-4 gap-5">
              <Button
                variant="contained"
                color="warning"
                onClick={handleClearSelection}
                className="text-white flex items-center gap-3 py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500"
              >
                <FaSearch className="text-white text-2xl" />
                <span className="text-lg font-semibold">Clear Selection</span>
              </Button>

              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={applyForSelectedWinners}
                className="text-white flex items-center gap-3 py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500"
              >
                {loading ? (
                  <div
                    className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin"
                    aria-hidden="true"
                  ></div>
                ) : (
                  <FaCheckCircle className="text-white text-2xl" />
                )}
                <span className="text-lg font-semibold">Apply</span>
              </Button>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChooseWinner;









































