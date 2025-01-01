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
  Paper,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

import React from "react";

import { Button } from "@/components/ui/button";

import { IoMdAddCircle } from "react-icons/io";

import { getAllUniversities } from "@/services/ApiServices/universityService";
import AddUniversityModal from "./UniversityManagement/AddUniversityForm";
import { getAllCountries } from "@/services/ApiServices/countryService";
import EditUniversityModal from "./UniversityManagement/EditUniversityForm";

const UniversityManagement = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);

  const [openAddUniversity, setOpenAddUniversity] = useState<boolean>(false);

  const [openEditUniversity, setOpenEditUniversity] = useState<boolean>(false);
  const [currentUniversity, setCurrentUniversity] = useState<University | null>(
    null
  );

  const TABLE_HEAD = [
    "ID",
    "Name",
    "Description",
    "City",
    "Country",
    "Actions",
  ];

  const fetchUniversities = async () => {
    setLoading(true);
    await getAllCountries().then((data) => {
      setCountries(data.data);
    });
    await getAllUniversities()
      .then((data) => {
        setUniversities(data.data);
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const renderTable = () => (
    <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
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
        <div style={{ flex: 0.5 }}>ID</div>
        <div style={{ flex: 2 }}>Name</div>
        <div style={{ flex: 2 }}>Description</div>
        <div style={{ flex: 2 }}>City</div>
        <div style={{ flex: 2 }}>Country</div>
        <div style={{ flex: 1 }}>Actions</div>
      </div>

      {universities.map((account) => (
        <React.Fragment key={account.id}>
          <div
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
            <div style={{ flex: 2 }}>{account.city}</div>
            <div style={{ flex: 2 }}>{account.country.name}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Tooltip title="Edit University">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the row click event from firing
                      setCurrentUniversity(account);
                      setOpenEditUniversity(true);
                    }}
                    sx={{ color: 'blue', '&:hover': { color: '#1976d2' } }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        </React.Fragment>
      ))}
    </Paper>
  );

  return (
    <>
      <div className="flex justify-between">
        <Typography
          variant="h4"
          component="div"
          color="primary"
          sx={{ ml: 2, mb: 3 }}
        >
          University Management
        </Typography>

        <Button onClick={() => setOpenAddUniversity(true)} className="gap-2">
          <IoMdAddCircle />
          Add University
        </Button>
      </div>
      {loading ? <CircularProgress /> : <>{renderTable()}</>}

      {universities && (
        <AddUniversityModal
          isOpen={openAddUniversity}
          countryOptions={countries.map((country) => ({
            label: country.name,
            value: country.id,
          }))}
          setIsOpen={(open: boolean) => setOpenAddUniversity(open)}
          fetchCategory={async () => {
            fetchUniversities();
          }}
        />
      )}

      {universities && (
        <EditUniversityModal
          isOpen={openEditUniversity}
          setIsOpen={(open: boolean) => setOpenEditUniversity(open)}
          countryOptions={countries.map((country) => ({
            label: country.name,
            value: country.id,
          }))}
          currentUniversity={currentUniversity}
          fetchUniversity={async () => {
            fetchUniversities();
          }}
        />
      )}

      {/* Edit Account Status Dialog */}
      {/*<Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth>
        <DialogTitle>Edit Account Status</DialogTitle>
        <DialogContent>
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} fullWidth>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleUpdateStatus} color="primary">Update</Button>
        </DialogActions>
      </Dialog>*/}
    </>
  );
};

export default UniversityManagement;

type University = {
  id: number;
  name: string;
  description: string;
  city: string;
  country: Country;
};

type Country = {
  id: number;
  name: string;
  code: number;
};
