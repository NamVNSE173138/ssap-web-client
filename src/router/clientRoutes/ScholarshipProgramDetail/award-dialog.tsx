import ApplicationStatus from "@/constants/applicationStatus";
import { Avatar, Button, Dialog, DialogTitle, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { FaRegEye, FaTrophy, FaUserCircle } from "react-icons/fa";
import { IoIosAddCircleOutline, IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";

interface AwardDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  winningApplications: any[];
}

const statusColor = {
    [ApplicationStatus.Submitted]: "blue",
    [ApplicationStatus.Awarded]: "green",
    [ApplicationStatus.Approved]: "blue",
    [ApplicationStatus.Rejected]: "red",
    [ApplicationStatus.NeedExtend]: "yellow",
    [ApplicationStatus.Reviewing]: "yellow",
  }

const AwardDialog = ({ isOpen, setIsOpen, winningApplications }: AwardDialogProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      fullWidth
      maxWidth="md"
      style={{ zIndex: 40 }}
    >
      <DialogTitle className="flex items-center justify-between gap-5 bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6">
        <div className="flex items-center gap-4">
          <FaTrophy className="text-3xl text-sky-500" />
          <span className="font-bold text-2xl">Award Milestones</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-3xl text-white hover:text-gray-300 transition-all duration-200"
        >
          <IoMdClose />
        </button>
      </DialogTitle>

      <div className="p-6">
        <span className="font-bold text-xl text-sky-500">Winners Applications</span>
        {!winningApplications || !winningApplications.length ? (
          <p className="text-center text-xl text-gray-600">No winning applications</p>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {winningApplications.map((application: any, index: number) => (
              <div key={index}>
                <ListItem alignItems="flex-start" className="hover:bg-blue-50 transition duration-200 rounded-lg">
                  <ListItemAvatar>
                    <Avatar alt={application.applicant.username} src={application.applicant.avatarUrl || "https://github.com/shadcn.png"} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <div className="flex items-center gap-2">
                        <FaUserCircle className="text-blue-500 text-lg" />
                        <span className="font-semibold text-lg text-gray-800">{application.applicant.username}</span>
                        
                      </div>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: 'text.primary', display: 'inline' }}
                        >
                          {application.applicant.email}
                        </Typography>
                        
                      </>
                    }
                  />
                      <span className="flex justify-end gap-2 items-center mr-[45%] mt-[2%]">
                        <span className="relative flex h-3 w-3">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${statusColor[application.status]}-500 opacity-75`}></span>
                          <span className={`relative inline-flex rounded-full h-3 w-3 bg-${statusColor[application.status]}-500`}></span>
                        </span>
                        <span className={`text-${statusColor[application.status]}-500 font-medium`}>{application.status}</span>
                      </span>

                      
                  <Link
                    target="_blank"
                    to={`/funder/application/${application.id}`}
                    className="text-blue-600 underline hover:text-blue-800 flex items-center gap-2"
                  >
                    <FaRegEye className="text-blue-500" />
                    View Award Progress
                  </Link>
                </ListItem>
                <Divider variant="fullWidth" component="li" />
              </div>
            ))}
          </List>
        )}
      </div>

    </Dialog>
  );
};

export default AwardDialog;
