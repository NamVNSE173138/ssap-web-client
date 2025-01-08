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
  awardProgress: z.string().regex(/^\d+$/, "Award Progress must be a number"),
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
          <form className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
            {/* Tiêu đề */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
              General Information
            </h2>

            {/* Chia nhóm thông tin */}
            <div className="space-y-8">
              {/* Thông tin cơ bản */}
              <div>
                <div className="grid grid-cols-6 gap-4 mt-4">
                  {/* Scholarship Type */}
                  <div className="col-span-6 sm:col-span-2">
                    <Label htmlFor="scholarshipType" className="block text-sm font-medium text-gray-700">
                      Scholarship Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      options={categories}
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      isSearchable
                      className="mt-1"
                    />
                    {errors.scholarshipType?.message && (
                      <p className="text-red-500">
                        {String(errors.scholarshipType.message)}
                      </p>
                    )}
                  </div>

                  {/* Educational Level */}
                  <div className="col-span-6 sm:col-span-2">
                    <Label htmlFor="educationalLevel" className="block text-sm font-medium text-gray-700">
                      Educational Level <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("educationalLevel")}
                      className="mt-1 block w-full"
                    />
                    {errors.educationalLevel?.message && (
                      <p className="text-sm text-red-500 mt-1">{errors.educationalLevel?.message && (
                        <p className="text-red-500">
                          {String(errors.educationalLevel.message)}
                        </p>
                      )}</p>
                    )}
                  </div>

                  {/* Scholarship Name */}
                  <div className="col-span-6 sm:col-span-2">
                    <Label htmlFor="scholarshipName" className="block text-sm font-medium text-gray-700">
                      Scholarship Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("scholarshipName")}
                      className="mt-1 block w-full"
                    />
                    {errors.scholarshipName?.message && (
                      <p className="text-sm text-red-500 mt-1">{errors.scholarshipName?.message && (
                        <p className="text-red-500">
                          {String(errors.scholarshipName.message)}
                        </p>
                      )}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Scholarship Details
                </h3>
                <div className="mt-4">
                  <Label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Scholarship Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    {...register("description")}
                    rows={4}
                    className="mt-1 block w-full"
                  />
                  {errors.description?.message && (
                    <p className="text-sm text-red-500 mt-1">{errors.description?.message && (
                      <p className="text-red-500">
                        {String(errors.description.message)}
                      </p>
                    )}</p>
                  )}
                </div>
              </div>

              {/* Giá trị và số lượng */}
              <div>
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Funding Details
                </h3>
                <div className="grid grid-cols-6 gap-4 mt-4">
                  {/* Value */}
                  <div className="col-span-6 sm:col-span-2">
                    <Label htmlFor="value" className="block text-sm font-medium text-gray-700">
                      Scholarship Value <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("value")}
                      className="mt-1 block w-full"
                    />
                    {errors.value?.message && (
                      <p className="text-sm text-red-500 mt-1"> {errors.value?.message && (
                        <p className="text-red-500">{String(errors.value.message)}</p>
                      )}</p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-6 sm:col-span-2">
                    <Label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      Scholarship Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("quantity")}
                      className="mt-1 block w-full"
                    />
                    {errors.quantity?.message && (
                      <p className="text-sm text-red-500 mt-1"> {errors.quantity?.message && (
                        <p className="text-red-500">
                          {String(errors.quantity.message)}
                        </p>
                      )}</p>
                    )}
                  </div>

                  {/* Award Progress */}
                  <div className="col-span-6 sm:col-span-2">
                    <Label htmlFor="awardProgress" className="block text-sm font-medium text-gray-700">
                      Award Progress <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("awardProgress")}
                      className="mt-1 block w-full"
                    />
                    {errors.awardProgress?.message && (
                      <p className="text-sm text-red-500 mt-1">{errors.awardProgress?.message && (
                        <p className="text-red-500">
                          {String(errors.awardProgress.message)}
                        </p>
                      )}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Attachments
                </h3>
                <div className="grid grid-cols-6 gap-4 mt-4">
                  {/* Upload Image */}
                  <div className="col-span-6 sm:col-span-3">
                    <Label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                      Upload Image
                    </Label>
                    <Input
                      type="file"
                      id="imageUrl"
                      onChange={handelUploadFile}
                      accept="image/*"
                      className="mt-1 block w-full"
                    />
                  </div>

                  {/* Deadline */}
                  <div className="col-span-6 sm:col-span-3">
                    <Label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                      Application Deadline <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("deadline")}
                      type="date"
                      id="deadline"
                      className="mt-1 block w-full"
                    />
                    {errors.deadline?.message && (
                      <p className="text-sm text-red-500 mt-1">{errors.deadline?.message && (
                        <p className="text-red-500">
                          {String(errors.deadline.message)}
                        </p>
                      )}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
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

export default InformationStep;
