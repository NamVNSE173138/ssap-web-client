import { getAllTransactions } from "@/services/ApiServices/paymentService";
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box,
  IconButton,
  TableSortLabel,
  TablePagination,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

const TransactionsManagement = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("id");

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
    <Container sx={{ marginTop: 4, backgroundColor: "#f4f7fb", borderRadius: "8px", padding: "20px" }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: "#1976d2" }}>
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
        <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: "8px" }}>
          <CardContent>
            <TableContainer component={Paper} sx={{ borderRadius: "8px" }}>
              <Table sx={{ minWidth: 750 }} aria-label="transactions table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1976d2", color: "white" }}>
                    <TableCell align="center" sx={{ color: "white" }}>
                      <TableSortLabel
                        active={orderBy === "id"}
                        direction={sortDirection}
                        onClick={() => handleRequestSort("id")}
                        sx={{ color: "white" }}
                      >
                        Transaction ID
                        {orderBy === "id" && (
                          <IconButton size="small">
                            {sortDirection === "asc" ? <ArrowUpward sx={{ color: "white" }} /> : <ArrowDownward sx={{ color: "white" }} />}
                          </IconButton>
                        )}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>Sender ID</TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>Receiver ID</TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>Amount</TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedTransactions.map((transaction) => (
                    <TableRow hover key={transaction.id}>
                      <TableCell align="center">{transaction.id}</TableCell>
                      <TableCell align="center">{transaction.walletSenderId}</TableCell>
                      <TableCell align="center">{transaction.walletReceiverId}</TableCell>
                      <TableCell align="center">{transaction.amount}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={transaction.status}
                          color={transaction.status === "Completed" ? "success" : "error"}
                          variant="filled"
                          size="small"
                          sx={{ backgroundColor: transaction.status === "Completed" ? "#388e3c" : "#d32f2f", color: "white" }}
                        />
                      </TableCell>
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
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default TransactionsManagement;
