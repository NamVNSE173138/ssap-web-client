"use client";

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Paper, Box } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SuccessfulPayment() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("Payment successful!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, []);

  return (
    <Container maxWidth="sm" className="mt-16">
      <ToastContainer />
      <Paper elevation={3} className="p-8">
        <Box className="flex flex-col items-center space-y-4">
          <CheckCircleOutline
            className="text-green-500"
            style={{ fontSize: 64 }}
          />
          <Typography variant="h4" component="h1" className="text-center">
            Payment Successful!
          </Typography>
          <Typography variant="body1" className="text-center">
            Thank you for your purchase. Your order has been processed
            successfully.
          </Typography>
          <Box className="w-full bg-gray-100 p-4 rounded-md">
            <Typography variant="h6" component="h2" className="mb-2">
              Order Details
            </Typography>
            <Typography variant="body2">Order ID: #123456</Typography>
            <Typography variant="body2">
              Date: {new Date().toLocaleDateString()}
            </Typography>
            <Typography variant="body2">Total Amount: $99.99</Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
            className="mt-4"
          >
            Return to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
