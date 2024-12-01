// import React, { useState } from "react";
// import { Input } from "@/components/ui/input";

// interface ExpertFormProps {
//   onSubmit: (formData: any) => Promise<void>; 
//   initialData: any; 
// }

// const ExpertForm: React.FC<ExpertFormProps> = ({ onSubmit, initialData }) => {
//   const [formData, setFormData] = useState(initialData);

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value, type } = e.target;

//     setFormData((prevData: any) => ({
//       ...prevData,
//       [name]:
//         type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await onSubmit(formData); 
//     setFormData(initialData); 
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block font-semibold">Name:</label>
//         <Input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleInputChange}
//           className="border p-2 rounded w-full"
//           required
//         />
//       </div>
//       <div>
//         <label className="block font-semibold">Major:</label>
//         <Input
//           type="text"
//           name="major"
//           value={formData.major}
//           onChange={handleInputChange}
//           className="border p-2 rounded w-full"
//         />
//       </div>
//       <div>
//         <label className="block font-semibold">Email:</label>
//         <Input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleInputChange}
//           className="border p-2 rounded w-full"
//           required
//         />
//       </div>
//       <div>
//         <label className="block font-semibold">Phone Number:</label>
//         <Input
//           type="text"
//           name="phoneNumber"
//           value={formData.phoneNumber}
//           onChange={handleInputChange}
//           className="border p-2 rounded w-full"
//           required
//         />
//       </div>
//       <div>
//         <label className="block font-semibold">Password:</label>
//         <Input
//           type="password"
//           name="password"
//           value={formData.password}
//           onChange={handleInputChange}
//           className="border p-2 rounded w-full"
//           required
//         />
//       </div>
//       <div>
//         <label className="block font-semibold">Address:</label>
//         <Input
//           type="text"
//           name="address"
//           value={formData.address}
//           onChange={handleInputChange}
//           className="border p-2 rounded w-full"
//         />
//       </div>
//       <div>
//         <label className="block font-semibold">Avatar URL:</label>
//         <Input
//           type="text"
//           name="avatarUrl"
//           value={formData.avatarUrl}
//           onChange={handleInputChange}
//           className="border p-2 rounded w-full"
//         />
//       </div>
//       <button
//         type="submit"
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Submit
//       </button>
//     </form>
//   );
// };

// export default ExpertForm;





// ===============================================
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { BASE_URL } from "@/constants/api";

interface ExpertFormProps {
  onSubmit: (formData: any) => Promise<void>;
  initialData: any;
  handelUploadFile : any;
}

const ExpertForm: React.FC<ExpertFormProps> = ({ onSubmit, initialData, handelUploadFile }) => {
  const [formData, setFormData] = useState(initialData);
  const [majors, setMajors] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/majors`
        );
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
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData(initialData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Name:</label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block font-semibold">Major:</label>
        <select
          name="major"
          value={formData.major}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
          required
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
      </div>
      <div>
        <label className="block font-semibold">Email:</label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block font-semibold">Phone Number:</label>
        <Input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block font-semibold">Password:</label>
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block font-semibold">Address:</label>
        <Input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block font-semibold">Avatar URL:</label>
        <Input
          type="file"
          accept="image/*"
          onChange={handelUploadFile} // Use the prop passed down
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
  );
};

export default ExpertForm;
