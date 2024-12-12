import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { BASE_URL } from "@/constants/api";

interface FirstReviewProps {
  scholarshipId: string;
  token: string;
}

const SecondReview: React.FC<FirstReviewProps> = ({ scholarshipId, token }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFirstReviewData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/applications/reviews/result`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              isFirstReview: false,
              scholarshipProgramId: scholarshipId, 
            },
          }
        );
        console.log("REVIEW RESULT", response.data.data);
        
        if (response.data.statusCode === 200) {
          setData(response.data.data);
        } else {
          setError("Failed to fetch first review data"); 
        }
      } catch (err) {
        setError((err as Error).message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchFirstReviewData();
  }, [scholarshipId, token]); 

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "applicantName", headerName: "Applicant Name", width: 200 },
    { field: "score", headerName: "Score", width: 100 },
    { field: "reviewDate", headerName: "Review Date", width: 200 },
    { field: "status", headerName: "Review Status", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (_params) => (
        <button className="text-sky-500 underline">View Details</button>
      ),
      flex: 1,
    },
  ];

  console.log("scholarship ID", scholarshipId);
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <DataGrid rows={data} columns={columns} autoHeight />
    </div>
  );
};

export default SecondReview;
