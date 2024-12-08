import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl, MenuItem, Select } from "@mui/material";
import { FaClipboardList, FaCog, FaDollarSign, FaPen, FaTimes } from "react-icons/fa";
import { useEffect } from "react";

interface EditServiceModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  fetchServices: () => void;
  serviceData: any;
}

const serviceTypes = [
  { value: "CV_REVIEW", label: "CV Review" },
  { value: "TRANSLATION", label: "Translation" },
  { value: "ESSAY_WRITING", label: "Essay Writing Assistance" },
  { value: "APPLICATION_REVIEW", label: "Application Review" },
  { value: "INTERVIEW_COACHING", label: "Interview Coaching" },
  { value: "RECOMMENDATION_LETTER", label: "Recommendation Letter Writing" },
  { value: "SCHOLARSHIP_SEARCH", label: "Scholarship Search Assistance" },
  { value: "DOCUMENT_PROOFREADING", label: "Document Proofreading" },
  { value: "RESEARCH_ASSISTANCE", label: "Research Assistance" },
  { value: "LANGUAGE_SUPPORT", label: "Language Support for Non-Native Speakers" },
  { value: "FINANCIAL_AID_GUIDANCE", label: "Financial Aid Guidance" },
  { value: "PERSONALIZED_STRATEGY", label: "Personalized Scholarship Strategy" },
];

const serviceFormSchema = z.object({
  name: z.string().min(1, "Please enter the service name"),
  description: z.string().min(1, "Please enter a description"),
  type: z.string().min(1, "Please select a service type"),
  price: z.string().refine((value) => !isNaN(parseFloat(value)), {
    message: "Price must be a number",
  }),
  status: z.string().default("Active"),
  providerId: z.number()
});

const EditServiceModal = ({ isOpen, setIsOpen, fetchServices, serviceData }: EditServiceModalProps) => {
  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: serviceData?.name || "",
      description: serviceData?.description || "",
      type: serviceData?.type || "",
      price: serviceData?.price || "",
      status: serviceData?.status || "Active",
      providerId: serviceData?.providerId || "",
    }
  });

  const handleSubmit = async (values: z.infer<typeof serviceFormSchema>) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/services/${serviceData.id}`, values);
      console.log("Service updated successfully:", response.data);
      setIsOpen(false);
      await fetchServices();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  useEffect(() => {
    if (serviceData) {
      form.reset({
        name: serviceData?.name || "",
        description: serviceData?.description || "",
        type: serviceData?.type || "",
        price: serviceData?.price || "",
        status: serviceData?.status || "Active",
        providerId: serviceData?.providerId || "",
      });
    }
  }, [isOpen, serviceData, form]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-8 rounded-lg shadow-2xl w-1/2 max-h-[80vh] overflow-y-auto animate__animated animate__fadeIn"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-semibold text-blue-600">Edit Service</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl hover:text-red-500 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <FaPen className="text-blue-600" />
                  <Label>Name</Label>
                </div>
                <Input
                  {...form.register("name")}
                  placeholder="Service Name"
                  className="input-custom"
                />
                {form.formState.errors.name && <p className="text-red-500">{form.formState.errors.name.message}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <FaPen className="text-blue-600" />
                  <Label>Description</Label>
                </div>
                <textarea
                  {...form.register("description")}
                  placeholder="Description"
                  className="w-full p-2 mb-2 border border-gray-300 rounded-lg resize-y min-h-[100px] hover:border-blue-400 focus:border-blue-500 transition-all"
                />
                {form.formState.errors.description && <p className="text-red-500">{form.formState.errors.description.message}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <FaClipboardList className="text-blue-600" />
                  <Label>Service Type</Label>
                </div>
                <FormControl fullWidth variant="outlined" className="mb-4">
                  <Select
                    labelId="service-type-label"
                    {...form.register("type")}
                    defaultValue={serviceData?.type || ""}
                    error={!!form.formState.errors.type}
                    className="select-custom hover:border-blue-400 focus:border-blue-500"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {serviceTypes.map((service) => (
                      <MenuItem key={service.value} value={service.value}>
                        <FaCog className="mr-2" />
                        {service.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {form.formState.errors.type && <p className="text-red-500 text-sm">{form.formState.errors.type.message}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <FaDollarSign className="text-blue-600" />
                  <Label>Price($)</Label>
                </div>
                <Input
                  {...form.register("price")}
                  placeholder="Price"
                  type="number"
                  className="input-custom"
                />
                {form.formState.errors.price && <p className="text-red-500">{form.formState.errors.price.message}</p>}
              </div>

              <div className="hidden">
                <Label>Status</Label>
                <Input hidden {...form.register("status")} value="Active" disabled />
                {form.formState.errors.status && <p>{form.formState.errors.status.message}</p>}
              </div>
              <div className="hidden">
                <Label>Provider ID</Label>
                <Input {...form.register("providerId")} placeholder="Provider ID" disabled />
                {form.formState.errors.providerId && <p>{form.formState.errors.providerId.message}</p>}
              </div>

              <Button
                type="submit"
                className="self-center mt-6 w-1/3 py-2 px-6 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all"
              >
                <FaPen className="mr-2" />
                Update Service
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditServiceModal;
