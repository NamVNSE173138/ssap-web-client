import { uploadFile } from "@/services/ApiServices/fileUploadService";
import * as Dialog from "@radix-ui/react-dialog";
import { notification } from "antd";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

const AvatarSection = (props: any) => {
  const { originalAvatar } = props;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const onDrop = (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile)); // Create a preview URL for the image
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, // Accept only image files
  });

  const handleSave = async () => {
    setIsProcessing(true);
    if (file) {
      try {
        const uploadFileResponse = await uploadFile([file]);
        const fileUrls = uploadFileResponse.data;
        console.log(fileUrls[0]);
      } catch (error) {
        notification.success({
          message: "Success",
          description: "Profile updated successfully",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleCancel = () => {
    setPreview(null);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full overflow-hidden hover:ring-2 hover:ring-green-500">
          {originalAvatar ? (
            <img
              src={originalAvatar}
              alt="Avatar Preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-sm text-gray-500">Upload Avatar</span>
          )}
        </button>
      </Dialog.Trigger>

      {/* Dialog */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
          <Dialog.Title className="text-lg font-bold">
            Upload Avatar
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mb-4">
            Drag and drop an image, or click to select a file.
          </Dialog.Description>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`w-full h-40 border-2 ${
              isDragActive ? "border-blue-500" : "border-dashed border-gray-300"
            } rounded-lg flex items-center justify-center text-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="object-cover w-32 h-32 rounded-lg"
              />
            ) : isDragActive ? (
              <p className="text-blue-500">Drop the image here...</p>
            ) : (
              <p className="text-gray-500">
                Drag & drop an image, or click to select one
              </p>
            )}
          </div>

          {/* Save button */}
          <div className="mt-4 flex justify-end space-x-2">
            <Dialog.Close asChild>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              disabled={!file}
            >
              Save Changes
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AvatarSection;
