import { Dialog, DialogTitle, List, Paper } from "@mui/material";
import { IoIosAddCircleOutline } from "react-icons/io";

import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import AddAwardDialog from "./add-award-dialog";
import { format } from "date-fns";

const AwardMilestoneDialog = ({
  open,
  onClose,
  awardMilestones,
  reviewMilestones,
  fetchAwardMilestones,
  scholarship,
}: any) => {
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  const handleOpenAdd = (openAdd: boolean) => {
    onClose(!openAdd);
    setOpenAdd(openAdd);
  };

  return (
    <>
      <Dialog
        onClose={() => onClose(false)}
        open={open}
        fullWidth
        style={{ zIndex: 40 }}
      >
        <DialogTitle className="text-2xl font-semibold flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white">
          <div className="flex gap-2 font-bold">
            <FaCalendarAlt className="text-sky-500 text-3xl" />
            Award Milestones
          </div>
        </DialogTitle>

        <div className="w-full flex justify-between items-center p-4">
          <p className="text-xl text-sky-400">
            Num. of Award Milestones: {scholarship?.numberOfAwardMilestones}
          </p>
          <button
            onClick={() => handleOpenAdd(true)}
            disabled={
              awardMilestones.length >= scholarship?.numberOfAwardMilestones
            }
            className="w-auto flex text-blue-600 items-center disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:text-gray-500 hover:bg-blue-500 hover:text-white transition-all duration-200 gap-3 px-6 py-3 bg-blue-100 rounded-lg shadow-md hover:shadow-xl"
          >
            <IoIosAddCircleOutline className="text-3xl" />
            <p className="text-xl">Add Award Milestone</p>
          </button>
        </div>

        <List sx={{ pt: 0 }}>
          {awardMilestones.length === 0 && (
            <p className="p-10 text-center text-gray-500 font-semibold text-xl">
              No award milestones for this scholarship
            </p>
          )}

          {awardMilestones &&
            awardMilestones.map((milestone: any, index: number) => (
              <Paper
                elevation={3}
                key={milestone.id}
                className="my-5 mx-3 p-6 flex gap-4 justify-between items-center rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex flex-col">
                  <p className="font-bold text-lg text-gray-800">
                    Progress {index + 1}
                  </p>

                  <div className="flex gap-2 items-center mt-2">
                    <p className="font-semibold text-gray-700">From:</p>
                    <p className="text-gray-600">
                      {format(new Date(milestone.fromDate), "MM/dd/yyyy")}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center mt-2">
                    <p className="font-semibold text-gray-700">To:</p>
                    <p className="text-gray-600">
                      {format(new Date(milestone.toDate), "MM/dd/yyyy")}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center mt-2">
                    <p className="font-semibold text-gray-700">Amount:</p>
                    <p className="text-green-600 font-semibold">
                      $ {milestone.amount}
                    </p>
                  </div>
                </div>

                <span className="flex justify-end gap-2 items-center">
                  <span className="relative flex h-3 w-3">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${
                        new Date() > new Date(milestone.fromDate)
                          ? "green"
                          : "gray"
                      }-500 opacity-75`}
                    ></span>
                    <span
                      className={`relative inline-flex rounded-full h-3 w-3 bg-${
                        new Date() > new Date(milestone.fromDate)
                          ? "green"
                          : "gray"
                      }-500`}
                    ></span>
                  </span>
                  <span
                    className={`text-${
                      new Date() > new Date(milestone.fromDate)
                        ? "green"
                        : "gray"
                    }-500 font-medium`}
                  >
                    {new Date() > new Date(milestone.fromDate) &&
                    new Date() < new Date(milestone.toDate)
                      ? "Progressing"
                      : new Date() > new Date(milestone.toDate)
                      ? "Completed"
                      : "Not started"}
                  </span>
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

      {awardMilestones && (
        <AddAwardDialog
          isOpen={openAdd}
          awardMilestones={awardMilestones}
          reviewMilestones={reviewMilestones}
          scholarship={scholarship}
          setIsOpen={handleOpenAdd}
          fetchAwards={fetchAwardMilestones}
        />
      )}
    </>
  );
};

export default AwardMilestoneDialog;
