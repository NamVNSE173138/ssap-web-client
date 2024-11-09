// import { Button } from "@/components/ui/button";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import { AnimatePresence, motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useSelector } from "react-redux";
// import { z } from "zod";
// import { BASE_URL } from "@/constants/api";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Select, { MultiValue } from "react-select";

// interface CreateScholarshipModalProps {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
// }

// interface OptionType {
//   value: string;
//   label: string;
// }

// const formSchema = z.object({
//   scholarshiptype: z.string().min(1, "Vui lòng chọn loại dịch vụ"),
//   name: z.string().min(1, "Vui lòng nhập tên chương trình"),
//   description: z.string().min(1, "Vui lòng nhập mô tả"),
//   price: z.string().refine((price) => !isNaN(parseFloat(price)), {
//     message: "Giá phải là số",
//   }),
//   quantity: z.string().refine((quantity) => !isNaN(parseInt(quantity)), {
//     message: "Số lượng phải là số",
//   }),
//   imageUrl: z.string(),
//   deadline: z.string(),
//   status: z.string(),
//   universities: z
//     .array(z.string())
//     .min(1, "Vui lòng chọn ít nhất một trường đại học"),
//   majors: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một ngành học"),
//   certificates: z
//     .array(z.string())
//     .min(1, "Vui lòng chọn ít nhất một chứng chỉ"),
//   skills: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một kỹ năng"),
// });

// const FormCreateScholarshipProgram = () => {
//   const [categories, setCategories] = useState([]);
//   const [majors, setMajors] = useState([]);
//   const [skills, setSkills] = useState([]);
//   const [certificates, setCertificates] = useState([]);
//   const [universities, setUniversities] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [selectedMajors, setSelectedMajors] = useState<OptionType[]>([]);
//   const [selectedSkills, setSelectedSkills] = useState<OptionType[]>([]);
//   const [selectedUniversities, setSelectedUniversities] = useState<
//     OptionType[]
//   >([]);
//   const [selectedCertificates, setSelectedCertificates] = useState<
//     OptionType[]
//   >([]);
//   const funder = useSelector((state: any) => state.token.user);
//   const funderId = funder?.id;

//   // const form = useForm<z.infer<typeof formSchema>>({
//   //   resolver: zodResolver(formSchema),
//   //   defaultValues: {
//   //     scholarshiptype: selectedCategory || "",
//   //     name: "",
//   //     description: "",
//   //     price: "",
//   //     quantity: "",
//   //     imageUrl: "",
//   //     deadline: "",
//   //     status: "",
//   //     universities: selectedUniversities.map((option) => option.value),
//   //     majors: selectedMajors.map((option) => option.value),
//   //     certificates: selectedCertificates.map((option) => option.value),
//   //     skills: selectedSkills.map((option) => option.value),
//   //   },
//   // });

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       scholarshiptype: "",
//       name: "",
//       description: "",
//       price: "",
//       quantity: "",
//       imageUrl: "",
//       deadline: "",
//       status: "ACTIVE",
//       universities: [],
//       majors: [],
//       certificates: [],
//       skills: [],
//     },
//   });

//   const handleCategoryChange = (selectedOption: any) => {
//     setSelectedCategory(selectedOption ? selectedOption.value : "");
//     form.clearErrors("scholarshiptype");
//   };

//   const handleUniversityChange = (options: MultiValue<OptionType>) => {
//     setSelectedUniversities(Array.from(options) || []);
//     form.clearErrors("universities");
//   };

//   const handleMajorChange = (options: MultiValue<OptionType>) => {
//     setSelectedMajors(Array.from(options) || []);
//     form.clearErrors("majors");
//   };

//   const handleCertificateChange = (options: MultiValue<OptionType>) => {
//     setSelectedCertificates(Array.from(options) || []);
//     form.clearErrors("certificates");
//   };

//   const handleSkillChange = (options: MultiValue<OptionType>) => {
//     setSelectedSkills(Array.from(options) || []);
//     form.clearErrors("skills");
//   };

//   useEffect(() => {
//     form.setValue("scholarshiptype", selectedCategory);
//   }, [selectedCategory, form]);

//   useEffect(() => {
//     form.setValue(
//       "majors",
//       selectedMajors.map((option) => option.value)
//     );
//   }, [selectedMajors, form]);

//   useEffect(() => {
//     form.setValue(
//       "certificates",
//       selectedCertificates.map((option) => option.value)
//     );
//   }, [selectedCertificates, form]);

//   useEffect(() => {
//     form.setValue(
//       "skills",
//       selectedSkills.map((option) => option.value)
//     );
//   }, [selectedSkills, form]);

//   useEffect(() => {
//     form.setValue(
//       "universities",
//       selectedUniversities.map((option) => option.value)
//     );
//   }, [selectedUniversities, form]);

//   useEffect(() => {
//     console.log("Form errors:", form.formState.errors);
//   }, [form.formState.errors]);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/categories`);
//       setCategories(
//         response.data.data.map((category: any) => ({
//           value: category.id.toString(),
//           label: category.name,
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching categories", error);
//     }
//   };

//   const fetchMajors = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/majors`);
//       setMajors(
//         response.data.data.map((major: any) => ({
//           value: major.id.toString(),
//           label: major.name,
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching majors", error);
//     }
//   };

//   const fetchSkills = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/skills`);
//       setSkills(
//         response.data.data.map((skill: any) => ({
//           value: skill.id.toString(),
//           label: skill.name,
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching skills", error);
//     }
//   };

//   const fetchCertificates = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/certificates`);
//       setCertificates(
//         response.data.data.map((certificate: any) => ({
//           value: certificate.id.toString(),
//           label: certificate.name,
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching certificates", error);
//     }
//   };

//   const fetchUniversities = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/universities`);
//       setUniversities(
//         response.data.data.map((university: any) => ({
//           value: university.id.toString(),
//           label: university.name,
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching universities", error);
//     }
//   };

//   //   useEffect(() => {
//   //     if (isOpen) {
//   //       fetchCategories();
//   //       fetchMajors();
//   //       fetchSkills();
//   //       fetchCertificates();
//   //       fetchUniversities();
//   //     }
//   //   }, [isOpen]);

//   useEffect(() => {
//     fetchCategories();
//     fetchMajors();
//     fetchSkills();
//     fetchCertificates();
//     fetchUniversities();
//   }, []);

//   const handleAddNewScholarshipProgram = async (
//     values: z.infer<typeof formSchema>
//   ) => {
//     console.log(
//       "Selected scholarship type:",
//       form.getValues("scholarshiptype")
//     );

//     try {
//       if (!funderId) {
//         throw new Error("Funder ID not available");
//       }

//       const postData = {
//         name: values.name,
//         imageUrl: "string",
//         description: values.description,
//         scholarshipAmount: values.price,
//         numberOfScholarships: values.quantity,
//         deadline: values.deadline,
//         status: values.status,
//         funderId,
//         categoryId: parseInt(values.scholarshiptype),
//         universityIds: values.universities.map((id) => parseInt(id)),
//         majorIds: values.majors.map((id) => parseInt(id)),
//         certificateIds: values.certificates.map((id) => parseInt(id)),
//         skillIds: values.skills.map((id) => parseInt(id)),
//       };

//       console.log("Post data to API:", postData);
//       const response = await axios.post(
//         `${BASE_URL}/api/scholarship-programs`,
//         postData
//       );
//       console.log("API response:", response.data);
//       form.reset();
//       setSelectedMajors([]);
//       setSelectedCertificates([]);
//       setSelectedSkills([]);
//       setSelectedUniversities([]);
//       setSelectedCategory("");
//       //   setIsOpen(false);
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error("Axios error response:", error.response?.data);
//       } else {
//         console.error("Error creating scholarship program", error);
//       }
//     }
//   };

//   return (
//     <AnimatePresence>
//       <div className="inset-0 bg-opacity-50 items-center grid grid-cols-2 gap-10 p-10 justify-center z-50">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.5 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.5 }}
//           transition={{ duration: 0.2 }}
//           className="bg-white p-6 rounded-lg shadow-lg w-full"
//         >
//           <div className="flex justify-between items-center">
//             <h3 className="text-2xl mb-5">Add new Scholarship Program</h3>
//           </div>
//           <form
//             onSubmit={form.handleSubmit(handleAddNewScholarshipProgram)}
//             className="flex flex-col gap-4"
//           >
//             {/* General Information */}
//             <Card className="">
//               <CardContent className="space-y-2">
//                 {/* Type */}
//                 <div className="space-y-1 grid grid-cols-3 items-center">
//                   <Label htmlFor="scholarshiptype">Type</Label>
//                   <Select
//                     options={categories}
//                     value={
//                       categories.find(
//                         (category: any) => category.value === selectedCategory
//                       ) || null
//                     }
//                     onChange={handleCategoryChange}
//                     placeholder="Select scholarship type"
//                     className="col-span-2"
//                   />
//                 </div>
//                 {/* Name */}
//                 <div className="space-y-1 grid grid-cols-3 items-center">
//                   <Label>Name</Label>
//                   <Input
//                     type="text"
//                     id="name"
//                     placeholder="Name of Scholarship Program"
//                     {...form.register("name")}
//                     className="col-span-2"
//                   />
//                 </div>
//                 {/* Description */}
//                 <div className="space-y-1 grid grid-cols-3 items-center">
//                   <Label>Description</Label>
//                   <Input
//                     type="text"
//                     id="description"
//                     placeholder="Description"
//                     {...form.register("description")}
//                     className="col-span-2"
//                   />
//                 </div>
//                 {/* Price */}
//                 <div className="space-y-1 grid grid-cols-3 items-center">
//                   <Label>Price</Label>
//                   <Input
//                     type="text"
//                     id="price"
//                     placeholder="Price"
//                     {...form.register("price")}
//                     className="col-span-2"
//                   />
//                 </div>
//                 {/* Quantity */}
//                 <div className="space-y-1 grid grid-cols-3 items-center">
//                   <Label>Quantity</Label>
//                   <Input
//                     type="text"
//                     id="quantity"
//                     placeholder="Quantity"
//                     {...form.register("quantity")}
//                     className="col-span-2"
//                   />
//                 </div>
//                 {/* Deadline */}
//                 <div className="space-y-1 grid grid-cols-3 items-center">
//                   <Label>Deadline</Label>
//                   <Input
//                     type="date"
//                     id="deadline"
//                     placeholder="Deadline"
//                     {...form.register("deadline")}
//                     className="col-span-2"
//                   />
//                 </div>
//                 {/* Status */}
//                 {/* <div className="space-y-1 grid grid-cols-3 items-center">
//                   <Label>Status</Label>
//                   <Input
//                     type="text"
//                     id="status"
//                     placeholder="Set status"
//                     {...form.register("status")}
//                     className="col-span-2"
//                   />
//                 </div> */}

//             {/* Majors */}

//               {/* <CardContent className="space-y-2"> */}
//                 <div className="space-y-1 grid grid-cols-3 items-center">
//                   <Label>Universities</Label>
//                   <Select
//                     isMulti
//                     value={selectedUniversities}
//                     onChange={handleUniversityChange}
//                     options={universities}
//                     placeholder="Choose university"
//                     className="col-span-2"
//                   />
//                 </div>
//                 <div className="space-y-1 grid grid-cols-5 items-center">
//                   <Label>Majors</Label>
//                   <Select
//                     isMulti
//                     value={selectedMajors}
//                     onChange={handleMajorChange}
//                     options={majors}
//                     placeholder="Choose majors"
//                     className="col-span-2"
//                   />
//                 </div>

//               {/* Skills */}

//               <div className="space-y-1 grid grid-cols-3 items-center">
//                   <Label>Skills</Label>
//                   <Select
//                     isMulti
//                     value={selectedSkills}
//                     onChange={handleSkillChange}
//                     options={skills}
//                     placeholder="Choose skills"
//                     className="col-span-2"
//                   />
//                 </div>

//             {/* Certificates */}

//                 <div className="space-y-1 grid grid-cols-3 items-center">
//                   <Label>Certificates</Label>
//                   <Select
//                     isMulti
//                     value={selectedCertificates}
//                     onChange={handleCertificateChange}
//                     options={certificates}
//                     placeholder="Choose certificates"
//                     className="col-span-2"
//                   />
//                 </div>

//               </CardContent>
//             </Card>

//             {/* Submit Button */}
//             <div className="w-full flex justify-end">
//               <Button
//                 type="submit"
//                 className="bg-blue-500 hover:bg-blue-800 rounded-[2rem] w-36 h-12 text-xl"
//                 onClick={() => console.log("Button clicked")}
//               >
//                 Create
//               </Button>
//             </div>
//           </form>
//         </motion.div>
//       </div>
//     </AnimatePresence>
//   );
// };

// export default FormCreateScholarshipProgram;

// ===========================================================================================

// import { Button } from "@/components/ui/button";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import { AnimatePresence, motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useSelector } from "react-redux";
// import { z } from "zod";
// import { BASE_URL } from "@/constants/api";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Select, { MultiValue } from "react-select";

// interface CreateScholarshipModalProps {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
// }

// interface OptionType {
//   value: string;
//   label: string;
// }

// const formSchema = z.object({
//   scholarshiptype: z.string().min(1, "Vui lòng chọn loại dịch vụ"),
//   name: z.string().min(1, "Vui lòng nhập tên chương trình"),
//   description: z.string().min(1, "Vui lòng nhập mô tả"),
//   price: z.string().refine((price) => !isNaN(parseFloat(price)), {
//     message: "Giá phải là số",
//   }),
//   quantity: z.string().refine((quantity) => !isNaN(parseInt(quantity)), {
//     message: "Số lượng phải là số",
//   }),
//   imageUrl: z.string(),
//   deadline: z.string(),
//   status: z.string(),
//   universities: z
//     .array(z.string())
//     .min(1, "Vui lòng chọn ít nhất một trường đại học"),
//   majors: z.string().min(1, "Vui lòng chọn ít nhất một ngành học"),
//   certificates: z
//     .array(z.string())
//     .min(1, "Vui lòng chọn ít nhất một chứng chỉ"),
//   skills: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một kỹ năng"),
// });

// const FormCreateScholarshipProgram = () => {
//   const [categories, setCategories] = useState<OptionType[]>([]);
//   const [majors, setMajors] = useState<OptionType[]>([]);
//   const [skills, setSkills] = useState<OptionType[]>([]);
//   const [certificates, setCertificates] = useState<OptionType[]>([]);
//   const [universities, setUniversities] = useState<OptionType[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [selectedMajors, setSelectedMajors] = useState<string>("");
//   const [selectedSkills, setSelectedSkills] = useState<OptionType[]>([]);
//   const [selectedUniversities, setSelectedUniversities] = useState<
//     OptionType[]
//   >([]);
//   const [selectedCertificates, setSelectedCertificates] = useState<
//     OptionType[]
//   >([]);
//   const funder = useSelector((state: any) => state.token.user);
//   const funderId = funder?.id;

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       scholarshiptype: "",
//       name: "",
//       description: "",
//       price: "",
//       quantity: "",
//       imageUrl: "",
//       deadline: "",
//       status: "ACTIVE",
//       universities: [],
//       majors: "",
//       certificates: [],
//       skills: [],
//     },
//   });

//   const handleCategoryChange = (selectedOption: any) => {
//     setSelectedCategory(selectedOption ? selectedOption.value : "");
//     form.clearErrors("scholarshiptype");
//   };

//   const handleUniversityChange = (options: MultiValue<OptionType>) => {
//     setSelectedUniversities(Array.from(options) || []);
//     form.clearErrors("universities");
//   };

//   const handleMajorChange = (selectedOption: any) => {
//     setSelectedMajors(selectedOption ? selectedOption.value : "");
//     form.clearErrors("majors");
//   };

//   const handleCertificateChange = (options: MultiValue<OptionType>) => {
//     setSelectedCertificates(Array.from(options) || []);
//     form.clearErrors("certificates");
//   };

//   const handleSkillChange = (options: MultiValue<OptionType>) => {
//     setSelectedSkills(Array.from(options) || []);
//     form.clearErrors("skills");
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchMajors();
//     fetchSkills();
//     fetchCertificates();
//     fetchUniversities();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/categories`);
//       setCategories(
//         response.data.data.map((category: any) => ({
//           value: category.id.toString(),
//           label: category.name,
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching categories", error);
//     }
//   };

//   const fetchMajors = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/majors`);
//       setMajors(
//         response.data.data.map((major: any) => ({
//           value: major.id.toString(),
//           label: major.name,
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching majors", error);
//     }
//   };

//   const fetchSkills = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/skills`);
//       setSkills(
//         response.data.data.map((skill: any) => ({
//           value: skill.id.toString(),
//           label: skill.name,
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching skills", error);
//     }
//   };

//   const fetchCertificates = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/certificates`);
//       setCertificates(
//         response.data.data.map((certificate: any) => ({
//           value: certificate.id.toString(),
//           label: certificate.name,
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching certificates", error);
//     }
//   };

//   const fetchUniversities = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/universities`);
//       setUniversities(
//         response.data.data.map((university: any) => ({
//           value: university.id.toString(),
//           label: university.name,
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching universities", error);
//     }
//   };

//   const handleAddNewScholarshipProgram = async (
//     values: z.infer<typeof formSchema>
//   ) => {
//     try {
//       if (!funderId) {
//         throw new Error("Funder ID not available");
//       }

//       const postData = {
//         name: values.name,
//         imageUrl: "string",
//         description: values.description,
//         scholarshipAmount: values.price,
//         numberOfScholarships: values.quantity,
//         deadline: values.deadline,
//         status: values.status,
//         funderId,
//         categoryId: parseInt(values.scholarshiptype),
//         universityIds: values.universities.map((id) => parseInt(id)),
//         majorIds: parseInt(values.majors),
//         certificateIds: values.certificates.map((id) => parseInt(id)),
//         skillIds: values.skills.map((id) => parseInt(id)),
//       };

//       const response = await axios.post(
//         `${BASE_URL}/api/scholarship-programs`,
//         postData
//       );
//       form.reset();
//       setSelectedMajors("");
//       setSelectedCertificates([]);
//       setSelectedSkills([]);
//       setSelectedUniversities([]);
//       setSelectedCategory("");
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error("Axios error response:", error.response?.data);
//       } else {
//         console.error("Error creating scholarship program", error);
//       }
//     }
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0, scale: 0.5 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.5 }}
//         transition={{ duration: 0.2 }}
//         className="bg-white p-6 rounded-lg shadow-lg w-full"
//       >
//         <h3 className="text-2xl mb-5">Add new Scholarship Program</h3>
//         <form
//           onSubmit={form.handleSubmit(handleAddNewScholarshipProgram)}
//           className="flex flex-col gap-4"
//         >
//           <Card className="">
//             <CardContent className="space-y-2">
//               {/* Type */}
//               <div className="space-y-1 grid grid-cols-3 items-center">
//                 <Label htmlFor="scholarshiptype">Type</Label>
//                 <Select
//                   options={categories}
//                   value={
//                     categories.find(
//                       (category) => category.value === selectedCategory
//                     ) || null
//                   }
//                   onChange={handleCategoryChange}
//                   placeholder="Select scholarship type"
//                   className="col-span-2"
//                 />
//               </div>
//               {/* Universities */}
//               <div className="space-y-1 grid grid-cols-3 items-center">
//                 <Label>Universities</Label>
//                 <Select
//                   isMulti
//                   value={selectedUniversities}
//                   onChange={handleUniversityChange}
//                   options={universities}
//                   placeholder="Choose university"
//                   className="col-span-2"
//                 />
//               </div>
//               {/* Majors */}
//               <div className="space-y-1 grid grid-cols-3 items-center">
//                 <Label>Majors and Skills</Label>
//                 <div className="col-span-2 flex space-x-4">
//                   <div className="w-1/2">
//                     <Select
//                       // isMulti
//                       value={
//                         majors.find(
//                           (major) => major.value === selectedMajors
//                         ) || null
//                       }
//                       onChange={handleMajorChange}
//                       options={majors}
//                       placeholder="Choose majors"
//                     />
//                   </div>
//                   {selectedMajors.length > 0 && (
//                     <div className="w-1/2">
//                       <Select
//                         isMulti
//                         value={selectedSkills}
//                         onChange={handleSkillChange}
//                         options={skills}
//                         placeholder="Choose skills"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//               {/* Certificates */}
//               <div className="space-y-1 grid grid-cols-3 items-center">
//                 <Label>Certificates</Label>
//                 <Select
//                   isMulti
//                   value={selectedCertificates}
//                   onChange={handleCertificateChange}
//                   options={certificates}
//                   placeholder="Choose certificate"
//                   className="col-span-2"
//                 />
//               </div>
//             </CardContent>
//           </Card>
//           {/* Name, Description, Price, Quantity */}
//           {/* ...rest of the form */}
//         </form>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default FormCreateScholarshipProgram;

// =====================================================================================================

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { BASE_URL } from "@/constants/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select, { MultiValue } from "react-select";
import RouteNames from "@/constants/routeNames";
import { useNavigate } from "react-router-dom";

interface CreateScholarshipModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface OptionType {
  value: string;
  label: string;
}

const formSchema = z.object({
  scholarshiptype: z.string().min(1, "Vui lòng chọn loại dịch vụ"),
  name: z.string().min(1, "Vui lòng nhập tên chương trình"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  price: z.string().refine((price) => !isNaN(parseFloat(price)), {
    message: "Giá phải là số",
  }),
  quantity: z.string().refine((quantity) => !isNaN(parseInt(quantity)), {
    message: "Số lượng phải là số",
  }),
  imageUrl: z.string(),
  deadline: z.string(),
  status: z.string(),
  universities: z
    .array(z.string())
    .min(1, "Vui lòng chọn ít nhất một trường đại học"),
  certificates: z
    .array(z.string())
    .min(1, "Vui lòng chọn ít nhất một chứng chỉ"),
  majorSkillPairs: z
    .array(
      z.object({
        majors: z.string().min(1, "Vui lòng chọn ít nhất một ngành học"),
        skills: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một kỹ năng"),
      })
    )
    .min(1, "Vui lòng chọn ít nhất một cặp ngành-kỹ năng"),
});

const FormCreateScholarshipProgram = () => {
  const [categories, setCategories] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedUniversities, setSelectedUniversities] = useState<
    OptionType[]
  >([]);
  const [selectedCertificates, setSelectedCertificates] = useState<
    OptionType[]
  >([]);
  const [majors, setMajors] = useState<OptionType[]>([]);
  const [skills, setSkills] = useState<OptionType[]>([]);
  const [majorSkillPairs, setMajorSkillPairs] = useState([
    { major: "", skills: [] as OptionType[] },
  ]);

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
      imageUrl: "",
      deadline: "",
      status: "ACTIVE",
      universities: [],
      certificates: [],
      majorSkillPairs: [{ majors: "", skills: [] }],
    },
  });

  const handleCategoryChange = (selectedOption: any) => {
    setSelectedCategory(selectedOption ? selectedOption.value : "");
    form.clearErrors("scholarshiptype");
  };

  const handleUniversityChange = (options: MultiValue<OptionType>) => {
    setSelectedUniversities(Array.from(options) || []);
    form.clearErrors("universities");
  };

  const handleCertificateChange = (options: MultiValue<OptionType>) => {
    setSelectedCertificates(Array.from(options) || []);
    form.clearErrors("certificates");
  };

  useEffect(() => {
    form.setValue("scholarshiptype", selectedCategory);
  }, [selectedCategory, form]);

  useEffect(() => {
    form.setValue(
      "certificates",
      selectedCertificates.map((option) => option.value)
    );
  }, [selectedCertificates, form]);

  useEffect(() => {
    form.setValue(
      "universities",
      selectedUniversities.map((option) => option.value)
    );
  }, [selectedUniversities, form]);

  useEffect(() => {
    form.setValue(
      "majorSkillPairs",
      majorSkillPairs.map((pair) => ({
        majors: pair.major,
        skills: pair.skills.map((skill) => skill.value), 
      }))
    );
  }, [majorSkillPairs, form]);

  useEffect(() => {
    console.log("Form errors:", form.formState.errors);
  }, [form.formState.errors]);

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

  useEffect(() => {
    fetchCategories();
    fetchMajors();
    fetchSkills();
    fetchCertificates();
    fetchUniversities();
  }, []);

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

  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/skills`);
      setSkills(
        response.data.data.map((skill: any) => ({
          value: skill.id.toString(),
          label: skill.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching skills", error);
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

  const handleAddMajorSkillPair = () => {
    setMajorSkillPairs([...majorSkillPairs, { major: "", skills: [] }]);
  };

  const handleRemoveMajorSkillPair = (index: number) => {
    setMajorSkillPairs(majorSkillPairs.filter((_, i) => i !== index));
  };

  const handleMajorChange = (selectedOption: any, index: number) => {
    const updatedPairs = [...majorSkillPairs];
    updatedPairs[index].major = selectedOption ? selectedOption.value : "";
    setMajorSkillPairs(updatedPairs);
  };

  const handleSkillChange = (
    options: MultiValue<OptionType>,
    index: number
  ) => {
    const updatedPairs = [...majorSkillPairs];
    updatedPairs[index].skills = Array.from(options) || [];
    setMajorSkillPairs(updatedPairs);
  };

  const handleAddNewScholarshipProgram = async (
    values: z.infer<typeof formSchema>
  ) => {
    console.log(
      "Selected scholarship type:",
      form.getValues("scholarshiptype")
    );
    try {
      if (!funderId) throw new Error("Funder ID not available");

      const majorSkillPairs = form.getValues("majorSkillPairs").map((pair) => ({
        majorIds: parseInt(pair.majors), 
        skillIds: pair.skills.map((skill) => parseInt(skill)),  
      }));

      const postData = {
        name: values.name,
        imageUrl: "string",
        description: values.description,
        scholarshipAmount: values.price,
        numberOfScholarships: values.quantity,
        deadline: values.deadline,
        status: values.status,
        funderId,
        categoryId: parseInt(values.scholarshiptype),
        universityIds: values.universities.map((id) => parseInt(id)),
        majors: majorSkillPairs,
        certificateIds: values.certificates.map((id) => parseInt(id)),
      };

      console.log("Post data to API:", postData);

      const response = await axios.post(
        `${BASE_URL}/api/scholarship-programs`,
        postData
      );
      console.log("API response:", response.data);
      form.reset();
      setSelectedCertificates([]);
      setMajorSkillPairs([{ major: "", skills: [] }]);
      setSelectedUniversities([]);
      setSelectedCategory("");
      navigate(RouteNames.ACTIVITY)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response?.data);
      } else {
        console.error("Error creating scholarship program", error);
      }
    }
  };

  

  return (
    <AnimatePresence>
      <div className="inset-0 bg-opacity-50 items-center grid grid-cols-1 gap-10 p-10 justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg w-full"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-2xl mb-5">Add new Scholarship Program</h3>
          </div>
          <form
            onSubmit={form.handleSubmit(handleAddNewScholarshipProgram)}
            className="flex flex-col gap-4"
          >
            <Card>
              <CardContent className="space-y-2">
                {/* Type */}
                <div className="space-y-1 grid grid-cols-3 items-center">
                  <Label htmlFor="scholarshiptype">Type</Label>
                  <Select
                    options={categories}
                    value={
                      categories.find(
                        (category: any) => category.value === selectedCategory
                      ) || null
                    }
                    onChange={handleCategoryChange}
                    placeholder="Select scholarship type"
                    className="col-span-2"
                  />
                </div>
                {/* Name */}
                <div className="space-y-1 grid grid-cols-3 items-center">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Name of Scholarship Program"
                    {...form.register("name")}
                    className="col-span-2"
                  />
                </div>
                {/* Description */}
                <div className="space-y-1 grid grid-cols-3 items-center">
                  <Label>Description</Label>
                  <Input
                    type="text"
                    id="description"
                    placeholder="Description"
                    {...form.register("description")}
                    className="col-span-2"
                  />
                </div>
                {/* Price */}
                <div className="space-y-1 grid grid-cols-3 items-center">
                  <Label>Price</Label>
                  <Input
                    type="text"
                    id="price"
                    placeholder="Price"
                    {...form.register("price")}
                    className="col-span-2"
                  />
                </div>
                {/* Quantity */}
                <div className="space-y-1 grid grid-cols-3 items-center">
                  <Label>Quantity</Label>
                  <Input
                    type="text"
                    id="quantity"
                    placeholder="Quantity"
                    {...form.register("quantity")}
                    className="col-span-2"
                  />
                </div>
                {/* Deadline */}
                <div className="space-y-1 grid grid-cols-3 items-center">
                  <Label>Deadline</Label>
                  <Input
                    type="date"
                    id="deadline"
                    placeholder="Deadline"
                    {...form.register("deadline")}
                    className="col-span-2"
                  />
                </div>
                <div className="space-y-1 grid grid-cols-3 items-center">
                  <Label>Universities</Label>
                  <Select
                    isMulti
                    value={selectedUniversities}
                    onChange={handleUniversityChange}
                    options={universities}
                    placeholder="Choose university"
                    className="col-span-2"
                  />
                </div>
                {/* Major-Skill Pairs Section */}
                <div className="space-y-1 grid grid-cols-3 items-center">
                  <Label>Majors and Skills</Label>
                  <div className="col-span-2 space-y-4">
                    {majorSkillPairs.map((pair, index) => (
                      <div key={index} className="flex space-x-4 items-center">
                        <Select
                          value={
                            majors.find(
                              (major) => major.value === pair.major
                            ) || null
                          }
                          onChange={(option) =>
                            handleMajorChange(option, index)
                          }
                          options={majors}
                          placeholder="Choose major"
                          className="w-1/2"
                        />
                        <Select
                          isMulti
                          value={pair.skills}
                          onChange={(options) =>
                            handleSkillChange(options, index)
                          }
                          options={skills}
                          placeholder="Choose skills"
                          className="w-1/2"
                        />
                        {index > 0 && (
                          <Button
                            onClick={() => handleRemoveMajorSkillPair(index)}
                            variant="outline"
                          >
                           X
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button onClick={handleAddMajorSkillPair} variant="default">
                      Add Another Major-Skill Pair
                    </Button>
                  </div>
                </div>
                {/* Certificates */}

                <div className="space-y-1 grid grid-cols-3 items-center">
                  <Label>Certificates</Label>
                  <Select
                    isMulti
                    value={selectedCertificates}
                    onChange={handleCertificateChange}
                    options={certificates}
                    placeholder="Choose certificates"
                    className="col-span-2"
                  />
                </div>
              </CardContent>
            </Card>
            {/* Submit Button */}
            <div className="w-full flex justify-end">
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-800 rounded-[2rem] w-36 h-12 text-xl"
                onClick={() => console.log("Button clicked")}
              >
                Create
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FormCreateScholarshipProgram;
