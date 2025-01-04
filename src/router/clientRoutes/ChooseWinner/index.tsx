import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/constants/api";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ScholarshipProgramType, } from "../ScholarshipProgram/data";
import Spinner from "@/components/Spinner";
import { Avatar, Button, Divider, FormControl, InputAdornment, InputLabel, List, ListItem, ListItemAvatar, ListItemText, OutlinedInput, Paper, Typography, } from "@mui/material";
import { getApplicationsByScholarship } from "@/services/ApiServices/accountService";
import { SendNotification, sendWinnerEmail } from "@/services/ApiServices/notification";
import {
  getScholarshipProgram, updateScholarshipStatus,
} from "@/services/ApiServices/scholarshipProgramService";
import {
  FaCheckCircle, FaEye, FaGraduationCap, FaSearch, FaTimes, FaTrophy,
  FaUser,
} from "react-icons/fa";
import { notification } from "antd";
import * as Tabs from "@radix-ui/react-tabs";
import FirstReview from "./firstReview";
import SecondReview from "./secondReview";
import { updateApplication } from "@/services/ApiServices/applicationService";
import { getUploadedScholarshipContract } from "@/services/ApiServices/applicantService";
import { getFunderProfile } from "@/services/ApiServices/funderService";
import { IoCloudUpload, IoDocumentText } from "react-icons/io5";
import Modal from "antd/es/modal/Modal";
import ApplicationStatus from "@/constants/applicationStatus";
// import { uploadFile } from "@/services/ApiServices/testService";

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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [generateFile, setGenerateFile] = useState(null);
  const [contractFiles, setContractFiles] = useState<File[]>([]);



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
            (row.status == "Submitted" ||
            row.status == "Rejected" ||
              row.status == "Reviewing") /*&&
              new Date(row.updatedAt) < new Date(scholarship.data.deadline)*/
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

  const handlePreviewTemplate = async () => {
    try {
      if (!data) {
        notification.error({
          message: "No data available for preview.",
        });
        return;
      }

      const funderProfile = await getFunderProfile(data?.funderId);
      const generateForFile = {
        applicantName: selectedRows[0].applicant.username,
        scholarshipAmount: data?.scholarshipAmount + "",
        scholarshipProviderName: funderProfile.data.username,
        deadline: data?.deadline,
      };

      const file = await getUploadedScholarshipContract(generateForFile);
      if (file) {
        notification.success({
          message: "Preview generated successfully!",
        });
        setGenerateFile(file.data);
      } else {
        notification.error({
          message: "Failed to generate preview.",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error generating preview.",
      });
    }
  };

  const openApplyModal = () => {
    setModalIsOpen(true);
  };

  const applyForSelectedWinners = async () => {
    setModalIsOpen(false);
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

        await updateApplication(row.id, payload);
        await sendWinnerEmail(row.applicantId, contractFiles);

        await SendNotification({
          topic: row.applicantId.toString(),
          link: `/funder/application/${row.id}`,
          title: "Your application has been approved",
          body: `Your application for ${data?.name} has been approved.`,
        });
      });

      await Promise.all(applyPromises);

      if (availableScholarships === 0) {
        await updateScholarshipStatus(Number(data?.id), "FINISHED");
      }

      notification.success({
        message: "Selected applicants have been approved!",
      });
      await fetchData();
    } catch (error) {
      console.error(error);
      setError("Failed to apply for selected winners.");
    } finally {
      setLoading(false);
    }
  };


  // const columns: GridColDef[] = [
  //   { field: "id", headerName: "ID", width: 70 },
  //   {
  //     field: "avatarUrl",
  //     headerName: "Avatar",
  //     width: 130,
  //     flex: 0.5,
  //     renderCell: (params) => {
  //       return (
  //         <img
  //           src={params.value}
  //           alt="avatar"
  //           style={{ width: 50, height: 50, borderRadius: 50 }}
  //         />
  //       );
  //     },
  //   },
  //   { field: "username", headerName: "Username", width: 130, flex: 1 },
  //   {
  //     field: "status",
  //     headerName: "Status",
  //     width: 130,
  //     flex: 0.5,
  //     renderCell: (params) => {
  //       console.log("PARAM", params)
  //       return (
  //         <span className="flex justify-end gap-2 items-center">
  //           <span className="relative flex h-3 w-3">
  //             <span
  //               className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${statusColor[params.row.status]
  //                 }-500 opacity-75`}
  //             ></span>
  //             <span
  //               className={`relative inline-flex rounded-full h-3 w-3 bg-${statusColor[params.row.status]
  //                 }-500`}
  //             ></span>
  //           </span>
  //           <span
  //             className={`text-${statusColor[params.value]}-500 font-medium`}
  //           >
  //             {params.value}
  //           </span>
  //         </span>
  //       );
  //     },
  //   },
  //   { field: "expertReview", headerName: "Reviewed by Expert", width: 130, flex: 1 },
  //   {
  //     field: "score", headerName: "Score", width: 130, flex: 1
  //   },
  //   {
  //     field: "link",
  //     headerName: "Action",
  //     renderCell: (params) => {
  //       return (
  //         <Link
  //           target="_blank"
  //           className="text-sky-500 underline"
  //           to={`/funder/application/${params.row.id}`}
  //         >
  //           View Profile
  //         </Link>
  //       );
  //     },
  //     flex: 1,
  //     width: 130,
  //   },
  // ];



  const handleSelectionChange = (appId: number) => {
    // Check if the appId is already in selectedRows
    console.log(selectedRows);
    const isSelected = selectedRows.some((row) => row.id === appId);
    let fakeSelectedRows;
    if (isSelected) {
      // If already selected, remove it from selectedRows
      fakeSelectedRows = selectedRows.filter((row) => row.id !== appId);
      setSelectedRows((prev) => prev.filter((row) => row.id !== appId));
    } else {
      // If not selected, add it to selectedRows
      fakeSelectedRows = [...selectedRows, applicants.find((row: any) => row.id === appId)];
      setSelectedRows((prev) => [...prev, applicants.find((row: any) => row.id === appId)]);
    }

    // Update available scholarships logic
    if (data) {
      const approvedCount = applicants.filter((row: any) => row.status === "Approved").length;
      const newAvailableScholarships = data.numberOfScholarships - approvedCount - fakeSelectedRows.length;
      setAvailableScholarships(newAvailableScholarships < 0 ? 0 : newAvailableScholarships);
    }
  };



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
            <p className="text-4xl font-semibold text-sky-600 flex items-center gap-2">
              <FaTrophy className="text-4xl text-sky-500" />
              Choose Scholarship Winner
            </p>
            <div className="block bg-sky-500 w-[24px] h-[6px] rounded-[8px] mt-[4px] ml-12"></div>
            <p className="text-lg font-semibold my-5 text-gray-700">
              <span>The winners of this scholarship: </span>
              <span className="text-sky-500">{scholarshipWinners.length}</span>
            </p>

            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {scholarshipWinners.map((winner) => (
                <div key={winner.id} className="p-4 mb-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
                  <ListItem
                    alignItems="flex-start"
                    className="flex items-center gap-4"
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={winner.applicant.username}
                        src={
                          winner.applicant.avatarUrl ??
                          "https://github.com/shadcn.png"
                        }
                        sx={{ width: 60, height: 60 }}
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
                      className="flex items-center gap-2 text-sky-500 underline hover:text-sky-600 transition-all mt-4"
                    >
                      <FaUser className="text-sky-500" />
                      <span className="text-sm">View Profile</span>
                    </Link>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              ))}
            </List>

            <p className="text-xl font-semibold my-5 text-gray-800 flex items-center gap-2 hover:text-sky-500 transition-all duration-300">
              <FaGraduationCap className="text-sky-500 text-2xl" />
              <span className="text-gray-600">Number of scholarships left:</span>
              <span className="text-sky-500 text-2xl font-bold">
                {availableScholarships}
              </span>
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
                  fontWeight: "600",
                  color: "gray.700",
                }}
              >
                Search Applicants
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-search"
                startAdornment={
                  <InputAdornment position="start">
                    <FaSearch className="text-sky-500 transition-all duration-200 transform hover:scale-105" />
                  </InputAdornment>
                }
                endAdornment={
                  searchQuery && (
                    <InputAdornment position="end">
                      <FaTimes
                        className="text-sky-500 cursor-pointer transition-all duration-200 transform hover:scale-105"
                        onClick={() => setSearchQuery("")}
                      />
                    </InputAdornment>
                  )
                }
                onChange={(e) => setSearchQuery(e.target.value)}
                label="Search Applicants"
                className="border-2 border-sky-500 rounded-md shadow-md transition-all duration-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hover:shadow-lg"
                sx={{
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  backgroundColor: "#F7FAFC",
                  borderColor: "gray.300",
                }}
              />
            </FormControl>

            <Tabs.Root defaultValue="firstReview" className="w-full">
              <Tabs.List className="flex justify-between border-b-2 my-5 bg-white shadow-md rounded-lg w-full h-full">
                <Tabs.Trigger
                  value="firstReview"
                  className="flex-1 px-6 py-3 text-lg font-medium focus:outline-none text-center transition-all duration-300 transform hover:scale-105 hover:text-sky-600 data-[state=active]:text-[#1eb2a6] data-[state=active]:border-b-2 border-transparent"
                >
                  First Review
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="secondReview"
                  className="flex-1 px-6 py-3 text-lg font-medium focus:outline-none text-center transition-all duration-300 transform hover:scale-105 hover:text-sky-600 data-[state=active]:text-[#1eb2a6] data-[state=active]:border-b-2 border-transparent"
                >
                  Second Review
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="finalReview"
                  className="flex-1 px-6 py-3 text-lg font-medium focus:outline-none text-center transition-all duration-300 transform hover:scale-105 hover:text-sky-600 data-[state=active]:text-[#1eb2a6] data-[state=active]:border-b-2 border-transparent"
                >
                  Final Review
                </Tabs.Trigger>
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
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {filteredRows.length > 0 ? (
                    <div style={{ overflowX: "auto", flex: 1 }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                            <th style={{ padding: "12px", fontWeight: "600" }}></th>
                            <th style={{ padding: "12px", fontWeight: "600" }}>ID</th>
                            <th style={{ padding: "12px", fontWeight: "600" }}>Avatar</th>
                            <th style={{ padding: "12px", fontWeight: "600" }}>Username</th>
                            <th style={{ padding: "12px", fontWeight: "600" }}>Status</th>
                            {/* <th style={{ padding: "12px", fontWeight: "600" }}>Reviewed by Expert</th> */}
                            <th style={{ padding: "12px", fontWeight: "600" }}>Score</th>
                            <th style={{ padding: "12px", fontWeight: "600" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRows.map((app: any, index: any) => (
                            <tr key={app.id} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                              <td style={{ padding: "12px" }}>
                                {app.status == ApplicationStatus.Reviewing && <input
                                  type="checkbox"
                                  disabled={availableScholarships === 0 && !selectedRows.includes(app)}
                                  checked={selectedRows.some((row) => row.id === app.id)}
                                  onChange={() => handleSelectionChange(app.id)}
                                />}
                              </td>
                              <td style={{ padding: "12px" }}>{app.id}</td>
                              <td style={{ padding: "12px" }}>
                                <img src={app.applicant.avatarUrl ?? "https://github.com/shadcn.png"} alt="Avatar" style={{ width: "40px", borderRadius: "50%" }} />
                              </td>
                              <td style={{ padding: "12px" }}>{app.applicant.username}</td>
                              <td style={{ padding: "12px" }}>{app.status}</td>
                              {/* <td style={{ padding: "12px" }}>{app.expertReview ?? "Not reviewed"}</td> */}
                              <td style={{ padding: "12px" }}>{app.applicationReviews.length ? (app.applicationReviews.reduce((a: any, b: any) => a + b.score, 0) / app.applicationReviews.length).toFixed(1) : "N/A"}</td>
                              <td style={{ padding: "12px", textAlign: "center" }}>
                                <Link
                                  target="_blank"
                                  to={`/funder/application/${app.id}`}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    textDecoration: "none",
                                    color: "inherit",
                                  }}
                                >
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    style={{
                                      fontSize: "14px",
                                      padding: "6px 12px",
                                      borderRadius: "5px",
                                    }}
                                  >
                                    <FaEye /> View Profile
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 mt-4 text-xl">No scholarship applicants yet </p>
                  )}

                  <div className="flex justify-end my-4 text-lg text-gray-700">
                    Selected Winners:{" "}
                    {selectedRows.map((row: any, index: number) =>
                      index > 0 ? `, ${row.applicant.username}` : row.applicant.username
                    )}
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      onClick={openApplyModal}
                      className="bg-[#1eb2a6] text-white px-4 py-2 rounded hover:bg-[#51b8af]"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin" aria-hidden="true"></div>
                      ) : (
                        <FaCheckCircle className="text-white text-2xl mr-2" />
                      )}
                      <span className="text-lg font-semibold">Apply</span>
                    </Button>
                  </div>

                </Paper>
              </Tabs.Content>
            </Tabs.Root>

            <Modal
              open={modalIsOpen}
              onCancel={() => setModalIsOpen(false)}
              onOk={() => {
                if (contractFiles.length === 0) {
                  notification.error({
                    message: "You need to provide a contract for the applicant!",
                  });
                  return;
                }
                applyForSelectedWinners();
              }}
            >
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Send Contract to Applicant
                </h2>

                <p className="text-sm text-gray-600 mb-6">
                  Use this form to preview and upload the contract files before sending them to the applicant.
                </p>
                <p className="mb-4 text-sm text-yellow-600">
                  If you use the auto-generated contract service, please note that only one contract will be generated. Or you can choose individual winners for this scholarship
                </p>

                <div className="flex justify-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow transition-all duration-300"
                    onClick={handlePreviewTemplate}
                  >
                    Preview Template
                  </button>
                </div>

                {generateFile && (
                  <div className="mt-6 w-full max-w-lg bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded shadow">
                    <h3 className="text-lg font-medium mb-2">Generated File</h3>
                    <p className="mb-4">
                      Your contract has been successfully generated and is ready for review. Click the link below to view or download it.
                    </p>
                    <p className="mb-4 text-sm text-gray-600">
                      If you use the auto-generated contract service, please note that only one contract will be generated.
                    </p>
                    <a
                      href={generateFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 text-center rounded-md transition-all duration-300 shadow-md"
                    >
                      View Generated Contract
                    </a>
                  </div>
                )}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Contract Files
                  </label>
                  <div className="border border-dashed border-gray-300 p-4 rounded-lg text-center hover:bg-gray-50 transition-all">
                    <input
                      type="file"
                      multiple
                      className="w-full hidden"
                      id="file-upload"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) setContractFiles(Array.from(files));
                      }}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center text-blue-500 hover:underline"
                    >
                      <IoCloudUpload className="text-4xl text-gray-400 mb-2" />
                      <span>Click to upload files</span>
                    </label>
                  </div>
                </div>

                {contractFiles.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700">Selected Files:</h3>
                    <ul className="mt-2 space-y-2">
                      {contractFiles.map((file: File, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-gray-600 flex items-center gap-2"
                        >
                          <IoDocumentText className="text-blue-500" />
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </Modal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChooseWinner;
