import {
  calculateAge,
  formatDateOnly,
  formatNaturalDate,
} from "@/lib/dateUtils";
import { updateApplicantGeneralInformation } from "@/services/ApiServices/applicantProfileService";
import { RootState } from "@/store/store";
import * as Dialog from "@radix-ui/react-dialog";
import { notification } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const GeneralInfoSection = (props: any) => {
  const { profile, setRefresh } = props;

  const user = useSelector((state: RootState) => state.token.user);

  const [open, setOpen] = useState<boolean>(false);
  const [form, setForm] = useState({
    birthDate: "",
    gender: "",
    nationality: "",
    ethnicity: "",
    bio: "",
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    setForm(profile);
  }, [profile, open]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
    console.log(form);
  };

  const handleSaveChanges = async () => {
    setIsProcessing(true);
    try {
      const payload = {
        avatarUrl: profile.avatar,
        birthDate: formatDateOnly(form.birthDate),
        gender: form.gender,
        nationality: form.nationality,
        ethnicity: form.ethnicity,
        bio: form.bio,
      };
      console.log("Payload for general info: ", payload);
      await updateApplicantGeneralInformation(Number(user?.id), payload);
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
      setIsProcessing(false);
      setRefresh(true);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div className="bg-white mt-4 w-full text-sm space-y-2 cursor-pointer hover:ring-2 hover:ring-green-500 p-4 rounded-md shadow-sm border">
          <p>
            <strong>Birthdate:</strong> {formatNaturalDate(profile.birthDate)}
          </p>
          <p>
            <strong>Age:</strong> {calculateAge(profile.birthDate)}
          </p>
          <p>
            <strong>Gender:</strong> {profile.gender || "N/A"}
          </p>
          <p>
            <strong>Nationality:</strong> {profile.nationality || "N/A"}
          </p>
          <p>
            <strong>Ethnicity:</strong> {profile.ethnicity || "N/A"}
          </p>
          <p>
            <strong>Bio:</strong> {profile.bio || "N/A"}
          </p>
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50 z-50" />
        <Dialog.Content className="fixed z-50 flex justify-center items-center inset-0 bg-white p-6 rounded-md shadow-lg max-w-[800px] w-[90%] h-auto max-h-[90vh] overflow-y-auto mx-auto my-auto self-start">
          <div className="relative w-full h-full max-h-[90vh]">
            <div className="absolute top-0 right-0 p-4">
              <Dialog.Close className="text-xl font-bold cursor-pointer hover:text-gray-500">
                &times;
              </Dialog.Close>
            </div>

            <div className="flex flex-col justify-between h-full">
              <div>
                <Dialog.Title className="text-2xl font-bold">
                  Update General Information
                </Dialog.Title>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Birthdate
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    defaultValue=""
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Nationality
                  </label>
                  <select
                    name="nationality"
                    defaultValue=""
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                  >
                    <option value="" disabled>
                      Select Nationality
                    </option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="China">China</option>
                    <option value="France">France</option>
                    <option value="America">America</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Ethnicity
                  </label>
                  <select
                    name="ethnicity"
                    defaultValue=""
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                  >
                    <option value="" disabled>
                      Select Ethnicity
                    </option>
                    <option value="Asian">Asian</option>
                    <option value="Caucasion">Caucasion</option>
                    <option value="Black/African">Black/African</option>
                    <option value="">Prefer Not To Answer</option>
                  </select>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                    rows={4}
                    placeholder="Share your background, interests, and experiences to stand out from other applicants."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between space-x-4">
                <button
                  disabled={isProcessing}
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  {isProcessing ? "Processing..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default GeneralInfoSection;
