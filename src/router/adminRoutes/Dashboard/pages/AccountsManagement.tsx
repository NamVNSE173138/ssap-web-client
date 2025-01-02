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
  Paper,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { getAllAccounts, updateAccount } from "@/services/ApiServices/accountService";
import { TrashIcon } from "@heroicons/react/24/solid";
import { FaCheckCircle, FaEnvelope, FaExclamationCircle, FaMapMarkerAlt, FaPhoneAlt, FaTimesCircle } from "react-icons/fa";
import React from "react";
import { GridArrowDownwardIcon } from "@mui/x-data-grid";
import { ArrowDown } from "lucide-react";

const ITEMS_PER_PAGE = 5;

const AccountsManagement = () => {
  const [accounts, setAccounts] = useState<AccountWithRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<AccountWithRole | null>(null);
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(accounts?.length / ITEMS_PER_PAGE);
    const paginatedAccounts = accounts?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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

  const fetchAccounts = () => {
    setLoading(true);
    getAllAccounts()
      .then((data) => {
        if (selectedTab == 0)
          setAccounts(data.filter((account: any) => account.status == "Active"));
        else
          setAccounts(data.filter((account: any) => account.status == "Inactive"));
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
    <Paper sx={{ borderRadius: 2, boxShadow: 3, padding: 2, marginBottom: 4 }}>
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#f5f5f5',
          fontWeight: 'bold',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '10px',
        }}
      >
        <div style={{ flex: 0.5, marginRight: '20px' }}>#.</div>
        <div style={{ flex: 0.5, marginRight: '20px' }}>ID</div>
        <div style={{ flex: 1.75, marginRight: '20px' }}>Username</div>
        <div style={{ flex: 1.5, marginRight: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            Phone
          </div>
        </div>
        <div style={{ flex: 2.5, marginRight: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            Email
          </div>
        </div>
        <div style={{ flex: 2.5, marginRight: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            Address
          </div>
        </div>
        <div style={{ flex: 1, marginRight: '20px' }}>Avatar</div>
        <div style={{ flex: 1, marginRight: '20px' }}>Status</div>
        <div style={{ flex: 1, marginRight: '20px' }}>Actions</div>
      </div>

      {/* Data Rows */}
      {filteredAccounts.map((account:any, index:any) => (
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
            onClick={() => handleToggle(account.id)} // for handle toggle action
          >
            <div style={{ flex: 0.5, marginRight: '20px' }}>{index + 1}</div>
            <div style={{ flex: 0.5, marginRight: '20px' }}>{account.id}</div>
            <div style={{ flex: 1.75, marginRight: '20px' }}>{account.username}</div>
            <div style={{ flex: 1.5, marginRight: '20px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                {account.phoneNumber || "N/A"}
              </div>
            </div>
            <div style={{ flex: 2.5, marginRight: '20px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                {account.email || "N/A"}
              </div>
            </div>
            <div style={{ flex: 2.5, marginRight: '20px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                {account.address || "N/A"}
              </div>
            </div>
            <div style={{ flex: 1, marginRight: '20px' }}>
              <img
                src={account.avatarUrl || "https://github.com/shadcn.png"}
                alt="Avatar"
                style={{
                  height: 40,
                  width: 40,
                  display: 'inline-flex',
                  alignItems: 'center',
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div style={{ flex: 1, marginRight: '20px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                {account.status === "Active" ? (
                  <FaCheckCircle className="text-green-500" />
                ) : account.status === "Inactive" ? (
                  <FaTimesCircle className="text-red-500" />
                ) : (
                  <FaExclamationCircle className="text-yellow-500" />
                )}
                {account.status || "N/A"}
              </div>
            </div>
            <div style={{ flex: 1, marginRight: '20px' }}>
              <div style={{ display: 'inline-flex', gap: '10px' }}>
                <Tooltip title="Edit Account">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // prevent the row click
                      handleEditAccount(account);
                    }}
                    sx={{ color: 'blue', '&:hover': { color: '#1976d2' } }}
                  >
                    <EditIcon />
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
            </div>
          </div>

          {/* Collapsible content */}
          {(account.roleName == "Provider" || account.roleName == "Funder") && (
            <div style={{ paddingLeft: '10px', paddingTop: '10px', paddingBottom: '10px' }}>
              <Collapse in={openRows[account.id]} timeout={300} unmountOnExit>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<GridArrowDownwardIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <div className="flex w-full items-center justify-between">
                      <Typography className="font-semibold text-sky-500">
                        {account.roleName + " Profile"}
                      </Typography>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    {/* Additional profile details go here */}
                  </AccordionDetails>
                </Accordion>
              </Collapse>
            </div>
          )}
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
      <h2 style={{ marginLeft: "16px", marginBottom: "24px", color: "#3f51b5", fontWeight: "bold" }}>
                    Accounts Management
                </h2>
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
