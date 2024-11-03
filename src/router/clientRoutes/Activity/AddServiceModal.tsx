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

interface AddServiceModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    fetchServices: () => void
}

const serviceFormSchema = z.object({
    name: z.string().min(1, "Please enter the service name"),
    description: z.string().min(1, "Please enter a description"),
    type: z.string().min(1, "Please select a service type"),
    price: z.string().refine((value) => !isNaN(parseFloat(value)), {
        message: "Price must be a number",
    }),
    status: z.string().default("Active"),
    duration: z.string(),
    providerId: z.number()
});

const AddServiceModal = ({ isOpen, setIsOpen, fetchServices }: AddServiceModalProps) => {
    const user = useSelector((state: RootState) => state.token.user);
    const form = useForm<z.infer<typeof serviceFormSchema>>({
        resolver: zodResolver(serviceFormSchema),
    });

    useEffect(() => {
        if (isOpen) {
            form.setValue("providerId", Number(user?.id));
        }
    }, [isOpen, user?.id, form]);

    const handleSubmit = async (values: z.infer<typeof serviceFormSchema>) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/services`, values);
            console.log("Service created successfully:", response.data);
            setIsOpen(false);
            await fetchServices();
        } catch (error) {
            console.error("Error creating service:", error);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white p-6 rounded-lg shadow-lg w-1/2"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl mb-10">Add New Service</h3>
                            <button onClick={() => setIsOpen(false)} className="text-xl">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                            <div>
                                <Label>Name</Label>
                                <Input {...form.register("name")} placeholder="Service Name" />
                                {form.formState.errors.name && <p>{form.formState.errors.name.message}</p>}
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Input {...form.register("description")} placeholder="Description" />
                                {form.formState.errors.description && <p>{form.formState.errors.description.message}</p>}
                            </div>
                            <div>
                                <Label>Type</Label>
                                <Input {...form.register("type")} placeholder="Service Type" />
                                {form.formState.errors.type && <p>{form.formState.errors.type.message}</p>}
                            </div>
                            <div>
                                <Label>Price</Label>
                                <Input {...form.register("price")} placeholder="Price" type="number" />
                                {form.formState.errors.price && <p>{form.formState.errors.price.message}</p>}
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Input
                                    {...form.register("status")}
                                    value={"Active"}
                                    disabled
                                />
                                {form.formState.errors.status && <p>{form.formState.errors.status.message}</p>}
                            </div>
                            <div>
                                <Label>Complete Date</Label>
                                <Input {...form.register("duration")} placeholder="Duration" type="date" />
                                {form.formState.errors.duration && <p>{form.formState.errors.duration.message}</p>}
                            </div>
                            <div>
                                <Label>Provider ID</Label>
                                <Input 
                                    {...form.register("providerId")} 
                                    placeholder="Provider ID" 
                                    disabled
                                />
                                {form.formState.errors.providerId && <p>{form.formState.errors.providerId.message}</p>}
                            </div>
                            <Button type="submit">Add Service</Button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddServiceModal;