import { formatDate } from "@/lib/date-formatter"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { Link } from "react-router-dom"

  const RequestDetailTable = ({ requestDetails }: any) => {
    if(!requestDetails || requestDetails.length == 0) 
        return <p className="text-center font-semibold text-xl">No service details</p>
    return (
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Note</TableCell>
            <TableCell align="right">Scholarship Type</TableCell>
            <TableCell align="right">File</TableCell>
            <TableCell align="right">Expected Completion Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requestDetails.map((detail:any) => (
            <TableRow
              key={detail.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell className="max-w-[100px]" component="th" scope="row">
                {detail.applicationNotes}
              </TableCell>
              <TableCell align="right">{detail.scholarshipType}</TableCell>
              <TableCell align="right">
                {detail.applicationFileUrl &&
                    <Link target="_blank" className="text-blue-500 underline" to={detail.applicationFileUrl}>Click here</Link>
                }
                {!detail.applicationFileUrl && "No file uploaded"}
              </TableCell>
              <TableCell align="right">{formatDate(detail.expectedCompletionTime)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    )
  }

  export default RequestDetailTable
