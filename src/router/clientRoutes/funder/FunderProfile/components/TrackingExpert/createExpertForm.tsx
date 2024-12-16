import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import ScreenSpinner from "@/components/ScreenSpinner";
import { notification } from "antd";
import { z } from "zod";

interface ExpertFormProps {
  onSubmit: (formData: any) => Promise<void>;
  initialData: any;
  handelUploadFile: any;
  // success: any;
}

const expertFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  major: z.string().nonempty({ message: "Major is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .regex(/^\d+$/, { message: "Phone number must contain only digits" })
    .min(10, { message: "Phone number must be at least 10 digits" }),
  password: z.string().min(3, { message: "Password must be at least 3 characters" }),
  address: z.string().optional(),
  avatarUrl: z.string().optional(),
});

const ExpertForm: React.FC<ExpertFormProps> = ({
  onSubmit,
  initialData,
  handelUploadFile,
  // success,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [majors, setMajors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/majors`);
        setMajors(response.data.data || []);
      } catch (err: any) {
        setError("Failed to fetch majors");
      } finally {
        setLoading(false);
      }
    };

    fetchMajors();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prevData: any) => ({
      ...prevData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const validateForm = () => {
    try {
      expertFormSchema.parse(formData);
      setValidationErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            errors[error.path[0] as string] = error.message;
          }
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // await onSubmit(formData);
    // setFormData(initialData);
    // setIsLoading(false);
    // if (success) {
    //   notification.success({ message: "Expert is created successfully!" });
    // } else {
    //   notification.error({ message: "Fail to create expert!" });
    // }
    try {
      await onSubmit(formData);
      notification.success({ message: "Expert is created successfully!" });
      setFormData(initialData); 
    } catch (error) {
      notification.error({ message: "Failed to create expert!" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Name:</label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            
          />
          {validationErrors.name && (
            <p className="text-red-500 text-sm">{validationErrors.name}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold">Major:</label>
          <select
            name="major"
            value={formData.major}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            
          >
            <option value="">Select a major</option>
            {loading ? (
              <option disabled>Loading majors...</option>
            ) : error ? (
              <option disabled>{error}</option>
            ) : (
              majors.map((major) => (
                <option key={major.id} value={major.name}>
                  {major.name}
                </option>
              ))
            )}
          </select>
          {validationErrors.major && (
            <p className="text-red-500 text-sm">{validationErrors.major}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold">Email:</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm">{validationErrors.email}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold">Phone Number:</label>
          <Input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            
          />
          {validationErrors.phoneNumber && (
            <p className="text-red-500 text-sm">{validationErrors.phoneNumber}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold">Password:</label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
          {validationErrors.password && (
            <p className="text-red-500 text-sm">{validationErrors.password}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold">Address:
          <span className="text-red-500 text-sm font-normal">(* Optional)</span>
          </label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block font-semibold">Avatar URL: <span className="text-red-500 text-sm font-normal">(* Optional)</span></label>
          <Input
            type="file"
            accept="image/*"
            onChange={handelUploadFile}
            className="border p-2 rounded w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-[#1eb2a6] text-white px-4 py-2 rounded hover:bg-[#51b8af]"
        >
          Submit
        </button>
      </form>
      {isLoading && <ScreenSpinner />}
    </>
  );
};

export default ExpertForm;
