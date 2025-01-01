import React, { useState, useEffect } from "react";
import { getAllTransactions } from "@/services/ApiServices/paymentService";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, TablePagination, Typography } from "@mui/material";
import { FaTimesCircle, FaCheckCircle, FaPiggyBank } from "react-icons/fa";
import { getAllWallets } from "@/services/ApiServices/accountService";

const WalletAndTransactionManagement = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  // const [orderBy, setOrderBy] = useState<string>("transactionId");

  const sortDirection: "asc" | "desc" = "asc"
  const orderBy = "transactionId"

  useEffect(() => {
    const fetchWalletsAndTransactions = async () => {
      setLoading(true);
      try {
        const walletData = await getAllWallets();
        setWallets(walletData.data);
        console.log(walletData.data)

        const transactionData = await getAllTransactions();
        setTransactions(transactionData.data);
        console.log(transactionData.data)

      } catch (err) {
        setError("Error fetching data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletsAndTransactions();
  }, []);

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedTransactions = transactions
    .sort((a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    })
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const sortedWallets = wallets
    .sort((a, b) => {
      if (a.id < b.id) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a.id > b.id) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    })
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ backgroundColor: "#f4f7fb", borderRadius: 2 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <h2 style={{ marginLeft: "16px", marginBottom: "15px", color: "#3f51b5", fontWeight: "bold" }}>
          Wallets Management
        </h2>
      </div>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
          <CircularProgress sx={{ color: "#1976d2" }} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2, backgroundColor: "#e3f2fd" }}>
          {error}
        </Alert>
      )}

      {!loading && !error && wallets.length === 0 && (
        <Alert severity="info" sx={{ marginBottom: 2, backgroundColor: "#e3f2fd" }}>
          No wallets found.
        </Alert>
      )}

      {!loading && !error && wallets.length > 0 && (
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
            <div style={{ flex: 0.5 }}>No.</div>
            <div style={{ flex: 1 }}>Wallet ID</div>
            <div style={{ flex: 2, display: 'inline-flex', alignItems: 'center' }}>
              <FaPiggyBank style={{ marginRight: 5 }} />
              Bank Account Name
            </div>
            <div style={{ flex: 1 }}>Bank Account Number</div>
            <div style={{ flex: 1 }}>Account ID</div>
          </div>

          {/* Data Rows */}
          {sortedWallets.map((wallet, index) => (
            <div
              key={wallet.id}
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
              <div style={{ flex: 0.5 }}>{page * rowsPerPage + index + 1}</div>
              <div style={{ flex: 1 }}>{wallet.id}</div>
              <div style={{ flex: 2 }}>{wallet.bankAccountName}</div>
              <div style={{ flex: 1 }}>{wallet.bankAccountNumber}</div>
              <div style={{ flex: 1 }}>{wallet.accountId}</div>
            </div>
          ))}

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={wallets.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ color: '#1976d2' }}
            />
          </div>
        </Paper>

      )}

      {/* Transactions Management */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <h2 style={{ marginLeft: "16px", marginTop:'10px',  marginBottom: "15px", color: "#3f51b5", fontWeight: "bold" }}>
          Transactions Management
        </h2>
      </div>

      {!loading && !error && transactions.length > 0 && (
        <Paper sx={{ borderRadius: 2, boxShadow: 3, padding: 2 }}>
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
            <div style={{ flex: 0.5 }}>No.</div>
            <div style={{ flex: 4, marginRight: '20px' }}>Transaction ID</div>
            <div style={{ flex: 1.25, marginRight: '20px' }}>Sender ID</div>
            <div style={{ flex: 1.35, marginRight: '20px' }}>Receiver ID</div>
            <div style={{ flex: 1.25, marginRight: '20px' }}>Payment Method</div>
            <div style={{ flex: 1, marginRight: '20px' }}>Amount</div>
            <div style={{ flex: 1.5, marginRight: '20px' }}>Transaction Date</div>
            <div style={{ flex: 1.5, marginRight: '20px' }}>Status</div>
            <div style={{ flex: 2.5, marginRight: '20px' }}>Description</div>
          </div>

          {/* Data Rows */}
          {sortedTransactions.map((transaction, index) => (
            <div
              key={transaction.transactionId}
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
              <div style={{ flex: 0.5 }}>{page * rowsPerPage + index + 1}</div>
              <div style={{ flex: 4, marginRight: '20px' }}>{transaction.transactionId}</div>
              <div style={{ flex: 1.25, marginRight: '20px' }}>{transaction.walletSenderId}</div>
              <div style={{ flex: 1.35, marginRight: '20px' }}>{transaction.walletReceiverId}</div>
              <div style={{ flex: 1.25, marginRight: '20px' }}>{transaction.paymentMethod}</div>
              <div style={{ flex: 1, marginRight: '20px' }}>{transaction.amount}$</div>
              <div style={{ flex: 1.5, marginRight: '20px' }}>
                {new Date(transaction.transactionDate).toLocaleDateString()}
              </div>
              <div style={{ flex: 1.5, marginRight: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {transaction.status === 'Successful' ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaTimesCircle className="text-red-500" />
                  )}
                  {transaction.status || 'N/A'}
                </div>
              </div>
              <div style={{ flex: 2.5, marginRight: '20px' }}>{transaction.description}</div>
            </div>
          ))}

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={transactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ color: '#1976d2' }}
            />
          </div>
        </Paper>

      )}
    </Box>
  );
};

export default WalletAndTransactionManagement;
