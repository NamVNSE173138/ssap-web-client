import { formatDate } from "@/lib/date-formatter"
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Tooltip } from "@mui/material"
import ExtendApplicationRows from "./extend-application-rows"
import {InsertDriveFile as FileIcon, AccessTime as TimeIcon } from "@mui/icons-material";


const DocumentTable = ({ documents, awardMilestones, rows, setRows, handleDeleteRow, handleInputChange }: any) => {

  if (!documents || documents.length == 0)
    return <p className="text-center font-semibold text-xl">No uploaded documents</p>
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
      <Table sx={{ minWidth: 700 }} aria-label="document table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
            <TableCell sx={{ fontWeight: "bold", color: "#0d47a1" }}>Progress</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#0d47a1" }}>Document Name</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#0d47a1" }} >Type</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#0d47a1" }} >File</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#0d47a1" }} >Uploaded At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc: any) => (
            <TableRow
              key={doc.id}
              sx={{
                "&:hover": { backgroundColor: "#e3f2fd" },
              }}
            >
              <TableCell component="th" scope="row" sx={{alignItems: "center", gap: 1 }}>
                <FileIcon sx={{ color: "#0d47a1" }} />
                {"Progress " +
                  (awardMilestones.findIndex(
                    (milestone: any) =>
                      new Date(milestone.fromDate) < new Date(doc.updatedAt) &&
                      new Date(doc.updatedAt) < new Date(milestone.toDate)
                  ) + 1)}
              </TableCell>
              <TableCell>{doc.name}</TableCell>
              <TableCell sx={{ textTransform: "capitalize" }}>{doc.type}</TableCell>
              <TableCell >
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
              </TableCell>
              <TableCell>
                <Tooltip title={`Uploaded on ${formatDate(doc.updatedAt)}`}>
                  <span>
                    <TimeIcon sx={{ verticalAlign: "middle", marginRight: 1, color: "#0d47a1" }} />
                    {formatDate(doc.updatedAt)}
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {rows &&
            rows.length > 0 &&
            rows.map((row: any) => (
              <ExtendApplicationRows
                key={row.id}
                awardMilestones={awardMilestones}
                row={row}
                setRows={setRows}
                handleDeleteRow={handleDeleteRow}
                handleInputChange={handleInputChange}
              />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DocumentTable
