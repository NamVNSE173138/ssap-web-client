import React, { useEffect, useState } from "react";
import { CircularProgress, Paper, Button, Accordion, AccordionSummary, Typography, AccordionDetails, Collapse, Box } from "@mui/material";
import { FaEye } from "react-icons/fa";
import { fetchSecondReviewData } from "@/services/ApiServices/applicationService";
import { getExpertProfile } from "@/services/ApiServices/expertService";
import { GridArrowDownwardIcon } from "@mui/x-data-grid";
import { ArrowDropDownCircleRounded } from "@mui/icons-material";

interface FirstReviewProps {
  scholarshipId: string;
  token: string;
}

const statusColor: any = {
  Submitted: "blue",
  Approved: "green",
  Rejected: "red",
  Failed: "red",
  Reviewing: "yellow",
};

const SecondReview: React.FC<FirstReviewProps> = ({ scholarshipId, token }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expertNames, setExpertNames] = useState<any>({});
  const [expanded, setExpanded] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      return prev.map((row) => {
        if (row.id == id) {
          return { ...row, expanded: !row.expanded };
        }
        return row;
      })
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await fetchSecondReviewData(scholarshipId, token);
        setData(fetchedData);

        let expertNamesData:any = [];
        for (let row of fetchedData) {
          const expertProfile = await getExpertProfile(row.expertId);
          expertNamesData = {
            ...expertNamesData,
            [row.expertId]: expertProfile.data.name
          }
          setExpertNames((prev: any) => ({
            ...prev,
            [row.expertId]: expertProfile.data.name,
          }));
        }
        //console.log(expertNamesData);
        //console.log(fetchedData);
        // Group by applicationId and calculate average score
        const groupedData = fetchedData.reduce((acc:any, item:any) => {
          const { applicationId, applicantName, score, expertId, status } = item;

          if (!acc[applicationId]) {
            acc[applicationId] = { applicationId, totalScore: 0, count: 0, applicantName: "", expertReview: "", updatedAt: "",
            status: 0};
          }

          acc[applicationId].totalScore += score;
          acc[applicationId].count += 1;
          acc[applicationId].applicantName = applicantName
          acc[applicationId].expertReview += expertNamesData[expertId]+", ";
          acc[applicationId].updatedAt = "...";
          if(status == "Approved") acc[applicationId].status += 1;
          else acc[applicationId].status -= 1;

          return acc;
        }, {});

        // Calculate the average score for each group
        const result = Object.values(groupedData).map((group:any) => ({
          applicationId: group.applicationId,
          score: (group.totalScore / group.count).toFixed(2),
          applicantName: group.applicantName,
          comment: "...",
          expertReview: group.expertReview.slice(0, -2),
          updatedAt: "...",
          status: group.status > 0 ? "Approved" : "Rejected"
        }));
        setApplications(result);
        setExpanded(fetchedData.map((row: any) => ({id: row.id, expanded: false})));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scholarshipId, token]);

  if (loading) return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
  if (error) return <div className="text-center text-red-500 text-xl">{error}</div>;

  return (
    <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
              <th style={{ padding: "12px", fontWeight: "600" }}>#</th>
              <th style={{ padding: "12px", fontWeight: "600" }}>Applicant Name</th>
              <th style={{ padding: "12px", fontWeight: "600" }}>Score</th>
              <th style={{ padding: "12px", fontWeight: "600" }}>Comment</th>
              <th style={{ padding: "12px", fontWeight: "600" }}>Review Date</th>
              <th style={{ padding: "12px", fontWeight: "600" }}>Review Status</th>
              <th style={{ padding: "12px", fontWeight: "600" }}>Review By</th>
              <th style={{ padding: "12px", fontWeight: "600" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "20px", fontSize: "18px", color: "#888" }}>
                  No scholarship applicants yet
                </td>
              </tr>
            ) : (
              applications.map((row, index) => (
              <React.Fragment key={row.applicationId}>
                <tr style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                  <td style={{ padding: "12px" }}>{index + 1}</td>
                  <td style={{ padding: "12px" }}>{row.applicantName}</td>
                  <td style={{ padding: "12px" }}>{row.score}</td>
                  <td style={{ padding: "12px" }}>{row.comment}</td>
                  <td style={{ padding: "12px" }}>
                    {row.updatedAt}
                  </td>
                  <td style={{ padding: "12px" }}><span className={`relative inline-flex items-center justify-center h-3 w-3 rounded-full bg-${statusColor[row.status]}-500`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${statusColor[row.status]}-500 opacity-75`}></span>
                  </span>
                    <span className={`text-${statusColor[row.status]}-500 font-medium ml-2`}>
                      {row.status}
                    </span></td>
                  <td style={{ padding: "12px" }}>{row.expertReview || 'N/a'}</td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "14px",
                        padding: "6px 12px",
                        borderRadius: "5px",
                      }}
                      onClick={() => toggleExpand(row.applicationId)}
                    >
                      <FaEye /> View Details
                    </Button>
                  </td>
                  </tr>
                  <td colSpan={7} className="w-full">
                    {expanded && <Collapse in={expanded.find((item) => item.id == row.applicationId)?.expanded}>

                    <table className="w-full">
                    {data.filter((item) => item.applicationId == row.applicationId).map((row, index) => (
                    <tr key={index}>
                        <td style={{position: 'relative', padding: "12px"}}>
                            <div
                                style={{
                                  position: 'absolute',
                                  top: "-24px",
                                  left: '10px',
                                  height: '100%',
                                  width: '1px',
                                  backgroundColor: 'black',
                                }}
                              />
                              {/* Horizontal Line for Subrow */}
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '22px',  // Position it after the vertical line
                                  left: '10px',
                                  width: '20px',
                                  height: '1px',
                                  backgroundColor: 'black',
                                }}
                              />
                        </td>
                      <td  style={{ padding: "12px" }}>{row.applicantName}</td>
                      <td style={{ padding: "12px" }}>{row.score}</td>
                      <td style={{ padding: "12px" }}>{row.comment}</td>
                      <td style={{ padding: "12px" }}>
                        {new Date(row.updatedAt).toLocaleDateString('en-US', {
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric',
                        })}
                      </td>
                      <td style={{ padding: "12px" }}><span className={`relative inline-flex items-center justify-center h-3 w-3 rounded-full bg-${statusColor[row.status]}-500`}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${statusColor[row.status]}-500 opacity-75`}></span>
                      </span>
                        <span className={`text-${statusColor[row.status]}-500 font-medium ml-2`}>
                          {row.status}
                        </span></td>
                      <td style={{ padding: "12px" }}>{expertNames[row.expertId] || 'N/a'}</td>
                    </tr>

                    ))}

                  </table>
                  </Collapse>}
                  </td>

                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Paper>
  );
};

export default SecondReview;
