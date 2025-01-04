import { Card, CardContent } from "@/components/ui/card";
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

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files ? event.target.files[0] : null;
  //   if (file) {
  //     if (!file.type.startsWith("image/")) {
  //       notification.error({
  //         message: "Invalid File",
  //         description: "Please upload an image file.",
  //       });
  //       return;
  //     }
  //     const fileUrl = URL.createObjectURL(file);
  //     setImageFile([file]);
  //     setValue("imageUrl", fileUrl, { shouldValidate: true }); 
  //   }
  // };

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
    const data = getValues(); // Lấy dữ liệu từ form
    console.log("Form data: ", data); // Kiểm tra dữ liệu
    onSave(data); // Lưu dữ liệu vào Parent Component
  };

  const handleCategoryChange = (option: OptionType | null) => {
    setSelectedCategory(option);
    setValue("scholarshipType", option?.value || "", { shouldValidate: true });
  };
  
  // Đảm bảo khớp giá trị trong useEffect
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
      <Card>
        <CardContent>
          <form>
            <div className="grid grid-cols-6 gap-4 my-5">
              <div className="col-span-6">
                <h2 className="text-xl font-semibold">General Information</h2>
              </div>

              {/* Scholarship Type */}
              <div className="space-y-2 col-start-1 col-end-2">
                <Label htmlFor="scholarshipType" className="text-md">
                  Scholarship Type
                  <span className="text-red-700 text-lg"> *</span>
                </Label>
                <Select
                  options={categories}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  isSearchable
                />

                {errors.scholarshipType?.message && (
                  <p className="text-red-500">
                    {String(errors.scholarshipType.message)}
                  </p>
                )}
              </div>

              {/* Educational Level */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="educationalLevel" className="text-md">
                  Educational Level
                  <span className="text-red-700 text-lg"> *</span>
                </Label>
                <Input {...register("educationalLevel")} />
                {errors.educationalLevel?.message && (
                  <p className="text-red-500">
                    {String(errors.educationalLevel.message)}
                  </p>
                )}
              </div>

              {/* Scholarship Name */}
              <div className="space-y-2 col-end-7 col-span-3">
                <Label htmlFor="scholarshipName" className="text-md">
                  Scholarship Name
                  <span className="text-red-700 text-lg"> *</span>
                </Label>
                <Input {...register("scholarshipName")} />
                {errors.scholarshipName?.message && (
                  <p className="text-red-500">
                    {String(errors.scholarshipName.message)}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 col-span-6">
                <Label htmlFor="description" className="text-md">
                  Scholarship Description
                  <span className="text-red-700 text-lg"> *</span>
                </Label>
                <Textarea {...register("description")} />
                {errors.description?.message && (
                  <p className="text-red-500">
                    {String(errors.description.message)}
                  </p>
                )}
              </div>

              {/* Value */}
              <div className="space-y-2">
                <Label htmlFor="value" className="text-md">
                  Value of Scholarship
                  <span className="text-red-700 text-lg"> *</span>
                </Label>
                <Input {...register("value")} />
                {errors.value?.message && (
                  <p className="text-red-500">{String(errors.value.message)}</p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-md">
                  Quantity of Scholarship
                  <span className="text-red-700 text-lg"> *</span>
                </Label>
                <Input {...register("quantity")} />
                {errors.quantity?.message && (
                  <p className="text-red-500">
                    {String(errors.quantity.message)}
                  </p>
                )}
              </div>

              {/* Award Progress */}
              <div className="space-y-2">
                <Label htmlFor="awardProgress" className="text-md">
                  Quantity of Award Progress
                  <span className="text-red-700 text-lg"> *</span>
                </Label>
                <Input {...register("awardProgress")} />
                {errors.awardProgress?.message && (
                  <p className="text-red-500">
                    {String(errors.awardProgress.message)}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-2 col-start-4 col-end-6">
                <Label htmlFor="imageUrl" className="text-md">
                  Upload Image
                </Label>
                {/* <Input {...register("imageUrl")} /> */}
                <Input
                  type="file"
                  id="imageUrl"
                  onChange={handelUploadFile}
                  accept="image/*"
                  className="block w-full border p-2 rounded"
                />
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-md">
                  Application Deadline
                  <span className="text-red-700 text-lg"> *</span>
                </Label>
                <Input
                  {...register("deadline")}
                  type="date"
                  id="deadline"
                  placeholder="Enter deadline"
                />
                {errors.deadline?.message && (
                  <p className="text-red-500">
                    {String(errors.deadline.message)}
                  </p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="flex justify-end mt-4">
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

export default InformationStep;
