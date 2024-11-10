import { useState, useEffect } from "react";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { Spin, Modal, Input, Button, notification } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { createWallet, getAccountWallet, updateWalletBalance } from "@/services/ApiServices/accountService";

const Wallet = () => {
  const user = useSelector((state: RootState) => state.token.user);
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false); // Trạng thái dialog tạo ví
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user) return;
      try {
        const data = await getAccountWallet(Number(user?.id));
        console.log(data)
        if (data) {
          setWalletData(data);
          setLoading(false);
        } else {
          setError("Please create your own wallet.");
          setLoading(false);
          setIsOpenDialog(true); // Mở dialog tạo ví khi không có ví
        }
      } catch (err) {
        setError("Error fetching wallet data.");
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [user?.id]);

  const handleAddMoneyClick = () => {
    setIsModalOpen(true);
  };

  const handleAddMoney = async () => {
    if (!user) return null;
    if (walletData) {
      try {
        const updatedBalance = walletData.balance + parseInt(addAmount);
        const payload = {
          updateWalletBalanceDto: {
            balance: updatedBalance,
          },
        };

        // Gửi yêu cầu API với payload
        await updateWalletBalance(Number(user.id), payload);
        
        // Cập nhật lại trạng thái ví
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

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="flex w-full">
      <div className="flex flex-col items-center p-5 h-full w-full bg-gradient-to-b from-blue-100 to-blue-300">
        <h1 className="text-3xl font-semibold text-blue-700 mb-4">Wallet</h1>

        {error ? (
          <div className="w-full lg:w-1/2 bg-blue-500 text-white p-6 rounded-lg shadow-xl flex flex-col items-center mb-5 transition-transform hover:scale-105">
            <Button
              onClick={() => setIsOpenDialog(true)}
              className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Create Wallet
            </Button>
          </div>
        ) : (
          <>
            <div className="w-full lg:w-1/2 bg-blue-600 text-white p-6 rounded-lg shadow-xl flex flex-col items-center mb-5 transition-transform hover:scale-105">
              <h2 className="text-2xl">Balance</h2>
              <p className="text-5xl font-bold mt-2">
                {walletData?.balance ? walletData?.balance.toLocaleString() : "N/a"} VND
              </p>
            </div>

            <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-lg mb-5">
              <h2 className="text-lg font-semibold text-blue-600 mb-2">Bank Account Information</h2>
              <p>
                <span className="font-semibold">Account Name:</span> {walletData?.bankAccountName || "N/a"}
              </p>
              <p>
                <span className="font-semibold">Account Number:</span> {walletData?.bankAccountNumber || "N/a"}
              </p>
              {!walletData?.bankAccountName && (
                <Button
                  onClick={() => setIsOpenDialog(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Bank Info
                </Button>
              )}
            </div>

            <div className="w-full lg:w-1/2 flex justify-around mb-5">
              <button
                onClick={handleAddMoneyClick}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
              >
                <AiOutlinePlusCircle size={24} />
                <span className="font-semibold">Add money</span>
              </button>
              <button className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-400 transition duration-200 ease-in-out transform hover:scale-105">
                <AiOutlineMinusCircle size={24} />
                <span className="font-semibold">Withdraw</span>
              </button>
            </div>

            <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-lg mb-5">
              <h2 className="text-lg font-semibold text-blue-600 mb-2">Transaction History</h2>
              <div className="flex flex-col gap-2"></div>
            </div>
          </>
        )}
      </div>

      {/* Modal để tạo ví */}
      <Modal
        title={<h2 className="text-xl font-semibold text-blue-600">Create Wallet</h2>}
        open={isOpenDialog} // Thay 'visible' thành 'open'
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

      {/* Modal để thêm tiền */}
      <Modal
        title={<h2 className="text-xl font-semibold text-blue-600">Add Money to Wallet</h2>}
        open={isModalOpen} // Thay 'visible' thành 'open'
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
