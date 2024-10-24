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
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { getAllAccounts, updateAccount } from "@/services/ApiServices/accountService";
import { TrashIcon } from "@heroicons/react/24/solid";

const AccountsManagement = () => {
  const [accounts, setAccounts] = useState<AccountWithRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<AccountWithRole | null>(null);
  const [status, setStatus] = useState("");

  const TABLE_HEAD = [
    "ID", "Username", "Phone Number", "Email", "Address", "Avatar", "Status", "Actions"
  ];

  const fetchAccounts = () => {
    setLoading(true);
    getAllAccounts()
      .then((data) => {
        setAccounts(data);
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
  }, []);

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
          avatarUrl: account.avatarUrl,
          status: "INACTIVE", 
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
    <Card className="h-full w-full">
      <Typography variant="h6" component="div" color="primary" sx={{ mt: 2, ml: 2 }}>
        {roleName} Accounts
      </Typography>
      <TableContainer>
        <Table>
          <TableHead >
            <TableRow>
              {TABLE_HEAD.map((head) => (
                <TableCell key={head}>
                  <TableSortLabel className="font-bold">{head}</TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.id}</TableCell>
                <TableCell>{account.username}</TableCell>
                <TableCell>{account.phoneNumber || "N/A"}</TableCell>
                <TableCell>{account.email || "N/A"}</TableCell>
                <TableCell>{account.address || "N/A"}</TableCell>
                <TableCell>
                  <img src={account.avatarUrl || "/default-avatar.png"} alt="Avatar" style={{ height: 40, width: 40, borderRadius: "50%" }} />
                </TableCell>
                <TableCell>{account.status || "N/A"}</TableCell>
                <TableCell>
                  <Tooltip title="Edit Account">
                    <IconButton onClick={() => handleEditAccount(account)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Account">
                    <IconButton onClick={() => handleDeleteAccount(account.id)}>
                      <TrashIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
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
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {renderTable("Applicant", accounts.filter(account => account.roleName === "APPLICANT"))}
          <br />
          {renderTable("Funder", accounts.filter(account => account.roleName === "FUNDER"))}
          <br />
          {renderTable("Provider", accounts.filter(account => account.roleName === "PROVIDER"))}
        </>
      )}

      {/* Edit Account Status Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth>
        <DialogTitle>Edit Account Status</DialogTitle>
        <DialogContent>
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} fullWidth>
            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
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
