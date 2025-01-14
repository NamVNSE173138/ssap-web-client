import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "@/constants/api";
import RouteNames from "@/constants/routeNames";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { uploadFile } from "@/services/ApiServices/fileUploadService";
import ScreenSpinner from "@/components/ScreenSpinner";
import { FaTrophy } from "react-icons/fa";
import ScholarshipContractDialogForFunder from "../funder/FunderProfile/components/Activity/ScholarshipContractDialogForFunder";
import InformationStep from "./informationStep";
import UcmStep from "./ucmStep";
import ReviewMilestoneStep from "./reviewMilestoneStep";
import AwardMilestoneStep from "./awardMilestoneStep";
import ViewDataCreated from "./viewDataCreated";
import { useState } from "react";

const FormCreateScholarshipProgram = () => {
  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isContractOpen, setContractOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();
  const funder = useSelector((state: any) => state.token.user);
  const funderId = funder?.id;

  const [formData, setFormData] = useState({
    scholarshipType: "",
    educationalLevel: "",
    scholarshipName: "",
    description: "",
    value: "",
    quantity: "",
    awardProgress: "",
    imageUrl: "",
    deadline: "",
    status: "Draft",
    university: "",
    certificate: [],
    major: "",
    criteria: [{ name: "", description: "", percentage: "" }],
    reviewMilestones: [
      { description: "Application Review", fromDate: "", toDate: "" },
      { description: "Interview", fromDate: "", toDate: "" },
    ],
    awardMilestones: [
      {
        fromDate: "",
        toDate: "",
        amount: "",
        note: "",
        awardMilestoneDocuments: [
          {
            type: "",
          },
        ],
      },
    ],
    documents: [
      {
        type: "",
        isRequired: true,
      },
    ],
  });

  const handleNext = (data: any) => {
    setFormData({ ...formData, ...data });
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

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

  const handleAddNewScholarshipProgram = async () => {
    setIsLoading(true);

    if (!isChecked) {
      notification.error({
        message: "Error",
        description: "You must check the agreement to proceed.",
      });
      setIsLoading(false);
      return;
    }

    try {
      if (!funderId) throw new Error("Funder ID not available");

      const imageUrl = await uploadFile(imageFile);
      if (!imageUrl) {
        notification.error({
          message: "Error",
          description: "Failed to upload image. Please try again.",
        });
        setIsLoading(false);
        return;
      }

      const postData = {
        name: formData.scholarshipName,
        imageUrl: imageUrl.data.toString(),
        description: formData.description,
        scholarshipAmount: parseFloat(formData.value),
        numberOfScholarships: parseInt(formData.quantity),
        numberOfAwardMilestones: formData.awardMilestones.length,
        educationLevel: formData.educationalLevel,
        deadline: new Date(formData.deadline).toISOString(),
        status: formData.status,
        funderId,
        categoryId: parseInt(formData.scholarshipType),
        universityId: parseInt(formData.university),
        majorId: parseInt(formData.major),
        certificateIds: formData.certificate.map((id) => parseInt(id)),
        criteria: formData.criteria,
        reviewMilestones: formData.reviewMilestones.map((milestone) => ({
          description: milestone.description,
          fromDate: new Date(milestone.fromDate).toISOString(),
          toDate: new Date(milestone.toDate).toISOString(),
        })),
        awardMilestones: formData.awardMilestones.map((milestone) => ({
          fromDate: new Date(milestone.fromDate).toISOString(),
          toDate: new Date(milestone.toDate).toISOString(),
          amount: parseFloat(milestone.amount),
          note: milestone.note,
          awardMilestoneDocuments: milestone.awardMilestoneDocuments.map(
            (doc) => ({
              type: doc.type,
            })
          ),
        })),
        documents: formData.documents.map((document) => ({
          type: document.type,
          isRequired: true,
        })),
      };
      console.log("Post Data:", postData);
      const response = await axios.post(
        `${BASE_URL}/api/scholarship-programs`,
        postData
      );

      console.log("DATA", response.data);
      setIsLoading(false);

      if (response.status === 200 || response.status === 201) {
        notification.success({
          message: "Scholarship Program Created",
          description: "The program was successfully created.",
        });
        navigate(RouteNames.FUNDER_PROFILE);
      }
    } catch (error: any) {
      console.error("Error creating scholarship program", error);
      console.error("Error response:", error.response.data);

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

        <form className="space-y-6 ">
          <div className="flex items-center justify-center">
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
          <div className="flex justify-center gap-5">
            <div className="text-center w-30">
              <p
                className={`text-sm font-medium ${
                  step === 1 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                General Information
              </p>
            </div>
            <div className="text-center w-32">
              <p
                className={`text-sm font-medium ${
                  step === 2 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {" "}
                Criteria & Documents
              </p>
            </div>
            <div className="text-center w-28">
              <p
                className={`text-sm font-medium ${
                  step === 3 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {" "}
                Review Milestones
              </p>
            </div>
            <div className="text-center w-27">
              <p
                className={`text-sm font-medium ${
                  step === 4 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {" "}
                Award Milestones
              </p>
            </div>
            <div className="text-center w-32">
              <p
                className={`text-sm font-medium ${
                  step === 5 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {" "}
                Preview
              </p>
            </div>
          </div>
          {step === 1 && (
            <>
              <InformationStep
                formData={formData}
                onSave={handleNext}
                handelUploadFile={handleFileChange}
              />
            </>
          )}

          {step === 2 && (
            <>
              <UcmStep
                formData={formData}
                onSave={handleNext}
                onBack={handleBack}
              />
              {/* <div className="">
                <Button onClick={() => setStep(1)}>Back</Button>
              </div> */}
            </>
          )}

          {step === 3 && (
            <>
              <ReviewMilestoneStep
                formData={formData}
                onSave={handleNext}
                onBack={handleBack}
              />
              {/* <div className="flex justify-between mt-4">
                <Button onClick={() => setStep(2)}>Back</Button>
              </div> */}
            </>
          )}

          {step === 4 && (
            <>
              <AwardMilestoneStep
                formData={formData}
                onSave={handleNext}
                onBack={handleBack}
              />
            </>
          )}

          {step === 5 && (
            <>
              <ViewDataCreated formData={formData} />

              <div className="flex flex-col items-start ml-10">
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

              <div className="flex justify-between">
                <Button onClick={() => setStep(4)}>Back</Button>
                <Button type="button" onClick={handleAddNewScholarshipProgram}>
                  Create Program
                </Button>
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
