

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
}: {
  formData: any;
  onSave: (data: any) => void;
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
      documents:  formData.documents || [],
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
      const selectedDocuments = [...documentOptions].filter((doc) => (watch("documents") || []).includes(doc.id)).map((doc) => {return{type: doc.type, isRequired: true}})
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
      <Card>
        <CardContent>
          <form>
            <div className="grid grid-cols-6 gap-4 my-5">
              <div className="col-span-6">
                <h2 className="text-lg font-semibold">Eligibility Criteria</h2>
              </div>

              {/* University */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="university" className="text-md">
                  University <span className="text-red-700 text-lg"> *</span>
                </Label>
                <Select
                  options={universities}
                  onChange={(option) =>
                    handleSelectChange(option, "university")
                  }
                />
                {errors.university && (
                  <p className="text-red-500 text-sm">
                    {String(errors.university.message)}
                  </p>
                )}
              </div>

              {/* Certificate */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="certificate" className="text-md">
                  Certificates <span className="text-red-700 text-lg"> *</span>
                </Label>
                <Select
                  options={certificates}
                  isMulti
                  onChange={(options) =>
                    handleMultiSelectChange(options, "certificate")
                  }
                />
                {errors.certificate && (
                  <p className="text-red-500 text-sm">
                    {String(errors.certificate.message)}
                  </p>
                )}
              </div>

              {/* Major */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="major" className="text-md">
                  Major <span className="text-red-700 text-lg"> *</span>
                </Label>
                <Select
                  options={majors}
                  onChange={(option) => handleSelectChange(option, "major")}
                />
                {errors.major && (
                  <p className="text-red-500 text-sm">
                    {String(errors.major.message)}
                  </p>
                )}
              </div>

              {/* Criteria */}
              <div className="space-y-2 col-start-1 col-end-7">
                <Label htmlFor="criteria" className="text-md">
                  Criteria <span className="text-red-700 text-lg"> *</span>
                </Label>

                {watch("criteria")?.map(
                  (
                    _field: { name: string; description: string },
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="space-y-2 relative border p-4 rounded-md"
                    >
                      {watch("criteria").length > 1 && (
                        <Button
                          type="button"
                          onClick={() =>
                            setValue(
                              "criteria",
                              watch("criteria").filter(
                                (_: any, i: number) => i !== index
                              ),
                              { shouldValidate: true }
                            )
                          }
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </Button>
                      )}
                      <Input
                        {...register(`criteria.${index}.name`)}
                        placeholder="Ex: Academic Excellence"
                      />
                      {errors.criteria &&
                        Array.isArray(errors.criteria) &&
                        errors.criteria[index]?.name && (
                          <p className="text-red-500 text-sm">
                            {errors.criteria[index]?.name?.message}
                          </p>
                        )}
                      <Input
                        {...register(`criteria.${index}.description`)}
                        placeholder="Ex: Requires a minimum GPA of 3.5"
                      />
                      {errors.criteria &&
                        Array.isArray(errors.criteria) &&
                        errors.criteria[index]?.description && (
                          <p className="text-red-500 text-sm">
                            {errors.criteria[index]?.description?.message}
                          </p>
                        )}
                    </div>
                  )
                )}

                <Button
                  type="button"
                  onClick={() =>
                    setValue("criteria", [
                      ...watch("criteria"),
                      { name: "", description: "" },
                    ])
                  }
                >
                  Add New Criterion
                </Button>
              </div>

              {/* Documents */}
              <div className="col-span-6">
                <Label className="text-lg font-semibold">
                  Required Documents{" "}
                  <span className="text-red-500 text-sm"> *</span>
                </Label>
                <p className="text-sm text-gray-500">
                  Select the documents applicants must submit for this
                  scholarship.
                </p>
              </div>

              <div className="col-span-6 space-y-2">
                {documentOptions.map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`doc-${doc.id}`}
                      checked={
                        Array.isArray(watch("documents")) &&
                        watch("documents").includes(doc.id)
                      }
                      onCheckedChange={() => handleCheckboxChange(doc.id)} // Đảm bảo `id` là kiểu số
                    />
                    <Label htmlFor={`doc-${doc.id}`}>{doc.type}</Label>
                  </div>
                ))}
                {errors.documents && (
                  <p className="text-red-500 text-sm">
                    {String(errors.documents.message)}
                  </p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="flex justify-end ">
        <Button
          type="button"
          className="bg-blue-500 text-white py-2 px-4 rounded "
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default UcmStep;
