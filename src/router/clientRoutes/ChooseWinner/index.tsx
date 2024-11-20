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
import { ScholarshipProgramType } from "../ScholarshipProgram/data";
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
import { updateScholarshipStatus } from "@/services/ApiServices/scholarshipProgramService";

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

  const fetchApplicants = async (scholarshipId: number, data: any) => {
    try {
      const response = await getApplicationsByScholarship(scholarshipId);
      if (response.statusCode == 200) {
        setApplicants(response.data.filter((row: any) => row.status != "APPROVED"));
        if(data){
            setScholarshipWinners(response.data.filter((row: any) => row.status == "APPROVED"));
            setAvailableScholarships(data?.numberOfScholarships - (response.data.filter((row: any) => row.status == "APPROVED")).length);
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
      const applyPromises = selectedRows.map(async (row) => {
        const payload = {
          id: row.id,
          appliedDate: new Date().toISOString(),
          status: "APPROVED",
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
      if(availableScholarships == 0){
        await updateScholarshipStatus(Number(data?.id), "FINISHED");
      }
      alert("Selected applicants have been approved!");
      await fetchData();
      for(let row of selectedRows){
          await SendNotification({
            topic: row.applicantId.toString(),
            link: "string",
            title: "string",
            body: `Your application for ${data?.name} has been approved.`,
          });
      }
      
    } catch (error) {
      setError("Failed to apply for selected winners.");
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
      field: "major",
      headerName: "Major",
      type: "string",
      flex: 2,
      width: 130,
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
    
    setSelectedRows(selectedRowData);
    if (data)
      setAvailableScholarships(
        data?.numberOfScholarships - (applicants.filter((row: any) => row.status == "APPROVED")).length
         - selectedRowData.length <= 0
          ? 0
          : data?.numberOfScholarships - (applicants.filter((row: any) => row.status == "APPROVED")).length
 - selectedRowData.length
      );
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
              <SchoolLogo imageUrl={data.imageUrl} />
              <div>
                <p className="text-white text-5xl  lg:line-clamp-3 line-clamp-5">
                  {data.name}
                </p>
                <p className="text-white text-3xl  text-heading-5 hidden lg:block mt-[12px]">
                  {data.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white lg:bg-white drop-shadow-[0_0_5px_rgba(0,0,0,0.1)] lg:drop-shadow-[0_5px_25px_rgba(0,0,0,0.05)] relative">
        <section className="max-w-container mx-auto py-[24px] lg:py-[40px]">
          <div className="grid grid-cols-2 mx-[150px] lg:px-0 lg:flex gap-[30px] flex-row flex-wrap justify-between lg:gap-[40px]">
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Location
              </p>
              <p className="text-heading-6">VietNam</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Qualification
              </p>
              <p className="text-heading-6">VietNam</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Funding type
              </p>
              <p className="text-heading-6">VietNam</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Deadline
              </p>
              <p className="text-heading-6">VietNam</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Value of Award
              </p>
              <p className="text-heading-6">VietNam</p>
            </div>
          </div>
        </section>
      </div>
      <section className="bg-white lg:bg-grey-lightest py-[40px] md:py-[60px]">
        <div className="max-w-[1216px] mx-auto">
          <div className="mb-[24px] px-[16px] xsm:px-[24px] 2xl:px-0">
            <p className="text-4xl">
              Choose scholarship winner
              <span className="block bg-sky-500 w-[24px] h-[6px] rounded-[8px] mt-[4px]"></span>
            </p>
            <p className="text-lg font-semibold my-5">
              <span className="">The winners of this scholarship: </span>
              <span className="text-sky-500">
                {scholarshipWinners.length}
              </span>

            </p>
            {/*JSON.stringify(scholarshipWinners)*/}
             <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
             {scholarshipWinners.map((winner) => (
             <div key={winner.id}>
                 <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src={winner.applicant.avatarUrl??"https://github.com/shadcn.png"} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={winner.applicant.username}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: 'text.primary', display: 'inline' }}
                          >
                          {winner.applicant.email}
                          </Typography>
                        </>
                      }
                    />
                    <Link target="_blank" to={`/funder/application/${winner.id}`} className="text-sky-500 underline">
                        View Profile
                    </Link>
                  </ListItem>
                  <Divider variant="inset" component="li" />
              </div>
             ))}
            </List>

            <p className="text-lg font-semibold my-5">
              <span className="">Number of scholarships left: </span>
              <span className="text-sky-500">
                {availableScholarships.toString()}
              </span>
            </p>
            <FormControl fullWidth sx={{}}>
              <InputLabel htmlFor="outlined-adornment-amount">
                Search
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
                onChange={(e) => setSearchQuery(e.target.value)}
                label="Amount"
              />
            </FormControl>
            {
              <Paper sx={{ height: 400, width: "100%" }}>
                {filteredRows.length > 0 ? (
                  <DataGrid
                    rows={filteredRows.map((app: any) => ({
                      id: app.id,
                      avatarUrl: app.applicant.avatarUrl??"https://github.com/shadcn.png",
                      username: app.applicant.username,
                      major: "Software Engineering",
                      choosable:
                        availableScholarships > 0 ||
                        selectedRows.includes((row: any) => row.id === app.id),
                    }))}
                    onRowSelectionModelChange={handleSelectionChange}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    sx={{ border: 0 }}
                    isRowSelectable={(params) => params.row.choosable}
                    //availableScholarships > 0 || selectedRows.includes((row:any) => row.id === params.id)}
                  />
                ) : (<>
                  <p className="text-center text-gray-500 mt-4 text-xl">
                    No scholarship applicants yet
                  </p>
                </>
                )}
              </Paper>
            }

            <div>
              Selected Winners:{" "}
              {selectedRows.map((row: any, index: number) =>
                index > 0
                  ? ", " + row.applicant.username
                  : row.applicant.username
              )}
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="contained" color="primary" onClick={applyForSelectedWinners}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChooseWinner;
