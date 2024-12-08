import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaTimes,  FaPen, FaCheckCircle } from 'react-icons/fa';
import Select from "react-select";
import {  editMajorSkills } from "@/services/ApiServices/majorService";

interface EditMajorSkillModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    major: any;
    skillOptions: {type: string, value: string}[];
    fetchMajor: () => void;
}



const EditMajorSkillModal = ({ isOpen, setIsOpen, major, skillOptions, fetchMajor }: EditMajorSkillModalProps) => {
    const [skillIds, setSkillIds] = useState<any>([]);

const milestoneFormSchema = z.object({
    id: z.number(),
    skillIds: z
            .array(
                z.number(), // Validate each document
            ),
});

    const form = useForm<z.infer<typeof milestoneFormSchema>>({
        resolver: zodResolver(milestoneFormSchema),
    });


    useEffect(() => {
        if (isOpen) {
            form.setValue("id", Number(major.id));
            form.setValue("skillIds", major.skills.map((skill: any) =>  skill.id));
            setSkillIds(major.skills.map((skill: any) =>  {return {label: skill.name, value: skill.id}}));
        }
    }, [isOpen, form]);

    useEffect(() => {
        form.setValue(
            "skillIds",
            skillIds.map((certificate: any) =>  certificate.value)
        );
    }, [skillIds, form]);

    const handleSubmit = async (values: z.infer<typeof milestoneFormSchema>) => {
        try {
              await editMajorSkills(values.id, values);
            form.reset();
            //console.log("Service created successfully:", response.data);
            setIsOpen(false);
            fetchMajor();
        } catch (error) {
            console.error("Error creating service:", error);
        }
    };
    

    return (
        <AnimatePresence>
  {isOpen && (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-lg shadow-xl w-11/12 sm:w-1/2 lg:w-1/3"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
            <FaPen className="text-sky-500" />
            Edit Major
          </h3>
          <button onClick={() => {setIsOpen(false); form.reset()}} className="text-3xl text-gray-700 hover:text-sky-500 transition-all">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <Label className="mb-3">Skills</Label>
            <div className="relative">
              <Select
                isMulti
                options={skillOptions}
                value={skillIds}
                onChange={setSkillIds}
                className="col-span-2"
              />
            </div>
            {form.formState.errors.skillIds && <p className="text-red-500 text-sm">{form.formState.errors.skillIds.message}</p>}
          </div>
              

          <Button
            type="submit"
            className="bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-3 w-full"
          >
            <FaCheckCircle className="text-white text-xl" />
            Edit Major
          </Button>
        </form>
      </motion.div>
    </div>
  )}
</AnimatePresence>
    );
};

export default EditMajorSkillModal;
