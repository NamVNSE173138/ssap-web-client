import { formatDate } from "@/lib/date-formatter";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Link } from "react-router-dom";

const RequestDetailTable = ({ requestDetails, description }: { requestDetails: any; description: string }) => {
  if (!requestDetails || requestDetails.length === 0) 
      return <p className="text-center font-semibold text-xl">No request details</p>;

  return (
      <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                  <TableRow>
                      <TableCell>Request File</TableCell> {/* Change the header to "Notes" */}
                      <TableCell align="right">Scholarship Type</TableCell>
                      <TableCell align="right">Provider Updated File</TableCell>
                      <TableCell align="right">Provider Notes</TableCell>
                      <TableCell align="right">Expected Completion Time</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                  {requestDetails.map((detail: any) => (
                      <TableRow
                          key={detail.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                          <TableCell>
                              {detail.applicationFileUrl ? (
                                  <Link target="_blank" className="text-blue-500 underline" to={detail.applicationFileUrl}>
                                    Request file
                                  </Link>
                              ) : (
                                  "No file uploaded"
                              )}
                          </TableCell>
                          
                          <TableCell align="right">{detail.scholarshipType}</TableCell>
                          <TableCell align="right" >
                              {detail.applicationNotes.split(", ")[0] ? (detail.applicationNotes.split(", ")[0].startsWith("https://") ?
                                  <Link target="_blank" className="text-blue-500 underline" to={detail.applicationNotes.split(", ")[0]}>
                                    Provider's Updated File
                                  </Link> 
                                  : detail.applicationNotes) : "No file uploaded"}
                          </TableCell>
                          <TableCell align="right" className="max-w-[500px]" component="th" scope="row">
                            {detail.applicationNotes ? detail.applicationNotes.split(", ")[1]
                                    : ""}</TableCell>
                          <TableCell align="right">{formatDate(detail.expectedCompletionTime)}</TableCell>
                      </TableRow>
                  ))}
              </TableBody>
          </Table>
      </TableContainer>
  );
};

export default RequestDetailTable;
