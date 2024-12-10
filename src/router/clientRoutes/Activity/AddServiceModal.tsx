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
import { FormControl, MenuItem, Select, CircularProgress } from "@mui/material";
import { FaClipboardList, FaDollarSign, FaFileAlt, FaPen, FaPlus, FaTimes, FaCheckCircle } from "react-icons/fa";
import { IoDocumentText, IoListCircle, IoWarningOutline, IoPersonOutline, IoLockClosedOutline, IoShieldCheckmarkOutline, IoCalendarOutline, IoCloseCircleOutline } from "react-icons/io5";
import { notification } from "antd";
import { addService } from "@/services/ApiServices/serviceService";

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
  name: z
    .string()
    .min(1, "Please enter the service name")
    .max(40, "Service name must not exceed 40 characters"),
  description: z.string().min(1, "Please enter a description"),
  type: z
    .string()
    .min(1, "Please select a service type")
    .refine((value) => value !== "", { message: "Service type is required" }),
  price: z
    .string()
    .refine((value) => {
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue >= 0;
    }, { message: "Price must be a positive number" }),
  status: z.string().default("Active"),
  providerId: z.number(),
});


interface AddServiceModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  fetchServices: () => void;
}

const ServiceContractDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? "block" : "hidden"}`}
    >
      <div
        className="bg-white w-[90%] md:w-[60%] rounded-lg shadow-xl p-6 relative transform transition-all scale-95 hover:scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-blue-600 flex items-center gap-2">
            <IoDocumentText className="text-3xl text-blue-500" />
            Service Contract
          </h2>
          <IoCloseCircleOutline
            className="text-2xl cursor-pointer text-gray-600 hover:text-red-500 transition-all"
            onClick={onClose}
          />
        </div>

        <div className="border-b pb-4 mb-4 text-gray-700 leading-relaxed">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <IoListCircle className="text-blue-500" />
            Terms and Conditions
          </h3>
          <ul className="list-disc list-inside mt-3 space-y-3">
            <li className="flex items-start gap-2">
              <IoWarningOutline className="text-red-500 mt-1" />
              Service fees are non-refundable under any circumstances.
            </li>
            <li className="flex items-start gap-2">
              <IoPersonOutline className="text-blue-500 mt-1" />
              The service is provided exclusively to the registered individual.
            </li>
            <li className="flex items-start gap-2">
              <IoLockClosedOutline className="text-green-500 mt-1" />
              Your personal information will remain confidential and will not be shared with third parties unless required by law.
            </li>
            <li className="flex items-start gap-2">
              <IoShieldCheckmarkOutline className="text-yellow-500 mt-1" />
              You agree not to use the service for any illegal activities or against our policies.
            </li>
            <li className="flex items-start gap-2">
              <IoCalendarOutline className="text-purple-500 mt-1" />
              This contract is effective immediately upon signing and cannot be canceled once the service is activated.
            </li>
          </ul>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition flex items-center gap-2"
          >
            <IoCloseCircleOutline className="text-lg" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const AddServiceModal = ({ isOpen, setIsOpen, fetchServices }: AddServiceModalProps) => {
  const user = useSelector((state: RootState) => state.token.user);
  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
  });
  const [termsOpen, setTermsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      form.setValue("providerId", Number(user?.id));
      setSuccess(false);
    }
  }, [isOpen, user?.id, form]);

  const handleSubmit = async (values: z.infer<typeof serviceFormSchema>) => {
    try {
      setIsSubmitting(true);
      const response = await addService(values);
      console.log("Service created successfully:", response.data);
      setIsOpen(false);
      setSuccess(true);
      notification.success({ message: "Add service successfully!" })
      await fetchServices();
    } catch (error) {
      console.error("Error creating service:", error);
      notification.error({ message: "Add service error!" })
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-8 rounded-lg shadow-2xl w-full sm:w-1/2 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-semibold text-blue-600">Add New Service</h3>
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
                    <FaFileAlt className="text-blue-600" />
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
                  <div className="flex items-center gap-2  mb-2">
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
                  <FormControl fullWidth>
                    <Select
                      {...form.register("type")}
                      className="bg-gray-100"
                    >
                      {serviceTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {form.formState.errors.type && <p className="text-red-500">{form.formState.errors.type.message}</p>}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <FaDollarSign className="text-blue-600" />
                    <Label>Price</Label>
                  </div>
                  <Input
                    {...form.register("price")}
                    placeholder="Service Price"
                    className="input-custom"
                  />
                  {form.formState.errors.price && <p className="text-red-500">{form.formState.errors.price.message}</p>}
                </div>

                <div className="hidden">
                  <Label>Status</Label>
                  <Input hidden {...form.register("status")} value="Active" disabled />
                  {form.formState.errors.status && <p>{form.formState.errors.status.message}</p>}
                </div>

                <div className="flex items-center mt-4 text-gray-600">
                  <p className="text-sm">
                    When you click "Add", it means you have complied with our{" "}
                    <button
                      type="button"
                      className="text-blue-600 underline"
                      onClick={() => setTermsOpen(true)}
                    >
                      Contract Policy
                    </button>
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="bg-blue-600 text-white hover:bg-blue-700 mt-6 w-1/3 py-2 px-6 rounded-lg shadow-md transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} className="text-white" />
                    ) : (
                      <FaPlus className="mr-2" />
                    )}
                    {isSubmitting ? "Adding..." : "Add Service"}
                  </Button>
                </div>

              </form>

              {success && (
                <div className="mt-4 text-center text-green-600">
                  <FaCheckCircle className="inline mr-2" />
                  Service added successfully!
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ServiceContractDialog isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
};

export default AddServiceModal;
