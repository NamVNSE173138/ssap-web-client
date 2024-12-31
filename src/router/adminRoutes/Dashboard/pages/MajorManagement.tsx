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
  Paper,

} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { getMajors } from "@/services/ApiServices/majorService";
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
    <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
      <div style={{ marginTop: 1, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        {/* Header Row */}
        <div
          style={{
            display: 'flex',
            fontWeight: 'bold',
            backgroundColor: '#f1f1f1',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '10px',
          }}
        >
          <div style={{ flex: 0.5 }}>#</div>
          <div style={{ flex: 2 }}>Name</div>
          <div style={{ flex: 2 }}>Description</div>
          <div style={{ flex: 1 }}>Actions</div>
        </div>

        {/* Data Rows */}
        {majors.map((account) => (
          <React.Fragment key={account.id}>
            <div
              onClick={() => handleToggle(account.id)}
              style={{
                display: 'flex',
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: '#fff',
                borderBottom: '1px solid #ddd',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
            >
              <div style={{ flex: 0.5 }}>{account.id}</div>
              <div style={{ flex: 2 }}>{account.name}</div>
              <div style={{ flex: 2 }}>{account.description}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Tooltip title="Edit Major">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents the row click event from firing
                        setCurrentMajor(account);
                        setOpenEditMajor(true);
                      }}
                      sx={{ color: 'blue', '&:hover': { color: '#1976d2' } }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Expand">
                    <IconButton sx={{ color: 'gray', '&:hover': { color: 'gray' } }}>
                      <ArrowDown />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Collapsible Content */}
            <div style={{ paddingLeft: '40px' }}>
              <Collapse in={openRows[account.id]} timeout={300} unmountOnExit>
                <Accordion>
                  <AccordionSummary expandIcon={<GridArrowDownwardIcon />} aria-controls="panel1-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography className="font-semibold text-sky-500">Submajors</Typography>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setParentMajorId(account.id);
                          setOpenAddMajor(true);
                        }}
                        className="bg-sky-500 hover:bg-sky-600 gap-2"
                      >
                        <IoMdAddCircle />
                        Add Submajor
                      </Button>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ marginTop: 16 }}>
                      {account.subMajors.map((submajor) => (
                        <div
                          key={submajor.id}
                          style={{
                            display: 'flex',
                            padding: '10px',
                            backgroundColor: '#fff',
                            borderBottom: '1px solid #ddd',
                            marginBottom: '8px',
                          }}
                        >
                          <div style={{ flex: 0.5, paddingRight: '20px' }}>{submajor.id}</div>
                          <div style={{ flex: 2, paddingRight: '20px' }}>{submajor.name}</div>
                          <div style={{ flex: 3, paddingRight: '20px' }}>{submajor.description}</div>
                          <div style={{ flex: 1, paddingRight: '20px' }}>
                            <Tooltip title="Edit Submajor">
                              <IconButton
                                onClick={() => {
                                  setOpenEditMajor(true);
                                  setCurrentMajor(submajor);
                                }}
                                sx={{ color: 'blue', '&:hover': { color: '#1976d2' } }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<GridArrowDownwardIcon />} aria-controls="panel1-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography className="font-semibold text-sky-500">Skills</Typography>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentMajor(account);
                          setOpenEditMajorSkill(true);
                        }}
                        className="bg-sky-500 hover:bg-sky-600 gap-2"
                      >
                        <IoMdAddCircle />
                        Edit Skills
                      </Button>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ marginTop: 16 }}>
                      {account.skills.map((skills) => (
                        <div
                          key={skills.id}
                          style={{
                            display: 'flex',
                            padding: '10px',
                            backgroundColor: '#fff',
                            borderBottom: '1px solid #ddd',
                            marginBottom: '8px',
                          }}
                        >
                          <div style={{ flex: 1, paddingRight: '20px' }}>{skills.id}</div>
                          <div style={{ flex: 2, paddingRight: '20px' }}>{skills.name}</div>
                          <div style={{ flex: 3, paddingRight: '20px' }}>{skills.description}</div>
                          <div style={{ flex: 1, paddingRight: '20px' }}>{skills.type}</div>
                        </div>
                      ))}
                    </div>
                  </AccordionDetails>
                </Accordion>
              </Collapse>
            </div>
          </React.Fragment>
        ))}
      </div>
    </Paper>
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
          setParentMajorId={(parentMajorId: number | null) => setParentMajorId(parentMajorId)}
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
          skillOptions={skills.map((skill: any) => ({ label: skill.name, value: skill.id }))}
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
