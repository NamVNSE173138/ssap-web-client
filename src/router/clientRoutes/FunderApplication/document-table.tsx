import { formatDate } from "@/lib/date-formatter"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { Link } from "react-router-dom"

  const DocumentTable = ({ documents }: any) => {
    if(!documents || documents.length == 0) 
        return <p className="text-center font-semibold text-xl">No uploaded documents</p>
    return (
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">File</TableCell>
            <TableCell align="right">Uploaded At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc:any) => (
            <TableRow
              key={doc.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {doc.name}
              </TableCell>
              <TableCell align="right">{doc.type}</TableCell>
              <TableCell align="right">
                <Link target="_blank" className="text-blue-500 underline" to={doc.fileUrl}>{doc.name}</Link>
              </TableCell>
              <TableCell align="right">{formatDate(doc.updatedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    )
  }

  export default DocumentTable
