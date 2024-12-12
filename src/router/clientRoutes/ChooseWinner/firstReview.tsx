import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { fetchFirstReviewData } from "@/services/ApiServices/applicationService";

interface FirstReviewProps {
  scholarshipId: string;
  token: string;
}

const FirstReview: React.FC<FirstReviewProps> = ({ scholarshipId, token }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await fetchFirstReviewData(scholarshipId, token);
        setData(fetchedData);   
      } catch (err) {
        setError((err as Error).message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchData(); 
  }, [scholarshipId, token]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "applicantName", headerName: "Applicant Name", width: 200 },
    { field: "score", headerName: "Score", width: 150 },
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
  

  // Loading or error states before rendering the DataGrid
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <DataGrid rows={data} columns={columns} autoHeight />
    </div>
  );
};

export default FirstReview;
