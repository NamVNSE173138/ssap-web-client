import { formatDate, formatOnlyDate } from "@/lib/date-formatter"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { Link } from "react-router-dom"

  const AwardProgressTable = ({ awardMilestone, application }: any) => {
    if(!awardMilestone || awardMilestone.length == 0) 
        return <p className="text-center font-semibold text-xl">No award milestone for this scholarship</p>
    return (
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">From Date</TableCell>
            <TableCell align="right">To Date</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {awardMilestone.map((award: any, index: number) => (
            <TableRow
              key={award.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Year {index+1}
              </TableCell>
              <TableCell align="right">{formatOnlyDate(award.fromDate)}</TableCell>
              <TableCell align="right">{formatOnlyDate(award.toDate)}</TableCell>
              <TableCell align="right">${award.amount}</TableCell>
              {(new Date() < new Date(award.toDate) && new Date() > new Date(award.fromDate)) ?
              (
                (<>
                    {application.status == "Submitted" && <TableCell align="right"><span className="text-yellow-500">Reviewing</span></TableCell>}
                    {application.status == "Awarded" && <TableCell align="right"><span className="text-green-500">Awarded</span></TableCell>}
                    {application.status == "Approved" && <TableCell align="right"><span className="text-sky-500">In progress</span></TableCell>}
                    {application.status == "Rejected" && <TableCell align="right"><span className="text-red-500">Rejected</span></TableCell>}
                </>)
              ) :
              (
                <>{(new Date(application.updatedAt) > new Date(award.toDate)) ? (<TableCell align="right"><span className="text-green-500">Awarded</span></TableCell>) :
                <TableCell align="right"><span className="text-gray-500">Not started</span></TableCell>}
                </>
              )}
              {/*<TableCell align="right">
                <Link target="_blank" className="text-blue-500 underline" to={doc.fileUrl}>{doc.name}</Link>
              </TableCell>
              <TableCell align="right">{formatDate(doc.updatedAt)}</TableCell>*/}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    )
  }

  export default AwardProgressTable
