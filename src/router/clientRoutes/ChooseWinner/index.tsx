import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/constants/api";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ScholarshipProgramType, } from "../ScholarshipProgram/data";
import Spinner from "@/components/Spinner";
import { Avatar, Button, Divider, Fade, FormControl, InputAdornment, InputLabel, List, ListItem, ListItemAvatar, ListItemText, Modal, OutlinedInput, Paper, Typography, } from "@mui/material";
import { getApplicationsByScholarship } from "@/services/ApiServices/accountService";
import { SendNotification, sendWinnerEmail } from "@/services/ApiServices/notification";
import {
  getScholarshipProgram, updateScholarshipStatus,
} from "@/services/ApiServices/scholarshipProgramService";
import {
  FaCheckCircle, FaEye, FaGraduationCap, FaTrophy,
  FaSortUp, FaSortDown
} from "react-icons/fa";
import { notification } from "antd";
import * as Tabs from "@radix-ui/react-tabs";
import FirstReview from "./firstReview";
import SecondReview from "./secondReview";
import { updateApplication } from "@/services/ApiServices/applicationService";
import ApplicationStatus from "@/constants/applicationStatus";
import { getApplicantProfileById } from "@/services/ApiServices/applicantProfileService";

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
  const [isApproved, setIsApproved] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [winnerName, setWinnerName] = useState<string>("");
  const handleCloseModal = () => setOpenModal(false);
  const handleOpenModal = (winnerName: string) => {
    setWinnerName(winnerName);
    setOpenModal(true);
  };

  const statusColor: any = {
    Submitted: "blue",
    Approved: "green",
    Rejected: "red",
    Failed: "red",
    Reviewing: "yellow",
  };



  const fetchApplicants = async (scholarshipId: number, data: any) => {
    try {
      const response = await getApplicationsByScholarship(scholarshipId);
      if (!id) return;
      const scholarship = await getScholarshipProgram(parseInt(id));

      if (response.statusCode == 200) {
        const applicantsWithFullName = await Promise.all(
          response.data.map(async (application: any) => {
            const applicantId = application.applicantId;

            const profileResponse = await getApplicantProfileById(applicantId);
            const fullName = profileResponse.data
              ? `${profileResponse.data.firstName} ${profileResponse.data.lastName}`
              : "Unknown Name";

            return {
              ...application,
              applicant: {
                ...application.applicant,
                fullName,
              },
            };
          })
        );
        setApplicants(
          applicantsWithFullName.filter(
            (row: any) =>
            (row.status == "Submitted" ||
              row.status == "Rejected" ||
              row.status == "Reviewing") /*&&
              new Date(row.updatedAt) < new Date(scholarship.data.deadline)*/
          )
        );
        if (data) {
          setScholarshipWinners(
            applicantsWithFullName.filter((row: any) => row.status == "Approved")
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

        await updateApplication(row.id, payload);
      });

      await Promise.all(applyPromises);

      if (availableScholarships === 0) {
        await updateScholarshipStatus(Number(data?.id), "FINISHED");
      }

      notification.success({
        message: "Approve successfully!",
      });
      await fetchData();
      for (const row of selectedRows)
        await SendNotification({
          topic: row.applicantId.toString(),
          link: `/funder/application/${row.id}`,
          title: "Your application has been approved",
          body: `Your application for ${data?.name} has been approved.`,
        });
      setIsApproved(true);
      handleCloseModal();
    } catch (error) {
      console.error(error);
      setError("Failed to apply for selected winners.");
    } finally {
      setLoading(false);
    }
  };

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

  const handleSort = () => {
    // Chuyển đổi giữa ascending và descending
    setSortOrder(prevSortOrder => {
      if (prevSortOrder === 'asc') return 'desc';
      return 'asc';
    });
  };

  const sortedRows = filteredRows.sort((a: any, b: any) => {
    const scoreA = a.applicationReviews.length
      ? a.applicationReviews.reduce((sum: any, review: any) => sum + review.score, 0) / a.applicationReviews.length
      : 0;
    const scoreB = b.applicationReviews.length
      ? b.applicationReviews.reduce((sum: any, review: any) => sum + review.score, 0) / b.applicationReviews.length
      : 0;

    if (sortOrder === 'asc') {
      return scoreA - scoreB; // ascending
    }
    if (sortOrder === 'desc') {
      return scoreB - scoreA; // descending
    }
    return 0; // no sorting
  });

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

            <Paper
              sx={{
                height: 300,
                width: "100%",
                borderRadius: "8px",
                boxShadow: 3,
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {scholarshipWinners.length > 0 ? (
                <div style={{ overflowX: "auto", flex: 1 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                        <th style={{ padding: "12px", fontWeight: "600", textAlign: "center" }}>#</th>
                        <th style={{ padding: "12px", fontWeight: "600" }}>Avatar</th>
                        <th style={{ padding: "12px", fontWeight: "600", textAlign: "center" }}>Name</th>
                        <th style={{ padding: "12px", fontWeight: "600", textAlign: "center" }}>Email</th>
                        <th style={{ padding: "12px", fontWeight: "600", textAlign: "center" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scholarshipWinners.map((winner, index) => (
                        <tr
                          key={winner.id}
                          style={{
                            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          <td style={{ padding: "12px", fontSize: "14px", color: "#333", textAlign: "center" }}>{index + 1}</td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <img
                              src={winner.applicant.avatarUrl ?? "https://github.com/shadcn.png"}
                              alt="Avatar"
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid #ddd",
                              }}
                            />
                          </td>
                          <td style={{ padding: "12px", fontSize: "14px", fontWeight: "500", color: "#333", textAlign: "center" }}>
                            {winner.applicant.fullName}

                          </td>
                          <td style={{ padding: "12px", fontSize: "14px", fontWeight: "500", color: "#555", textAlign: "center" }}>
                            {winner.applicant.email}
                          </td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "10px",
                                flexWrap: "wrap",
                                justifyItems: "center",
                              }}
                            >
                              {/* View Application Button */}
                              <Link
                                target="_blank"
                                to={`/funder/application/${winner.id}`}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  textDecoration: "none",
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  size="small"
                                  style={{
                                    fontSize: "14px",
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                  }}
                                  onMouseEnter={(e) =>
                                  (e.currentTarget.style.boxShadow =
                                    "0px 4px 8px rgba(0, 0, 0, 0.1)")
                                  }
                                  onMouseLeave={(e) =>
                                  (e.currentTarget.style.boxShadow =
                                    "0px 2px 4px rgba(0, 0, 0, 0.1)")
                                  }
                                >
                                  <FaEye className="mr-2" />
                                  View Application
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 mt-4 text-xl">No scholarship applicants yet</p>
              )}
            </Paper>



            <p className="mt-20 text-xl font-semibold my-5 text-gray-800 flex items-center gap-2 hover:text-sky-500 transition-all duration-300">
              <FaGraduationCap className="text-sky-500 text-2xl" />
              <span className="text-gray-600">Number of scholarships left:</span>
              <span className="text-sky-500 text-2xl font-bold">
                {availableScholarships}
              </span>
            </p>

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
                            <th style={{ padding: "12px", fontWeight: "600" }}>-</th>
                            <th style={{ padding: "12px", fontWeight: "600" }}>#</th>
                            <th style={{ padding: "12px", fontWeight: "600" }}>Avatar</th>
                            <th style={{ padding: "12px", fontWeight: "600" }}>Name</th>
                            <th style={{ padding: "12px", fontWeight: "600" }}>Status</th>
                            <th style={{ padding: "12px", fontWeight: "600" }}>Score
                              <button onClick={handleSort} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                                {sortOrder === 'asc' ? <FaSortUp /> : sortOrder === 'desc' ? <FaSortDown /> : <FaSortUp />}
                              </button>
                            </th>
                            <th style={{ padding: "12px", fontWeight: "600" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedRows.map((app: any, index: any) => (
                            <tr key={app.id} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                              <td style={{ padding: "12px" }}>
                                {app.status == ApplicationStatus.Reviewing && <input
                                  type="checkbox"
                                  disabled={availableScholarships === 0 && !selectedRows.includes(app) || app.status === "Rejected"}
                                  checked={selectedRows.some((row) => row.id === app.id)}
                                  onChange={() => handleSelectionChange(app.id)}
                                />}
                              </td>
                              <td style={{ padding: "12px" }}>{index + 1}</td>
                              <td style={{ padding: "12px" }}>
                                <img src={app.applicant.avatarUrl ?? "https://github.com/shadcn.png"} alt="Avatar" style={{ width: "40px", borderRadius: "50%" }} />
                              </td>
                              <td style={{ padding: "12px" }}>{app.applicant.fullName}</td>
                              <td style={{ padding: "12px" }}><span className={`relative inline-flex items-center justify-center h-3 w-3 rounded-full bg-${statusColor[app.status]}-500`}>
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${statusColor[app.status]}-500 opacity-75`}></span>
                              </span>
                                <span className={`text-${statusColor[app.status]}-500 font-medium ml-2`}>
                                  {app.status}
                                </span></td>
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
                                    <FaEye /> View Application
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
                      onClick={() => handleOpenModal(selectedRows[0]?.applicant.username)}
                      className="bg-[#1eb2a6] text-white px-4 py-2 rounded hover:bg-[#51b8af]"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin" aria-hidden="true"></div>
                      ) : (
                        <FaCheckCircle className="text-white text-2xl mr-2" />
                      )}
                      <span className="text-lg font-semibold">Approve</span>
                    </Button>
                  </div>

                  <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    closeAfterTransition
                  >
                    <Fade in={openModal}>
                      <div
                        style={{
                          padding: "20px",
                          background: "#fff",
                          borderRadius: "10px",
                          maxWidth: "500px",
                          margin: "auto",
                          position: "relative",
                          top: "30%",
                          boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)",
                          border: "1px solid #51b8af",
                        }}
                      >
                        <h3
                          style={{
                            textAlign: "center",
                            color: "#555",
                            fontSize: "20px",
                            fontWeight: "600",
                            marginBottom: "20px",
                          }}
                        >
                          You have selected {winnerName} for this scholarship.
                        </h3>
                        <p
                          style={{
                            textAlign: "center",
                            marginBottom: "20px",
                            fontSize: "16px",
                            color: "#555",
                          }}
                        >
                          If you click "Confirm", it means you have selected the winner and will
                          not be able to change it further.
                        </p>

                        <div className="flex justify-between" style={{ marginTop: '60px' }}>
                          <div style={{ textAlign: "start" }}>
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={handleCloseModal}
                              style={{
                                padding: "10px 20px",
                                borderRadius: "5px",
                              }}
                            >
                              Cancel
                            </Button>
                          </div>

                          <div style={{ textAlign: "end" }}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={applyForSelectedWinners}
                              disabled={isApproved}
                              style={{
                                backgroundColor: "#51b8af",
                                color: "white",
                                padding: "10px 20px",
                                fontWeight: "600",
                                borderRadius: "5px",
                              }}
                            >
                              Confirm
                            </Button>
                          </div>
                        </div>

                      </div>
                    </Fade>
                  </Modal>
                </Paper>
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChooseWinner;
