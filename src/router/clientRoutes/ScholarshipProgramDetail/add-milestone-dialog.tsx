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
    path: ["toDate"], // This will add the error message to `toDate`
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
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white p-6 rounded-lg shadow-lg w-1/2"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl mb-10">Add New Review Milestone</h3>
                            <button onClick={() => setIsOpen(false)} className="text-xl">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                            <div>
                                <Label>Description</Label>
                                <Input {...form.register("description")} placeholder="Description" />
                                {form.formState.errors.description && <p>{form.formState.errors.description.message}</p>}
                            </div>
                            <div>
                                <Label>From Date</Label>
                                <Input {...form.register("fromDate")} placeholder="From Date" type="datetime-local" />
                                {form.formState.errors.fromDate && <p>{form.formState.errors.fromDate.message}</p>}
                            </div>
                            <div>
                                <Label>To Date</Label>
                                <Input {...form.register("toDate")} placeholder="To Date" type="datetime-local" />
                                {form.formState.errors.toDate && <p>{form.formState.errors.toDate.message}</p>}
                            </div>
                            <Button type="submit">Add Review Milestone</Button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddMilestoneModal;
