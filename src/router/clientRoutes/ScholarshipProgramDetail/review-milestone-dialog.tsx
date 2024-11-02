import { formatDate } from "@/lib/date-formatter";
import { Box, Button, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper } from "@mui/material";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import AddMilestoneModal from "./add-milestone-dialog";
import { useState } from "react";

const ReviewMilestoneDialog = ({ open, onClose, reviewMilestones, fetchReviewMilestones }: any) => {
    const navigate = useNavigate();
    const [openAdd, setOpenAdd] = useState<boolean>(false);

    const handleOpenAdd = (openAdd:boolean) => {
        onClose(!openAdd);
        setOpenAdd(openAdd);
    }

  return (<>
    {<Dialog onClose={() => onClose(false)} open={open} fullWidth style={{ zIndex: 40 }}>
      <DialogTitle>Review Milestones</DialogTitle>
      <div className="w-full flex justify-end">
          <button
            onClick={() => handleOpenAdd(true)}
            className="w-auto flex justify-start items-center hover:bg-blue-400 hover:text-white transition-all duration-200 gap-4 px-4 py-2 bg-white rounded-lg active:scale-95"
           >
            <IoIosAddCircleOutline className="text-3xl text-blue-500" />
            <p className="text-xl text-blue-600">Add Review Milestone</p>
          </button>
      </div>
      <List sx={{ pt: 0 }}>
        {reviewMilestones.length === 0 && 
        <p className="p-10 text-center text-gray-500 font-semibold text-xl">
            No review milestones for this scholarship
        </p>}
        {reviewMilestones && reviewMilestones.map((milestone:any) => (
          <Paper elevation={3} key={milestone.id} className="my-5 mx-3 p-5 flex gap-2 justify-between items-center">
              <div>
                  <p className="font-bold text-lg">{milestone.description}</p>
                  <div className="flex gap-2">
                      <p className="font-semibold">From:</p>
                      <p>{formatDate(milestone.fromDate)}</p>
                  </div>
                  <div className="flex gap-2">
                      <p className="font-semibold">To:</p>
                      <p>{formatDate(milestone.toDate)}</p>
                  </div>
              </div>
              <Button className="h-1/3" onClick={() => navigate(`/funder/milestone/${milestone.id}`)} 
                variant="contained">View milestone</Button>
          </Paper>
        ))}
      </List>

    </Dialog>}

    <AddMilestoneModal
          isOpen={openAdd}
          setIsOpen={handleOpenAdd}
          fetchMilestones={fetchReviewMilestones}
        />
       </>
  )
}

export default ReviewMilestoneDialog;
