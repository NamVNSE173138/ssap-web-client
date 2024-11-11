import { useState } from "react";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { Spin, Modal, Input, Button } from "antd";
import { Sidebar } from "@/components/AccountInfo";

const Wallet = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addAmount, setAddAmount] = useState("");

  const walletData = {
    bankAccountName: "Nguyen Van A",
    bankAccountNumber: "1234567890",
    balance: 1500000,
  };

  const handleAddMoneyClick = () => {
    setIsModalOpen(true);
  };

  const handleAddMoney = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setAddAmount("");
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="flex w-full">
      <Sidebar className="col-start-1 col-end-3" />

      <div className="flex flex-col items-center p-5 h-full w-full">
        <h1 className="text-2xl font-semibold text-blue-600 mb-4">Wallet</h1>

        <div className="w-full lg:w-1/2 bg-blue-600 text-white p-6 rounded-lg shadow-lg flex flex-col items-center mb-5">
          <h2 className="text-xl">Balance</h2>
          <p className="text-4xl font-bold mt-2">
            {walletData.balance.toLocaleString()} VND
          </p>
        </div>

        <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-lg mb-5">
          <h2 className="text-lg font-semibold text-blue-600 mb-2">Bank Account Information</h2>
          <p>
            <span className="font-semibold">Account Name:</span> {walletData.bankAccountName}
          </p>
          <p>
            <span className="font-semibold">Account Number:</span> {walletData.bankAccountNumber}
          </p>
        </div>

        <div className="w-full lg:w-1/2 flex justify-around mb-5">
          <button onClick={handleAddMoneyClick} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-500 transition">
            <AiOutlinePlusCircle size={24} />
            <span className="font-semibold">+ Add money to wallet</span>
          </button>
          <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-400 transition">
            <AiOutlineMinusCircle size={24} />
            <span className="font-semibold">Withdraw</span>
          </button>
        </div>

        <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-blue-600 mb-2">Transaction History</h2>
          <div className="flex flex-col gap-2">
            {[{ date: "2023-10-01", description: "Deposit", amount: 500000 }, { date: "2023-09-15", description: "Withdrawal", amount: -300000 }].map((transaction, index) => (
              <div key={index} className="flex justify-between p-3 border-b">
                <p>{transaction.date}</p>
                <p>{transaction.description}</p>
                <p className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                  {transaction.amount.toLocaleString()} VND
                </p>
              </div>
            ))}
          </div>
        </div>

        <Modal
          title={<h2 className="text-xl font-semibold text-blue-600">Add Money to Wallet</h2>}
          visible={isModalOpen}
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
            <p className="text-blue-600 font-semibold">Current Balance:</p>
            <p className="text-2xl font-bold">{walletData.balance.toLocaleString()} VND</p>
          </div>
          <div>
            <label className="text-blue-600 font-semibold">Amount to Add:</label>
            <Input
              placeholder="Enter amount"
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              className="mt-2 p-2 border rounded-lg w-full"
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Wallet;
