// ======================RUNNING===========================

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
// import RouteNames from "@/constants/routeNames";
// import { useNavigate } from "react-router-dom";
// import { notification } from "antd";

// interface OptionType {
//   value: string;
//   label: string;
// }

// const formSchema = z.object({
//   scholarshiptype: z
//     .string()
//     .min(1, "Please choose type of scholarship program"),
//   name: z.string().min(1, "Please enter the name"),
//   description: z.string().min(1, "Please enter the description"),
//   price: z.string().refine((price) => !isNaN(parseFloat(price)), {
//     message: "Price is a number",
//   }),
//   quantity: z.string().refine((quantity) => !isNaN(parseInt(quantity)), {
//     message: "Quantity is a number",
//   }),
//   imageUrl: z.string(),
//   deadline: z.string(),
//   status: z.string(),
//   university: z.string().min(1, "Please choose a university"),
//   certificate: z
//     .array(z.string())
//     .min(1, "Please choose at least one certificate"),
//   major: z.string().min(1, "Please choose a major"),
// });

// const FormCreateScholarshipProgram = () => {
//   const [categories, setCategories] = useState<OptionType[]>([]);
//   const [certificates, setCertificates] = useState<OptionType[]>([]);
//   const [universities, setUniversities] = useState<OptionType[]>([]);
//   const [majors, setMajors] = useState<OptionType[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [selectedUniversity, setSelectedUniversity] =
//     useState<OptionType | null>(null);
//   const [selectedCertificates, setSelectedCertificates] = useState<
//     OptionType[]
//   >([]);
//   const [selectedMajor, setSelectedMajor] = useState<OptionType | null>(null);

//   const navigate = useNavigate();
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
//       university: "",
//       certificate: [],
//       major: "",
//     },
//   });

//   const handleCategoryChange = (selectedOption: OptionType | null) => {
//     setSelectedCategory(selectedOption ? selectedOption.value : "");
//     form.clearErrors("scholarshiptype");
//   };

//   const handleUniversityChange = (selectedOption: OptionType | null) => {
//     setSelectedUniversity(selectedOption);
//     form.clearErrors("university");
//   };

//   const handleCertificatesChange = (
//     selectedOptions: MultiValue<OptionType>
//   ) => {
//     setSelectedCertificates(Array.from(selectedOptions) || []);
//     form.clearErrors("certificate");
//   };

//   const handleMajorChange = (selectedOption: OptionType | null) => {
//     setSelectedMajor(selectedOption);
//     form.clearErrors("major");
//   };

//   useEffect(() => {
//     form.setValue("scholarshiptype", selectedCategory);
//   }, [selectedCategory, form]);

//   useEffect(() => {
//     form.setValue(
//       "university",
//       selectedUniversity ? selectedUniversity.value : ""
//     );
//   }, [selectedUniversity, form]);

//   useEffect(() => {
//     form.setValue(
//       "certificate",
//       selectedCertificates.map((certificate) => certificate.value)
//     );
//   }, [selectedCertificates, form]);

//   useEffect(() => {
//     form.setValue("major", selectedMajor ? selectedMajor.value : "");
//   }, [selectedMajor, form]);

//   useEffect(() => {
//     fetchCategories();
//     fetchUniversities();
//     fetchCertificates();
//     fetchMajors();
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

//   const handleAddNewScholarshipProgram = async (
//     values: z.infer<typeof formSchema>
//   ) => {
//     try {
//       if (!funderId) throw new Error("Funder ID not available");

//       const postData = {
//         name: values.name,
//         imageUrl: values.imageUrl,
//         description: values.description,
//         scholarshipAmount: parseFloat(values.price),
//         numberOfScholarships: parseInt(values.quantity),
//         deadline: values.deadline,
//         status: values.status,
//         funderId,
//         categoryId: parseInt(values.scholarshiptype),
//         universityId: parseInt(values.university),
//         certificateIds: values.certificate.map((id) => parseInt(id)), // Map over selected certificate IDs
//         majorId: parseInt(values.major),
//       };

//       const response = await axios.post(
//         `${BASE_URL}/api/scholarship-programs`,
//         postData
//       );
//       console.log("API response:", response.data);

//       form.reset();
//       notification.success({ message: "Create scholarship succesfully!" })
//       setSelectedCertificates([]); // Clear certificates selection
//       setSelectedUniversity(null);
//       setSelectedMajor(null);
//       setSelectedCategory("");
//       navigate(RouteNames.ACTIVITY);
//     } catch (error) {
//       console.error("Error creating scholarship program", error);
//     }
//   };

//   return (
//     <AnimatePresence>
//       <div className="inset-0 bg-opacity-50 items-center grid grid-cols-1 gap-10 p-10 justify-center z-50">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.5 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.5 }}
//           transition={{ duration: 0.2 }}
//           className="bg-white p-6 rounded-lg shadow-lg w-full"
//         >
//           <form
//             onSubmit={form.handleSubmit(handleAddNewScholarshipProgram)}
//             className="flex flex-col gap-4"
//           >
//             <Card>
//               <CardContent className="space-y-2">
//                 {/* Scholarship Type */}
//                 <div className="space-y-1 grid grid-cols-3 items-center">
//                   <Label>Type</Label>
//                   <Select
//                     options={categories}
//                     value={categories.find(
//                       (category) => category.value === selectedCategory
//                     )}
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
//                     placeholder="Name"
//                     {...form.register("name")}
//                     className="col-span-2"
//                   />
//                 </div>
//                 {/* Description */}
//                 <div className="space-y-1 grid grid-cols-3 items-center">
//                   <Label>Description</Label>
//                   <Input
//                     type="text"
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
//                     placeholder="Quantity"
//                     {...form.register("quantity")}
//                     className="col-span-2"
//                   />
//                 </div>
//                 {/* Image URL */}
//                 <div className="space-y-1 grid grid-cols-3 items-center">
//                   <Label>Image URL</Label>
//                   <Input
//                     type="text"
//                     placeholder="Image URL"
//                     {...form.register("imageUrl")}
//                     className="col-span-2"
//                   />
//                 </div>
//                 {/* Deadline */}
//                 <div className="space-y-1 grid grid-cols-3 items-center">
//                   <Label>Deadline</Label>
//                   <Input
//                     type="date"
//                     {...form.register("deadline")}
//                     className="col-span-2"
//                   />
//                 </div>
//                 {/* Status */}
//                 <div className="space-y-1 grid grid-cols-3 items-center hidden">
//                   <Label>Status</Label>
//                   <Input
//                     type="text"
//                     value="ACTIVE"
//                     {...form.register("status")}
//                     className="col-span-2"
//                     disabled
//                   />
//                 </div>
//                 {/* University */}
//                 <div className="space-y-1 grid grid-cols-3 items-center">
//                   <Label>University</Label>
//                   <Select
//                     options={universities}
//                     value={selectedUniversity}
//                     onChange={handleUniversityChange}
//                     className="col-span-2"
//                   />
//                 </div>
//                 {/* Certificate */}
//                 <div className="space-y-1 grid grid-cols-3 items-center">
//                   <Label>Certificate</Label>
//                   <Select
//                     options={certificates}
//                     value={selectedCertificates}
//                     onChange={handleCertificatesChange}
//                     isMulti
//                     className="col-span-2"
//                   />
//                 </div>
//                 {/* Major */}
//                 <div className="space-y-1 grid grid-cols-3 items-center">
//                   <Label>Major</Label>
//                   <Select
//                     options={majors}
//                     value={selectedMajor}
//                     onChange={handleMajorChange}
//                     className="col-span-2"
//                   />
//                 </div>
//               </CardContent>
//             </Card>

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















// =============================TESTING SUCCESSFULLY==============================
// import { Button } from "@/components/ui/button";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import { AnimatePresence, motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { useSelector } from "react-redux";
// import { z } from "zod";
// import { BASE_URL } from "@/constants/api";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Select, { MultiValue } from "react-select";
// import RouteNames from "@/constants/routeNames";
// import { useNavigate } from "react-router-dom";
// import { notification } from "antd";

// interface OptionType {
//   value: string;
//   label: string;
// }

// const formSchema = z.object({
//   scholarshiptype: z.string().min(1, "Please choose type of scholarship program"),
//   name: z.string().min(1, "Please enter the name"),
//   description: z.string().min(1, "Please enter the description"),
//   price: z.string().refine((price) => !isNaN(parseFloat(price)), {
//     message: "Price must be a number",
//   }),
//   quantity: z.string().refine((quantity) => !isNaN(parseInt(quantity)), {
//     message: "Quantity must be a number",
//   }),
//   quantityOfAwardMilestones: z
//     .string()
//     .refine((quantity) => !isNaN(parseInt(quantity)), {
//       message: "Number of award milestones must be a number",
//     }),
//   imageUrl: z.string(),
//   deadline: z.string().min(1, "Please enter a deadline date"),
//   status: z.string(),
//   university: z.string().min(1, "Please choose a university"),
//   certificate: z.array(z.string()).min(1, "Please choose at least one certificate"),
//   major: z.string().min(1, "Please choose a major"),
//   criteria: z.array(
//     z.object({
//       name: z.string().min(1, "Criterion name is required"),
//       description: z.string().min(1, "Criterion description is required"),
//     })
//   ).min(1, "Please add at least one criterion"),
//   reviewMilestones: z.array(
//     z.object({
//       description: z.string().min(1, "Review milestone description is required"),
//       fromDate: z.string(),
//       toDate: z.string(),
//     })
//   ).min(1, "Please add at least one review milestone"),
// });

// const FormCreateScholarshipProgram = () => {
//   const [categories, setCategories] = useState<OptionType[]>([]);
//   const [certificates, setCertificates] = useState<OptionType[]>([]);
//   const [universities, setUniversities] = useState<OptionType[]>([]);
//   const [majors, setMajors] = useState<OptionType[]>([]);

//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [selectedUniversity, setSelectedUniversity] = useState<OptionType | null>(null);
//   const [selectedCertificates, setSelectedCertificates] = useState<OptionType[]>([]);
//   const [selectedMajor, setSelectedMajor] = useState<OptionType | null>(null);

//   const navigate = useNavigate();
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
//       quantityOfAwardMilestones: "",
//       imageUrl: "",
//       deadline: "",
//       status: "ACTIVE",
//       university: "",
//       certificate: [],
//       major: "",
//       criteria: [{ name: "", description: "" }],
//       reviewMilestones: [{ description: "", fromDate: "", toDate: "" }],
//     },
//   });

//   const { fields: criteriaFields, append: appendCriteria } = useFieldArray({
//     name: "criteria",
//     control: form.control,
//   });

//   const { fields: reviewMilestoneFields, append: appendReviewMilestone } = useFieldArray({
//     name: "reviewMilestones",
//     control: form.control,
//   });

//   const handleCategoryChange = (selectedOption: OptionType | null) => {
//     setSelectedCategory(selectedOption ? selectedOption.value : "");
//     form.clearErrors("scholarshiptype");
//   };

//   const handleUniversityChange = (selectedOption: OptionType | null) => {
//     setSelectedUniversity(selectedOption);
//     form.clearErrors("university");
//   };

//   const handleCertificatesChange = (selectedOptions: MultiValue<OptionType>) => {
//     setSelectedCertificates(Array.from(selectedOptions) || []);
//     form.clearErrors("certificate");
//   };

//   const handleMajorChange = (selectedOption: OptionType | null) => {
//     setSelectedMajor(selectedOption);
//     form.clearErrors("major");
//   };

//   useEffect(() => {
//     form.setValue("scholarshiptype", selectedCategory);
//   }, [selectedCategory, form]);

//   useEffect(() => {
//     form.setValue("university", selectedUniversity ? selectedUniversity.value : "");
//   }, [selectedUniversity, form]);

//   useEffect(() => {
//     form.setValue("certificate", selectedCertificates.map((certificate) => certificate.value));
//   }, [selectedCertificates, form]);

//   useEffect(() => {
//     form.setValue("major", selectedMajor ? selectedMajor.value : "");
//   }, [selectedMajor, form]);

//   useEffect(() => {
//     fetchCategories();
//     fetchUniversities();
//     fetchCertificates();
//     fetchMajors();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/categories`);
//       setCategories(response.data.data.map((category: any) => ({ value: category.id.toString(), label: category.name })));
//     } catch (error) {
//       console.error("Error fetching categories", error);
//     }
//   };

//   const fetchUniversities = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/universities`);
//       setUniversities(response.data.data.map((university: any) => ({ value: university.id.toString(), label: university.name })));
//     } catch (error) {
//       console.error("Error fetching universities", error);
//     }
//   };

//   const fetchCertificates = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/certificates`);
//       setCertificates(response.data.data.map((certificate: any) => ({ value: certificate.id.toString(), label: certificate.name })));
//     } catch (error) {
//       console.error("Error fetching certificates", error);
//     }
//   };

//   const fetchMajors = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/majors`);
//       setMajors(response.data.data.map((major: any) => ({ value: major.id.toString(), label: major.name })));
//     } catch (error) {
//       console.error("Error fetching majors", error);
//     }
//   };

//   const handleAddNewScholarshipProgram = async (values: z.infer<typeof formSchema>) => {
//     try {
//       if (!funderId) throw new Error("Funder ID not available");

//       const postData = {
//         ...values,
//         scholarshipAmount: parseFloat(values.price),
//         numberOfScholarships: parseInt(values.quantity),
//         numberOfAwardMilestones: parseInt(values.quantityOfAwardMilestones),
//         funderId,
//         categoryId: parseInt(values.scholarshiptype),
//         universityId: parseInt(values.university),
//         certificateIds: values.certificate.map((id) => parseInt(id)),
//         majorId: parseInt(values.major),
//         criteria: values.criteria,
//         reviewMilestones: values.reviewMilestones.map((milestone) => ({
//           ...milestone,
//           fromDate: new Date(milestone.fromDate).toISOString(),
//           toDate: new Date(milestone.toDate).toISOString(),
//         })),
//       };

//       const response = await axios.post(`${BASE_URL}/api/scholarship-programs`, postData);

//       notification.success({
//         message: "Success",
//         description: "Scholarship program created successfully",
//       });

//       navigate(RouteNames.ACTIVITY);
//     } catch (error) {
//       notification.error({
//         message: "Error",
//         description: "Error creating scholarship program. Please try again.",
//       });
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <form onSubmit={form.handleSubmit(handleAddNewScholarshipProgram)} className="space-y-6">
//       <Card>
//         <CardContent>
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="scholarshiptype">Scholarship Type</Label>
//               <Select
//                 name="scholarshiptype"
//                 options={categories}
//                 value={categories.find((option) => option.value === selectedCategory)}
//                 onChange={handleCategoryChange}
//                 isSearchable
//               />
//               {form.formState.errors.scholarshiptype && (
//                 <span className="text-red-500">{form.formState.errors.scholarshiptype.message}</span>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="name">Scholarship Name</Label>
//               <Input
//                 {...form.register("name")}
//                 type="text"
//                 id="name"
//                 placeholder="Enter scholarship name"
//               />
//               {form.formState.errors.name && (
//                 <span className="text-red-500">{form.formState.errors.name.message}</span>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description">Scholarship Description</Label>
//               <Input
//                 {...form.register("description")}
//                 type="text"
//                 id="description"
//                 placeholder="Enter description"
//               />
//               {form.formState.errors.description && (
//                 <span className="text-red-500">{form.formState.errors.description.message}</span>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="price">Price</Label>
//               <Input
//                 {...form.register("price")}
//                 type="text"
//                 id="price"
//                 placeholder="Enter price"
//               />
//               {form.formState.errors.price && (
//                 <span className="text-red-500">{form.formState.errors.price.message}</span>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="quantity">Quantity</Label>
//               <Input
//                 {...form.register("quantity")}
//                 type="text"
//                 id="quantity"
//                 placeholder="Enter quantity"
//               />
//               {form.formState.errors.quantity && (
//                 <span className="text-red-500">{form.formState.errors.quantity.message}</span>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="quantityOfAwardMilestones">Quantity of Award Milestones</Label>
//               <Input
//                 {...form.register("quantityOfAwardMilestones")}
//                 type="text"
//                 id="quantityOfAwardMilestones"
//                 placeholder="Enter quantity of award milestones"
//               />
//               {form.formState.errors.quantityOfAwardMilestones && (
//                 <span className="text-red-500">{form.formState.errors.quantityOfAwardMilestones.message}</span>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="imageUrl">Image URL</Label>
//               <Input
//                 {...form.register("imageUrl")}
//                 type="text"
//                 id="imageUrl"
//                 placeholder="Enter image URL"
//               />
//               {form.formState.errors.imageUrl && (
//                 <span className="text-red-500">{form.formState.errors.imageUrl.message}</span>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="deadline">Deadline</Label>
//               <Input
//                 {...form.register("deadline")}
//                 type="date"
//                 id="deadline"
//                 placeholder="Enter deadline"
//               />
//               {form.formState.errors.deadline && (
//                 <span className="text-red-500">{form.formState.errors.deadline.message}</span>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="status">Status</Label>
//               <select
//                 {...form.register("status")}
//                 id="status"
//                 className="w-full"
//               >
//                 <option value="ACTIVE">Active</option>
//                 <option value="INACTIVE">Inactive</option>
//               </select>
//               {form.formState.errors.status && (
//                 <span className="text-red-500">{form.formState.errors.status.message}</span>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="university">University</Label>
//               <Select
//                 {...form.register("university")}
//                 options={universities}
//                 onChange={handleUniversityChange}
//                 value={selectedUniversity}
//               />
//               {form.formState.errors.university && (
//                 <span className="text-red-500">{form.formState.errors.university.message}</span>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="certificate">Certificates</Label>
//               <Select
//                 {...form.register("certificate")}
//                 options={certificates}
//                 isMulti
//                 onChange={handleCertificatesChange}
//                 value={selectedCertificates}
//               />
//               {form.formState.errors.certificate && (
//                 <span className="text-red-500">{form.formState.errors.certificate.message}</span>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="major">Major</Label>
//               <Select
//                 {...form.register("major")}
//                 options={majors}
//                 onChange={handleMajorChange}
//                 value={selectedMajor}
//               />
//               {form.formState.errors.major && (
//                 <span className="text-red-500">{form.formState.errors.major.message}</span>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label>Criteria</Label>
//               {criteriaFields.map((field: any, index: any) => (
//                 <div key={field.id} className="space-y-2">
//                   <Input {...form.register(`criteria.${index}.name`)} placeholder="Enter criterion name" />
//                   <Input {...form.register(`criteria.${index}.description`)} placeholder="Enter criterion description" />
//                 </div>
//               ))}
//               <Button type="button" onClick={() => appendCriteria({ name: "", description: "" })}>
//                 Add New Criterion
//               </Button>
//             </div>

//             {/* Review Milestones Fields */}
//             <div className="space-y-2">
//               <Label>Review Milestones</Label>
//               {reviewMilestoneFields.map((field: any, index: any) => (
//                 <div key={field.id} className="space-y-2">
//                   <Input {...form.register(`reviewMilestones.${index}.description`)} placeholder="Enter milestone description" />
//                   <Input {...form.register(`reviewMilestones.${index}.fromDate`)} type="date" placeholder="From Date" />
//                   <Input {...form.register(`reviewMilestones.${index}.toDate`)} type="date" placeholder="To Date" />
//                 </div>
//               ))}
//               <Button type="button" onClick={() => appendReviewMilestone({ description: "", fromDate: "", toDate: "" })}>
//                 Add New Milestone
//               </Button>
//             </div>

//             <div className="flex justify-end">
//               <Button type="submit">Create Program</Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </form>
//   );
// };

// export default FormCreateScholarshipProgram;










// ================TESTING IMAGE UPLOAD===================================

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { BASE_URL } from "@/constants/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select, { MultiValue } from "react-select";
import RouteNames from "@/constants/routeNames";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";

interface OptionType {
  value: string;
  label: string;
}

const formSchema = z.object({
  scholarshiptype: z.string().min(1, "Please choose type of scholarship program"),
  name: z.string().min(1, "Please enter the name"),
  description: z.string().min(1, "Please enter the description"),
  price: z.string().refine((price) => !isNaN(parseFloat(price)), {
    message: "Price must be a number",
  }),
  quantity: z.string().refine((quantity) => !isNaN(parseInt(quantity)), {
    message: "Quantity must be a number",
  }),
  quantityOfAwardMilestones: z
    .string()
    .refine((quantity) => !isNaN(parseInt(quantity)), {
      message: "Number of award milestones must be a number",
    }),
  imageUrl: z.string(),
  deadline: z.string().min(1, "Please enter a deadline date"),
  status: z.string(),
  university: z.string().min(1, "Please choose a university"),
  certificate: z.array(z.string()).min(1, "Please choose at least one certificate"),
  major: z.string().min(1, "Please choose a major"),
  criteria: z.array(
    z.object({
      name: z.string().min(1, "Criterion name is required"),
      description: z.string().min(1, "Criterion description is required"),
    })
  ).min(1, "Please add at least one criterion"),
  reviewMilestones: z.array(
    z.object({
      description: z.string().min(1, "Review milestone description is required"),
      fromDate: z.string(),
      toDate: z.string(),
    })
  ).min(1, "Please add at least one review milestone"),
});

const FormCreateScholarshipProgram = () => {
  const [categories, setCategories] = useState<OptionType[]>([]);
  const [certificates, setCertificates] = useState<OptionType[]>([]);
  const [universities, setUniversities] = useState<OptionType[]>([]);
  const [majors, setMajors] = useState<OptionType[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedUniversity, setSelectedUniversity] = useState<OptionType | null>(null);
  const [selectedCertificates, setSelectedCertificates] = useState<OptionType[]>([]);
  const [selectedMajor, setSelectedMajor] = useState<OptionType | null>(null);

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
      quantityOfAwardMilestones: "",
      imageUrl: "",
      deadline: "",
      status: "ACTIVE",
      university: "",
      certificate: [],
      major: "",
      criteria: [{ name: "", description: "" }],
      reviewMilestones: [{ description: "", fromDate: "", toDate: "" }],
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setImageFile(file);
    }
  };

  // Handle file upload to the API
  const uploadImageAndGetUrl = async (): Promise<string | null> => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await axios.post(
        "https://ssap-backend.azurewebsites.net/api/file-upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data.url; // assuming the response has `url` in the response data
    } catch (error) {
      notification.error({
        message: "Error uploading image",
        description: "Failed to upload image. Please try again.",
      });
      console.error("Upload Error:", error);
      return null;
    }
  };

  const { fields: criteriaFields, append: appendCriteria } = useFieldArray({
    name: "criteria",
    control: form.control,
  });

  const { fields: reviewMilestoneFields, append: appendReviewMilestone } = useFieldArray({
    name: "reviewMilestones",
    control: form.control,
  });

  const handleCategoryChange = (selectedOption: OptionType | null) => {
    setSelectedCategory(selectedOption ? selectedOption.value : "");
    form.clearErrors("scholarshiptype");
  };

  const handleUniversityChange = (selectedOption: OptionType | null) => {
    setSelectedUniversity(selectedOption);
    form.clearErrors("university");
  };

  const handleCertificatesChange = (selectedOptions: MultiValue<OptionType>) => {
    setSelectedCertificates(Array.from(selectedOptions) || []);
    form.clearErrors("certificate");
  };

  const handleMajorChange = (selectedOption: OptionType | null) => {
    setSelectedMajor(selectedOption);
    form.clearErrors("major");
  };

  useEffect(() => {
    form.setValue("scholarshiptype", selectedCategory);
  }, [selectedCategory, form]);

  useEffect(() => {
    form.setValue("university", selectedUniversity ? selectedUniversity.value : "");
  }, [selectedUniversity, form]);

  useEffect(() => {
    form.setValue("certificate", selectedCertificates.map((certificate) => certificate.value));
  }, [selectedCertificates, form]);

  useEffect(() => {
    form.setValue("major", selectedMajor ? selectedMajor.value : "");
  }, [selectedMajor, form]);

  useEffect(() => {
    fetchCategories();
    fetchUniversities();
    fetchCertificates();
    fetchMajors();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/categories`);
      setCategories(response.data.data.map((category: any) => ({ value: category.id.toString(), label: category.name })));
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchUniversities = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/universities`);
      setUniversities(response.data.data.map((university: any) => ({ value: university.id.toString(), label: university.name })));
    } catch (error) {
      console.error("Error fetching universities", error);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/certificates`);
      setCertificates(response.data.data.map((certificate: any) => ({ value: certificate.id.toString(), label: certificate.name })));
    } catch (error) {
      console.error("Error fetching certificates", error);
    }
  };

  const fetchMajors = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/majors`);
      setMajors(response.data.data.map((major: any) => ({ value: major.id.toString(), label: major.name })));
    } catch (error) {
      console.error("Error fetching majors", error);
    }
  };

  const handleAddNewScholarshipProgram = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!funderId) throw new Error("Funder ID not available");

      // Upload image and get URL
      const imageUrl = await uploadImageAndGetUrl();
      if (imageUrl) {
        form.setValue("imageUrl", imageUrl);
      }

      const postData = {
        ...values,
        scholarshipAmount: parseFloat(values.price),
        numberOfScholarships: parseInt(values.quantity),
        numberOfAwardMilestones: parseInt(values.quantityOfAwardMilestones),
        funderId,
        categoryId: parseInt(values.scholarshiptype),
        universityId: parseInt(values.university),
        certificateIds: values.certificate.map((id) => parseInt(id)),
        majorId: parseInt(values.major),
        deadline: new Date(values.deadline).toISOString(),
      };

      const response = await axios.post(`${BASE_URL}/api/scholarship-programs`, postData);
      if (response.status === 200 || 201) {
        notification.success({ message: "Scholarship Program Created", description: "The program was successfully created." });
        navigate(RouteNames.ACTIVITY);
      }
    } catch (error) {
      console.error("Error creating scholarship program", error);
      notification.error({ message: "Error", description: "Failed to create the scholarship program. Please try again." });
    }
  };
  return (
    <form onSubmit={form.handleSubmit(handleAddNewScholarshipProgram)} className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="scholarshiptype">Scholarship Type</Label>
              <Select
                name="scholarshiptype"
                options={categories}
                value={categories.find((option) => option.value === selectedCategory)}
                onChange={handleCategoryChange}
                isSearchable
              />
              {form.formState.errors.scholarshiptype && (
                <span className="text-red-500">{form.formState.errors.scholarshiptype.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Scholarship Name</Label>
              <Input
                {...form.register("name")}
                type="text"
                id="name"
                placeholder="Enter scholarship name"
              />
              {form.formState.errors.name && (
                <span className="text-red-500">{form.formState.errors.name.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Scholarship Description</Label>
              <Input
                {...form.register("description")}
                type="text"
                id="description"
                placeholder="Enter description"
              />
              {form.formState.errors.description && (
                <span className="text-red-500">{form.formState.errors.description.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                {...form.register("price")}
                type="text"
                id="price"
                placeholder="Enter price"
              />
              {form.formState.errors.price && (
                <span className="text-red-500">{form.formState.errors.price.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                {...form.register("quantity")}
                type="text"
                id="quantity"
                placeholder="Enter quantity"
              />
              {form.formState.errors.quantity && (
                <span className="text-red-500">{form.formState.errors.quantity.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantityOfAwardMilestones">Quantity of Award Milestones</Label>
              <Input
                {...form.register("quantityOfAwardMilestones")}
                type="text"
                id="quantityOfAwardMilestones"
                placeholder="Enter quantity of award milestones"
              />
              {form.formState.errors.quantityOfAwardMilestones && (
                <span className="text-red-500">{form.formState.errors.quantityOfAwardMilestones.message}</span>
              )}
            </div>

            <div className="space-y-2">
          <Label htmlFor="imageUrl">Upload Image</Label>
          <Input
            type="file"
            id="imageUrl"
            onChange={handleFileChange}
            accept="image/*"
            className="block w-full border p-2 rounded"
          />
          {form.formState.errors.imageUrl && (
            <span className="text-red-500">{form.formState.errors.imageUrl.message}</span>
          )}
        </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                {...form.register("deadline")}
                type="date"
                id="deadline"
                placeholder="Enter deadline"
              />
              {form.formState.errors.deadline && (
                <span className="text-red-500">{form.formState.errors.deadline.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                {...form.register("status")}
                id="status"
                className="w-full"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              {form.formState.errors.status && (
                <span className="text-red-500">{form.formState.errors.status.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Select
                {...form.register("university")}
                options={universities}
                onChange={handleUniversityChange}
                value={selectedUniversity}
              />
              {form.formState.errors.university && (
                <span className="text-red-500">{form.formState.errors.university.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate">Certificates</Label>
              <Select
                {...form.register("certificate")}
                options={certificates}
                isMulti
                onChange={handleCertificatesChange}
                value={selectedCertificates}
              />
              {form.formState.errors.certificate && (
                <span className="text-red-500">{form.formState.errors.certificate.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="major">Major</Label>
              <Select
                {...form.register("major")}
                options={majors}
                onChange={handleMajorChange}
                value={selectedMajor}
              />
              {form.formState.errors.major && (
                <span className="text-red-500">{form.formState.errors.major.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Criteria</Label>
              {criteriaFields.map((field: any, index: any) => (
                <div key={field.id} className="space-y-2">
                  <Input {...form.register(`criteria.${index}.name`)} placeholder="Enter criterion name" />
                  <Input {...form.register(`criteria.${index}.description`)} placeholder="Enter criterion description" />
                </div>
              ))}
              <Button type="button" onClick={() => appendCriteria({ name: "", description: "" })}>
                Add New Criterion
              </Button>
            </div>

            {/* Review Milestones Fields */}
            <div className="space-y-2">
              <Label>Review Milestones</Label>
              {reviewMilestoneFields.map((field: any, index: any) => (
                <div key={field.id} className="space-y-2">
                  <Input {...form.register(`reviewMilestones.${index}.description`)} placeholder="Enter milestone description" />
                  <Input {...form.register(`reviewMilestones.${index}.fromDate`)} type="date" placeholder="From Date" />
                  <Input {...form.register(`reviewMilestones.${index}.toDate`)} type="date" placeholder="To Date" />
                </div>
              ))}
              <Button type="button" onClick={() => appendReviewMilestone({ description: "", fromDate: "", toDate: "" })}>
                Add New Milestone
              </Button>
            </div>

            <div className="flex justify-end">
            
              <Button type="submit">Create Program</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default FormCreateScholarshipProgram;
