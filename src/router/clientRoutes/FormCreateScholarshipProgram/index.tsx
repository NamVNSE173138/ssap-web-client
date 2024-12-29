import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { BASE_URL } from "@/constants/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select, { MultiValue } from "react-select";
import RouteNames from "@/constants/routeNames";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { uploadFile } from "@/services/ApiServices/fileUploadService";
import ScreenSpinner from "@/components/ScreenSpinner";
import { FaInfoCircle, FaTrophy } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import ScholarshipContractDialogForFunder from "../funder/FunderProfile/components/Activity/ScholarshipContractDialogForFunder";
import InformationStep from "./informationStep";
import UcmStep from "./ucmStep";
import DocumentStep from "./documentStep";
import ReviewMilestoneStep from "./reviewMilestoneStep";
import AwardMilestoneStep from "./awardMilestoneStep";

interface OptionType {
  value: string;
  label: string;
}

const formSchema = z.object({
  scholarshiptype: z
    .string()
    .min(1, "Please choose type of scholarship program"),
  name: z.string().min(1, "Please enter the name"),
  description: z.string().min(1, "Please enter the description"),
  price: z.string().refine((price) => !isNaN(parseFloat(price)), {
    message: "Price must be a number",
  }),
  quantity: z.string().refine((quantity) => !isNaN(parseInt(quantity)), {
    message: "Quantity must be a number",
  }),
  quantityOfAwardMilestones: z
    .string()
    .refine((quantity) => !isNaN(parseInt(quantity)), {
      message: "Number of award milestones must be a number",
    }),
  imageUrl: z.string().optional(),
  deadline: z.string().min(1, "Please enter a deadline date"),
  status: z.string(),
  university: z.string().min(1, "Please choose a university"),
  certificate: z
    .array(z.string())
    .min(1, "Please choose at least one certificate"),
  major: z.string().min(1, "Please choose a major"),
  criteria: z
    .array(
      z.object({
        name: z.string().min(1, "Criterion name is required"),
        description: z.string().min(1, "Criterion description is required"),
      })
    )
    .min(1, "Please add at least one criterion"),
  reviewMilestones: z
    .array(
      z.object({
        description: z
          .string()
          .min(1, "Review milestone description is required"),
        fromDate: z.string().min(1, "From Date is required"),
        toDate: z.string().min(1, "To Date is required"),
      })
    )
    .min(2, "Please add at least two review milestones") // At least "Review Application" and "Interview"
    .refine(
      (milestones) => {
        const reviewMilestone = milestones[0];
        const interviewMilestone = milestones[1];
        console.log(new Date(reviewMilestone.fromDate));
        console.log(new Date(interviewMilestone.fromDate));

        // Check if dates are valid
        if (
          reviewMilestone &&
          interviewMilestone &&
          new Date(interviewMilestone.fromDate) <=
            new Date(reviewMilestone.toDate)
        ) {
          return false;
        }

        return true;
      },
      {
        message:
          "Interview From Date must be after Application Review's To Date",
      }
    ),
});

const FormCreateScholarshipProgram = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [categories, setCategories] = useState<OptionType[]>([]);
  const [certificates, setCertificates] = useState<OptionType[]>([]);
  const [universities, setUniversities] = useState<OptionType[]>([]);
  const [majors, setMajors] = useState<OptionType[]>([]);
  const [imageFile, setImageFile] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isContractOpen, setContractOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedUniversity, setSelectedUniversity] =
    useState<OptionType | null>(null);
  const [selectedCertificates, setSelectedCertificates] = useState<
    OptionType[]
  >([]);
  const [selectedMajor, setSelectedMajor] = useState<OptionType | null>(null);

  const navigate = useNavigate();
  const funder = useSelector((state: any) => state.token.user);
  const funderId = funder?.id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scholarshiptype: "",
      name: "",
      description: "",
      price: "",
      quantity: "",
      quantityOfAwardMilestones: "",
      imageUrl: "",
      deadline: "",
      status: "ACTIVE",
      university: "",
      certificate: [],
      major: "",
      criteria: [{ name: "", description: "" }],
      reviewMilestones: [
        { description: "Application Review", fromDate: "", toDate: "" },
        { description: "Interview", fromDate: "", toDate: "" },
      ],
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      if (!file.type.startsWith("image/")) {
        notification.error({
          message: "Invalid File",
          description: "Please upload an image file.",
        });
        return;
      }
      setImageFile([file]);
    }
  };

  const handleCategoryChange = (selectedOption: OptionType | null) => {
    setSelectedCategory(selectedOption ? selectedOption.value : "");
    form.clearErrors("scholarshiptype");
  };

  const handleUniversityChange = (selectedOption: OptionType | null) => {
    setSelectedUniversity(selectedOption);
    form.clearErrors("university");
  };

  const handleCertificatesChange = (
    selectedOptions: MultiValue<OptionType>
  ) => {
    setSelectedCertificates(Array.from(selectedOptions) || []);
    form.clearErrors("certificate");
  };

  const handleMajorChange = (selectedOption: OptionType | null) => {
    setSelectedMajor(selectedOption);
    form.clearErrors("major");
  };

  useEffect(() => {
    form.setValue("scholarshiptype", selectedCategory);
  }, [selectedCategory, form]);

  useEffect(() => {
    form.setValue(
      "university",
      selectedUniversity ? selectedUniversity.value : ""
    );
  }, [selectedUniversity, form]);

  useEffect(() => {
    form.setValue(
      "certificate",
      selectedCertificates.map((certificate) => certificate.value)
    );
  }, [selectedCertificates, form]);

  useEffect(() => {
    form.setValue("major", selectedMajor ? selectedMajor.value : "");
  }, [selectedMajor, form]);

  useEffect(() => {
    fetchCategories();
    fetchUniversities();
    fetchCertificates();
    fetchMajors();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/categories`);
      setCategories(
        response.data.data.map((category: any) => ({
          value: category.id.toString(),
          label: category.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchUniversities = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/universities`);
      setUniversities(
        response.data.data.map((university: any) => ({
          value: university.id.toString(),
          label: university.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching universities", error);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/certificates`);
      setCertificates(
        response.data.data.map((certificate: any) => ({
          value: certificate.id.toString(),
          label: certificate.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching certificates", error);
    }
  };

  const fetchMajors = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/majors`);
      setMajors(
        response.data.data.map((major: any) => ({
          value: major.id.toString(),
          label: major.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching majors", error);
    }
  };

  const handleAddNewScholarshipProgram = async (
    values: z.infer<typeof formSchema>
  ) => {
    setIsLoading(true);
    if (!isChecked) {
      notification.error({
        message: "Error",
        description: "You must fill in check box to create.",
      });
      setIsLoading(false);
      return;
    }
    try {
      if (!funderId) throw new Error("Funder ID not available");

      const imageUrl = await uploadFile(imageFile);
      if (imageUrl) {
        values.imageUrl = imageUrl.data.toString();
      }

      const postData = {
        ...values,
        scholarshipAmount: parseFloat(values.price),
        description: values.description,
        numberOfScholarships: parseInt(values.quantity),
        numberOfAwardMilestones: parseInt(values.quantityOfAwardMilestones),
        funderId,
        categoryId: parseInt(values.scholarshiptype),
        universityId: parseInt(values.university),
        certificateIds: values.certificate.map((id) => parseInt(id)),
        majorId: parseInt(values.major),
        deadline: new Date(values.deadline).toISOString(),
      };

      const response = await axios.post(
        `${BASE_URL}/api/scholarship-programs`,
        postData
      );
      setIsLoading(false);
      if (response.status === 200 || response.status === 201) {
        notification.success({
          message: "Scholarship Program Created",
          description: "The program was successfully created.",
        });
        navigate(RouteNames.FUNDER_PROFILE);
      }
    } catch (error) {
      console.error("Error creating scholarship program", error);
      setIsLoading(false);
      notification.error({
        message: "Error",
        description:
          "Failed to create the scholarship program. Please try again.",
      });
    }
  };

  return (
    <>
      <div className="bg-white p-[50px] ">
        <p className="text-4xl font-semibold text-sky-600 flex items-center gap-2">
          <FaTrophy className="text-4xl text-sky-500" />
          Create Scholarship Program
        </p>
        <div className="block bg-sky-500 w-[24px] h-[6px] rounded-[8px] mt-[4px] ml-12 mb-5"></div>

        <form
          onSubmit={form.handleSubmit(handleAddNewScholarshipProgram)}
          className="space-y-6 "
        >
          <div className="flex items-center justify-center mb-6">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${
                step === 1 ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              1
            </div>
            <div className="h-1 w-20 bg-gray-300 mx-2"></div>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${
                step === 2 ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              2
            </div>
            <div className="h-1 w-20 bg-gray-300 mx-2"></div>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${
                step === 3 ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              3
            </div>
            <div className="h-1 w-20 bg-gray-300 mx-2"></div>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${
                step === 4 ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              4
            </div>
            <div className="h-1 w-20 bg-gray-300 mx-2"></div>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${
                step === 5 ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              5
            </div>
          </div>
          {step === 1 && (
            <>
            <InformationStep/>
            <div className="flex justify-end mt-4">
              <Button
                // variant="contained"
                style={{
                  backgroundColor: "#0ea5e9",
                  color: "white",
                }}
                onClick={() => setStep(2)}
                // disabled={!selectedApplications.length}
              >
                Next
              </Button>
            </div>
            </>
          )}

          {step === 2 && (
            <>
            <UcmStep/>
            <div className="flex justify-between mt-4">
              <Button  
              //  variant="outlined"
               onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                // variant="contained"
                style={{
                  backgroundColor: "#0ea5e9",
                  color: "white",
                }}
                onClick={() => setStep(3)}
                // disabled={!selectedApplications.length}
              >
                Next
              </Button>
            </div>
            </>
            
            )}

          {step === 3 && (
            <>
            <DocumentStep/>
            <div className="flex justify-between mt-4">
              <Button  
              //  variant="outlined"
               onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                // variant="contained"
                style={{
                  backgroundColor: "#0ea5e9",
                  color: "white",
                }}
                onClick={() => setStep(4)}
                // disabled={!selectedApplications.length}
              >
                Next
              </Button>
            </div>
            </>
            )}

          {step === 4 && (
            <>
            <ReviewMilestoneStep/>
            <div className="flex justify-between mt-4">
              <Button  
              //  variant="outlined"
               onClick={() => setStep(3)}>
                Back
              </Button>
              <Button
                // variant="contained"
                style={{
                  backgroundColor: "#0ea5e9",
                  color: "white",
                }}
                onClick={() => setStep(5)}
                // disabled={!selectedApplications.length}
              >
                Next
              </Button>
            </div>
            </>
            )}

          {step === 5 && (
            <>
            <AwardMilestoneStep/>
            <div className="flex justify-between mt-4">
              <Button  
              //  variant="outlined"
               onClick={() => setStep(4)}>
                Back
              </Button>
              
            </div>
            <div className="flex flex-col items-start">
            <span className="text-black">
              <input
                type="checkbox"
                id="agreement"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="mr-2"
              />
              I agree to SSAP{" "}
              <a
                href="#"
                className="mx-[4px] underline hover:no-underline"
                onClick={() => setContractOpen(true)}
              >
                Terms and Privacy
              </a>{" "}
              and proceed to read the scholarship contract.
            </span>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Create Program</Button>
          </div>
            </>
            )}

          
        </form>
        {isLoading && <ScreenSpinner />}
        <ScholarshipContractDialogForFunder
          isOpen={isContractOpen}
          onClose={() => setContractOpen(false)}
        />
      </div>
    </>
  );
};

export default FormCreateScholarshipProgram;
