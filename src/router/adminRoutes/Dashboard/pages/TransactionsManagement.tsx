import React, { useState, useEffect } from "react";
import { getAllTransactions } from "@/services/ApiServices/paymentService";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Chip, TablePagination, IconButton, Typography } from "@mui/material";
import { FaSortUp, FaSortDown, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

const TransactionsManagement = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("transactionId");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const data = await getAllTransactions();
        setTransactions(data.data);
      } catch (err) {
        setError("Error fetching transactions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
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

  return (
    <Box sx={{ backgroundColor: "#f4f7fb", borderRadius: 2 }}>
  <Typography variant="h4" component="div" color="primary" sx={{ ml: 2, mb: 3}}>
    Transactions Management
  </Typography>

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

  {!loading && !error && transactions.length === 0 && (
    <Alert severity="info" sx={{ marginBottom: 2, backgroundColor: "#e3f2fd" }}>
      No transactions found.
    </Alert>
  )}

  {!loading && !error && transactions.length > 0 && (
    <Paper sx={{ borderRadius: 2, boxShadow: 3, padding: 2 }}>
      <TableContainer component={Paper} sx={{ borderRadius: "8px", boxShadow: 3 }}>
        <Table sx={{ minWidth: 750 }} aria-label="transactions table">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#1c1c1c' }}>No.</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1c1c1c' }}>
                <Box sx={{ display: "flex" }}>
                  <span>Transaction ID</span>
                  <IconButton size="small" onClick={() => handleRequestSort("transactionId")}>
                    {sortDirection === "asc" ? <FaSortUp style={{ color: "black" }} /> : <FaSortDown style={{ color: "black" }} />}
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1c1c1c' }}>Sender ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1c1c1c' }}>Receiver ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1c1c1c' }}>Payment Method</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1c1c1c' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1c1c1c' }}>Transaction Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1c1c1c' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1c1c1c' }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTransactions.map((transaction, index) => (
              <TableRow hover key={transaction.transactionId} sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{transaction.transactionId}</TableCell>
                <TableCell>{transaction.walletSenderId}</TableCell>
                <TableCell>{transaction.walletReceiverId}</TableCell>
                <TableCell>{transaction.paymentMethod}</TableCell>
                <TableCell>{transaction.amount}$</TableCell>
                <TableCell>{new Date(transaction.transactionDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {transaction.status === "Successful" ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <FaTimesCircle className="text-red-500" />
                    )}
                    {transaction.status || "N/A"}
                  </div>
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ color: "#1976d2" }}
      />
    </Paper>
  )}
</Box>

  );
};

export default TransactionsManagement;
