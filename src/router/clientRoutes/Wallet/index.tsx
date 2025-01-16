import { useState, useEffect } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { Spin, Modal, Input, Button, notification, Table } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  createWallet,
  getAccountWallet,
  updateWalletBankInformation,
} from "@/services/ApiServices/accountService";
import {
  createCheckoutSession,
  getTransactionsByWalletSenderId,
} from "@/services/ApiServices/paymentService";

const Wallet = () => {
  const user = useSelector((state: RootState) => state.token.user);
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isUpdateBankModalOpen, setIsUpdateBankModalOpen] = useState(false);
  const [accountNameError, setAccountNameError] = useState("");
  const [accountNumberError, setAccountNumberError] = useState("");

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user) return;
      try {
        const data = await getAccountWallet(Number(user?.id));
        console.log(data);
        if (data) {
          setWalletData(data);
          await fetchTransactions(data.data.id);
          setLoading(false);
        } else {
          setError("Please create your own wallet.");
          setLoading(false);
          setIsOpenDialog(true);
        }
      } catch (err) {
        setError("Error fetching wallet data.");
        setLoading(false);
      }
    };

    const fetchTransactions = async (id: number) => {
      if (!user) return;
      try {
        const data = await getTransactionsByWalletSenderId(id);
        setTransactions(data.data || []);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchWalletData();
  }, [user?.id]);

  const handleAddMoneyClick = () => {
    setIsModalOpen(true);
  };

  const handleAddMoney = async () => {
    if (!user) {
      notification.error({ message: "User not found. Please login." });
      return;
    }

    if (!addAmount || isNaN(Number(addAmount)) || Number(addAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setError(null);

    try {
      setLoading(true);

      const checkoutSessionRequest = {
        email: user.email,
        amount: Number(addAmount),
        senderId: user.id,
        receiverId: user.id,
        description: "Add Money to Wallet",
      };

      const { data } = await createCheckoutSession(checkoutSessionRequest);
      console.log(data);

      if (data) {
        window.location.href = data.sessionUrl;
      } else {
        notification.error({
          message: "Unable to create payment session. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({ message: "Error creating payment session" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setAddAmount("");
  };

  const handleCreateWallet = async () => {
    if (!user) return null;
    setAccountNameError("");
    setAccountNumberError("");
    if (!/^[a-zA-Z\s]+$/.test(bankAccountName) || bankAccountName.length > 50) {
      setAccountNameError(
        "Account Name must be letters only and up to 50 characters."
      );
      return;
    }
    if (!/^\d+$/.test(bankAccountNumber) || bankAccountNumber.length > 20) {
      setAccountNumberError(
        "Account Number must be digits only and up to 20 characters."
      );
      return;
    }

    try {
      const newWallet = await createWallet(Number(user.id), {
        bankAccountName,
        bankAccountNumber,
        balance: 0,
      });
      setWalletData(newWallet);
      setError(null);
      setIsOpenDialog(false);
      notification.success({ message: "Create wallet successfully!" });
    } catch (err) {
      notification.error({
        message: "Failed to create wallet.",
      });
    }
  };

  const handleUpdateBankInformation = async () => {
    setAccountNameError("");
    setAccountNumberError("");

    if (!/^[a-zA-Z\s]+$/.test(bankAccountName) || bankAccountName.length > 50) {
      setAccountNameError(
        "Account Name must be letters only and up to 50 characters."
      );
      return;
    }

    if (!/^\d+$/.test(bankAccountNumber) || bankAccountNumber.length > 20) {
      setAccountNumberError(
        "Account Number must be digits only and up to 20 characters."
      );
      return;
    }

    if (!user) return null;
    try {
      const updatedWallet = await updateWalletBankInformation(Number(user.id), {
        bankAccountName,
        bankAccountNumber,
      });

      setWalletData(updatedWallet);
      notification.success({
        message: "Bank information updated successfully!",
      });
      setIsUpdateBankModalOpen(false);
    } catch (err) {
      notification.error({
        message: "Failed to update bank information.",
      });
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `${amount}$`,
    },
    {
      title: "Transaction Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          className={`text-${status === "Successful" ? "green" : "red"}-500`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col items-center p-10 bg-white rounded-xl w-full">
        {/* <h1 className="text-4xl font-semibold text-[#1eb2a6] mb-8">Wallet</h1> */}

        {error ? (
          <div className="w-full bg-[#1eb2a6] text-white p-6 rounded-lg shadow-xl flex flex-col items-center mb-6 transition-transform">
            <Button
              onClick={() => setIsOpenDialog(true)}
              className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Create Wallet
            </Button>
          </div>
        ) : (
          <>
            <div className="w-full bg-teal-100 text-[#1eb2a6] p-6 rounded-xl flex flex-col md:flex-row items-center justify-between mb-6">
              <div>
                <p className="text-5xl font-extrabold mt-2">
                  ${(walletData?.data.balance).toLocaleString("en-US")}
                </p>
                <h2 className="text-xl font-semibold mt-4">
                  Current SSAP Wallet Balance
                </h2>
              </div>
              <button
                onClick={handleAddMoneyClick}
                className="flex items-center gap-2 mt-4 md:mt-0 bg-[#1eb2a6] text-white px-6 py-3 rounded-lg shadow-md hover:bg-teal-700 transition duration-200 ease-in-out"
              >
                <AiOutlinePlusCircle size={24} />
                <span className="font-semibold">Add Money to Wallet</span>
              </button>
            </div>

            <div className="w-full bg-white p-6 rounded-lg shadow-lg mb-6">
              <h2 className="text-lg font-semibold text-[#1eb2a6] mb-2">
                Bank Account Information
              </h2>
              <p>
                <span className="font-semibold">Account Name:</span>{" "}
                {walletData?.data.bankAccountName || "N/a"}
              </p>
              <p>
                <span className="font-semibold">Account Number:</span>{" "}
                {walletData?.data.bankAccountNumber || "N/a"}
              </p>
              {!walletData?.bankAccountName && (
                <Button
                  onClick={() => setIsUpdateBankModalOpen(true)}
                  className="mt-4 bg-[#1eb2a6] hover:bg-[#17a595] text-white"
                >
                  Update Bank Information
                </Button>
              )}
            </div>

            <div className="w-full bg-white p-6 rounded-lg shadow-lg mb-6">
              <h2 className="text-lg font-semibold text-[#1eb2a6] mb-2">
                Transaction History
              </h2>
              <Table
                columns={columns}
                dataSource={transactions}
                rowKey="transactionId"
                pagination={{ pageSize: 5 }}
              />
            </div>
          </>
        )}
      </div>

      <Modal
        title="Update Bank Information"
        open={isUpdateBankModalOpen}
        onCancel={() => setIsUpdateBankModalOpen(false)}
        centered
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsUpdateBankModalOpen(false)}
            className="bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </Button>,
          <Button
            key="update"
            type="primary"
            onClick={handleUpdateBankInformation}
            className="bg-[#1eb2a6] hover:bg-[#17a595] text-white"
          >
            Update
          </Button>,
        ]}
      >
        <div className="mb-4">
          <label className="text-[#1eb2a6] font-semibold">
            Bank Account Name:
          </label>
          <Input
            value={bankAccountName}
            onChange={(e) => setBankAccountName(e.target.value)}
            className={`mt-2 p-3 border rounded-lg w-full ${
              accountNameError ? "border-red-500" : ""
            }`}
          />
          {accountNameError && (
            <div className="text-red-500 text-sm">{accountNameError}</div>
          )}
          <div
            className={`text-sm mt-1 ${
              bankAccountName.length > 50 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {bankAccountName.length}/50
          </div>
        </div>
        <div className="mb-4">
          <label className="text-[#1eb2a6] font-semibold">
            Bank Account Number:
          </label>
          <Input
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
            className={`mt-2 p-3 border rounded-lg w-full ${
              accountNumberError ? "border-red-500" : ""
            }`}
          />
          {accountNumberError && (
            <div className="text-red-500 text-sm">{accountNumberError}</div>
          )}
          <div
            className={`text-sm mt-1 ${
              bankAccountNumber.length > 20 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {bankAccountNumber.length}/20
          </div>
        </div>
      </Modal>

      <Modal
        title={
          <h2 className="text-xl font-semibold text-[#1eb2a6]">
            Create Wallet
          </h2>
        }
        open={isOpenDialog}
        onCancel={() => setIsOpenDialog(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsOpenDialog(false)}
            className="bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </Button>,
          <Button
            key="create"
            type="primary"
            onClick={handleCreateWallet}
            className="bg-[#1eb2a6] hover:bg-[#17a595] text-white"
          >
            Create
          </Button>,
        ]}
      >
        <div className="mb-4">
          <label className="text-[#1eb2a6] font-semibold">
            Bank Account Name:
          </label>
          <Input
            placeholder="Enter bank account name"
            value={bankAccountName}
            onChange={(e) => setBankAccountName(e.target.value)}
            className={`mt-2 p-3 border rounded-lg w-full ${
              accountNameError ? "border-red-500" : ""
            }`}
          />
          {accountNameError && (
            <div className="text-red-500 text-sm">{accountNameError}</div>
          )}
          <div
            className={`text-sm mt-1 ${
              bankAccountName.length > 50 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {bankAccountName.length}/50
          </div>
        </div>
        <div className="mb-4">
          <label className="text-[#1eb2a6] font-semibold">
            Bank Account Number:
          </label>
          <Input
            placeholder="Enter bank account number"
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
            className={`mt-2 p-3 border rounded-lg w-full ${
              accountNumberError ? "border-red-500" : ""
            }`}
          />
          {accountNumberError && (
            <div className="text-red-500 text-sm">{accountNumberError}</div>
          )}
          <div
            className={`text-sm mt-1 ${
              bankAccountNumber.length > 20 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {bankAccountNumber.length}/20
          </div>
        </div>
      </Modal>

      <Modal
        title={
          <h2 className="text-xl font-semibold text-[#1eb2a6]">
            Add Money to Wallet
          </h2>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        centered
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            className="bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </Button>,
          <Button
            key="add"
            type="primary"
            onClick={handleAddMoney}
            className="bg-[#1eb2a6] hover:bg-[#17a595] text-white"
            disabled={!addAmount}
          >
            Add
          </Button>,
        ]}
      >
        <div className="mb-4">
          <label className="text-[#1eb2a6] font-semibold">Amount:</label>
          <Input
            type="number"
            placeholder="Enter amount to add"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            className="mt-2 p-3 border rounded-lg w-full"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Wallet;
