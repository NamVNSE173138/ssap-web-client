

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select, { MultiValue } from "react-select";
import { BASE_URL } from "@/constants/api";
import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";

interface OptionType {
  value: string;
  label: string;
}

const schema = z.object({
  university: z.string().min(1, "Please choose a university"),
  certificate: z
    .array(z.string())
    .min(1, "Please choose at least one certificate"),
  major: z.string().min(1, "Please choose a major"),
  documents: z.array(z.number()).min(1, "At least one document is required"),
  criteria: z
    .array(
      z.object({
        name: z.string().min(1, "Criterion name is required"),
        description: z.string().min(1, "Criterion description is required"),
      })
    )
    .min(1, "Please add at least one criterion")
    .refine(
      (data) =>
        data.every((criterion) => criterion.name && criterion.description),
      {
        message: "Each criterion must have both name and description",
      }
    ),
});

const UcmStep = ({
  formData,
  onSave,
  onBack,
}: {
  formData: any;
  onSave: (data: any) => void;
  onBack: (data: any) => void;
}) => {
  const [certificates, setCertificates] = useState<OptionType[]>([]);
  const [universities, setUniversities] = useState<OptionType[]>([]);
  const [majors, setMajors] = useState<OptionType[]>([]);

  const documentOptions = [
    { id: 1, type: "Resume/CV" },
    { id: 2, type: "Reference Letter/Letter of Recommendation" },
    { id: 3, type: "Academic Transcript" },
    { id: 4, type: "Personal Statement" },
    { id: 5, type: "Portfolio" },
    { id: 6, type: "Medical Report" },
    { id: 7, type: "Financial Information" },
    { id: 8, type: "Scholarship Application" },
  ];

  const fetchData = async (
    endpoint: string,
    setData: (data: OptionType[]) => void
  ) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/${endpoint}`);
      const options = response.data.data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      setData(options);
    } catch (error) {
      console.error(`Error fetching ${endpoint}`, error);
    }
  };

  useEffect(() => {
    fetchData("universities", setUniversities);
    fetchData("certificates", setCertificates);
    fetchData("majors", setMajors);
  }, []);

  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    getValues,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...formData,
      university: formData.university || "",
      certificate: formData.certificate || [],
      major: formData.major || "",
      // documents:  formData.documents || [{type: "", isRequired: true}],
      documents: formData.documents || [],
      criteria: formData.criteria || [{ name: "", description: "" }],
    },
  });

  const handleNext = async () => {
    const isValid = await trigger();
    if (!isValid) {
      console.error("Validation failed", errors);
      return;
    }


    const data = getValues(); // Lấy dữ liệu từ form
    if (data) {
      // console.log("Form data: ", data);
      const selectedDocuments = [...documentOptions].filter((doc) => (watch("documents") || []).includes(doc.id)).map((doc) => { return { type: doc.type, isRequired: true } })
      data.documents = selectedDocuments
      console.log("beforeSave", data);

      onSave(data);
    }
  };

  const handleSelectChange = (
    selectedOption: OptionType | null,
    fieldName: "university" | "major"
  ) => {
    setValue(fieldName, selectedOption ? selectedOption.value : "");
  };

  const handleMultiSelectChange = (
    selectedOptions: MultiValue<OptionType>,
    fieldName: "certificate"
  ) => {
    const values = selectedOptions.map((option) => option.value);
    setValue(fieldName, values || [], { shouldValidate: true });
  };

  const handleCheckboxChange = (id: number) => {
    const currentDocuments: number[] = watch("documents") || [];
    console.log("Before update:", currentDocuments);

    const validDocuments = currentDocuments.filter((doc) => typeof doc === "number");
    console.log("Valid documents:", validDocuments);

    const updatedDocuments = validDocuments.includes(id)
      ? validDocuments.filter((doc) => doc !== id)
      : [...validDocuments, id];



    console.log("After update:", updatedDocuments);
    setValue("documents", updatedDocuments, { shouldValidate: true });
  };

  useEffect(() => {
    if (formData) {
      setValue("university", formData.university || "");
      setValue("certificate", formData.certificate || []);
      setValue("major", formData.major || "");
      setValue("documents", formData.documents || []);
      setValue(
        "criteria",
        formData.criteria || [{ name: "", description: "" }]
      );
    }
  }, [formData, setValue]);
  return (
    <>
      <div>
        <div>
          <form className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
            {/* Tiêu đề */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Academic Information</h2>

            <div className="space-y-8">
              {/* University */}
              <div>
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Eligibility Criteria
                </h3>
                <div className="grid grid-cols-6 gap-4 mt-4">
                  {/* University */}
                  <div className="col-span-6 sm:col-span-2">
                    <Label htmlFor="university" className="block text-sm font-medium text-gray-700">
                      University <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      options={universities}
                      onChange={(option) => handleSelectChange(option, "university")}
                      className="mt-1"
                    />
                    {errors.university && (
                      <p className="text-red-500 text-sm">
                        {String(errors.university.message)}
                      </p>
                    )}
                  </div>

                  {/* Certificates */}
                  <div className="col-span-6 sm:col-span-2">
                    <Label htmlFor="certificate" className="block text-sm font-medium text-gray-700">
                      Certificates <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      options={certificates}
                      isMulti
                      onChange={(options) => handleMultiSelectChange(options, "certificate")}
                      className="mt-1"
                    />
                    {errors.certificate && (
                      <p className="text-red-500 text-sm">
                        {String(errors.certificate.message)}
                      </p>
                    )}
                  </div>

                  {/* Major */}
                  <div className="col-span-6 sm:col-span-2">
                    <Label htmlFor="major" className="block text-sm font-medium text-gray-700">
                      Major <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      options={majors}
                      onChange={(option) => handleSelectChange(option, "major")}
                      className="mt-1"
                    />
                    {errors.major && (
                      <p className="text-red-500 text-sm">
                        {String(errors.major.message)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Criteria */}
              <div>
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">Criteria</h3>
                <div className="mt-4">
                  {watch("criteria")?.map((criterion: any, index: any) => (
                    <div
                      key={index}
                      className="relative border p-4 rounded-md space-y-2 bg-gray-50"
                    >
                      {watch("criteria").length > 1 && (
                        <Button
                          type="button"
                          onClick={() =>
                            setValue(
                              "criteria",
                              watch("criteria").filter((_: any, i: any) => i !== index),
                              { shouldValidate: true }
                            )
                          }
                          className="absolute top-2 right-2 bg-gray-800 text-white hover:bg-gray-600 w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-all duration-300"
                          aria-label="Remove criterion"
                        >
                          <FaTrash className="w-5 h-5" />
                        </Button>
                      )}
                      <Input
                        {...register(`criteria.${index}.name`)}
                        placeholder="Ex: Academic Excellence"
                        className="block w-full"
                      />
                      {errors.criteria &&
                        Array.isArray(errors.criteria) &&
                        errors.criteria[index]?.name && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.criteria[index]?.name?.message}
                          </p>
                        )}
                      <Input
                        {...register(`criteria.${index}.description`)}
                        placeholder="Ex: Requires a minimum GPA of 3.5"
                        className="block w-full"
                      />
                      {errors.criteria &&
                        Array.isArray(errors.criteria) &&
                        errors.criteria[index]?.description && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.criteria[index]?.description?.message}
                          </p>
                        )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      setValue("criteria", [...watch("criteria"), { name: "", description: "" }])
                    }
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                  >
                    Add New Criteria
                  </Button>
                </div>
              </div>

              <br></br>
              {/* Required Documents */}
              <div>
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Required Documents
                </h3>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-500">
                    Select the documents applicants must submit for this scholarship.
                  </p>
                  {documentOptions.map((doc) => (
                    <div key={doc.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`doc-${doc.id}`}
                        checked={Array.isArray(watch("documents")) && watch("documents").includes(doc.id)}
                        onCheckedChange={() => handleCheckboxChange(doc.id)}
                      />
                      <Label htmlFor={`doc-${doc.id}`} className="text-sm font-medium text-gray-700">
                        {doc.type}
                      </Label>
                    </div>
                  ))}
                  {errors.documents && (
                    <p className="text-red-500 text-sm">
                      {String(errors.documents.message)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-4">
            <Button
                type="button"
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={onBack}
              >
                Back
              </Button>
              <Button
                type="button"
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={handleNext}
              >
                Next
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UcmStep;
