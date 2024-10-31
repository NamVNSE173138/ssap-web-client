import { formatDate } from "@/lib/date-formatter";
import { Autocomplete, Box, Button, Dialog, DialogTitle, InputAdornment, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, styled, TextField } from "@mui/material";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    
  return (
    <Dialog onClose={onClose} open={open} fullWidth>
      <DialogTitle>Assign Expert</DialogTitle>
        {experts.length === 0 && 
        <p className="p-10 text-center text-gray-500 font-semibold text-xl">
            No applicants applied for this scholarship
        </p>}
        {experts && 
        <div className="h-full">
         <StyledAutocomplete
            sx={{ height: "200px"  }}
            open
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
