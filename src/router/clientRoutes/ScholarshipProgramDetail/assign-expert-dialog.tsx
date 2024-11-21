import { formatDate } from "@/lib/date-formatter";
import { getAllMajors } from "@/services/ApiServices/majorService";
import { Autocomplete, Box, Button, Dialog, DialogTitle, InputAdornment, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, styled, TextField } from "@mui/material";
import { ArrowLeftIcon, ArrowRightIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { BiRightArrow } from "react-icons/bi";
import { FaBook, FaCheckCircle, FaUniversity, FaUsers } from "react-icons/fa";
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
    <Dialog onClose={() => { onClose(); setSelectedMajor(null) }} open={open} fullWidth maxWidth="md">
      <DialogTitle className="flex items-center justify-between gap-5 flex-wrap bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 shadow-lg">
        <div className="flex items-center gap-4">
          {selectedMajor &&
            <Button
              startIcon={<ArrowLeftIcon />}
              onClick={() => setSelectedMajor(null)}
              className="bg-transparent text-white hover:bg-white hover:text-black transition duration-200 rounded-full p-2"
            >
              Back
            </Button>
          }
          <div className="font-bold text-2xl text-shadow-lg">Assign Expert</div>
        </div>
        {selectedMajor &&
          <div className="font-semibold text-lg text-gray-200">Major: {selectedMajor.name}</div>
        }
      </DialogTitle>

      {!selectedMajor ? (
        <>
          {experts.length === 0 && (
            <p className="p-10 text-center text-gray-500 font-semibold text-xl">
              No applicants applied for this scholarship
            </p>
          )}

          <List sx={{ pt: 0 }} className="space-y-5">
          <p className="text-xl font-bold flex items-center justify-center bg-gradient-to-r text-blue-500 p-4 rounded-lg shadow-lg mt-5 mb-5">
  <FaBook className="mr-3 text-blue text-3xl" />
  <span>Choose the major of the expert you want to review applications</span>
</p>


            {majors.length === 0 && (
              <p className="p-10 text-center text-gray-500 font-semibold text-xl">
                No majors available
              </p>
            )}

            {majors && majors.map((major: any) => (
              <ListItem
                disableGutters
                key={major.id}
                className="hover:bg-blue-50 transition duration-300 rounded-lg shadow-sm"
              >
                <ListItemButton onClick={() => setSelectedMajor(major)} className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <FaUniversity className="text-blue-600 text-2xl" />
                    <ListItemText
                      primary={major.name}
                      className="text-lg font-medium text-gray-800"
                    />
                  </div>
                  <ArrowRightIcon className="text-blue-500 text-xl" />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <div className="h-full p-5 space-y-4">
          <StyledAutocomplete
            sx={{ height: "200px" }}
            open={open}
            disableCloseOnSelect
            options={experts}
            getOptionLabel={(option: any) => option.username}
            renderOption={(props, option: any) => {
              const { key, ...optionProps } = props;
              return (
                <Box key={key} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...optionProps}>
                  <div className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-5">
                      <img
                        loading="lazy"
                        width="35"
                        height="35"
                        className="rounded-full border-2 border-gray-200"
                        src={option.avatarUrl ?? "https://github.com/shadcn.png"}
                        alt=""
                      />
                      <span className="font-semibold text-lg">{option.username}</span>
                    </div>
                    <a href={`/profile/${option.id}`} target="_blank" rel="noopener noreferrer">
                      <h2 className="flex items-center text-base font-semibold text-gray-800 bg-gradient-to-r from-cyan-500 to-blue-500 p-1 rounded-lg shadow-xl">
                        <FaUsers className="mr-3 text-white text-2xl" />
                        <span className="text-white">View Profile</span>
                      </h2>
                    </a>

                  </div>
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Experts"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                className="bg-gray-100 rounded-full"
              />
            )}
          />
          <br></br>
          <div className="w-full flex justify-end mr-10 mb-5">
            <Button
              onClick={() => { }}
              className="w-2/5 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-2 rounded-lg shadow-xl hover:from-cyan-400 hover:to-blue-400 transition duration-300"
              variant="contained"
            >
              <FaCheckCircle className="mr-3 text-white text-lg" />
              <span className="text-white text-lg font-semibold">Assign Expert</span>
            </Button>
          </div>

        </div>
      )}
    </Dialog>
  )
}

export default AssignExpertDialog;
