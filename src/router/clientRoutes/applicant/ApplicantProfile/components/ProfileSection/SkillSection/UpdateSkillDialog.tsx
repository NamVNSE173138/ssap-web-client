import { getYearsToPresent } from "@/lib/dateUtils";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import {
  deleteApplicantSkill,
  updateApplicantSkill,
} from "@/services/ApiServices/applicantProfileService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { notification } from "antd";
import { ApplicantSkill } from "../../../types/Applicant";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog";
import { getAllSkills } from "@/services/ApiServices/skillService";

const UpdateSkillDialog = (props: any) => {
  const { open, setOpen, item, setRefresh } = props;

  const user = useSelector((state: RootState) => state.token.user);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState<boolean>(false);
  const [skills, setSkills] = useState<string[]>();
  const [skill, setSkill] = useState<ApplicantSkill>({
    id: 0,
    name: "",
    fromYear: 0,
    toYear: 0,
    type: "",
    description: "",
  });

  useEffect(() => {
    const fetchSkills = async () => {
      const response = await getAllSkills();
      const skillNames = response.data.map((skill: any) => skill.name);
      setSkills(skillNames);
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    setSkill(item);
  }, [item, open]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setSkill((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setIsProcessing(true);
    try {
      const payload = {
        name: skill.name,
        type: skill.type,
        fromYear: skill.fromYear,
        toYear: skill.toYear,
        description: skill.description,
      };
      await updateApplicantSkill(Number(user?.id), skill.id, payload);
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
      setIsProcessing(false);
      setRefresh(true);
    }
  };

  return (
    <div>
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
                    Update Skill Information
                  </Dialog.Title>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      What skill do you have?
                    </label>
                    <select
                      name="name"
                      value={skill.name || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                    >
                      <option value="" disabled>
                        Select Skill
                      </option>
                      {skills?.map((skill) => (
                        <option value={skill}>{skill}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      What is the type of your skill?
                    </label>
                    <select
                      name="type"
                      value={skill.type || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                    >
                      <option value="" disabled>
                        Select Type
                      </option>
                      <option value="Technical">Technical Skill</option>
                      <option value="Soft">Soft Skill</option>
                    </select>
                  </div>

                  <div className="mt-4 flex space-x-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <select
                        name="fromYear"
                        value={skill.fromYear || 0}
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
                        value={skill.toYear || 0}
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
                      value={skill.description}
                      onChange={handleChange}
                      className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                      rows={4}
                      placeholder="Provide brief description for your skill"
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

                  <button
                    disabled={isProcessing}
                    onClick={() => setIsConfirmationDialogOpen(true)}
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

      <DeleteConfirmationDialog
        isConfirmationDialogOpen={isConfirmationDialogOpen}
        setIsConfirmationDialogOpen={setIsConfirmationDialogOpen}
        setOpen={setOpen}
        setRefresh={setRefresh}
        itemId={item.id}
        handleDelete={deleteApplicantSkill}
      />
    </div>
  );
};

export default UpdateSkillDialog;
