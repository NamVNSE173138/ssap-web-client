import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL } from "@/constants/api";
import Select from "react-select";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

interface OptionType {
  value: string;
  label: string;
}

const schema = z.object({
  scholarshipType: z.string().min(1, "Scholarship Type is required"),
  educationalLevel: z.string().min(1, "Educational Level is required"),
  scholarshipName: z.string().min(1, "Scholarship Name is required"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters long")
    .max(200, "Description must be at most 200 characters long"),
  value: z.string().regex(/^\d+$/, "Value must be a number"),
  quantity: z.string().regex(/^\d+$/, "Quantity must be a number"),
  awardProgress: z
    .string()
    .regex(/^\d+$/, "Award Progress must be a number")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1 && val <= 10, {
      message: "Award Progress must be between 1 and 10",
    }),
  imageUrl: z.string().optional(),
  deadline: z.string().min(1, "Deadline is required"),
});


const InformationStep = ({
  formData,
  onSave,
  handelUploadFile,
}: {
  formData: any;
  onSave: (data: any) => void;
  handelUploadFile: any;
}) => {
  const [categories, setCategories] = useState<OptionType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<OptionType | null>(
    null
  );
  const [_imageFile, setImageFile] = useState<File[]>([]);

  useEffect(() => {
    if (formData.imageUrl) {
      setImageFile([formData.imageUrl]);
    }
  }, [formData.imageUrl]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/categories`);
      console.log("category", response.data.data);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData,
  });

  useEffect(() => {
    console.log("Form data being loaded:", formData);
    Object.keys(formData).forEach((key) => {
      if (typeof key === "string") {
        setValue(key, formData[key as keyof typeof formData]);
      }
    });
  }, [formData, setValue]);

  const handleNext = async () => {
    const isValid = await trigger();
    if (!isValid) {
      console.error("Validation failed", errors);
      return;
    }
    const data = getValues();
    console.log("Form data: ", data);
    onSave(data);
  };

  const handleCategoryChange = (option: OptionType | null) => {
    setSelectedCategory(option);
    setValue("scholarshipType", option?.value || "", { shouldValidate: true });
  };

  useEffect(() => {
    if (formData.scholarshipType) {
      const matchingOption = categories.find(
        (category) => category.value === formData.scholarshipType
      );
      setSelectedCategory(matchingOption || null);
    }
  }, [formData.scholarshipType, categories]);

  return (
    <>
      <div>
        <div>
          <form className="bg-white p-8 rounded-lg shadow-lg max-w-6xl mx-auto">
            {/* Tiêu đề */}
            <h2 className="text-3xl font-bold text-blue-700 mb-8 border-b-2 pb-4">
              General Information
            </h2>

            {/* Chia nhóm thông tin */}
            <div className="space-y-8">
              {/* Thông tin cơ bản */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Scholarship Name */}
                  <div>
                    <Label htmlFor="scholarshipName" className="block text-sm font-medium text-gray-700">
                      Scholarship Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("scholarshipName")}
                      placeholder="Enter scholarship name"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.scholarshipName?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.scholarshipName?.message)}</p>
                    )}
                  </div>

                  {/* Deadline */}
                  <div>
                    <Label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                      Application Deadline <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("deadline")}
                      type="date"
                      id="deadline"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.deadline?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.deadline?.message)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Scholarship Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Scholarship Type */}
                  <div>
                    <Label htmlFor="scholarshipType" className="block text-sm font-medium text-gray-700">
                      Scholarship Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      options={categories}
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      isSearchable
                      placeholder="Select type"
                      className="mt-1"
                    />
                    {errors.scholarshipType?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.scholarshipType.message)}</p>
                    )}
                  </div>

                  {/* Educational Level */}
                  <div>
                    <Label htmlFor="educationalLevel" className="block text-sm font-medium text-gray-700">
                      Educational Level <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("educationalLevel")}
                      placeholder="Enter level"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.educationalLevel?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.educationalLevel?.message)}</p>
                    )}
                  </div>

                  {/* Upload Image */}
                  <div>
                    <Label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                      Scholarship Logo
                    </Label>
                    <Input
                      type="file"
                      id="imageUrl"
                      onChange={handelUploadFile}
                      accept="image/*"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                </div>

                {/* Scholarship Description */}
                <div className="mt-6">
                  <Label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Scholarship Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    {...register("description")}
                    rows={4}
                    placeholder="Provide a brief description"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.description?.message && (
                    <p className="text-sm text-red-500 mt-1">{String(errors.description.message)}</p>
                  )}
                </div>
              </div>

              {/* Giá trị và số lượng */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Funding Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Value */}
                  <div>
                    <Label htmlFor="value" className="block text-sm font-medium text-gray-700">
                      Scholarship Value ($) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("value")}
                      placeholder="Enter value"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.value?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.value.message)}</p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    <Label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      Scholarship Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("quantity")}
                      placeholder="Enter quantity"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.quantity?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.quantity.message)}</p>
                    )}
                  </div>

                  {/* Award Progress */}
                  <div>
                    <Label htmlFor="awardProgress" className="block text-sm font-medium text-gray-700">
                      Award Progress <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("awardProgress")}
                      placeholder="Enter progress"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.awardProgress?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.awardProgress.message)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end mt-6">
              <Button
                type="button"
                className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition"
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

export default InformationStep;
