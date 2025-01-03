import { setUser } from "@/reducers/tokenSlice";
import { updateApplicantProfileDetails } from "@/services/ApiServices/applicantProfileService";
import { uploadFile } from "@/services/ApiServices/fileUploadService";
import { RootState } from "@/store/store";
import * as Dialog from "@radix-ui/react-dialog";
import { notification } from "antd";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";

const AvatarSection = (props: any) => {
  const { profile, originalAvatar } = props;

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.token.user);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

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

        const payload = {
          avatarUrl: fileUrls[0],
          firstName: profile.firstName,
          lastName: profile.lastName,
          username: profile.username,
          phone: profile.phone,
          bio: profile.bio,
          address: profile.address,
          gender: profile.gender,
          birthdate: profile.birthDate,
          nationality: profile.nationality,
          ethnicity: profile.ethnicity,
          skills: profile.applicantSkills,
          experience: profile.applicantExperience,
          certificates: profile.applicantCertificates,
        };
        console.log("Change image payload: ", payload);
        await updateApplicantProfileDetails(Number(user?.id), payload);

        dispatch(setUser({ ...user, avatar: profile.avatar }));
      } catch (error) {
        console.log("Error: ", error);
        notification.error({
          message: "Error",
          description: "Profile updated failed",
        });
      } finally {
        setIsProcessing(false);
        setOpen(false);
      }
    }
  };

  const handleCancel = () => {
    setPreview(null);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
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
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
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
