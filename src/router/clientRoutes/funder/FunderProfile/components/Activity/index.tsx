import { IoIosAddCircleOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { Link } from "react-router-dom";
import RouteNames from "@/constants/routeNames";
import scholarshipProgram, { ScholarshipProgramType } from "./data";
import ScholarshipProgramSkeleton from "./ScholarshipProgramSkeleton";
import * as Tabs from "@radix-ui/react-tabs";
import { Paper } from "@mui/material";
import { FaEye } from "react-icons/fa";
import { getApplicationsByApplicant } from "@/services/ApiServices/applicantProfileService";
import { getAllApplications } from "@/services/ApiServices/applicationService";

const Activity = () => {
  const user = useSelector((state: any) => state.token.user);
  const role = user?.role;
  const funderId = user?.id;

  const [data, setData] =
    useState<ScholarshipProgramType[]>(scholarshipProgram);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);

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
                      Deadline
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Value of Award
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Number of Scholarships
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Number of Applicants
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
                    data.map((item: any, index: any) => (
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
                          {index + 1}
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
                          {item.numberOfScholarships}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {applications && applications.filter((app:any) => 
                            app.scholarshipProgramId == item.id).length}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <Link
                            to={`/scholarship-program/${item.id}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              fontSize: "14px",
                              padding: "6px 12px",
                              borderRadius: "5px",
                              textDecoration: "none",
                              color: "#007bff",
                              backgroundColor: "#f0f8ff",
                              transition:
                                "background-color 0.3s ease, color 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#007bff";
                              e.currentTarget.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#f0f8ff";
                              e.currentTarget.style.color = "#007bff";
                            }}
                          >
                            <FaEye /> View
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Paper>
        </div>
      </div>
    </Tabs.Content>
  );
};

export default Activity;
