import ApplicationStatus from "@/constants/applicationStatus"
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
                Progress {index+1}
              </TableCell>
              <TableCell align="right">{formatOnlyDate(award.fromDate)}</TableCell>
              <TableCell align="right">{formatOnlyDate(award.toDate)}</TableCell>
              <TableCell align="right">${award.amount}</TableCell>
              {(new Date() < new Date(award.toDate) && new Date() > new Date(award.fromDate)) ?
              (
                (<>
                    {application.status == ApplicationStatus.Submitted && <TableCell align="right">
                    <div className="flex justify-end gap-2 items-center">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                        </span>
                        <span className="text-yellow-500">Reviewing</span>
                    </div>
                    </TableCell>}
                    {application.status == ApplicationStatus.Awarded && <TableCell align="right">
                    <div className="flex justify-end gap-2 items-center">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-green-500">Awarded</span>
                    </div>
                    </TableCell>}
                    {application.status == ApplicationStatus.NeedExtend && <TableCell align="right">
                    <div className="flex justify-end gap-2 items-center">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                        </span>
                        <span className="text-yellow-500">Need extend application</span>
                    </div>
                    </TableCell>}
                    {application.status == ApplicationStatus.Approved && <TableCell align="right">
                    <div className="flex justify-end gap-2 items-center">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                        </span>
                        <span className="text-sky-500">In progress</span>
                    </div>
                    </TableCell>}
                    {application.status == ApplicationStatus.Rejected && <TableCell align="right">
                    <div className="flex justify-end gap-2 items-center">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span className="text-red-500">Rejected</span>
                    </div>
                    </TableCell>}
                </>)
              ) :
              (
                <>{(new Date(application.updatedAt) > new Date(award.toDate)) ? (<TableCell align="right">

                <div className="flex justify-end gap-2 items-center">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-green-500">Awarded</span>
                </div>
                </TableCell>) :
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
