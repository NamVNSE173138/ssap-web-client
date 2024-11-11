import { formatDate } from "@/lib/date-formatter";
import { Button, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AccountDialog = ({ open, onClose, applications, scholarship }: any) => {
    const navigate = useNavigate();
  return (
    <Dialog onClose={onClose} open={open} fullWidth>
      <DialogTitle className="flex justify-between">
        <div>Applied Applicants</div>

        {applications.length != 0 && 
        <button
          onClick={() => navigate(`/funder/choose-winners/${scholarship.id}`)}
          className="flex justify-start items-center hover:bg-blue-400 hover:text-white transition-all duration-200 gap-4 px-4 py-2 bg-white rounded-lg active:scale-95"
        >
          <IoIosAddCircleOutline className="text-3xl text-blue-500" />
          <p className="text-xl text-blue-600">Choose Winners</p>
        </button>}
      </DialogTitle>
      <List sx={{ pt: 0 }}>
        {applications.length === 0 && 
        <p className="p-10 text-center text-gray-500 font-semibold text-xl">
            No applicants applied for this scholarship
        </p>}
        {applications && applications.map((app:any) => (
          <ListItem disableGutters key={app.id}>
            <ListItemButton disableRipple onClick={() => {}}>
              <ListItemAvatar>
                <img className="rounded-full w-10 h-10" 
                    src={app.applicant.avatarUrl} 
                    alt="avatar" />
              </ListItemAvatar>
              <ListItemText primary={app.applicant.username} />
              <ListItemText primary={formatDate(app.appliedDate)} />
              <Button onClick={() => navigate(`/funder/application/${app.id}`)} 
                variant="contained">View application</Button>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  )
}

export default AccountDialog;
