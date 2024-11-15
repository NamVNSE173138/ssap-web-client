import { useState, useEffect } from "react";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { Spin, Modal, Input, Button, notification, Table } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { createWallet, getAccountWallet, updateWalletBalance, updateWalletBankInformation } from "@/services/ApiServices/accountService";
import { getTransactionsByWalletSenderId } from "@/services/ApiServices/paymentService";

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
  const [isModalWithdrawOpen, setIsModalWithdrawOpen] = useState(false);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user) return;
      try {
        const data = await getAccountWallet(Number(user?.id));
        console.log(data)
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

  const handleWithdrawClick = () => {
    setIsModalWithdrawOpen(true);
  };

  const closeModal = () => {
    setIsModalWithdrawOpen(false);
  };

  const handleAddMoney = async () => {
    if (!user) return null;
    if (walletData) {
      try {
        console.log(walletData)
        console.log(addAmount)
        const updatedBalance = walletData.data.balance + parseInt(addAmount);
        const payload = {
          balance: updatedBalance,
        };

        await updateWalletBalance(Number(user.id), payload);

        setWalletData((prevData: any) => ({
          ...prevData,
          balance: updatedBalance,
        }));

        setAddAmount("");
        setIsModalOpen(false);

        notification.success({
          message: "Balance updated successfully!",
        });
      } catch (err) {
        notification.error({
          message: "Failed to update balance.",
        });
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setAddAmount("");
  };

  const handleCreateWallet = async () => {
    if (!user) return null;

    try {
      const newWallet = await createWallet(Number(user.id), {
        bankAccountName,
        bankAccountNumber,
        balance: 0,
      });
      setWalletData(newWallet);
      setError(null);
      setIsOpenDialog(false);
    } catch (err) {
      notification.error({
        message: "Failed to create wallet.",
      });
    }
  };

  const handleUpdateBankInformation = async () => {
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
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount}$`,
    },
    {
      title: 'Transaction Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`text-${status === 'Completed' ? 'green' : 'red'}-500`}>{status}</span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <div className="flex w-full">
      <div className="flex flex-col items-center p-5 h-full w-full bg-gradient-to-b from-blue-100 to-blue-300">
        <h1 className="text-3xl font-semibold text-blue-700 mb-4">Wallet 💰</h1>

        {error ? (
          <div className="w-full lg:w-2/3 bg-blue-500 text-white p-6 rounded-lg shadow-xl flex flex-col items-center mb-5 transition-transform hover:scale-105">
            <Button
              onClick={() => setIsOpenDialog(true)}
              className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Create Wallet
            </Button>
          </div>
        ) : (
          <>
            <div className="w-full lg:w-2/3 bg-blue-600 text-white p-6 rounded-lg shadow-xl flex flex-col items-center mb-5 transition-transform hover:scale-105">
              <h2 className="text-2xl">Balance</h2>
              <p className="text-5xl font-bold mt-2">
                {walletData?.data.balance}$
              </p>
            </div>
            <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-lg mb-5">
              <h2 className="text-lg font-semibold text-blue-600 mb-2">Bank Account Information</h2>
              <p>
                <span className="font-semibold">Account Name:</span> {walletData?.data.bankAccountName || "N/a"}
              </p>
              <p>
                <span className="font-semibold">Account Number:</span> {walletData?.data.bankAccountNumber || "N/a"}
              </p>
              {!walletData?.bankAccountName && (
                <Button
                  onClick={() => setIsUpdateBankModalOpen(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Update Bank Information
                </Button>
              )}
            </div>

            <div className="w-full lg:w-2/3 flex justify-around mb-5">
              <button
                onClick={handleAddMoneyClick}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
              >
                <AiOutlinePlusCircle size={24} />
                <span className="font-semibold">Add money</span>
              </button>
              <button onClick={handleWithdrawClick} className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-400 transition duration-200 ease-in-out transform hover:scale-105">
                <AiOutlineMinusCircle size={24} />
                <span className="font-semibold">Withdraw</span>
              </button>
            </div>

            <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-lg mb-5">
              <h2 className="text-lg font-semibold text-blue-600 mb-2">Transaction History</h2>
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

      {isModalWithdrawOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3 text-center">
            <h2 className="font-semibold text-xl mb-4">Thank you for using our service!</h2>
            <p>Good luck!</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Modal
        title="Update Bank Information"
        open={isUpdateBankModalOpen}
        onCancel={() => setIsUpdateBankModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsUpdateBankModalOpen(false)} className="bg-gray-200 hover:bg-gray-300">
            Cancel
          </Button>,
          <Button key="update" type="primary" onClick={handleUpdateBankInformation} className="bg-blue-600 hover:bg-blue-700 text-white">
            Update
          </Button>,
        ]}
      >
        <div className="mb-4">
          <label className="text-blue-600 font-semibold">Bank Account Name:</label>
          <Input
            value={bankAccountName}
            onChange={(e) => setBankAccountName(e.target.value)}
            className="mt-2 p-3 border rounded-lg w-full"
          />
        </div>
        <div className="mb-4">
          <label className="text-blue-600 font-semibold">Bank Account Number:</label>
          <Input
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
            className="mt-2 p-3 border rounded-lg w-full"
          />
        </div>
      </Modal>

      <Modal
        title={<h2 className="text-xl font-semibold text-blue-600">Create Wallet</h2>}
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
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create
          </Button>,
        ]}
      >
        <div className="mb-4">
          <label className="text-blue-600 font-semibold">Bank Account Name:</label>
          <Input
            placeholder="Enter bank account name"
            value={bankAccountName}
            onChange={(e) => setBankAccountName(e.target.value)}
            className="mt-2 p-3 border rounded-lg w-full"
          />
        </div>
        <div className="mb-4">
          <label className="text-blue-600 font-semibold">Bank Account Number:</label>
          <Input
            placeholder="Enter bank account number"
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
            className="mt-2 p-3 border rounded-lg w-full"
          />
        </div>
      </Modal>

      <Modal
        title={<h2 className="text-xl font-semibold text-blue-600">Add Money to Wallet</h2>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} className="bg-gray-200 hover:bg-gray-300">
            Cancel
          </Button>,
          <Button
            key="add"
            type="primary"
            onClick={handleAddMoney}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!addAmount}
          >
            Add
          </Button>,
        ]}
      >
        <div className="mb-4">
          <label className="text-blue-600 font-semibold">Amount:</label>
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
