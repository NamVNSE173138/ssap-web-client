import { IoIosAddCircleOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { Link, useNavigate } from "react-router-dom";
import RouteNames from "@/constants/routeNames";
import scholarshipProgram, { ScholarshipProgramType } from "./data";
import ScholarshipProgramSkeleton from "./ScholarshipProgramSkeleton";
import * as Tabs from "@radix-ui/react-tabs";
import { Paper } from "@mui/material";
import { FaExclamationTriangle, FaEye, FaTrash } from "react-icons/fa";
import { getAllApplications } from "@/services/ApiServices/applicationService";
import { deleteScholarshipProgram, updateScholarshipStatus } from "@/services/ApiServices/scholarshipProgramService";

const ITEMS_PER_PAGE = 5;

const ConfirmationDialog = ({ isOpen, onClose, onConfirm }: any) => {
  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? "block" : "hidden"
        }`}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 max-w-sm w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <FaExclamationTriangle className="text-yellow-500 text-4xl mb-4" />
        <h3 className="text-xl font-semibold mb-4">
          Are you sure you want to delete this scholarship forever?
        </h3>
        <div className="flex space-x-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-500 transition"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Activity = () => {
  const user = useSelector((state: any) => state.token.user);
  const role = user?.role;
  const funderId = user?.id;
  const navigate = useNavigate();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] =
    useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(data?.length / ITEMS_PER_PAGE);
  const paginated = data?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const deleteScholarship = async (id: any) => {
    try {
      const response = await updateScholarshipStatus(id, {
        "status": "Closed"
      });
      console.log(response)
      if (response.statusCode === 200) {
        navigate("/funder/profile");
        await fetchData();
      } else {
        setError("Failed to delete scholarship");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [response, applications] = await Promise.all([axios.get(
        `${BASE_URL}/api/scholarship-programs/by-funder-id/${funderId}`,
      ),
      getAllApplications()
      ]);

      console.log("SCP", response.data.data);

      if (response.data.statusCode === 200) {
        setData(response.data.data.items);
        setApplications(applications);
      } else {
        setError("Failed to fetch scholarship programs");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, funderId]);

  return (
    <Tabs.Content value="activity" className="pt-4 w-full">
      <div className="grid grid-cols-12">
        <div className="col-span-12 col-start-1 p-6">
          <div className="relative w-full flex items-center justify-between my-5">
            <div className="flex items-center"></div>
            {(role == "FUNDER" || role == "Funder") && (
              <Link
                to={RouteNames.FORM_CREATE_SCHOLARSHIP_PROGRAM}
                className="flex justify-start items-center hover:bg-[#419f97] text-[#1eb2a6] hover:text-white transition-all duration-200 gap-4 px-4 py-2 bg-white rounded-lg active:scale-95 border border-[#1eb2a6]"
              >
                <IoIosAddCircleOutline className="text-3xl  hover:text-white" />
                <p className="text-xl  ">Add Scholarship Program</p>
              </Link>
            )}
          </div>

          <Paper
            elevation={3}
            style={{ padding: "20px", borderRadius: "10px" }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#419f97",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    <th style={{ padding: "12px", fontWeight: "600" }}>#</th>
                    <th style={{ padding: "12px", fontWeight: "600" }}>Name</th>
                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Description
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Create Date
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Deadline
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Value of Award
                    </th>

                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Number of Applicants
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Status
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8}>
                        <ScholarshipProgramSkeleton />
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan={8}
                        style={{
                          textAlign: "center",
                          padding: "20px",
                          fontSize: "18px",
                          color: "#888",
                        }}
                      >
                        Error loading scholarship programs
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        style={{
                          textAlign: "center",
                          padding: "20px",
                          fontSize: "18px",
                          color: "#888",
                        }}
                      >
                        No scholarship programs found
                      </td>
                    </tr>
                  ) : (
                    paginated.map((item: any, index: any) => (
                      <tr
                        key={item.id}
                        style={{
                          backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                          transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f1f1f1")
                        }
                        onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          index % 2 === 0 ? "#f9f9f9" : "#fff")
                        }
                      >
                        <td
                          style={{
                            padding: "12px",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {item.name}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {item.description.length > 30
                            ? item.description.slice(0, 30) + "..."
                            : item.description}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {new Date(item.deadline).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          ${item.scholarshipAmount}
                        </td>

                        <td
                          style={{
                            padding: "12px",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {applications && applications.filter((app: any) =>
                            app.scholarshipProgramId == item.id).length}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {item.status}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          {/* Button View */}
                          <Link
                            to={`/scholarship-program/${item.id}`}
                            className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-blue-600 bg-blue-100 hover:bg-blue-600 hover:text-white transition duration-300 gap-2"
                            title="View Scholarship"
                          >
                            <FaEye /> View
                          </Link>

                          {/* Button Delete */}

                          <button
                            onClick={() => setConfirmationDialogOpen(true)}
                            className={`flex items-center justify-center mt-2 px-4 py-2 text-sm font-medium rounded-lg transition duration-300 ${(applications.filter((app: any) => app.scholarshipProgramId == item.id).length !== 0) || item.status === "Closed"
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-red-500 text-white hover:bg-red-400"
                              }`}
                            disabled={(applications.filter((app: any) => app.scholarshipProgramId == item.id).length !== 0 || item.status === "Closed")}

                            title={
                              (applications.filter((app: any) =>
                                app.scholarshipProgramId == item.id).length !== 0 || item.status === "Closed")
                                ? "Cannot delete."
                                : "Delete Scholarship"
                            }
                          >
                            <FaTrash className="mr-2" /> Delete
                          </button>

                          {/* Confirmation Dialog */}
                          <ConfirmationDialog
                            isOpen={isConfirmationDialogOpen}
                            onClose={() => setConfirmationDialogOpen(false)}
                            onConfirm={async () => {
                              await deleteScholarship(item.id);
                              setConfirmationDialogOpen(false);
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "end" }}>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  style={{
                    margin: "0 5px",
                    padding: "5px 10px",
                    backgroundColor: currentPage === index + 1 ? "#419f97" : "#f1f1f1",
                    color: currentPage === index + 1 ? "white" : "black",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </Paper>
        </div>
      </div>
    </Tabs.Content>
  );
};

export default Activity;
