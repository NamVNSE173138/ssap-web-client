import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

const ExperienceDialog = (props: any) => {
  const { open, setOpen } = props;

  // State to hold the input values for experience details
  const [experience, setExperience] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setExperience((prev) => ({ ...prev, [name]: value }));
  };

  // Handle saving changes (you can modify this to handle actual saving logic)
  const handleSaveChanges = () => {
    console.log("Saving experience: ", experience);
    // Close dialog after saving changes
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50 z-50" />
        <Dialog.Content className="fixed z-50 flex justify-center items-center inset-0 bg-white p-6 rounded-md shadow-lg max-w-[800px] w-[90%] h-auto max-h-[90vh] overflow-y-auto mx-auto my-auto self-start">
          <div className="relative w-full h-full max-h-[90vh]">
            <div className="absolute top-0 right-0 p-4">
              <Dialog.Close
                onClick={() => setOpen(false)}
                className="text-xl font-bold cursor-pointer hover:text-gray-500"
              >
                &times;
              </Dialog.Close>
            </div>

            <div className="flex flex-col justify-between h-full">
              <div>
                <Dialog.Title className="text-2xl font-bold">
                  Add Experience Information
                </Dialog.Title>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    What experience do you have?
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={experience.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                    placeholder="Enter your experience"
                  />
                </div>

                <div className="mt-4 flex space-x-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={experience.startDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={experience.endDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={experience.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                    rows={4}
                    placeholder="Provide brief description for your experience"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between space-x-4">
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ExperienceDialog;
