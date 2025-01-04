import { getYearsToPresent } from "@/lib/dateUtils";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { notification } from "antd";
import { addApplicantEducation } from "@/services/ApiServices/applicantProfileService";

const AddEducationDialog = (props: any) => {
  const { open, setOpen, setRefresh } = props;

  const user = useSelector((state: RootState) => state.token.user);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [education, setEducation] = useState<any>({
    id: 0,
    school: "",
    educationLevel: "",
    major: "",
    gpa: 0,
    fromYear: 0,
    toYear: 0,
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setEducation((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setIsProcessing(true);
    try {
      const payload = {
        school: education.school,
        educationLevel: education.educationLevel,
        major: education.major,
        gpa: education.gpa,
        fromYear: education.fromYear,
        toYear: education.toYear,
        description: education.description,
      };
      console.log(payload);
      await addApplicantEducation(Number(user?.id), payload);

      notification.success({
        message: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
      setIsProcessing(false);
      setRefresh(true);
    }
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
                  Add Education Information
                </Dialog.Title>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    What school have you enrolled in?
                  </label>
                  <input
                    type="text"
                    name="school"
                    value={education.school}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                    placeholder="Enter your school"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    What education level have you enrolled in?
                  </label>
                  <input
                    type="text"
                    name="educationLevel"
                    value={education.educationLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                    placeholder="Enter education level"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    What major have you studied at school?
                  </label>
                  <input
                    type="text"
                    name="major"
                    value={education.major}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                    placeholder="Enter your major"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    What is your GPA after finishing school?
                  </label>
                  <input
                    type="text"
                    name="gpa"
                    value={education.gpa}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                    placeholder="Enter your GPA"
                  />
                </div>

                <div className="mt-4 flex space-x-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <select
                      name="fromYear"
                      value={education.fromYear || 0}
                      onChange={handleChange}
                      className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                    >
                      <option value="" disabled>
                        Select Year
                      </option>
                      {getYearsToPresent(1973).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <select
                      name="toYear"
                      value={education.toYear || 0}
                      onChange={handleChange}
                      className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                    >
                      <option value="" disabled>
                        Select Year
                      </option>
                      {getYearsToPresent(1973).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={education.description || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                    rows={4}
                    placeholder="Provide brief description for your education at your school"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between space-x-4">
                <button
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

export default AddEducationDialog;
