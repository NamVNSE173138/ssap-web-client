import { formatDate } from "@/lib/date-formatter";
import { Button, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AccountDialog = ({ open, onClose, applications }: any) => {
    const navigate = useNavigate();
  return (
    <Dialog onClose={onClose} open={open} fullWidth>
      <DialogTitle>Applied Applicants</DialogTitle>
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
