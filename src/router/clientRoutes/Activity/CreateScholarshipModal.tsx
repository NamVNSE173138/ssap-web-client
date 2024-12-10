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

// const CreateScholarshipModal = ({
//   isOpen,
//   setIsOpen,
// }: CreateScholarshipModalProps) => {
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
//       status: "",
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

//   useEffect(() => {
//     if (isOpen) {
//       fetchCategories();
//       fetchMajors();
//       fetchSkills();
//       fetchCertificates();
//       fetchUniversities();
//     }
//   }, [isOpen]);

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
//       setIsOpen(false);
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
//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.5 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.5 }}
//             transition={{ duration: 0.2 }}
//             className="bg-white p-6 rounded-lg shadow-lg w-1/2"
//           >
//             <div className="flex justify-between items-center">
//               <h3 className="text-2xl mb-5">Add new Scholarship Program</h3>
//               <button onClick={() => setIsOpen(false)} className="text-xl">
//                 &times;
//               </button>
//             </div>
//             <form
//               onSubmit={form.handleSubmit(handleAddNewScholarshipProgram)}
//               className="flex flex-col gap-4"
//             >
//               <Tabs defaultValue="information">
//                 <TabsList className="grid w-full grid-cols-4">
//                   <TabsTrigger value="information">
//                     General Information
//                   </TabsTrigger>
//                   <TabsTrigger value="majors">Majors</TabsTrigger>
//                   <TabsTrigger value="certificates">Certificates</TabsTrigger>
//                   <TabsTrigger value="skills">Skills</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="information">
//                   <Card>
//                     <CardContent className="space-y-2 ">
//                       <div className="space-y-1 grid grid-cols-3 items-center w-full mt-5">
//                         <Label htmlFor="scholarshiptype">Type</Label>
//                         <Select
//                           options={categories}
//                           value={
//                             categories.find(
//                               (category: any) =>
//                                 category.value === selectedCategory
//                             ) || null
//                           }
//                           onChange={handleCategoryChange}
//                           placeholder="Select scholarship type"
//                           className="col-span-2"
//                         />
//                       </div>
//                       {form.formState.errors.scholarshiptype && (
//                         <span className="text-red-500 text-sm ">
//                           {form.formState.errors.scholarshiptype.message}
//                         </span>
//                       )}
//                       <div className="space-y-1 grid grid-cols-3 items-center">
//                         <Label>Name</Label>
//                         <Input
//                           type="text"
//                           id="name"
//                           placeholder="Name of Scholarship Program"
//                           {...form.register("name")}
//                           className="col-span-2"
//                         />
//                       </div>
//                       {form.formState.errors.name && (
//                         <span className="text-red-500 text-sm">
//                           {form.formState.errors.name.message}
//                         </span>
//                       )}
//                       <div className="space-y-1 grid grid-cols-3 items-center">
//                         <Label>Description</Label>
//                         <Input
//                           type="text"
//                           id="description"
//                           placeholder="Description"
//                           {...form.register("description")}
//                           className="col-span-2"
//                         />
//                       </div>
//                       {form.formState.errors.description && (
//                         <span className="text-red-500 text-sm">
//                           {form.formState.errors.description.message}
//                         </span>
//                       )}
//                       <div className="space-y-1 grid grid-cols-3 items-center">
//                         <Label>Price</Label>
//                         <Input
//                           type="text"
//                           id="price"
//                           placeholder="Price"
//                           {...form.register("price")}
//                           className="col-span-2"
//                         />
//                       </div>
//                       {form.formState.errors.price && (
//                         <span className="text-red-500 text-sm">
//                           {form.formState.errors.price.message}
//                         </span>
//                       )}
//                       <div className="space-y-1 grid grid-cols-3 items-center">
//                         <Label>Quantity</Label>
//                         <Input
//                           type="text"
//                           id="quantity"
//                           placeholder="Quantity"
//                           {...form.register("quantity")}
//                           className="col-span-2"
//                         />
//                       </div>
//                       {form.formState.errors.quantity && (
//                         <span className="text-red-500 text-sm">
//                           {form.formState.errors.quantity.message}
//                         </span>
//                       )}
//                       <div className="space-y-1 grid grid-cols-3 items-center">
//                         <Label>Deadline</Label>
//                         <Input
//                           type="date"
//                           id="deadline"
//                           placeholder="Deadline"
//                           {...form.register("deadline")}
//                           className="col-span-2"
//                         />
//                       </div>
//                       {form.formState.errors.deadline && (
//                         <span className="text-red-500 text-sm">
//                           {form.formState.errors.deadline.message}
//                         </span>
//                       )}
//                       <div className="space-y-1 grid grid-cols-3 items-center">
//                         <Label>Status</Label>
//                         <Input
//                           type="text"
//                           id="status"
//                           placeholder="Set status"
//                           {...form.register("status")}
//                           className="col-span-2"
//                         />
//                       </div>
//                       {form.formState.errors.status && (
//                         <span className="text-red-500 text-sm">
//                           {form.formState.errors.status.message}
//                         </span>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//                 <TabsContent value="majors">
//                   <Card>
//                     <CardContent className="space-y-2">
//                       <div className="space-y-1 grid grid-cols-3 items-center mt-5">
//                         <Label>Universities</Label>
//                         <Select
//                           isMulti
//                           value={selectedUniversities}
//                           onChange={handleUniversityChange}
//                           options={universities}
//                           placeholder="Choose university"
//                           className="col-span-2"
//                         />
//                       </div>
//                       {form.formState.errors.majors && (
//                         <span className="text-red-500 text-sm">
//                           {form.formState.errors.majors.message}
//                         </span>
//                       )}
//                       <div className="space-y-1 grid grid-cols-3 items-center">
//                         <Label>Majors</Label>
//                         <Select
//                           isMulti
//                           value={selectedMajors}
//                           onChange={handleMajorChange}
//                           options={majors}
//                           placeholder="Choose majors"
//                           className="col-span-2"
//                         />
//                       </div>
//                       {form.formState.errors.majors && (
//                         <span className="text-red-500 text-sm">
//                           {form.formState.errors.majors.message}
//                         </span>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//                 <TabsContent value="certificates">
//                   <Card>
//                     <CardContent className="space-y-2">
//                       <div className="space-y-1 grid grid-cols-3 items-center mt-5">
//                         <Label>Certificates</Label>
//                         <Select
//                           isMulti
//                           value={selectedCertificates}
//                           onChange={handleCertificateChange}
//                           options={certificates}
//                           placeholder="Choose certificates"
//                           className="col-span-2"
//                         />
//                       </div>
//                       {form.formState.errors.certificates && (
//                         <span className="text-red-500 text-sm">
//                           {form.formState.errors.certificates.message}
//                         </span>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//                 <TabsContent value="skills">
//                   <Card>
//                     <CardContent className="space-y-2">
//                       <div className="space-y-1 grid grid-cols-3 items-center mt-5">
//                         <Label>Skills</Label>
//                         <Select
//                           isMulti
//                           value={selectedSkills}
//                           onChange={handleSkillChange}
//                           options={skills}
//                           placeholder="Choose skills"
//                           className="col-span-2"
//                         />
//                       </div>
//                       {form.formState.errors.skills && (
//                         <span className="text-red-500 text-sm">
//                           {form.formState.errors.skills.message}
//                         </span>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//               </Tabs>
//               <div className="w-full flex justify-end ">
//                 <Button
//                   type="submit"
//                   className="bg-blue-500 hover:bg-blue-800 rounded-[2rem] w-36 h-12 text-xl"
//                   // disabled={
//                   //   !form.formState.isValid || form.formState.isSubmitting
//                   // }
//                   onClick={() => console.log("Button clicked")}
//                 >
//                   Create
//                 </Button>
//               </div>
//             </form>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default CreateScholarshipModal;

// // RUNNING==============================

// // import { Button } from "@/components/ui/button";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import axios from "axios";
// // import { AnimatePresence, motion } from "framer-motion";
// // import { useEffect, useState } from "react";
// // import { useForm } from "react-hook-form";
// // import { useSelector } from "react-redux";
// // import { z } from "zod";
// // import { BASE_URL } from "@/constants/api";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectGroup,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";

// // interface CreateScholarshipModalProps {
// //   isOpen: boolean;
// //   setIsOpen: (isOpen: boolean) => void;
// // }

// // const formSchema = z.object({
// //   scholarshiptype: z.string().min(1, "Vui lòng chọn loại dịch vụ"),
// //   name: z.string().min(1, "Vui lòng nhập tên chương trình"),
// //   description: z.string().min(1, "Vui lòng nhập mô tả"),
// //   price: z.string().refine((price) => !isNaN(parseFloat(price)), {
// //     message: "Giá phải là số",
// //   }),
// //   quantity: z.string().refine((quantity) => !isNaN(parseInt(quantity)), {
// //     message: "Số lượng phải là số",
// //   }),
// //   imageUrl: z.string(),
// //   deadline: z.string(),
// //   status: z.string(),
// //   universities: z.string().min(1, "Vui lòng nhập ít nhất một trường đại học"),
// //   majors: z.string().min(1, "Vui lòng nhập ít nhất một ngành học"),
// //   certificates: z.string().min(1, "Vui lòng nhập ít nhất một chứng chỉ"),
// //   skills: z.string().min(1, "Vui lòng nhập ít nhất một kỹ năng"),
// // });

// // const CreateScholarshipModal = ({
// //   isOpen,
// //   setIsOpen,
// // }: CreateScholarshipModalProps) => {
// //   const [categories, setCategories] = useState([]);
// //   const [majors, setMajors] = useState([]);
// //   const [skills, setSkills] = useState([]);
// //   const [certificates, setCertificates] = useState([]);
// //   const [universities, setUniversities] = useState([]);
// //   const [selectedCategory, setSelectedCategory] = useState<string>("");
// //   const [selectedMajors, setSelectedMajors] = useState<string>("");
// //   const [selectedSkills, setSelectedSkills] = useState<string>("");
// //   const [selectedUniversities, setSelectedUniversities] = useState<string>("");
// //   const [selectedCertificates, setSelectedCertificates] = useState<string>("");
// //   const funder = useSelector((state: any) => state.token.user);
// //   const funderId = funder?.id;

// //   const form = useForm<z.infer<typeof formSchema>>({
// //     resolver: zodResolver(formSchema),
// //     defaultValues: {
// //       scholarshiptype: selectedCategory || "",
// //       name: "",
// //       description: "",
// //       price: "",
// //       quantity: "",
// //       imageUrl: "",
// //       deadline: "",
// //       status: "",
// //       universities: selectedUniversities || "",
// //       majors: selectedMajors || "",
// //       certificates: selectedCertificates || "",
// //       skills: selectedSkills || "",
// //     },
// //   });

// //   useEffect(() => {
// //     form.setValue("scholarshiptype", selectedCategory);
// //   }, [selectedCategory, form]);

// //   useEffect(() => {
// //     form.setValue("majors", selectedMajors);
// //   }, [selectedMajors, form]);

// //   useEffect(() => {
// //     form.setValue("certificates", selectedCertificates);
// //   }, [selectedCertificates, form]);

// //   useEffect(() => {
// //     form.setValue("skills", selectedSkills);
// //   }, [selectedSkills, form]);

// //   useEffect(() => {
// //     form.setValue("universities", selectedUniversities);
// //   }, [selectedUniversities, form]);

// //   useEffect(() => {
// //     console.log("Form errors:", form.formState.errors);
// //   }, [form.formState.errors]);

// //   const fetchCategories = async () => {
// //     try {
// //       const response = await axios.get(`${BASE_URL}/api/categories`);
// //       setCategories(response.data.data);
// //     } catch (error) {
// //       console.error("Error fetching categories", error);
// //     }
// //   };

// //   const fetchMajors = async () => {
// //     try {
// //       const response = await axios.get(`${BASE_URL}/api/majors`);
// //       setMajors(response.data.data);
// //     } catch (error) {
// //       console.error("Error fetching majors", error);
// //     }
// //   };

// //   const fetchSkills = async () => {
// //     try {
// //       const response = await axios.get(`${BASE_URL}/api/skills`);
// //       setSkills(response.data.data);
// //     } catch (error) {
// //       console.error("Error fetching skills", error);
// //     }
// //   };

// //   const fetchCertificates = async () => {
// //     try {
// //       const response = await axios.get(`${BASE_URL}/api/certificates`);
// //       setCertificates(response.data.data);
// //     } catch (error) {
// //       console.error("Error fetching certificates", error);
// //     }
// //   };

// //   const fetchUniversities = async () => {
// //     try {
// //       const response = await axios.get(`${BASE_URL}/api/universities`);
// //       setUniversities(response.data.data);
// //     } catch (error) {
// //       console.error("Error fetching certificates", error);
// //     }
// //   };

// //   useEffect(() => {
// //     if (isOpen) {
// //       fetchCategories();
// //       fetchMajors();
// //       fetchSkills();
// //       fetchCertificates();
// //       fetchUniversities();
// //     }
// //   }, [isOpen]);

// //   useEffect(() => {
// //     form.setValue("scholarshiptype", selectedCategory);
// //     form.setValue("majors", selectedMajors);
// //     form.setValue("certificates", selectedCertificates);
// //     form.setValue("skills", selectedSkills);
// //     form.setValue("universities", selectedUniversities);
// //   }, [selectedCategory, selectedMajors, selectedCertificates, selectedSkills, selectedUniversities, form]);

// //   const handleAddNewScholarshipProgram = async (
// //     values: z.infer<typeof formSchema>
// //   ) => {
// //     console.log(
// //       "Selected scholarship type:",
// //       form.getValues("scholarshiptype")
// //     );

// //     try {
// //       if (!funderId) {
// //         throw new Error("Funder ID not available");
// //       }

// //       const postData = {
// //         name: values.name,
// //         imageUrl: "string",
// //         description: values.description,
// //         scholarshipAmount: values.price,
// //         numberOfScholarships: values.quantity,
// //         deadline: values.deadline,
// //         status: values.status,
// //         funderId,
// //         categoryId: parseInt(values.scholarshiptype),
// //         universityIds: values.universities
// //           .split(",")
// //           .map((id) => parseInt(id.trim())),
// //         majorIds: values.majors.split(",").map((id) => parseInt(id.trim())),
// //         certificateIds: values.certificates
// //           .split(",")
// //           .map((id) => parseInt(id.trim())),
// //         skillIds: values.skills.split(",").map((id) => parseInt(id.trim())),
// //       };

// //       console.log("Post data to API:", postData);
// //       const response = await axios.post(
// //         `${BASE_URL}/api/scholarship-programs`,
// //         postData
// //       );
// //       console.log("API response:", response.data);
// //       setIsOpen(false);
// //     } catch (error) {
// //       if (axios.isAxiosError(error)) {
// //         console.error("Axios error response:", error.response?.data);
// //       } else {
// //         console.error("Error creating scholarship program", error);
// //       }
// //     }
// //   };

// //   return (
// //     <AnimatePresence>
// //       {isOpen && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //           <motion.div
// //             initial={{ opacity: 0, scale: 0.5 }}
// //             animate={{ opacity: 1, scale: 1 }}
// //             exit={{ opacity: 0, scale: 0.5 }}
// //             transition={{ duration: 0.2 }}
// //             className="bg-white p-6 rounded-lg shadow-lg w-1/2"
// //           >
// //             <div className="flex justify-between items-center">
// //               <h3 className="text-2xl mb-10">Add new Scholarship Program</h3>
// //               <button onClick={() => setIsOpen(false)} className="text-xl">
// //                 &times;
// //               </button>
// //             </div>
// //             <form
// //               onSubmit={form.handleSubmit(handleAddNewScholarshipProgram)}
// //               className="flex flex-col gap-4"
// //             >
// //               <Tabs defaultValue="information">
// //                 <TabsList className="grid w-full grid-cols-4">
// //                   <TabsTrigger value="information">Information</TabsTrigger>
// //                   <TabsTrigger value="majors">Majors</TabsTrigger>
// //                   <TabsTrigger value="certificates">Certificates</TabsTrigger>
// //                   <TabsTrigger value="skills">Skills</TabsTrigger>
// //                 </TabsList>
// //                 <TabsContent value="information">
// //                   <Card>
// //                     <CardContent className="space-y-2">
// //                       <div className="space-y-1 grid grid-cols-2 items-center w-full">
// //                         <Label htmlFor="scholarshiptype">Type</Label>
// //                         <Select
// //                           value={selectedCategory}
// //                           onValueChange={(value) => setSelectedCategory(value)}
// //                         >
// //                           <SelectTrigger>
// //                             <SelectValue placeholder="Choose type" />
// //                           </SelectTrigger>
// //                           <SelectContent>
// //                             <SelectGroup>
// //                               {categories.map((category: any) => (
// //                                 <SelectItem
// //                                   key={category.id}
// //                                   value={category.id.toString()}
// //                                 >
// //                                   {category.name}
// //                                 </SelectItem>
// //                               ))}
// //                             </SelectGroup>
// //                           </SelectContent>
// //                         </Select>
// //                       </div>
// //                       {form.formState.errors.scholarshiptype && (
// //                         <span className="text-red-500 text-sm">
// //                           {form.formState.errors.scholarshiptype.message}
// //                         </span>
// //                       )}
// //                       <div className="space-y-1 grid grid-cols-2 items-center">
// //                         <Label>Name</Label>
// //                         <Input
// //                           type="text"
// //                           id="name"
// //                           placeholder="Name of Scholarship Program"
// //                           {...form.register("name")}
// //                         />
// //                       </div>
// //                       {form.formState.errors.name && (
// //                         <span className="text-red-500 text-sm">
// //                           {form.formState.errors.name.message}
// //                         </span>
// //                       )}
// //                       <div className="space-y-1 grid grid-cols-2 items-center">
// //                         <Label>Description</Label>
// //                         <Input
// //                           type="text"
// //                           id="description"
// //                           placeholder="Description"
// //                           {...form.register("description")}
// //                         />
// //                       </div>
// //                       {form.formState.errors.description && (
// //                         <span className="text-red-500 text-sm">
// //                           {form.formState.errors.description.message}
// //                         </span>
// //                       )}
// //                       <div className="space-y-1 grid grid-cols-2 items-center">
// //                         <Label>Price</Label>
// //                         <Input
// //                           type="text"
// //                           id="price"
// //                           placeholder="Price"
// //                           {...form.register("price")}
// //                         />
// //                       </div>
// //                       {form.formState.errors.price && (
// //                         <span className="text-red-500 text-sm">
// //                           {form.formState.errors.price.message}
// //                         </span>
// //                       )}
// //                       <div className="space-y-1 grid grid-cols-2 items-center">
// //                         <Label>Quantity</Label>
// //                         <Input
// //                           type="text"
// //                           id="quantity"
// //                           placeholder="Quantity"
// //                           {...form.register("quantity")}
// //                         />
// //                       </div>
// //                       {form.formState.errors.quantity && (
// //                         <span className="text-red-500 text-sm">
// //                           {form.formState.errors.quantity.message}
// //                         </span>
// //                       )}
// //                       <div className="space-y-1 grid grid-cols-2 items-center">
// //                         <Label>Deadline</Label>
// //                         <Input
// //                           type="date"
// //                           id="deadline"
// //                           placeholder="Deadline"
// //                           {...form.register("deadline")}
// //                         />
// //                       </div>
// //                       {form.formState.errors.deadline && (
// //                         <span className="text-red-500 text-sm">
// //                           {form.formState.errors.deadline.message}
// //                         </span>
// //                       )}
// //                       <div className="space-y-1 grid grid-cols-2 items-center">
// //                         <Label>Status</Label>
// //                         <Input
// //                           type="text"
// //                           id="status"
// //                           placeholder="Set status"
// //                           {...form.register("status")}
// //                         />
// //                       </div>
// //                       {form.formState.errors.status && (
// //                         <span className="text-red-500 text-sm">
// //                           {form.formState.errors.status.message}
// //                         </span>
// //                       )}
// //                     </CardContent>
// //                   </Card>
// //                 </TabsContent>
// //                 <TabsContent value="majors">
// //                   <Card>
// //                     <CardContent className="space-y-2">
// //                     <div className="space-y-1 grid grid-cols-2 items-center">
// //                         <Label>Universities</Label>
// //                         <Select
// //                           value={selectedUniversities}
// //                           onValueChange={(value) => setSelectedUniversities(value)}
// //                         >
// //                           <SelectTrigger>
// //                             <SelectValue placeholder="Choose universities" />
// //                           </SelectTrigger>
// //                           <SelectContent>
// //                             <SelectGroup>
// //                               {universities.map((university: any) => (
// //                                 <SelectItem
// //                                   key={university.id}
// //                                   value={university.id.toString()}
// //                                 >
// //                                   {university.name}
// //                                 </SelectItem>
// //                               ))}
// //                             </SelectGroup>
// //                           </SelectContent>
// //                         </Select>
// //                       </div>
// //                       {form.formState.errors.majors && (
// //                         <span className="text-red-500 text-sm">
// //                           {form.formState.errors.majors.message}
// //                         </span>
// //                       )}
// //                       <div className="space-y-1 grid grid-cols-2 items-center">
// //                         <Label>Majors</Label>
// //                         <Select
// //                           value={selectedMajors}
// //                           onValueChange={(value) => setSelectedMajors(value)}
// //                         >
// //                           <SelectTrigger>
// //                             <SelectValue placeholder="Choose majors" />
// //                           </SelectTrigger>
// //                           <SelectContent>
// //                             <SelectGroup>
// //                               {majors.map((major: any) => (
// //                                 <SelectItem
// //                                   key={major.id}
// //                                   value={major.id.toString()}
// //                                 >
// //                                   {major.name}
// //                                 </SelectItem>
// //                               ))}
// //                             </SelectGroup>
// //                           </SelectContent>
// //                         </Select>
// //                       </div>
// //                       {form.formState.errors.majors && (
// //                         <span className="text-red-500 text-sm">
// //                           {form.formState.errors.majors.message}
// //                         </span>
// //                       )}
// //                     </CardContent>
// //                   </Card>
// //                 </TabsContent>
// //                 <TabsContent value="certificates">
// //                   <Card>
// //                     <CardContent className="space-y-2">
// //                       <div className="space-y-1 grid grid-cols-2 items-center">
// //                         <Label>Certificates</Label>
// //                         <Select
// //                           value={selectedCertificates}
// //                           onValueChange={(value) =>
// //                             setSelectedCertificates(value)
// //                           }
// //                         >
// //                           <SelectTrigger>
// //                             <SelectValue placeholder="Choose certificates" />
// //                           </SelectTrigger>
// //                           <SelectContent>
// //                             <SelectGroup>
// //                               {certificates.map((certificate: any) => (
// //                                 <SelectItem
// //                                   key={certificate.id}
// //                                   value={certificate.id.toString()}
// //                                 >
// //                                   {certificate.name}
// //                                 </SelectItem>
// //                               ))}
// //                             </SelectGroup>
// //                           </SelectContent>
// //                         </Select>
// //                       </div>
// //                       {form.formState.errors.certificates && (
// //                         <span className="text-red-500 text-sm">
// //                           {form.formState.errors.certificates.message}
// //                         </span>
// //                       )}
// //                     </CardContent>
// //                   </Card>
// //                 </TabsContent>
// //                 <TabsContent value="skills">
// //                   <Card>
// //                     <CardContent className="space-y-2">
// //                       <div className="space-y-1 grid grid-cols-2 items-center">
// //                         <Label>Skills</Label>
// //                         <Select
// //                           value={selectedSkills}
// //                           onValueChange={(value) => setSelectedSkills(value)}
// //                         >
// //                           <SelectTrigger>
// //                             <SelectValue placeholder="Choose skills" />
// //                           </SelectTrigger>
// //                           <SelectContent>
// //                             <SelectGroup>
// //                               {skills.map((skill: any) => (
// //                                 <SelectItem
// //                                   key={skill.id}
// //                                   value={skill.id.toString()}
// //                                 >
// //                                   {skill.name}
// //                                 </SelectItem>
// //                               ))}
// //                             </SelectGroup>
// //                           </SelectContent>
// //                         </Select>
// //                       </div>
// //                       {form.formState.errors.skills && (
// //                         <span className="text-red-500 text-sm">
// //                           {form.formState.errors.skills.message}
// //                         </span>
// //                       )}
// //                     </CardContent>
// //                   </Card>
// //                 </TabsContent>
// //               </Tabs>
// //               <div className="w-full flex justify-end mt-4">
// //                 <Button
// //                   type="submit"
// //                   className="bg-blue-500 hover:bg-blue-800 rounded-[2rem] w-36 h-12 text-xl"
// //                   disabled={
// //                     !form.formState.isValid || form.formState.isSubmitting
// //                   }
// //                   onClick={() => console.log("Button clicked")}
// //                 >
// //                   Add
// //                 </Button>
// //                 <p>isValid: {form.formState.isValid.toString()}</p>
// //                 <p>isSubmitting: {form.formState.isSubmitting.toString()}</p>
// //                 <Button
// //                   type="button"
// //                   onClick={() => console.log("Form values:", form.getValues())}
// //                   className="ml-4 bg-gray-400 text-white rounded-md px-4 py-2"
// //                 >
// //                   Debug Form
// //                 </Button>
// //               </div>
// //             </form>
// //           </motion.div>
// //         </div>
// //       )}
// //     </AnimatePresence>
// //   );
// // };

// // export default CreateScholarshipModal;
