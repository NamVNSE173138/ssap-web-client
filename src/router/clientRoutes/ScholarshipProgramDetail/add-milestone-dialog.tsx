import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { createReviewMilestone } from "@/services/ApiServices/reviewMilestoneService";
import { useParams } from "react-router-dom";
import { FaTimes, FaCalendarAlt, FaPen, FaCheckCircle } from 'react-icons/fa';

interface AddMilestoneModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    fetchMilestones: () => void
}

const milestoneFormSchema = z.object({
    description: z.string().min(1, "Please enter a description"),
    fromDate: z.string(),
    toDate: z.string(),
    scholarshipProgramId: z.number()
}).refine(data => new Date(data.fromDate) < new Date(data.toDate), {
    message: "The 'From' date must be earlier than the 'To' date.",
    path: ["toDate"],
});

const AddMilestoneModal = ({ isOpen, setIsOpen, fetchMilestones }: AddMilestoneModalProps) => {
    const { id } = useParams<{ id: string }>();
    const form = useForm<z.infer<typeof milestoneFormSchema>>({
        resolver: zodResolver(milestoneFormSchema),
    });


    useEffect(() => {
        if (isOpen) {
            form.setValue("scholarshipProgramId", Number(id));
        }
    }, [isOpen, id, form]);

    const handleSubmit = async (values: z.infer<typeof milestoneFormSchema>) => {
        try {
            //console.log(values);
            const response = await createReviewMilestone(values);
            form.reset();
            //console.log("Service created successfully:", response.data);
            setIsOpen(false);
            fetchMilestones();
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
            Add New Review Milestone
          </h3>
          <button onClick={() => setIsOpen(false)} className="text-3xl text-gray-700 hover:text-sky-500 transition-all">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <Label className="mb-3">Description</Label>
            <div className="relative">
              <Input
                {...form.register("description")}
                placeholder="Enter description"
                className="p-3 pl-10 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <FaPen className="absolute left-3 top-3 text-gray-500" />
            </div>
            {form.formState.errors.description && <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>}
          </div>

          <div className="flex flex-col">
            <Label className="mb-3">From Date</Label>
            <div className="relative">
              <Input
                {...form.register("fromDate")}
                placeholder="Select start date"
                type="datetime-local"
                className="p-3 pl-10 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
            </div>
            {form.formState.errors.fromDate && <p className="text-red-500 text-sm">{form.formState.errors.fromDate.message}</p>}
          </div>

          <div className="flex flex-col">
            <Label className="mb-3">To Date</Label>
            <div className="relative">
              <Input
                {...form.register("toDate")}
                placeholder="Select end date"
                type="datetime-local"
                className="p-3 pl-10 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
            </div>
            {form.formState.errors.toDate && <p className="text-red-500 text-sm">{form.formState.errors.toDate.message}</p>}
          </div>

          <Button
            type="submit"
            className="bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-3 w-full"
          >
            <FaCheckCircle className="text-white text-xl" />
            Add Review Milestone
          </Button>
        </form>
      </motion.div>
    </div>
  )}
</AnimatePresence>
    );
};

export default AddMilestoneModal;
