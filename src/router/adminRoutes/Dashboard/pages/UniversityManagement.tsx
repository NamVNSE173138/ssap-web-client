import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse,
  Box,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { getAllAccounts, updateAccount } from "@/services/ApiServices/accountService";
import { TrashIcon } from "@heroicons/react/24/solid";
import { FaCheckCircle, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaTimesCircle, FaUserCircle } from "react-icons/fa";
import { getAllMajors, getMajors } from "@/services/ApiServices/majorService";
import { GridArrowDownwardIcon } from "@mui/x-data-grid";
import React from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IoAddCircle } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import AddMajorModal from "./MajorManagement/AddMajorForm";
import EditMajorModal from "./MajorManagement/EditMajorForm";
import { getAllCategories } from "@/services/ApiServices/categoryService";
import AddCategoryModal from "./CategoryManagement/AddCategoryForm";
import EditCategoryModal from "./CategoryManagement/EditCategoryForm";
import { getAllUniversities } from "@/services/ApiServices/universityService";
import AddUniversityModal from "./UniversityManagement/AddUniversityForm";
import { getAllCountries } from "@/services/ApiServices/countryService";
import EditUniversityModal from "./UniversityManagement/EditUniversityForm";

const UniversityManagement = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [status, setStatus] = useState("");

  const [openRows, setOpenRows] = useState<any>({});

  const [openAddUniversity, setOpenAddUniversity] = useState<boolean>(false);

  const [openEditUniversity, setOpenEditUniversity] = useState<boolean>(false);
  const [currentUniversity, setCurrentUniversity] = useState<University | null>(null);


  const handleToggle = (rowId: any) => {
    setOpenRows((prevState: any) => ({
      ...prevState,
      [rowId]: !prevState[rowId],
    }));
  };

  const TABLE_HEAD = [
    "ID", "Name", "Description", "City", "Country", "Actions"
  ];

  const fetchUniversities= async () => {
    setLoading(true);
    await getAllCountries()
        .then((data) => {
            setCountries(data.data);
        })
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

  /*const handleEditAccount = (account: AccountWithRole) => {
    setCurrentAccount(account);
    setStatus(account.status || "");
    setOpenEditDialog(true);
  };*/

  /*const handleDeleteAccount = async (id: string) => {
    setLoading(true);
    try {
      const account = accounts.find((acc) => acc.id === id);
      if (account) {
        await updateAccount({
          id: account.id,
          username: account.username,
          phoneNumber: account.phoneNumber,
          email: account.email,
          hashedPassword: account.hashedPassword,
          roleId: account.roleId,
          address: account.address,
          avatarUrl: account.avatarUrl || "https://github.com/shadcn.png",
          status: "Inactive", 
          roleName: account.roleName,
        });
        fetchAccounts(); 
      }
      setLoading(false);
    } catch (error) {
      console.error("Error deleting account:", error);
      setLoading(false);
    }
  };*/

  /*const handleUpdateStatus = async () => {
    if (currentAccount) {
      setLoading(true);
      try {
        await updateAccount({
          ...currentAccount,await 
          status, 
        });
        fetchAccounts(); 
        setOpenEditDialog(false); 
      } catch (error) {
        console.error("Error updating account status:", error);
      } finally {
        setLoading(false);
      }
    }
  };*/

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
            {universities.map((account, index) => (
              <React.Fragment key={account.id}>
                <TableRow key={account.id} className="cursor-pointer" sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                  {/*<TableCell>{index + 1}</TableCell>*/}
                  <TableCell>{account.id}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.description}</TableCell>
                  <TableCell>{account.city}</TableCell>
                  <TableCell>{account.country.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tooltip title="Edit University">
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation(); // Prevents the TableRow's onClick event from firing
                                setCurrentUniversity(account);
                                setOpenEditUniversity(true);
                            }}
                          sx={{ color: 'blue', '&:hover': { color: '#1976d2' } }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                    </div>
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
            University Management
        </Typography>

        <Button onClick={() => setOpenAddUniversity(true)} className="gap-2">
          <IoMdAddCircle />
          Add University
        </Button>
      </div>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {renderTable()}
        </>
      )}

      {universities && (
        <AddUniversityModal
          isOpen={openAddUniversity}
          countryOptions={countries.map((country) => ({ label: country.name, value:country.id }))}
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
          countryOptions={countries.map((country) => ({ label: country.name, value:country.id }))}
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
}
