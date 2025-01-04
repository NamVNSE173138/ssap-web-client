import React, { useState, useEffect } from "react";
import { getAllTransactions } from "@/services/ApiServices/paymentService";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, TablePagination, Typography } from "@mui/material";
import { FaTimesCircle, FaCheckCircle, FaPiggyBank } from "react-icons/fa";
import { getAllWallets } from "@/services/ApiServices/accountService";

const ITEMS_PER_PAGE = 5;

const WalletAndTransactionManagement = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletsPage, setWalletsPage] = useState<number>(1);
  const [transactionsPage, setTransactionsPage] = useState<number>(1);
  const [expandedTransactionIds, setExpandedTransactionIds] = useState<Set<string>>(new Set());

  const totalTransactionsPages = Math.ceil(transactions?.length / ITEMS_PER_PAGE);
  const paginatedTransactions = transactions?.slice(
    (transactionsPage - 1) * ITEMS_PER_PAGE,
    transactionsPage * ITEMS_PER_PAGE
  );
  const handleTransactionsPageChange = (page: number) => {
    setTransactionsPage(page);
  };

  const totalWalletsPages = Math.ceil(wallets?.length / ITEMS_PER_PAGE);
  const paginatedWallets = wallets.slice(
    (walletsPage - 1) * ITEMS_PER_PAGE,
    walletsPage * ITEMS_PER_PAGE
  );
  const handleWalletsPageChange = (page: number) => {
    setWalletsPage(page);
  };

  const toggleExpand = (transactionId: string) => {
    setExpandedTransactionIds((prevState) => {
      const newState = new Set(prevState);
      if (newState.has(transactionId)) {
        newState.delete(transactionId);
      } else {
        newState.add(transactionId);
      }
      return newState;
    });
  };

  const displayText = (transactionId: string) => {
    if (expandedTransactionIds.has(transactionId)) {
      return transactionId;
    }
    return `${transactionId.slice(0, 25)}...`;
  };


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
              Bank Account Name
            </div>
            <div style={{ flex: 1 }}>Bank Account Number</div>
            <div style={{ flex: 1 }}>Account ID</div>
          </div>

          {/* Data Rows */}
          {paginatedWallets.map((wallet, index) => (
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
              <div style={{ flex: 0.5 }}>{(walletsPage - 1) * ITEMS_PER_PAGE + index + 1}</div>
              <div style={{ flex: 1 }}>{wallet.id}</div>
              <div style={{ flex: 2 }}>{wallet.bankAccountName}</div>
              <div style={{ flex: 1 }}>{wallet.bankAccountNumber}</div>
              <div style={{ flex: 1 }}>{wallet.accountId}</div>
            </div>
          ))}

          <div style={{ marginTop: "20px", marginBottom: '10px', display: "flex", justifyContent: "end" }}>
            {Array.from({ length: totalWalletsPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handleWalletsPageChange(index + 1)}
                style={{
                  margin: "0 5px",
                  padding: "5px 10px",
                  backgroundColor: walletsPage === index + 1 ? "#419f97" : "#f1f1f1",
                  color: walletsPage === index + 1 ? "white" : "black",
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

      )}

      {/* Transactions Management */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <h2 style={{ marginLeft: "16px", marginTop: '10px', marginBottom: "15px", color: "#3f51b5", fontWeight: "bold" }}>
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
          {paginatedTransactions.map((transaction, index) => (
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
              <div style={{ flex: 0.5 }}>{(transactionsPage - 1) * ITEMS_PER_PAGE + index + 1}</div>
              <div key={index} style={{ flex: 4, marginBottom: '10px', marginRight: '20px' }}>
                <span>{displayText(transaction.transactionId)}</span>
                {transaction.transactionId.length > 25 && (
                  <button
                    style={{
                      color: 'blue',
                      cursor: 'pointer',
                      marginLeft: '5px',
                      background: 'transparent',
                      border: 'none',
                      padding: '0',
                      fontSize: '14px',
                      textDecoration: 'underline',
                    }}
                    onClick={() => toggleExpand(transaction.transactionId)}
                  >
                    {expandedTransactionIds.has(transaction.transactionId) ? 'Decrease' : 'Expand'}
                  </button>
                )}
              </div>
              <div style={{ flex: 1.25, marginRight: '20px' }}>{transaction.walletSenderId}</div>
              <div style={{ flex: 1.35, marginRight: '20px' }}>{transaction.walletReceiverId}</div>
              <div style={{ flex: 1.25, marginRight: '20px' }}>{transaction.paymentMethod}</div>
              <div style={{ flex: 1, marginRight: '20px' }}>${(transaction.amount).toLocaleString("en-US")}</div>
              <div style={{ flex: 1.5, marginRight: '20px' }}>
                {new Date(transaction.transactionDate).toLocaleDateString("en-US")}
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

          <div style={{ marginTop: "20px", marginBottom: '10px', display: "flex", justifyContent: "end" }}>
            {Array.from({ length: totalTransactionsPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handleTransactionsPageChange(index + 1)}
                style={{
                  margin: "0 5px",
                  padding: "5px 10px",
                  backgroundColor: transactionsPage === index + 1 ? "#419f97" : "#f1f1f1",
                  color: transactionsPage === index + 1 ? "white" : "black",
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

      )}
    </Box>
  );
};

export default WalletAndTransactionManagement;
