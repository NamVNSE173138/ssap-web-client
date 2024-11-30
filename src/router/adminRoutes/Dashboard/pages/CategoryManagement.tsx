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

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [status, setStatus] = useState("");

  const [openRows, setOpenRows] = useState<any>({});

  const [openAddCategory, setOpenAddCategory] = useState<boolean>(false);

  const [openEditCategory, setOpenEditCategory] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);


  const handleToggle = (rowId: any) => {
    setOpenRows((prevState: any) => ({
      ...prevState,
      [rowId]: !prevState[rowId],
    }));
  };

  const TABLE_HEAD = [
    "ID", "Name", "Description", "Actions"
  ];

  const fetchCategories= () => {
    setLoading(true);
    getAllCategories()
      .then((data) => {
        setCategories(data.data);
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
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
            {categories.map((account, index) => (
              <React.Fragment key={account.id}>
                <TableRow key={account.id} className="cursor-pointer" sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                  {/*<TableCell>{index + 1}</TableCell>*/}
                  <TableCell>{account.id}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tooltip title="Edit Category">
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation(); // Prevents the TableRow's onClick event from firing
                                setCurrentCategory(account);
                                setOpenEditCategory(true);
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
            Category Management
        </Typography>

        <Button onClick={() => setOpenAddCategory(true)} className="gap-2">
          <IoMdAddCircle />
          Add Category
        </Button>
      </div>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {renderTable()}
        </>
      )}

      {categories && (
        <AddCategoryModal
          isOpen={openAddCategory}
          setIsOpen={(open: boolean) => setOpenAddCategory(open)}
          fetchCategory={async () => {
            fetchCategories();
          }}
        />
      )}

      {categories && (
        <EditCategoryModal
          isOpen={openEditCategory}
          setIsOpen={(open: boolean) => setOpenEditCategory(open)}
          category={currentCategory}
          fetchCategory={async () => {
            fetchCategories();
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

export default CategoryManagement;

type Category = {
  id: string;
  name: string;
  description: string;

};
