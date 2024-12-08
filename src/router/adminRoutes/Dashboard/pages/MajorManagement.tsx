import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  IconButton,
  Tooltip,
  
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  CircularProgress,
  
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse,
  
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import {  getMajors } from "@/services/ApiServices/majorService";
import { GridArrowDownwardIcon } from "@mui/x-data-grid";
import React from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IoMdAddCircle } from "react-icons/io";
import AddMajorModal from "./MajorManagement/AddMajorForm";
import EditMajorModal from "./MajorManagement/EditMajorForm";
import EditMajorSkillModal from "./MajorManagement/EditMajorSkillForm";
import { getAllSkills } from "@/services/ApiServices/skillService";

const MajorManagement = () => {
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(false);

  const [openRows, setOpenRows] = useState<any>({});

  const [openAddMajor, setOpenAddMajor] = useState<boolean>(false);

  const [openEditMajor, setOpenEditMajor] = useState<boolean>(false);
  const [currentMajor, setCurrentMajor] = useState<Major | null>(null);


  const [openEditMajorSkill, setOpenEditMajorSkill] = useState<boolean>(false);
  const [skills, setSkills] = useState<any>([]);

  const [parentMajorId, setParentMajorId] = useState<any>(null);


  const handleToggle = (rowId: any) => {
    setOpenRows((prevState: any) => ({
      ...prevState,
      [rowId]: !prevState[rowId],
    }));
  };

  const TABLE_HEAD = [
    "ID", "Name", "Description", "Actions"
  ];

  const SKILL_TABLE_HEAD = [
    "ID", "Name", "Description", "Type"
  ];

  const fetchMajors = async () => {
    setLoading(true);
    await getAllSkills()
      .then((data) => {
          setSkills(data.data);
      })
    await getMajors()
      .then((data) => {
        setMajors(data.data);
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMajors();
  }, []);

  const renderTable = () => (
    <Card className="h-full w-full shadow-lg rounded-lg">
      <Typography variant="h6" component="div" color="primary" sx={{ mt: 2, ml: 2, fontWeight: 'bold' }}>

      </Typography>

      <TableContainer sx={{ marginTop: 2, boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              {TABLE_HEAD.map((head) => (
                <TableCell key={head} sx={{ fontWeight: 'bold', color: '#1c1c1c' }}>
                  <TableSortLabel className="font-semibold">{head}</TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {/*JSON.stringify(majors)*/}
            {majors.map((account) => (
              <React.Fragment key={account.id}>
                <TableRow key={account.id} onClick={() => handleToggle(account.id)} className="cursor-pointer" sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                  {/*<TableCell>{index + 1}</TableCell>*/}
                  <TableCell>{account.id}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tooltip title="Edit Major">
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation(); // Prevents the TableRow's onClick event from firing
                                setCurrentMajor(account);
                                setOpenEditMajor(true);
                            }}
                          sx={{ color: 'blue', '&:hover': { color: '#1976d2' } }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Expand">
                        <IconButton
                          sx={{ color: 'gray', '&:hover': { color: 'gray' } }}
                        >
                          <ArrowDown />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>

                </TableRow>
                {/* Collapsible content */}

                <TableRow>
                  <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={openRows[account.id]} timeout={300} 
                        unmountOnExit 
                        className="py-3"
                        sx={{ transition: "all 0.3s ease-in-out" }}>
                      <Accordion >
                        <AccordionSummary
                          expandIcon={<GridArrowDownwardIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                        <div className="flex w-full items-center justify-between">
                          <Typography className="font-semibold text-sky-500 ">Submajors</Typography>
                          <Button onClick={(e) => {
                              e.stopPropagation(); // Prevents the TableRow's onClick event from firing
                              setParentMajorId(account.id);
                              setOpenAddMajor(true)
                              }}
                              className="bg-sky-500 hover:bg-sky-600 gap-2">
                            <IoMdAddCircle />
                            Add Submajor
                          </Button>
                        </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <TableContainer sx={{ marginTop: 2, boxShadow: 3, borderRadius: 2 }}>
                            <Table>
                              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow>
                                  {TABLE_HEAD.map((head) => (
                                    <TableCell key={head} sx={{ fontWeight: 'bold', color: '#1c1c1c' }}>
                                      <TableSortLabel className="font-semibold">{head}</TableSortLabel>
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>

                              <TableBody>
                                {/*JSON.stringify(majors)*/}
                                {account.subMajors.map((submajor: any, _subIndex: number) => (
                                  <TableRow key={submajor.id} sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                                    <TableCell>{submajor.id}</TableCell>
                                    <TableCell>{submajor.name}</TableCell>
                                    <TableCell>{submajor.description}</TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Tooltip title="Edit Major">
                                          <IconButton
                                            onClick={() => {
                                                setOpenEditMajor(true)
                                                setCurrentMajor(submajor)
                                                }}
                                            sx={{ color: 'blue', '&:hover': { color: '#1976d2' } }}
                                          >
                                            <EditIcon />
                                          </IconButton>
                                        </Tooltip>

                                      </div>
                                    </TableCell>


                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>

                        </AccordionDetails>
                      </Accordion>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<GridArrowDownwardIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >

                        <div className="flex w-full items-center justify-between">
                          <Typography className="font-semibold text-sky-500 ">Skills</Typography>

                          <Button onClick={(e) => {
                                e.stopPropagation(); // Prevents the TableRow's onClick event from firing
                                setCurrentMajor(account);
                                setOpenEditMajorSkill(true);
                            }}
                              className="bg-sky-500 hover:bg-sky-600 gap-2">
                            <IoMdAddCircle />
                            Edit Skills
                          </Button>
                        </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <TableContainer sx={{ marginTop: 2, boxShadow: 3, borderRadius: 2 }}>
                            <Table>
                              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow>
                                  {SKILL_TABLE_HEAD.map((head) => (
                                    <TableCell key={head} sx={{ fontWeight: 'bold', color: '#1c1c1c' }}>
                                      <TableSortLabel className="font-semibold">{head}</TableSortLabel>
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>

                              <TableBody>
                                {/*JSON.stringify(majors)*/}
                                {account.skills.map((skills: any, _subIndex: number) => (
                                  <TableRow key={skills.id} sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                                    <TableCell>{skills.id}</TableCell>
                                    <TableCell>{skills.name}</TableCell>
                                    <TableCell>{skills.description}</TableCell>
                                    <TableCell>{skills.type}</TableCell>

                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>

                        </AccordionDetails>
                      </Accordion>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );

  return (
    <>
      <div className="flex justify-between">
        <Typography variant="h4" component="div" color="primary" sx={{ ml: 2, mb: 3 }}>
            Major Management
        </Typography>

        <Button onClick={() => setOpenAddMajor(true)} className="bg-sky-500 hover:bg-sky-600 gap-2">
          <IoMdAddCircle />
          Add Major
        </Button>
      </div>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {renderTable()}
        </>
      )}

      {majors && (
        <AddMajorModal
          isOpen={openAddMajor}
          setIsOpen={(open: boolean) => setOpenAddMajor(open)}
          parentMajorId={parentMajorId}
          setParentMajorId={(parentMajorId: number|null) => setParentMajorId(parentMajorId)}
          fetchMajor={async () => {
            fetchMajors();
          }}
        />
      )}

      {majors && (
        <EditMajorModal
          isOpen={openEditMajor}
          setIsOpen={(open: boolean) => setOpenEditMajor(open)}
          major={currentMajor}
          fetchMajor={async () => {
            fetchMajors();
          }}
        />
      )}

      {majors && (
        <EditMajorSkillModal
          isOpen={openEditMajorSkill}
          setIsOpen={(open: boolean) => setOpenEditMajorSkill(open)}
          major={currentMajor}
          skillOptions={skills.map((skill: any) => ({label: skill.name, value: skill.id}))}
          fetchMajor={async () => {
            fetchMajors();
          }}
        />
      )}


      </>
  );
};

export default MajorManagement;

type Major = {
  id: string;
  name: string;
  description: string;
  subMajors: any[];
  skills: any[];

};
