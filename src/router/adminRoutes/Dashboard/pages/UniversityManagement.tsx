import { useEffect, useState } from "react";
import {
  IconButton,
  Tooltip,
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

const ITEMS_PER_PAGE = 5;

const UniversityManagement = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);

  const [openAddUniversity, setOpenAddUniversity] = useState<boolean>(false);

  const [openEditUniversity, setOpenEditUniversity] = useState<boolean>(false);
  const [currentUniversity, setCurrentUniversity] = useState<University | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(universities?.length / ITEMS_PER_PAGE);
  const paginatedUniversities = universities?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


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
        <div style={{ flex: 0.5, marginRight: '20px' }}>ID</div>
        <div style={{ flex: 2, marginRight: '20px' }}>Name</div>
        <div style={{ flex: 2, marginRight: '20px' }}>Description</div>
        <div style={{ flex: 2, marginRight: '20px' }}>City</div>
        <div style={{ flex: 2, marginRight: '20px' }}>Country</div>
        <div style={{ flex: 1, marginRight: '20px' }}>Actions</div>
      </div>

      {paginatedUniversities.map((account) => (
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
            <div style={{ flex: 0.5, marginRight: '20px' }}>{account.id}</div>
            <div style={{ flex: 2, marginRight: '20px' }}>{account.name}</div>
            <div style={{ flex: 2, marginRight: '20px' }}>{account.description}</div>
            <div style={{ flex: 2, marginRight: '20px' }}>{account.city}</div>
            <div style={{ flex: 2, marginRight: '20px' }}>{account.country.name}</div>
            <div style={{ flex: 1, marginRight: '20px' }}>
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
      <div style={{ marginTop: "20px", marginBottom: '10px', display: "flex", justifyContent: "end" }}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              backgroundColor: currentPage === index + 1 ? "#419f97" : "#f1f1f1",
              color: currentPage === index + 1 ? "white" : "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </Paper>

  );

  return (
    <>
      <div className="flex justify-between">
        <h2 style={{ marginLeft: "16px", marginBottom: "24px", color: "#3f51b5", fontWeight: "bold" }}>
          University Management
        </h2>

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
