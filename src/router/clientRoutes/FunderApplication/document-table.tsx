import { Paper, Tooltip } from "@mui/material";
import ExtendApplicationRows from "./extend-application-rows";
import {
  InsertDriveFile as FileIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";

const DocumentTable = ({
  documents,
  documentType,
  awardMilestones,
  rows,
  setRows,
  handleDeleteRow,
  handleInputChange,
}: any) => {
  return (
    <>
      {(!documents || documents.length === 0) &&
        (!rows || rows.length === 0) && (
          <div className="text-center w-full font-semibold text-xl">
            No uploaded documents
          </div>
        )}

      {((documents && documents.length > 0) || (rows && rows.length > 0)) && (
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#fafafa",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: "flex",
              fontWeight: "bold",
              backgroundColor: "#f1f1f1",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            <div style={{ flex: 1 }}>Progress</div>
            <div style={{ flex: 1 }}>Document Name</div>
            <div style={{ flex: 1 }}>Type</div>
            <div style={{ flex: 1 }}>File</div>
            <div style={{ flex: 1 }}>Uploaded At</div>
          </div>

          {/* Documents */}
          {documents &&
            documents.length > 0 &&
            documents.map((doc: any) => (
              <div
                key={doc.id}
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
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e3f2fd")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9f9f9")
                }
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <FileIcon style={{ color: "#0d47a1" }} />
                  <span>
                    {"Progress " +
                      (awardMilestones.findIndex(
                        (milestone: any) =>
                          new Date(milestone.fromDate) <
                            new Date(doc.createdAt) &&
                          new Date(doc.createdAt) < new Date(milestone.toDate)
                      ) +
                        1)}
                  </span>
                </div>
                <div style={{ flex: 1 }}>{doc.name}</div>
                <div style={{ flex: 1, textTransform: "capitalize" }}>
                  {doc.type}
                </div>
                <div style={{ flex: 1 }}>
                  <Tooltip title="View File">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={doc.fileUrl}
                      style={{
                        textDecoration: "none",
                        fontWeight: "bold",
                        color: "#1e88e5",
                        cursor: "pointer",
                      }}
                    >
                      {doc.name}
                    </a>
                  </Tooltip>
                </div>
                <div style={{ flex: 1 }}>
                  <Tooltip
                    title={`Uploaded on ${new Date(
                      doc.createdAt
                    ).toLocaleDateString("en-US")}`}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <TimeIcon
                        style={{
                          verticalAlign: "middle",
                          marginRight: "8px",
                          color: "#0d47a1",
                        }}
                      />
                      {new Date(doc.createdAt).toLocaleDateString("en-US")}
                    </span>
                  </Tooltip>
                </div>
              </div>
            ))}

          {/* Rows */}
          {rows &&
            rows.length > 0 &&
            rows.map((row: any) => (
              <ExtendApplicationRows
                key={row.id}
                awardMilestones={awardMilestones}
                row={row}
                setRows={setRows}
                documentType={documentType}
                handleDeleteRow={handleDeleteRow}
                handleInputChange={handleInputChange}
              />
            ))}
        </Paper>
      )}
    </>
  );
};

export default DocumentTable;
