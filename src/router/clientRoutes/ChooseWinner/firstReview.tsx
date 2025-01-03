import React, { useEffect, useState } from "react";
import { CircularProgress, Paper, Button } from "@mui/material";
import { FaEye } from "react-icons/fa"; // Importing an eye icon from react-icons
import { fetchFirstReviewData } from "@/services/ApiServices/applicationService";
import { getExpertProfile } from "@/services/ApiServices/expertService";

interface FirstReviewProps {
  scholarshipId: string;
  token: string;
}

const FirstReview: React.FC<FirstReviewProps> = ({ scholarshipId, token }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const statusColor: any = {
    Submitted: "blue",
    Approved: "green",
    Rejected: "red",
    Failed: "red",
    Reviewing: "yellow",
  };
  const [expertNames, setExpertNames] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await fetchFirstReviewData(scholarshipId, token);
        setData(fetchedData);
        for (let row of fetchedData) {
          const expertProfile = await getExpertProfile(row.expertId);
          setExpertNames((prev: any) => ({
            ...prev,
            [row.expertId]: expertProfile.data.name,
          }));
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scholarshipId, token]);

  // Loading or error states before rendering the table
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
              data.map((row, index) => (
                <tr key={row.id} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                  <td style={{ padding: "12px" }}>{index + 1}</td>
                  <td style={{ padding: "12px" }}>{row.applicantName}</td>
                  <td style={{ padding: "12px" }}>{row.score}</td>
                  <td style={{ padding: "12px" }}>{row.comment}</td>
                  <td style={{ padding: "12px" }}>
                    {new Date(row.updatedAt).toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span className={`relative inline-flex items-center justify-center h-3 w-3 rounded-full bg-${statusColor[row.status]}-500`}>
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${statusColor[row.status]}-500 opacity-75`}></span>
                    </span>
                    <span className={`text-${statusColor[row.status]}-500 font-medium ml-2`}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>{expertNames[row.expertId] || 'N/a'}</td>
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
                    >
                      <FaEye /> View Details
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Paper>
  );
};

export default FirstReview;
