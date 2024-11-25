import { formatDate } from "@/lib/date-formatter";
import { Box, Button, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper } from "@mui/material";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import AddMilestoneModal from "./add-milestone-dialog";
import { useState } from "react";
import { FaCalendarAlt, FaEye } from "react-icons/fa";
import AddAwardDialog from "./add-award-dialog";

const AwardMilestoneDialog = ({ open, onClose, awardMilestones, reviewMilestones, fetchAwardMilestones, scholarship }: any) => {
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  const handleOpenAdd = (openAdd: boolean) => {
    onClose(!openAdd);
    setOpenAdd(openAdd);
  }

  return (<>
    <Dialog onClose={() => onClose(false)} open={open} fullWidth style={{ zIndex: 40 }}>
      <DialogTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white">
        <FaCalendarAlt className="text-sky-500 text-3xl" />
        Award Milestones
      </DialogTitle>

      <div className="w-full flex justify-end p-4">
        <button
          onClick={() => handleOpenAdd(true)}
          className="w-auto flex items-center hover:bg-blue-500 hover:text-white transition-all duration-200 gap-3 px-6 py-3 bg-blue-100 rounded-lg shadow-md hover:shadow-xl"
        >
          <IoIosAddCircleOutline className="text-3xl text-blue-500" />
          <p className="text-xl text-blue-600">Add Award Milestone</p>
        </button>
      </div>

      <List sx={{ pt: 0 }}>
        {awardMilestones.length === 0 && (
          <p className="p-10 text-center text-gray-500 font-semibold text-xl">
            No award milestones for this scholarship
          </p>
        )}

        {awardMilestones && awardMilestones.map((milestone: any, index: number) => (
          <Paper elevation={3} key={milestone.id} className="my-5 mx-3 p-6 flex gap-4 justify-between items-center rounded-lg shadow-lg hover:shadow-xl transition-all">
            <div className="flex flex-col">
              <p className="font-bold text-lg text-gray-800">Progress {index + 1}</p>

              <div className="flex gap-2 items-center mt-2">
                <p className="font-semibold text-gray-700">From:</p>
                <p className="text-gray-600">{formatDate(milestone.fromDate)}</p>
              </div>

              <div className="flex gap-2 items-center mt-2">
                <p className="font-semibold text-gray-700">To:</p>
                <p className="text-gray-600">{formatDate(milestone.toDate)}</p>
              </div>
              <div className="flex gap-2 items-center mt-2">
                <p className="font-semibold text-gray-700">Amount:</p>
                <p className="text-green-600 font-semibold">$ {milestone.amount}</p>
              </div>
            </div>

            <span className="flex justify-end gap-2 items-center">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${new Date() > new Date(milestone.fromDate) && new Date() < new Date(milestone.toDate) ? "green" : "gray"}-500 opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 bg-${new Date() > new Date(milestone.fromDate) && new Date() < new Date(milestone.toDate) ? "green" : "gray"}-500`}></span>
                </span>
                <span className={`text-${new Date() > new Date(milestone.fromDate) && new Date() < new Date(milestone.toDate) ? "green" : "gray"}-500 font-medium`}>{new Date() > new Date(milestone.fromDate) &&
                    new Date() < new Date(milestone.toDate) ? "Happening" : "Not started"}</span>
              </span>

            {/*<Button
              onClick={() => navigate(`/funder/milestone/${milestone.id}`)}
              variant="contained"
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all"
            >
              <FaEye className="text-white" />
              View Milestone
            </Button>*/}
          </Paper>
        ))}
      </List>
    </Dialog>

    {awardMilestones && <AddAwardDialog
      isOpen={openAdd}
      awardMilestones={awardMilestones}
      reviewMilestones={reviewMilestones}
      scholarship={scholarship}
      setIsOpen={handleOpenAdd}
      fetchAwards={fetchAwardMilestones}
    />}
  </>
  )
}

export default AwardMilestoneDialog;