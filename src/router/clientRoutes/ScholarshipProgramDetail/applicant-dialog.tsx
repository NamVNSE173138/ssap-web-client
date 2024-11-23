import ApplicationStatus from "@/constants/applicationStatus";
import { formatDate } from "@/lib/date-formatter";
import { Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Tab, Tabs } from "@mui/material";
import { Button } from "@radix-ui/themes";
import { sub } from "date-fns";
import { useState } from "react";
import { IoIosAddCircleOutline, IoIosEye, IoMdPerson } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AccountDialog = ({ open, onClose, applications, scholarship }: any) => {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };
    const winnersApplications = applications.filter((application: any) => application.status == "Approved"
     || application.status == "Awarded"
     || (new Date(application.updatedAt) > new Date(scholarship.deadline))
     );

    const submittingApplications = applications.filter((application: any) => application.status == "Submitted"
    && new Date(application.updatedAt) < new Date(scholarship.deadline));

    const statusColor = {
        [ApplicationStatus.Submitted]: "blue",
        [ApplicationStatus.Awarded]: "green",
        [ApplicationStatus.Approved]: "blue",
        [ApplicationStatus.Rejected]: "red",
        [ApplicationStatus.NeedExtend]: "yellow",
        [ApplicationStatus.Reviewing]: "yellow",
      }


  return (
    <Dialog onClose={onClose} open={open} fullWidth>
  <DialogTitle className="flex justify-between items-center bg-gradient-to-r from-blue-500 via-teal-400 to-blue-400 text-white p-5 shadow-md">
    <div className="text-2xl font-bold flex items-center gap-3">
      <IoMdPerson className="text-3xl" />
      Applied Applicants
    </div>

    {applications.length !== 0 && (
      <button
        onClick={() => navigate(`/funder/choose-winners/${scholarship.id}`)}
        className="flex items-center gap-3 bg-white text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 px-5 py-2 rounded-lg shadow-md active:scale-95"
      >
        <IoIosAddCircleOutline className="text-2xl" />
        <span className="text-lg font-medium">Choose Winners</span>
      </button>
    )}
  </DialogTitle>

  <List sx={{ pt: 0 }} className="bg-gray-100 rounded-b-lg">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="Applications Tabs"
          className="bg-white shadow-sm"
          indicatorColor="primary"
          textColor="inherit"
          centered
        >
          <Tab label="Submitting Applications" sx={{ textTransform: "none", color: "blue", fontWeight: "bold" }} />
          <Tab label="Winners Applications" sx={{ textTransform: "none", color: "green", fontWeight: "bold" }} />
        </Tabs>
    {(selectedTab == 0 ? submittingApplications : winnersApplications).length === 0 ? (
      
      <p className="p-10 text-center text-gray-500 font-semibold text-xl">
        No applications in this tab
      </p>
    ) : (
      (selectedTab == 0 ? submittingApplications : winnersApplications).map((app: any) => (
        <ListItem
          disableGutters
          key={app.id}
          className="hover:bg-gray-200 transition duration-300 rounded-lg mx-2 my-1"
        >
          
              
          <ListItemButton className="flex items-center gap-4">
            <ListItemAvatar>
              <img
                className="rounded-full w-12 h-12 shadow-md"
                src={app.applicant.avatarUrl || "https://via.placeholder.com/150"}
                alt="avatar"
              />
            </ListItemAvatar>
            <div className="flex flex-col flex-grow">
              <ListItemText
                primary={
                  <span className="text-lg font-semibold text-gray-700">
                    {app.applicant.username}
                  </span>
                }
              />
              <ListItemText
                primary={
                  <span className="text-sm text-gray-500">
                    Applied on {formatDate(app.appliedDate)}
                  </span>
                }
              />
            </div>
            <span className="flex justify-end gap-2 items-center">
                        <span className="relative flex h-3 w-3">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${statusColor[app.status]}-500 opacity-75`}></span>
                          <span className={`relative inline-flex rounded-full h-3 w-3 bg-${statusColor[app.status]}-500`}></span>
                        </span>
                        <span className={`text-${statusColor[app.status]}-500 font-medium`}>{app.status}</span>
                      </span>
            <Button
              onClick={() => navigate(`/funder/application/${app.id}`)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
            >
              <IoIosEye className="text-lg" />
              View Application
            </Button>
          </ListItemButton>
        </ListItem>
      ))
    )}
  </List>
</Dialog>

  )
}

export default AccountDialog;
