import { formatDate } from "@/lib/date-formatter"
import { Accordion, AccordionDetails, AccordionSummary, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material"
import { ArrowDropDownCircleRounded, InsertDriveFile as FileIcon } from "@mui/icons-material";
import { TimerIcon } from "lucide-react"
import { BsDashCircle } from "react-icons/bs"
import ApplicationStatus from "@/constants/applicationStatus";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { Tag } from "antd";

const AwardProgressTable = ({ awardMilestone, application }: any) => {
    const transformToMarkdown = (text: string) => {
      return text.replace(/\\n/gi, "\n").replace(/\n/gi, "<br/>");
  }

  const CustomLink = ({ children, href }: any) => {
      return (
        <Link target="_blank" to={href} className="text-blue-400 no-underline">
          {children}
        </Link>
      );
  };

  if (!awardMilestone || awardMilestone.length == 0)
    return <p className="text-center font-semibold text-xl">No award milestone for this scholarship</p>
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "12px",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        {/* Table Header */}
        <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
          <TableRow>
            <TableCell sx={{ color: "#0d47a1", fontWeight: "bold" }}>Milestone</TableCell>
            <TableCell sx={{ color: "#0d47a1", fontWeight: "bold" }}>From Date</TableCell>
            <TableCell sx={{ color: "#0d47a1", fontWeight: "bold" }}>To Date</TableCell>
            <TableCell sx={{ color: "#0d47a1", fontWeight: "bold" }}>Amount</TableCell>
            <TableCell sx={{ color: "#0d47a1", fontWeight: "bold" }}>Status</TableCell>
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {awardMilestone.map((award: any, index: any) => (
          <>
            <TableRow
              key={award.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": { backgroundColor: "#e3f2fd" },
              }}
            >
              <TableCell component="th" scope="row" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FileIcon style={{ color: "#0d47a1" }} />
                {"Progress " + (index + 1)}
              </TableCell>
              <TableCell >
                <Tooltip title={`Uploaded on ${formatDate(award.fromDate)}`}>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <TimerIcon style={{ verticalAlign: "middle", marginRight: 1, color: "#0d47a1" }} />
                    {formatDate(award.fromDate)}
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title={`Uploaded on ${formatDate(award.toDate)}`}>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <TimerIcon style={{ verticalAlign: "middle", marginRight: 1, color: "#0d47a1" }} />
                    {formatDate(award.toDate)}
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell sx={{ color: "#388e3c", fontWeight: "bold" }}>${award.amount}</TableCell>

              {/* Status Cell */}
              <TableCell>
                {(new Date(application.updatedAt) < new Date(award.toDate) && new Date(application.updatedAt) > new Date(award.fromDate)
                ) ? (
                  <>
                    {application.status === "Submitted" && (
                      <div className="flex justify-end gap-2 items-center">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                        </span>
                        <span className="text-yellow-500 font-medium">Reviewing</span>
                      </div>
                    )}
                    {application.status === "Awarded" && (
                      <div className="flex justify-end gap-2 items-center">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-green-500 font-medium">Awarded</span>
                      </div>
                    )}
                    {application.status === "NeedExtend" && (
                      <div className="flex justify-end gap-2 items-center">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </span>
                        <span className="text-orange-500 font-medium">Need Extend</span>
                      </div>
                    )}
                    {application.status == ApplicationStatus.Approved && 
                    <div className="flex justify-end gap-2 items-center">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                        </span>
                        <span className="text-sky-500">Approved</span>
                    </div>
                    }
                    {application.status == ApplicationStatus.Rejected && 
                    <div className="flex justify-end gap-2 items-center">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span className="text-red-500">Rejected</span>
                    </div>
                    }
                  </>
                ) : new Date(application.updatedAt) > new Date(award.toDate) ? (
                  <div className="flex justify-end gap-2 items-center">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>

                    <span className="text-green-500 font-medium">Awarded</span>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2 items-center">
                    <BsDashCircle size={20} color="#9e9e9e" />
                    <span className="text-gray-500 font-medium">Not Started</span>
                  </div>
                )}
              </TableCell>
            </TableRow>
              {/* Accordion Row */}
          <TableRow>
            <TableCell colSpan={5} sx={{ padding: 0 }}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ArrowDropDownCircleRounded />}
                  aria-controls="panel2-content"
                  id={`panel2-header-${index}`}
                >
                <Tooltip title={`Click to expand`}>
                  <Typography sx={{ color: "#0d47a1",fontWeight: "semibold" }} >
                    Submission Guides for Progress {index + 1}
                  </Typography>
                </Tooltip>
                </AccordionSummary>
                <AccordionDetails>
                    <Accordion expanded>
                        <AccordionSummary
                          expandIcon={<ArrowDropDownCircleRounded />}
                          aria-controls="panel2-content"
                          id={`panel2-header-${index}`}
                        >
                        <Tooltip title={`Click to expand`}>
                          <Typography sx={{ color: "#0d47a1",fontWeight: "semibold" }} >
                            Required Files
                          </Typography>
                        </Tooltip>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography className="mb-3">
                              {award.awardMilestoneDocuments && award.awardMilestoneDocuments.length == 0 && "No required files"}
                              {award.awardMilestoneDocuments?.map((document:any, index:number) => (
                                <Tag key={index} color="magenta">{document.type}</Tag>
                              ))}
                          </Typography>
                        </AccordionDetails>
                  </Accordion>
                  <Accordion expanded>
                        <AccordionSummary
                          expandIcon={<ArrowDropDownCircleRounded />}
                          aria-controls="panel2-content"
                          id={`panel2-header-${index}`}
                        >
                        <Tooltip title={`Click to expand`}>
                          <Typography sx={{ color: "#0d47a1",fontWeight: "semibold" }} >
                              Notes
                          </Typography>
                        </Tooltip>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                          <ReactMarkdown 
                                components={{ a: CustomLink }}
                                children={transformToMarkdown(award.note ?? 
                                `No notes for this award milestone`)}
                                rehypePlugins={[rehypeRaw]}
                                remarkPlugins={[remarkGfm]}
                            ></ReactMarkdown>
                      </Typography>

                        </AccordionDetails>
                  </Accordion>

                </AccordionDetails>
              </Accordion>
            </TableCell>
            </TableRow>
        </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default AwardProgressTable
