import * as Dialog from "@radix-ui/react-dialog";
import { notification } from "antd";
import { useState } from "react";

const DeleteConfirmationDialog = (props: any) => {
  const {
    isConfirmationDialogOpen,
    setIsConfirmationDialogOpen,
    setOpen,
    setRefresh,
    itemId,
    handleDelete,
  } = props;

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleDeleteItem = async () => {
    setIsProcessing(true);
    try {
      await handleDelete(itemId);
      notification.success({
        message: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Profile updated failed",
      });
    } finally {
      setOpen(false);
      setIsConfirmationDialogOpen(false);
      setIsProcessing(false);
      setRefresh(true);
    }
  };

  return (
    <Dialog.Root
      open={isConfirmationDialogOpen}
      onOpenChange={setIsConfirmationDialogOpen}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50 z-50" />
        <Dialog.Content className="fixed z-50 flex justify-center items-center inset-0 bg-white p-6 rounded-md shadow-lg max-w-[400px] w-[45%] h-auto max-h-[45vh] overflow-y-auto mx-auto my-auto self-start">
          <div className="text-center">
            <Dialog.Title className="text-lg font-semibold">
              Are you sure you want to delete this?
            </Dialog.Title>
            <p className="mt-2 text-sm text-gray-600">
              This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                disabled={isProcessing}
                onClick={handleDeleteItem}
                className="px-8 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-red-600"
              >
                {isProcessing ? "Processing..." : "Yes"}
              </button>

              <button
                disabled={isProcessing}
                onClick={() => setIsConfirmationDialogOpen(false)}
                className="px-8 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                No
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteConfirmationDialog;
