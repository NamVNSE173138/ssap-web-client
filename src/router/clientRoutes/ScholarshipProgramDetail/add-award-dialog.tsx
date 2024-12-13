import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createAwardMilestone } from "@/services/ApiServices/awardMilestoneService";
import { formatDate } from "@/lib/date-formatter";
import Select from "react-select";
import QuillEditor from "@/components/Quill/QuillEditor";
import { IoCalendar } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";

interface AddAwardDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    fetchAwards: () => void;
    reviewMilestones: any[];
    awardMilestones: any[];
    scholarship: any;
}



const AddAwardDialog = ({ isOpen, setIsOpen, fetchAwards, reviewMilestones, awardMilestones, scholarship }: AddAwardDialogProps) => {
    const { id } = useParams<{ id: string }>();

    const [fileType, setFileType] = useState<any>([]);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const typeOptions = [
        { value: 'Academic Transcript', label: 'Academic Transcript' },
        { value: 'Financial Report', label: 'Financial Report' },
    ];

    const awardFormSchema = z.object({
        fromDate: z.string(),
        toDate: z.string(),
        amount: z.number().min(1, "Amount must be greater than 0"),
        scholarshipProgramId: z.number(),
        note: z.string().optional(), // Optional note field
        awardMilestoneDocuments: z
            .array(
                z.object({
                    type: z.string(), // Validate each document
                })
            ).optional(),
    }).refine(data => new Date(data.fromDate) < new Date(data.toDate), {
        message: "The 'From' date must be earlier than the 'To' date.",
        path: ["toDate"], // This will add the error message to `toDate`
    }).refine(data => new Date(data.fromDate) > new Date(scholarship.deadline) && new Date(data.toDate) > new Date(scholarship.deadline), {
        message: `The 'From' and 'To' date must be later than the scholarship deadline. which is ${formatDate(scholarship.deadline)}`,
        path: ["toDate"], // This will add the error message to `toDate`
    }).refine(data => !reviewMilestones || reviewMilestones.length === 0 || reviewMilestones.every((review: any) => new Date(review.toDate) < new Date(data.fromDate)), {
        message: `The 'From' and 'To' date must be later than the all of review milestones. which is ${reviewMilestones.length > 0 ? formatDate(reviewMilestones.sort((a: any, b: any) =>
            new Date(a.toDate).getTime() - new Date(b.toDate).getTime())[reviewMilestones.length - 1].toDate) : ""}`,
        path: ["toDate"], // This will add the error message to `toDate`
    }).refine(data => !awardMilestones || awardMilestones.length === 0 || awardMilestones.every((award: any) => new Date(award.toDate) < new Date(data.fromDate)), {
        message: `The 'From' and 'To' date must be later than the all of award milestones before. which is ${awardMilestones.length > 0 ? formatDate(awardMilestones.sort((a: any, b: any) =>
            new Date(a.toDate).getTime() - new Date(b.toDate).getTime())[awardMilestones.length - 1].toDate) : ""}`,
        path: ["toDate"], // This will add the error message to `toDate`
    }).refine(data => Number(data.amount) <= scholarship.scholarshipAmount - awardMilestones.reduce((sum: number, award: any) => sum + award.amount, 0), {
        message: `The 'Amount' must be less than or equal to the remaining amount. which is ${scholarship.scholarshipAmount -
            awardMilestones.reduce((sum: number, award: any) => sum + award.amount, 0)}`,
        path: ["amount"], // This will add the error message to `toDate`
    }).refine(data => awardMilestones.length == scholarship.numberOfAwardMilestones - 1 || Number(data.amount) < scholarship.scholarshipAmount -
            awardMilestones.reduce((sum: number, award: any) => sum + award.amount, 0), {
        message: `The 'Amount' of the not last award milestone must be less than the remaining amount. which is ${scholarship.scholarshipAmount -
            awardMilestones.reduce((sum: number, award: any) => sum + award.amount, 0)}`,
        path: ["amount"], // This will add the error message to `toDate`
    }).refine(data => awardMilestones.length != scholarship.numberOfAwardMilestones - 1 || Number(data.amount) == scholarship.scholarshipAmount -
            awardMilestones.reduce((sum: number, award: any) => sum + award.amount, 0), {
        message: `The 'Amount' of the last award milestone must be equal to the remaining amount. which is ${scholarship.scholarshipAmount -
            awardMilestones.reduce((sum: number, award: any) => sum + award.amount, 0)}`,
        path: ["amount"], // This will add the error message to `toDate`
    });

    const form = useForm<z.infer<typeof awardFormSchema>>({
        resolver: zodResolver(awardFormSchema),
    });

    useEffect(() => {
            
        if (isOpen) {
            form.setValue("scholarshipProgramId", Number(id));
            
        }
    }, [isOpen, id, form]);

    useEffect(() => {
        form.setValue(
            "awardMilestoneDocuments",
            fileType.map((certificate: any) => ({ type: certificate.value }))
        );
    }, [fileType, form]);

    useEffect(() => {
            if(scholarship.numberOfAwardMilestones - 1 == awardMilestones.length){
                
                form.setValue("amount", scholarship.scholarshipAmount - 
                awardMilestones.reduce((sum: number, award: any) => sum + award.amount, 0));
            }
    }, [scholarship.numberOfAwardMilestones, awardMilestones.length, form]);


    const handleSubmit = async (values: z.infer<typeof awardFormSchema>) => {
        try {
            setSubmitLoading(true);
             await createAwardMilestone(values);
            //console.log(values);
            setFileType([]);
            form.reset();
            setSubmitLoading(false);
            //console.log("Service created successfully:", response.data);
            setIsOpen(false);
            fetchAwards();
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
                        className="bg-white  p-6 rounded-lg shadow-lg w-1/2"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-3xl text-blue-600 font-semibold">Add New Award Milestone</h3>
                            <button onClick={() => setIsOpen(false)} className="text-3xl text-gray-600 hover:text-red-600 transition">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col max-h-[500px] overflow-y-scroll gap-4">
                            <div>
                                <Label>From Date</Label>
                                <div className="flex items-center">
                                    <IoCalendar className="text-blue-500 mr-2" />
                                    <Input {...form.register("fromDate")} type="datetime-local" placeholder="From Date" />
                                </div>
                                {form.formState.errors.fromDate && <p className="text-red-500 text-sm">{form.formState.errors.fromDate.message}</p>}
                            </div>
                            <div>
                                <Label>To Date</Label>
                                <div className="flex items-center">
                                    <IoCalendar className="text-blue-500 mr-2" />
                                    <Input {...form.register("toDate")} type="datetime-local" placeholder="To Date" />
                                </div>                                
                                {form.formState.errors.toDate && <p className="text-red-500 text-sm">{form.formState.errors.toDate.message}</p>}
                            </div>
                            <div>
                                <Label>Required File Types</Label>
                                <Select
                                    isMulti
                                    options={typeOptions}
                                    value={fileType}
                                    onChange={setFileType}

                                    className="col-span-2"
                                />
                                {form.formState.errors.awardMilestoneDocuments && <p className="text-red-500 text-sm">{form.formState.errors.awardMilestoneDocuments.message}</p>}
                            </div>
                            <div>
                                <Label>Amount</Label>
                                <div className="flex items-center">
                                    <span className="text-md text-green-500 bg-gray-100 border border-gray-200 p-2 rounded-sm">$</span>
                                    <Input
                                        type="number"
                                        disabled={scholarship.numberOfAwardMilestones - 1 == awardMilestones.length}
                                        {...form.register("amount", {
        setValueAs: (value) => (value === "" ? undefined : Number(value)), // Convert string to number
        onChange: (e) => {
            // Handle validation-friendly updates here if needed
            form.setValue("amount", Number(e.target.value), {
                shouldValidate: true,
            });
        },
    })}                                        value={form.getValues("amount")}
                                        placeholder="Amount"
                                        className="ml-2 flex-1"
                                    />
                                </div>
                                {form.formState.errors.amount && <p className="text-red-500 text-sm">{form.formState.errors.amount.message}</p>}
                            </div>

                            <div>
                                <h1>Submission Guide</h1>
                                <QuillEditor value={form.getValues("note") ?? ""} onChange={(value: string) => {
                                    form.setValue("note", value)
                                }} />
                            </div>
                            <Button
                                className="bg-sky-500 hover:bg-sky-600 text-white w-full py-3 rounded-full mt-4"
                                type="submit"
                            >
                            {submitLoading ? (<div
                              className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin"
                              aria-hidden="true"
                            ></div>) :
                            (<>
                            <FaCheckCircle className="text-white text-xl" />
                            <span>Add Award Milestone</span>
                            </>)}

                               
                            </Button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default AddAwardDialog;
