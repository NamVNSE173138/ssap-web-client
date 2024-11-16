import { formatDate } from "@/lib/date-formatter";
import { getAllMajors } from "@/services/ApiServices/majorService";
import { Autocomplete, Box, Button, Dialog, DialogTitle, InputAdornment, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, styled, TextField } from "@mui/material";
import { ArrowLeftIcon, ArrowRightIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { BiRightArrow } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";

const StyledAutocomplete = styled(Autocomplete)({
  "& .MuiAutocomplete-popupIndicator": {
    display: "none"
  }
});

// Custom Paper component to control dropdown height and scroll
const CustomPaper = (props: any) => (
  <Paper
    {...props}
    style={{
      maxHeight: 200, // Set your desired height here
      overflowY: "auto", // Enables scrolling when options exceed max height
    }}
  />
);

const AssignExpertDialog = ({ open, onClose, experts }: any) => {
    const navigate = useNavigate();
    const [majors, setMajors] = useState<any>([]);
    const [selectedMajor, setSelectedMajor] = useState<any>(null);

    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

  const fetchMajors = async () => {
    try {
      const response = await getAllMajors();
      //console.log(response);
      if (response.statusCode == 200) {
        setMajors(response.data.items);
      } else {
        setError("Failed to get applicants");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedMajor(null)
    fetchMajors();
  }, []);
    
  return (
    <Dialog onClose={() => {onClose(); setSelectedMajor(null)}} open={open} fullWidth>
      <DialogTitle className="flex items-center gap-5 flex-wrap">
        {selectedMajor && 
            <Button startIcon={<ArrowLeftIcon/>} onClick={() => setSelectedMajor(null)}>
                Back
            </Button>
        }
        <div>Assign Expert</div>
        {selectedMajor && 
            <div>Major in {selectedMajor.name}</div>
        }
      </DialogTitle>
        {!selectedMajor && (<>
            {experts.length === 0 && 
            <p className="p-10 text-center text-gray-500 font-semibold text-xl">
                No applicants applied for this scholarship
            </p>}
            <List sx={{ pt: 0 }}>
                <p className="text-lg font-semibold pl-5">
                    Choose the major of the expert you want to review applications
                </p>
                {majors.length === 0 && 
                <p className="p-10 text-center text-gray-500 font-semibold text-xl">
                    No majors
                </p>}
                {majors && majors.map((major:any) => (
                  <ListItem disableGutters key={major.id}>
                    <ListItemButton onClick={() => setSelectedMajor(major)}>
                      <ListItemText primary={major.name} />
                      <ArrowRightIcon/>
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
        </>)}
        {experts && selectedMajor &&
        <div className="h-full">
         <StyledAutocomplete
            sx={{ height: "200px"  }}
            open={open}
            disableCloseOnSelect
            options={experts}
            //PaperComponent={CustomPaper}
            getOptionLabel={(option: any) => option.username}
            renderOption={(props: any, option: any) => {
                const { key, ...optionProps } = props;
                return (
                  <Box
                    key={key}
                    component="li"
                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                    {...optionProps}
                  >
                   <div className="flex w-full justify-between">
                       <div className="flex items-center gap-5">
                            <img
                              loading="lazy"
                              width="20"
                              height="20"
                              className="rounded-full"
                              srcSet={option.avatarUrl ?? "https://github.com/shadcn.png"}
                              src={option.avatarUrl ?? "https://github.com/shadcn.png"}
                              alt=""
                            />
                            {option.username}
                        </div>
                        <Link target="_blank" to={`/profile/${option.id}`} className="text-blue-500 underline">
                            View profile
                        </Link>
                    </div>
                  </Box>
                );
              }}
            renderInput={(params) => <TextField {...params} 
                label="Search" 
                InputProps={{
                    ...params.InputProps,
                    startAdornment:(
                        <InputAdornment position="start">
                            <SearchIcon/>
                        </InputAdornment>
                    )
                }}
            />}
          /> 
          <div className="w-full flex justify-end pr-5 mb-5">
          <Button onClick={() => {}} 
            className="w-1/3"
            variant="contained">Assign</Button>
          </div>
          </div>
        }
    </Dialog>
  )
}

export default AssignExpertDialog;
