import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  Button,
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
  Tabs,
  Tab,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { getAllAccounts, updateAccount } from "@/services/ApiServices/accountService";
import { TrashIcon } from "@heroicons/react/24/solid";
import { FaCheckCircle, FaEnvelope, FaExclamationCircle, FaMapMarkerAlt, FaPhoneAlt, FaTimesCircle, FaUserCircle } from "react-icons/fa";
import React from "react";
import { GridArrowDownwardIcon } from "@mui/x-data-grid";
import { IoMdAddCircle } from "react-icons/io";
import { ArrowDown } from "lucide-react";

const AccountsManagement = () => {
  const [accounts, setAccounts] = useState<AccountWithRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<AccountWithRole | null>(null);
  const [status, setStatus] = useState("");

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const [openRows, setOpenRows] = useState<any>({});
  const handleToggle = (rowId: any) => {
    setOpenRows((prevState: any) => ({
      ...prevState,
      [rowId]: !prevState[rowId],
    }));
  };
  const TABLE_HEAD = [
    "No.", "ID", "Username", "Phone Number", "Email", "Address", "Avatar", "Status", "Actions"
  ];

  const fetchAccounts = () => {
    setLoading(true);
    getAllAccounts()
      .then((data) => {
          if(selectedTab == 0)
            setAccounts(data.filter((account:any) => account.status == "Pending"));
          else if(selectedTab == 1)
            setAccounts(data.filter((account:any) => account.status == "Active"));
          else
            setAccounts(data.filter((account:any) => account.status == "Inactive"));
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAccounts();
  }, [selectedTab]);

  const handleEditAccount = (account: AccountWithRole) => {
    setCurrentAccount(account);
    setStatus(account.status || "");
    setOpenEditDialog(true);
  };

  const handleDeleteAccount = async (id: string) => {
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
  };

  const handleUpdateStatus = async () => {
    if (currentAccount) {
      setLoading(true);
      try {
        await updateAccount({
          ...currentAccount,
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
  };

  const renderTable = (roleName: string, filteredAccounts: AccountWithRole[]) => (
    <Card className="h-full w-full shadow-lg rounded-lg">
      <Typography variant="h6" component="div" color="primary" sx={{ mt: 2, ml: 2, fontWeight: 'bold' }}>
        {roleName} Accounts
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
            {filteredAccounts.map((account, index) => (
              <React.Fragment key={account.id}>
              <TableRow className="cursor-pointer" onClick={() => handleToggle(account.id)} sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{account.id}</TableCell>
                <TableCell>{account.username}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-sky-500" />
                    {account.phoneNumber || "N/A"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-500" />
                    {account.email || "N/A"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-green-500" />
                    {account.address || "N/A"}
                  </div>
                </TableCell>
                <TableCell>
                  <img 
                    src={account.avatarUrl || "https://github.com/shadcn.png"} 
                    alt="Avatar" 
                    style={{
                      height: 40, 
                      width: 40, 
                      borderRadius: "50%", 
                      objectFit: "cover",
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {account.status === "Active" ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : account.status === "Inactive" ? (
                      <FaTimesCircle className="text-red-500" />
                    ): (
                      <FaExclamationCircle className="text-yellow-500" />  
                    )}
                    {account.status || "N/A"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Tooltip title="Edit Account">
                      <IconButton 
                        onClick={(e) => {
                                e.stopPropagation();
                                handleEditAccount(account)
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
                    <Tooltip title="Delete Account">
                      <IconButton 
                        onClick={() => handleDeleteAccount(account.id)} 
                        sx={{ color: 'red', '&:hover': { color: '#d32f2f' } }}
                      >
                        <TrashIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
              {/* Collapsible content */}

                {(account.roleName == "Provider" || account.roleName == "Funder") && <TableRow>
                  <TableCell colSpan={10} style={{ paddingBottom: 0, paddingTop: 0 }}>
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
                          <Typography className="font-semibold text-sky-500 ">{account.roleName+ " Profile"}</Typography>
                        </div>
                        </AccordionSummary>
                        <AccordionDetails>
                        </AccordionDetails>
                      </Accordion>
                    </Collapse>
                  </TableCell>
                </TableRow>}

              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );

  return (
    <>
      <Typography variant="h4" component="div" color="primary" sx={{ ml: 2, mb: 3 }}>
        Accounts Management
      </Typography>
      <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="Applications Tabs"
          className="bg-white shadow-sm"
          indicatorColor="primary"
          textColor="inherit"
          centered
        >
          <Tab
            label="Pending Accounts"
            sx={{ textTransform: "none", color: "gold", fontWeight: "bold" }}
          />
          <Tab
            label="Active Accounts"
            sx={{ textTransform: "none", color: "green", fontWeight: "bold" }}
          />
          <Tab
            label="Inactive Accounts"
            sx={{ textTransform: "none", color: "red", fontWeight: "bold" }}
          />
        </Tabs>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {renderTable("Applicant", accounts.filter(account => account.roleName === "Applicant"))}
          <br />
          {renderTable("Funder", accounts.filter(account => account.roleName === "Funder"))}
          <br />
          {renderTable("Provider", accounts.filter(account => account.roleName === "Provider"))}
          <br />
          {renderTable("Expert", accounts.filter(account => account.roleName === "Expert"))}
        </>
      )}

      {/* Edit Account Status Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth>
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
      </Dialog>
    </>
  );
};

export default AccountsManagement;

type AccountWithRole = {
  id: string;
  username: string;
  phoneNumber?: string;
  email?: string;
  hashedPassword: string;
  roleId?: number;
  address?: string;
  loginWithGoogle: boolean;
  avatarUrl?: string;
  status?: string;
  roleName: string;
};
