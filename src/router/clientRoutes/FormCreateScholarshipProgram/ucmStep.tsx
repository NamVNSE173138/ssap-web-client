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
import { FaPlus, FaTrash } from "react-icons/fa";

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
  documents: z
    .array(z.number().or(z.object({})))
    .min(1, "At least one document is required"),
  criteria: z
    .array(
      z.object({
        name: z.string().min(1, "Criteria name is required"),
        description: z.string().min(1, "Criteria description is required"),
        percentage: z.string().min(1, "Percentage of score is required"),
      })
    )
    .min(1, "Please add at least one criteria")
    .refine(
      (data) =>
        data.every((criterion) => criterion.name && criterion.description),
      {
        message: "Each criterion must have both name and description",
      }
    )
    .refine(
      (data: any) =>
        data &&
        data.reduce(
          (sum: any, criterion: any) => sum + Number(criterion.percentage),
          0
        ) == 100,
      {
        message: "The total percentage of all criteria must equal 100",
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
      documents: formData.documents || [],
      criteria: formData.criteria || [
        { name: "", description: "", percentage: "" },
      ],
    },
  });

  const handleNext = async () => {
    const isValid = await trigger();
    if (!isValid) {
      console.error("Validation failed", errors);
      return;
    }

    const data = getValues();
    if (data) {
      const selectedDocuments = [...documentOptions]
        .filter((doc) => (watch("documents") || []).includes(doc.id))
        .map((doc) => {
          return { type: doc.type, isRequired: true };
        });
      data.documents = selectedDocuments;
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

    const validDocuments = currentDocuments.filter(
      (doc) => typeof doc === "number"
    );
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
        formData.criteria || [{ name: "", description: "", percentage: "" }]
      );
    }
  }, [formData, setValue]);
  return (
    <>
      <div>
        <div>
          <form className="bg-white p-8 rounded-lg shadow-md max-w-6xl mx-auto space-y-10">
            {/* Tiêu đề chính */}
            <h2 className="text-3xl font-bold text-blue-700 mb-8 border-b-2 pb-4">
              Criteria & Documents
            </h2>
            {/* Academic Information & Required Documents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Academic Information */}
              <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                <h3 className="text-2xl font-semibold text-gray-700 border-b pb-2">
                  Academic Information
                </h3>
                <div className="space-y-4">
                  {/* University */}
                  <div>
                    <Label
                      htmlFor="university"
                      className="block text-sm font-medium text-gray-700"
                    >
                      University <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      options={universities}
                      onChange={(option) =>
                        handleSelectChange(option, "university")
                      }
                      className="mt-2"
                    />
                    {errors.university && (
                      <p className="text-red-500 text-sm">
                        {String(errors.university.message)}
                      </p>
                    )}
                  </div>

                  {/* Certificates */}
                  <div>
                    <Label
                      htmlFor="certificate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Certificates <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      options={certificates}
                      isMulti
                      onChange={(options) =>
                        handleMultiSelectChange(options, "certificate")
                      }
                      className="mt-2"
                    />
                    {errors.certificate && (
                      <p className="text-red-500 text-sm">
                        {String(errors.certificate.message)}
                      </p>
                    )}
                  </div>

                  {/* Major */}
                  <div>
                    <Label
                      htmlFor="major"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Major <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      options={majors}
                      onChange={(option) => handleSelectChange(option, "major")}
                      className="mt-2"
                    />
                    {errors.major && (
                      <p className="text-red-500 text-sm">
                        {String(errors.major.message)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Required Documents */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-700 border-b pb-2">
                  Required Documents
                </h3>
                <p className="text-gray-500 text-sm mt-2">
                  Select the documents applicants must submit for this
                  scholarship.
                </p>
                <div className="mt-4 space-y-3">
                  {documentOptions.map((doc) => (
                    <div key={doc.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`doc-${doc.id}`}
                        checked={
                          Array.isArray(watch("documents")) &&
                          watch("documents").includes(doc.id)
                        }
                        onCheckedChange={() => handleCheckboxChange(doc.id)}
                      />
                      <Label
                        htmlFor={`doc-${doc.id}`}
                        className="text-sm font-medium text-gray-700"
                      >
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

            {/* Eligibility Criteria */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
              <h3 className="text-2xl font-semibold text-gray-700 border-b pb-2">
                Eligibility Criteria
              </h3>
              <div className="space-y-4">
                {watch("criteria")?.map((_criteria: any, index: any) => (
                  <div
                    key={index}
                    className="relative p-4 border rounded-md bg-white shadow-sm grid grid-cols-3 gap-4"
                  >
                    {watch("criteria").length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setValue(
                            "criteria",
                            watch("criteria").filter(
                              (_: any, i: any) => i !== index
                            ),
                            { shouldValidate: true }
                          )
                        }
                        className="absolute top-2 right-2 bg-white text-red-500 w-8 h-8 flex items-center justify-center rounded-full shadow hover:bg-red-500 hover:text-white"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    )}
                    <Input
                      {...register(`criteria.${index}.name`)}
                      placeholder="Ex: Academic Excellence"
                      className="w-full"
                    />
                    <Input
                      {...register(`criteria.${index}.description`)}
                      placeholder="Ex: Requires a minimum GPA of 3.5"
                      className="w-full"
                    />
                    <Input
                      {...register(`criteria.${index}.percentage`)}
                      placeholder="Ex: 30%"
                      className="w-full"
                      type="number"
                    />
                  </div>
                ))}
              </div>
              {errors.criteria && errors.criteria.root && (
                <p className="text-red-500 text-sm">
                  {String(errors.criteria.root.message)}
                </p>
              )}
              <Button
                type="button"
                onClick={() =>
                  setValue("criteria", [
                    ...watch("criteria"),
                    { name: "", description: "", percentage: "" },
                  ])
                }
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition flex items-center space-x-2"
              >
                <FaPlus />
                <span>Add New Criteria</span>
              </Button>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                onClick={onBack}
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                type="button"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
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
