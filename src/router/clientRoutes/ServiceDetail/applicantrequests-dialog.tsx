import { formatDate } from "@/lib/date-formatter";
import { Button, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AccountApplicantDialog = ({ open, onClose, applications }: any) => {
    const navigate = useNavigate();
  
    return (
      <Dialog onClose={onClose} open={open} fullWidth>
        <DialogTitle>Applicants Request Information</DialogTitle>
        <List sx={{ pt: 0 }}>
          {applications && applications.length > 0 ? (
            applications.map((app: any) => (
              <ListItem disableGutters key={app.id}>
                <ListItemButton disableRipple onClick={() => {}}>
                  <ListItemAvatar>
                    <img className="rounded-full w-10 h-10" 
                        src={app.applicant.avatarUrl} 
                        alt="avatar" />
                  </ListItemAvatar>
                  <ListItemText primary={app.applicant.username} />
                  <ListItemText primary={formatDate(app.requestDate)} />
                  <Button onClick={() => navigate(`/provider/requestinformation/${app.id}`)}
                    variant="contained">View request information</Button>
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No request" className="text-center" />
            </ListItem>
          )}
        </List>
      </Dialog>
    );
};

export default AccountApplicantDialog;
