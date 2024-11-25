import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useParams } from "react-router-dom";
import SchoolLogo from "../ScholarshipProgramDetail/logo";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/constants/api";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import scholarshipProgram, { ScholarshipProgramType } from "../ScholarshipProgram/data";
import Spinner from "@/components/Spinner";
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import {
  BoxIcon,
  DraftingCompassIcon,
  Search,
  SearchIcon,
  SendIcon,
} from "lucide-react";
import { getApplicationsByScholarship } from "@/services/ApiServices/accountService";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { LoginUser } from "@/services/ApiServices/authenticationService";
import { SendNotification } from "@/services/ApiServices/notification";
import { argv0 } from "process";
import { getScholarshipProgram, updateScholarshipStatus } from "@/services/ApiServices/scholarshipProgramService";
import { FaCalendarAlt, FaCheckCircle, FaExternalLinkAlt, FaGraduationCap, FaMapMarkerAlt, FaMoneyBillWave, FaSearch, FaTimes, FaTrophy } from "react-icons/fa";
import { notification } from "antd";
import ApplicationStatus from "@/constants/applicationStatus";
import { log } from "console";

const ChooseWinner = () => {
  const { id } = useParams<{ id: string }>();
  const token = useSelector((state: RootState) => state.token.token);
  const [data, setData] = useState<ScholarshipProgramType | null>(null);
  const [applicants, setApplicants] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      }



  const fetchApplicants = async (scholarshipId: number, data: any) => {
    try {
      const response = await getApplicationsByScholarship(scholarshipId);
      if(!id) return;
      const scholarship = await getScholarshipProgram(parseInt(id));
      if (response.statusCode == 200) {
        setApplicants(response.data.filter((row: any) => row.status == "Submitted" &&
        new Date(row.updatedAt) < new Date(scholarship.data.deadline)));
        if(data){
            setScholarshipWinners(response.data.filter((row: any) => row.status == "Approved"));
            setAvailableScholarships(data?.numberOfScholarships - (response.data.filter((row: any) => row.status == "Approved")).length);
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
      setLoading(true)
      const applyPromises = selectedRows.map(async (row) => {
        const payload = {
          id: row.id,
          appliedDate: new Date().toISOString(),
          status: "Approved",
          applicantId: row.applicantId,
          scholarshipProgramId: id,
          applicationDocuments: [],
          applicationReviews: []
        };


        const response = await axios.put(
          `${BASE_URL}/api/applications/${row.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        return response;
      });

      await Promise.all(applyPromises);
      if (availableScholarships == 0) {
        await updateScholarshipStatus(Number(data?.id), "FINISHED");
      }
      notification.success({message:"Selected applicants have been approved!"});
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
    }
    finally{
      setLoading(false)
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
        //console.log(params)
        return (
        <span className="flex justify-end gap-2 items-center">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${statusColor[params.row.status]}-500 opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 bg-${statusColor[params.row.status]}-500`}></span>
          </span>
            <span className={`text-${statusColor[params.value]}-500 font-medium`}>{params.value}</span>
          </span>
        );
      },
    },
    {
      field: "link",
      headerName: "",
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
        data?.numberOfScholarships - (applicants.filter((row: any) => row.status == "Approved")).length
         - selectedRowData.length <= 0
          ? 0
          : data?.numberOfScholarships - (applicants.filter((row: any) => row.status == "Approved")).length
 - selectedRowData.length
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
      <div className="relative">
        <ScholarshipProgramBackground />
        <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-start items-start p-[70px] gap-[170px]  z-10">
          <div>
            <Breadcrumb className="">
              <BreadcrumbList className="text-white">
                <BreadcrumbItem>
                  <Link to="/" className="md:text-xl text-lg">
                    Home
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    to="/scholarship-program"
                    className=" text-white md:text-xl text-lg"
                  >
                    Scholarship Program
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <p className="text-white md:text-xl text-lg">{data?.name}</p>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="">
            <div className="lg:flex-row items-center :lg:items-center flex-row flex gap-[20px] ">
              <SchoolLogo imageUrl={data.imageUrl || "https://github.com/shadcn.png"} />
              <div>
                <p className="text-white text-5xl  lg:line-clamp-3 line-clamp-5">
                  {data.name}
                </p>
                <p className="text-white text-3xl text-heading-5 hidden lg:block mt-[12px]">
                  {data.description.length > 50 ? `${data.description.substring(0, 50)}...` : data.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white lg:bg-white drop-shadow-lg lg:drop-shadow-xl relative rounded-lg">
        <section className="max-w-container mx-auto py-[24px] bg-gray-100 lg:py-[40px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px] lg:gap-[40px] px-[24px] lg:px-0">
            {/* Location */}
            <div className="flex flex-col items-start bg-blue-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500 text-3xl" />
                <p className="block text-xl font-semibold text-blue-600">Location</p>
              </div>
              <p className="text-heading-6 text-gray-700 mt-2">VietNam</p>
            </div>

            {/* Qualification */}
            <div className="flex flex-col items-start bg-green-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
              <div className="flex items-center gap-2">
                <FaGraduationCap className="text-green-500 text-3xl" />
                <p className="block text-xl font-semibold text-green-600">Qualification</p>
              </div>
              <p className="text-heading-6 text-gray-700 mt-2">Bachelor's Degree</p>
            </div>

            {/* Funding Type */}
            <div className="flex flex-col items-start bg-yellow-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
              <div className="flex items-center gap-2">
                <FaMoneyBillWave className="text-yellow-500 text-3xl" />
                <p className="block text-xl font-semibold text-yellow-600">Funding Type</p>
              </div>
              <p className="text-heading-6 text-gray-700 mt-2">Full Scholarship</p>
            </div>

            {/* Deadline */}
            <div className="flex flex-col items-start bg-orange-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-orange-500 text-3xl" />
                <p className="block text-xl font-semibold text-orange-600">Deadline</p>
              </div>
              <p className="text-heading-6 text-gray-700 mt-2">December 31, 2024</p>
            </div>

            {/* Value of Award */}
            <div className="flex flex-col items-start bg-teal-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
              <div className="flex items-center gap-2">
                <FaTrophy className="text-teal-500 text-3xl" />
                <p className="block text-xl font-semibold text-teal-600">Value of Award</p>
              </div>
              <p className="text-heading-6 text-gray-700 mt-2">$5,000 USD</p>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white lg:bg-gray-50 py-[40px] md:py-[60px]">
        <div className="max-w-[1216px] mx-auto">
          <div className="mb-[24px] px-[16px] xsm:px-[24px] 2xl:px-0">
            {/* Title Section */}
            <p className="text-4xl font-semibold text-sky-600 flex items-center gap-2">
              <FaTrophy className="text-4xl text-sky-500" />
              Choose Scholarship Winner
              <span className="block bg-sky-500 w-[24px] h-[6px] rounded-[8px] mt-[4px]"></span>
            </p>
            <p className="text-lg font-semibold my-5 text-gray-700">
              <span>The winners of this scholarship: </span>
              <span className="text-sky-500">{scholarshipWinners.length}</span>
            </p>

            {/* Scholarship Winners List */}
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {scholarshipWinners.map((winner) => (
                <div key={winner.id}>
                  <ListItem
                    alignItems="flex-start"
                    className="hover:bg-sky-50 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl"
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={winner.applicant.username}
                        src={winner.applicant.avatarUrl ?? "https://github.com/shadcn.png"}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <span className="font-bold text-sky-600">{winner.applicant.username}</span>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: 'text.primary', display: 'inline' }}
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

            <FormControl fullWidth sx={{ marginBottom: '20px' }}>
              <InputLabel
                htmlFor="outlined-adornment-search"
                sx={{
                  zIndex: 1,
                  backgroundColor: 'white',
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  top: '-8px',
                  fontSize: '14px',
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
                        onClick={() => setSearchQuery('')}
                      />
                    </InputAdornment>
                  )
                }
                onChange={(e) => setSearchQuery(e.target.value)}
                label="Search Applicants"
                className="border-2 border-sky-500 rounded-md shadow-md transition-all duration-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hover:shadow-lg"
                sx={{
                  paddingTop: '10px',
                  paddingBottom: '10px',
                }}
              />
            </FormControl>

            <Paper sx={{ height: 400, width: '100%', borderRadius: '8px', boxShadow: 3 }}>
              {filteredRows.length > 0 ? (
                <DataGrid
                  //disableMultipleRowSelection
                  rows={filteredRows.map((app: any) => ({
                    id: app.id,
                    avatarUrl: app.applicant.avatarUrl ?? "https://github.com/shadcn.png",
                    username: app.applicant.username,
                    status: app.status,
                    choosable: availableScholarships > 0 || selectedRows.includes((row: any) => row.id === app.id),
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
                <p className="text-center text-gray-500 mt-4 text-xl">No scholarship applicants yet</p>
              )}
            </Paper>

            <div className="my-4 text-lg text-gray-700">
              Selected Winners:{" "}
              {selectedRows.map((row: any, index: number) =>
                index > 0 ? `, ${row.applicant.username}` : row.applicant.username
              )}
            </div>

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
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin" aria-hidden="true"></div> : <FaCheckCircle className="text-white text-2xl" />}
                <span className="text-lg font-semibold">Apply</span>
              </Button>
            </div>

          </div>
        </div>
      </section>


    </div>
  );
};

export default ChooseWinner;
