import { calculateAge, formatNaturalDate } from "@/lib/dateUtils";
import * as Dialog from "@radix-ui/react-dialog";

const GeneralInfoSection = (props: any) => {
  const { profile } = props;
  return (
    <Dialog.Root>
      {/* Trigger for the Dialog */}
      <Dialog.Trigger asChild>
        <div className="mt-4 w-full text-sm space-y-2 cursor-pointer hover:ring-2 hover:ring-green-500 p-4 rounded-md shadow-sm border">
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

      {/* Dialog Content */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
          <Dialog.Title className="text-lg font-bold">
            Profile Details
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mb-4">
            Here is detailed information about the profile.
          </Dialog.Description>

          <div className="space-y-2 text-sm">
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

          {/* Close Button */}
          <div className="mt-4 flex justify-end">
            <Dialog.Close asChild>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Close
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default GeneralInfoSection;
