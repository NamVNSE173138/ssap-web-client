import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import React, { useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentResult() {
  const [open, setOpen] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status");
  const isSuccessful = status === "successful";

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <>
      <Toast.Provider>
        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className="bg-white rounded-md shadow-lg p-4 fixed top-4 right-4 w-auto max-w-sm"
        >
          <Toast.Title className="font-medium text-sm">
            {isSuccessful ? "Payment successful!" : "Payment failed!"}
          </Toast.Title>
          <Toast.Description className="text-sm text-gray-500 mt-1">
            {isSuccessful
              ? "Your order has been processed successfully."
              : "There was an error processing your payment."}
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>

      <main className="w-full min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center gap-4">
            {isSuccessful ? (
              <CheckCircleIcon className="w-16 h-16 text-green-500" />
            ) : (
              <XCircleIcon className="w-16 h-16 text-red-500" />
            )}

            <h1 className="text-2xl font-semibold text-center">
              {isSuccessful ? "Payment Successful!" : "Payment Failed!"}
            </h1>

            <p className="text-center text-gray-600">
              {isSuccessful
                ? "Thank you for your purchase. Your order has been processed successfully."
                : "We apologize, but there was an error processing your payment. Please try again."}
            </p>

            <button
              className={`mt-4 px-6 py-2 rounded-md text-white font-medium transition-colors ${isSuccessful ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}`}
              onClick={handleReturn}
            >
              Return to Home
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
