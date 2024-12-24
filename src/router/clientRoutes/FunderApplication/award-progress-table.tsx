import { InsertDriveFile as FileIcon } from "@mui/icons-material";
import { Paper } from "@mui/material";
import { BsDashCircle } from "react-icons/bs";

import { Link } from "react-router-dom";


const AwardProgressTable = ({ awardMilestone, application }: any) => {
  const transformToMarkdown = (text: string) => {
    return text.replace(/\\n/gi, "\n").replace(/\n/gi, "<br/>");
  };

  const CustomLink = ({ children, href }: any) => {
    return (
      <Link target="_blank" to={href} className="text-blue-400 no-underline">
        {children}
      </Link>
    );
  };

  if (!awardMilestone || awardMilestone.length === 0)
    return <p className="text-center font-semibold text-xl">No award milestone for this scholarship</p>;

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: "12px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        backgroundColor: "#fafafa",
      }}
    >

      {/* Column Headers */}
      <div
        style={{
          display: "flex",
          fontWeight: "bold",
          backgroundColor: "#f1f1f1",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <div style={{ flex: 1 }}>Milestone</div>
        <div style={{ flex: 1 }}>From Date</div>
        <div style={{ flex: 1 }}>To Date</div>
        <div style={{ flex: 1 }}>Amount</div>
        <div style={{ flex: 1 }}>Status</div>
      </div>

      {/* Award Milestone List */}
      {awardMilestone.map((award: any, index: any) => (
        <div
          key={award.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#f9f9f9",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e3f2fd')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
        >
          {/* Milestone Header */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileIcon style={{ color: '#0d47a1' }} />
            <span>{`Milestone ${index + 1}`}</span>
          </div>
          <div style={{ flex: 1 }}>{new Date(award.fromDate).toLocaleDateString('en-US')}</div>
          <div style={{ flex: 1 }}>{new Date(award.toDate).toLocaleDateString('en-US')}</div>
          <div style={{ flex: 1, color: "#388e3c", fontWeight: "bold" }}>${award.amount}</div>

          {/* Status Section */}

          <div style={{ flex: 1 }}>
            {new Date(application.updatedAt) < new Date(award.toDate) && new Date(application.updatedAt) > new Date(award.fromDate) ? (
              <>
                {application.status === "Submitted" && (
                  <div className="flex gap-2 items-center">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                    </span>
                    <span className="text-yellow-500 font-medium">Reviewing</span>
                  </div>
                )}

                {application.status === "Approved" && (
                  <div className="flex gap-2 items-center">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                    </span>
                    <span className="text-sky-500 font-medium">Approved</span>
                  </div>
                )}

                {application.status === "Awarded" && (
                  <div className="flex gap-2 items-center">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-green-500 font-medium">Awarded</span>
                  </div>
                )}
              </>

            ) : new Date(application.updatedAt) > new Date(award.toDate) ? (
              <div className="flex gap-2 items-center">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-green-500 font-medium">Awarded</span>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <BsDashCircle size={20} color="#9e9e9e" />
                <span className="text-gray-500 font-medium">Not Started</span>
              </div>
            )}
          </div>
        </div>
      ))}

    </Paper>
  );
};

export default AwardProgressTable;