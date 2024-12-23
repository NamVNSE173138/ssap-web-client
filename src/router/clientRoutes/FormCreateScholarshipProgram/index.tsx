// import { Button } from "@/components/ui/button";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
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
// import { uploadFile } from "@/services/ApiServices/fileUploadService";
// import ScreenSpinner from "@/components/ScreenSpinner";
// import { FaInfoCircle, FaTrophy } from "react-icons/fa";
// import { Textarea } from "@/components/ui/textarea";
// import ScholarshipContractDialogForFunder from "../funder/FunderProfile/components/Activity/ScholarshipContractDialogForFunder";

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
//   imageUrl: z.string().optional(),
//   deadline: z.string().min(1, "Please enter a deadline date"),
//   status: z.string(),
//   university: z.string().min(1, "Please choose a university"),
//   certificate: z
//     .array(z.string())
//     .min(1, "Please choose at least one certificate"),
//   major: z.string().min(1, "Please choose a major"),
//   criteria: z
//     .array(
//       z.object({
//         name: z.string().min(1, "Criterion name is required"),
//         description: z.string().min(1, "Criterion description is required"),
//       })
//     )
//     .min(1, "Please add at least one criterion"),
//     reviewMilestones: z
//     .array(
//       z.object({
//         description: z.string().min(1, "Review milestone description is required"),
//         fromDate: z.string().min(1, "From Date is required"),
//         toDate: z.string().min(1, "To Date is required"),
//       })
//     )
//     .min(2, "Please add at least two review milestones") // At least "Review Application" and "Interview"
//     .refine(
//       (milestones) => {
//         const reviewMilestone = milestones[0];
//         const interviewMilestone = milestones[1];
//         console.log(new Date(reviewMilestone.fromDate))
//         console.log(new Date(interviewMilestone.fromDate))

//         // Check if dates are valid
//         if (
//           reviewMilestone &&
//           interviewMilestone &&
//           new Date(interviewMilestone.fromDate) <=
//             new Date(reviewMilestone.toDate)
//         ) {
//           return false;
//         }

//         return true;
//       },
//       {
//         message:
//           "Interview From Date must be after Application Review's To Date",
//       }
//     ),
// });

// const FormCreateScholarshipProgram = () => {
//   const [categories, setCategories] = useState<OptionType[]>([]);
//   const [certificates, setCertificates] = useState<OptionType[]>([]);
//   const [universities, setUniversities] = useState<OptionType[]>([]);
//   const [majors, setMajors] = useState<OptionType[]>([]);
//   const [imageFile, setImageFile] = useState<File[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isContractOpen, setContractOpen] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);

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
//       quantityOfAwardMilestones: "",
//       imageUrl: "",
//       deadline: "",
//       status: "ACTIVE",
//       university: "",
//       certificate: [],
//       major: "",
//       criteria: [{ name: "", description: "" }],
//       reviewMilestones: [
//         { description: "Application Review", fromDate: "", toDate: "" },
//         { description: "Interview", fromDate: "", toDate: "" },
//       ],
//     },
//   });

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files ? event.target.files[0] : null;
//     if (file) {
//       if (!file.type.startsWith("image/")) {
//         notification.error({
//           message: "Invalid File",
//           description: "Please upload an image file.",
//         });
//         return;
//       }
//       setImageFile([file]);
//     }
//   };

//   const {
//     fields: criteriaFields,
//     append: appendCriteria,
//     remove: removeCriteria,
//   } = useFieldArray({
//     name: "criteria",
//     control: form.control,
//   });

//   // const { fields: reviewMilestoneFields, append: appendReviewMilestone } =
//   //   useFieldArray({
//   //     name: "reviewMilestones",
//   //     control: form.control,
//   //   });

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
//     setIsLoading(true);
//     if (!isChecked) {
//       notification.error({
//         message: "Error",
//         description: "You must fill in check box to create.",
//       });
//       setIsLoading(false);
//       return;
//     }
//     try {
//       if (!funderId) throw new Error("Funder ID not available");

//       const imageUrl = await uploadFile(imageFile);
//       if (imageUrl) {
//         values.imageUrl = imageUrl.data.toString();
//       }

//       const postData = {
//         ...values,
//         scholarshipAmount: parseFloat(values.price),
//         description: values.description,
//         numberOfScholarships: parseInt(values.quantity),
//         numberOfAwardMilestones: parseInt(values.quantityOfAwardMilestones),
//         funderId,
//         categoryId: parseInt(values.scholarshiptype),
//         universityId: parseInt(values.university),
//         certificateIds: values.certificate.map((id) => parseInt(id)),
//         majorId: parseInt(values.major),
//         deadline: new Date(values.deadline).toISOString(),
//       };

//       const response = await axios.post(
//         `${BASE_URL}/api/scholarship-programs`,
//         postData
//       );
//       setIsLoading(false);
//       if (response.status === 200 || response.status === 201) {
//         notification.success({
//           message: "Scholarship Program Created",
//           description: "The program was successfully created.",
//         });
//         navigate(RouteNames.FUNDER_PROFILE);
//       }
//     } catch (error) {
//       console.error("Error creating scholarship program", error);
//       setIsLoading(false);
//       notification.error({
//         message: "Error",
//         description:
//           "Failed to create the scholarship program. Please try again.",
//       });
//     }
//   };

//   return (
//     <>
//       <div className="bg-white p-[50px] ">
//         <p className="text-4xl font-semibold text-sky-600 flex items-center gap-2">
//           <FaTrophy className="text-4xl text-sky-500" />
//           Create Scholarship Program
//         </p>
//         <div className="block bg-sky-500 w-[24px] h-[6px] rounded-[8px] mt-[4px] ml-12 mb-5"></div>

//         <form
//           onSubmit={form.handleSubmit(handleAddNewScholarshipProgram)}
//           className="space-y-6 "
//         >
//           <Card className="">
//             <CardContent>
//               <div className=" grid grid-cols-6 gap-4 my-5 ">
//                 <div className="space-y-2 col-start-1 col-end-4">
//                   <Label htmlFor="scholarshiptype" className="text-md">
//                     Scholarship Type
//                   </Label>
//                   <Select
//                     name="scholarshiptype"
//                     options={categories}
//                     value={categories.find(
//                       (option) => option.value === selectedCategory
//                     )}
//                     onChange={handleCategoryChange}
//                     isSearchable
//                   />
//                   {form.formState.errors.scholarshiptype && (
//                     <span className="text-red-500">
//                       {form.formState.errors.scholarshiptype.message}
//                     </span>
//                   )}
//                 </div>

//                 <div className="space-y-2 col-end-7 col-span-3">
//                   <Label htmlFor="name" className="text-md">
//                     Scholarship Name
//                   </Label>
//                   <Input
//                     {...form.register("name")}
//                     type="text"
//                     id="name"
//                     placeholder="Enter scholarship name (Name must be at most 100 characters)"
//                   />
//                   {form.formState.errors.name && (
//                     <span className="text-red-500">
//                       {form.formState.errors.name.message}
//                     </span>
//                   )}
//                 </div>

//                 <div className="space-y-2 col-start-1 col-end-7">
//                   <Label htmlFor="description" className="text-md">
//                     Scholarship Description
//                   </Label>
//                   <Textarea
//                     {...form.register("description")}
//                     id="description"
//                     placeholder="Enter description (Description must be at most 200 characters)"
//                     rows={4}
//                   />
//                   {/* <Input
//                      {...form.register("description")}
//                      type="text"
//                      id="description"
//                      placeholder="Enter description"
//                    /> */}
//                   {form.formState.errors.description && (
//                     <span className="text-red-500">
//                       {form.formState.errors.description.message}
//                     </span>
//                   )}
//                 </div>

//                 <div className="space-y-2 ">
//                   <Label htmlFor="price" className="text-md">
//                     Price
//                   </Label>
//                   <Input
//                     {...form.register("price")}
//                     type="text"
//                     id="price"
//                     placeholder="Enter price"
//                   />
//                   {form.formState.errors.price && (
//                     <span className="text-red-500">
//                       {form.formState.errors.price.message}
//                     </span>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="quantity" className="text-md">
//                     Quantity
//                   </Label>
//                   <Input
//                     {...form.register("quantity")}
//                     type="text"
//                     id="quantity"
//                     placeholder="Quantity of Scholarship Program"
//                   />
//                   {form.formState.errors.quantity && (
//                     <span className="text-red-500">
//                       {form.formState.errors.quantity.message}
//                     </span>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="quantityOfAwardMilestones"
//                     className="text-md"
//                   >
//                     Quantity of Award Milestones
//                   </Label>
//                   <Input
//                     {...form.register("quantityOfAwardMilestones")}
//                     type="text"
//                     id="quantityOfAwardMilestones"
//                     placeholder="Enter quantity of award milestones"
//                   />
//                   {form.formState.errors.quantityOfAwardMilestones && (
//                     <span className="text-red-500">
//                       {form.formState.errors.quantityOfAwardMilestones.message}
//                     </span>
//                   )}
//                 </div>

//                 <div className="space-y-2 col-start-4 col-end-6">
//                   <Label htmlFor="imageUrl" className="text-md">
//                     Upload Image
//                     <span className="text-red-500 text-sm"> (* Optional)</span>
//                   </Label>
//                   <Input
//                     type="file"
//                     id="imageUrl"
//                     onChange={handleFileChange}
//                     accept="image/*"
//                     className="block w-full border p-2 rounded"
//                   />
//                   {form.formState.errors.imageUrl && (
//                     <span className="text-red-500">
//                       {form.formState.errors.imageUrl.message}
//                     </span>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="deadline" className="text-md">
//                     Deadline
//                   </Label>
//                   <Input
//                     {...form.register("deadline")}
//                     type="date"
//                     id="deadline"
//                     placeholder="Enter deadline"
//                   />
//                   {form.formState.errors.deadline && (
//                     <span className="text-red-500">
//                       {form.formState.errors.deadline.message}
//                     </span>
//                   )}
//                 </div>

//                 <div className="space-y-2 col-span-2 col-end-3">
//                   <Label htmlFor="university" className="text-md">
//                     University
//                   </Label>
//                   <Select
//                     {...form.register("university")}
//                     options={universities}
//                     onChange={handleUniversityChange}
//                     value={selectedUniversity}
//                   />
//                   {form.formState.errors.university && (
//                     <span className="text-red-500">
//                       {form.formState.errors.university.message}
//                     </span>
//                   )}
//                 </div>

//                 <div className="space-y-2 col-span-2 col-end-5">
//                   <Label htmlFor="certificate" className="text-md">
//                     Certificates
//                   </Label>
//                   <Select
//                     {...form.register("certificate")}
//                     options={certificates}
//                     isMulti
//                     onChange={handleCertificatesChange}
//                     value={selectedCertificates}
//                   />
//                   {form.formState.errors.certificate && (
//                     <span className="text-red-500">
//                       {form.formState.errors.certificate.message}
//                     </span>
//                   )}
//                 </div>

//                 <div className="space-y-2 col-span-2 col-end-7">
//                   <Label htmlFor="major" className="text-md">
//                     Major
//                   </Label>
//                   <Select
//                     {...form.register("major")}
//                     options={majors}
//                     onChange={handleMajorChange}
//                     value={selectedMajor}
//                   />
//                   {form.formState.errors.major && (
//                     <span className="text-red-500">
//                       {form.formState.errors.major.message}
//                     </span>
//                   )}
//                 </div>

//                 {/* <div className="space-y-2 col-start-1 col-end-7">
//                   <Label htmlFor="criteria" className="text-md">
//                     Criteria

//                   </Label>
//                   {criteriaFields.map((field: any, index: any) => (
//                     <div key={field.id} className="space-y-2">
//                       <Input
//                         {...form.register(`criteria.${index}.name`)}
//                         placeholder="Ex: Academic Excellence"
//                       />
//                       {form.formState.errors.criteria?.[index]?.name && (
//                         <span className="text-red-500">
//                           {form.formState.errors.criteria[index].name?.message}
//                         </span>
//                       )}
//                       <Input
//                         {...form.register(`criteria.${index}.description`)}
//                         placeholder="Ex: Requires a minimum GPA of 3.5 or equivalent, recognizing outstanding academic performance through grades, test scores, or awards."
//                       />
//                       {form.formState.errors.criteria?.[index]?.description && (
//                         <span className="text-red-500">
//                           {
//                             form.formState.errors.criteria[index].description
//                               ?.message
//                           }
//                         </span>
//                       )}
//                     </div>
//                   ))}
//                   <Button
//                     type="button"
//                     onClick={() =>
//                       appendCriteria({ name: "", description: "" })
//                     }
//                   >
//                     Add New Criteria
//                   </Button>
//                 </div> */}

//                 <div className="space-y-2 col-start-1 col-end-7">
//                   <Label htmlFor="criteria" className="text-md">
//                     Criteria
//                   </Label>
//                   {criteriaFields.map((field: any, index: any) => (
//                     <div
//                       key={field.id}
//                       className="space-y-2 relative border p-4 rounded-md"
//                     >
//                       {criteriaFields.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeCriteria(index)}
//                           className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//                         >
//                           ✕
//                         </button>
//                       )}
//                       <Input
//                         {...form.register(`criteria.${index}.name`)}
//                         placeholder="Ex: Academic Excellence"
//                       />
//                       {form.formState.errors.criteria?.[index]?.name && (
//                         <span className="text-red-500">
//                           {form.formState.errors.criteria[index].name?.message}
//                         </span>
//                       )}
//                       <Input
//                         {...form.register(`criteria.${index}.description`)}
//                         placeholder="Ex: Requires a minimum GPA of 3.5 or equivalent, recognizing outstanding academic performance through grades, test scores, or awards."
//                       />
//                       {form.formState.errors.criteria?.[index]?.description && (
//                         <span className="text-red-500">
//                           {
//                             form.formState.errors.criteria[index].description
//                               ?.message
//                           }
//                         </span>
//                       )}
//                     </div>
//                   ))}
//                   <Button
//                     type="button"
//                     onClick={() =>
//                       appendCriteria({ name: "", description: "" })
//                     }
//                   >
//                     Add New Criteria
//                   </Button>
//                 </div>

//                 <div className="space-y-2 col-start-1 col-end-7">
//                   <Label
//                     htmlFor="reviewMilestone"
//                     className="text-md flex items-center gap-2"
//                   >
//                     Review Milestones
//                     <FaInfoCircle
//                       className="text-gray-600 cursor-pointer"
//                       title="The start day must be after the deadline"
//                     />
//                   </Label>

//                   {/* Milestone 1: Review Application */}
//                   <div className="space-y-2">
//                     <Input
//                       value="Application Review"
//                       disabled
//                       className="bg-gray-100 cursor-not-allowed"
//                     />
//                     <Input
//                       {...form.register("reviewMilestones.0.fromDate", {
//                         required: "From Date is required",
//                       })}
//                       type="date"
//                       placeholder="From Date"
//                     />
//                     {form.formState.errors.reviewMilestones?.[0]?.fromDate && (
//                       <span className="text-red-500">
//                         {
//                           form.formState.errors.reviewMilestones[0].fromDate
//                             .message
//                         }
//                       </span>
//                     )}

//                     <Input
//                       {...form.register("reviewMilestones.0.toDate", {
//                         required: "To Date is required",
//                       })}
//                       type="date"
//                       placeholder="To Date"
//                     />
//                     {form.formState.errors.reviewMilestones?.[0]?.toDate && (
//                       <span className="text-red-500">
//                         {
//                           form.formState.errors.reviewMilestones[0].toDate
//                             .message
//                         }
//                       </span>
//                     )}
//                   </div>

//                   {/* Milestone 2: Interview */}
//                   <div className="space-y-2">
//                     <Input
//                       value="Interview"
//                       disabled
//                       className="bg-gray-100 cursor-not-allowed"
//                     />
//                     <Input
//                       {...form.register("reviewMilestones.1.fromDate", {
//                         required: "From Date is required",
//                         validate: (value) => {
//                           const reviewToDate = form.getValues(
//                             "reviewMilestones.0.toDate"
//                           );
//                           if (new Date(value) <= new Date(reviewToDate)) {
//                             return "From Date must be after Application Review's To Date";
//                           }
//                           return true;
//                         },
//                       })}
//                       type="date"
//                       placeholder="From Date"
//                     />
//                     {form.formState.errors.reviewMilestones?.root?.message && (
//                       <span className="text-red-500">
//                         {
//                           form.formState.errors.reviewMilestones?.root?.message                        }
//                       </span>
//                     )}
//                     <Input
//                       {...form.register("reviewMilestones.1.toDate", {
//                         required: "To Date is required",
//                         validate: (value) => {
//                           const interviewFromDate = form.getValues(
//                             "reviewMilestones.1.fromDate"
//                           );
//                           if (new Date(value) <= new Date(interviewFromDate)) {
//                             return "To Date must be after Interview's From Date";
//                           }
//                           return true;
//                         },
//                       })}
//                       type="date"
//                       placeholder="To Date"
//                     />
//                     {form.formState.errors.reviewMilestones?.[1]?.toDate && (
//                       <span className="text-red-500">
//                         {
//                           form.formState.errors.reviewMilestones[1].toDate
//                             .message
//                         }
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <div className="flex flex-col items-start">
//             <span className="text-black">
//               <input
//                 type="checkbox"
//                 id="agreement"
//                 checked={isChecked}
//                 onChange={() => setIsChecked(!isChecked)}
//                 className="mr-2"
//               />
//               I agree to SSAP{" "}
//               <a
//                 href="#"
//                 className="mx-[4px] underline hover:no-underline"
//                 onClick={() => setContractOpen(true)}
//               >
//                 Terms and Privacy
//               </a>{" "}
//               and proceed to read the scholarship contract.
//             </span>
//           </div>

//           <div className="flex justify-end">
//             <Button type="submit">Create Program</Button>
//           </div>
//         </form>
//         {isLoading && <ScreenSpinner />}
//         <ScholarshipContractDialogForFunder
//           isOpen={isContractOpen}
//           onClose={() => setContractOpen(false)}
//         />
//       </div>
//     </>
//   );
// };

// export default FormCreateScholarshipProgram;







import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
import { uploadFile } from "@/services/ApiServices/fileUploadService";
import ScreenSpinner from "@/components/ScreenSpinner";
import { FaInfoCircle, FaTrophy } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import ScholarshipContractDialogForFunder from "../funder/FunderProfile/components/Activity/ScholarshipContractDialogForFunder";
import InformationStep from "./informationStep";
import UcmStep from "./ucmStep";
import DocumentStep from "./documentStep";
import ReviewMilestoneStep from "./reviewMilestoneStep";
import AwardMilestoneStep from "./awardMilestoneStep";

interface OptionType {
  value: string;
  label: string;
}

const formSchema = z.object({
  scholarshiptype: z
    .string()
    .min(1, "Please choose type of scholarship program"),
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
  imageUrl: z.string().optional(),
  deadline: z.string().min(1, "Please enter a deadline date"),
  status: z.string(),
  university: z.string().min(1, "Please choose a university"),
  certificate: z
    .array(z.string())
    .min(1, "Please choose at least one certificate"),
  major: z.string().min(1, "Please choose a major"),
  criteria: z
    .array(
      z.object({
        name: z.string().min(1, "Criterion name is required"),
        description: z.string().min(1, "Criterion description is required"),
      })
    )
    .min(1, "Please add at least one criterion"),
  reviewMilestones: z
    .array(
      z.object({
        description: z
          .string()
          .min(1, "Review milestone description is required"),
        fromDate: z.string().min(1, "From Date is required"),
        toDate: z.string().min(1, "To Date is required"),
      })
    )
    .min(2, "Please add at least two review milestones") // At least "Review Application" and "Interview"
    .refine(
      (milestones) => {
        const reviewMilestone = milestones[0];
        const interviewMilestone = milestones[1];
        console.log(new Date(reviewMilestone.fromDate));
        console.log(new Date(interviewMilestone.fromDate));

        // Check if dates are valid
        if (
          reviewMilestone &&
          interviewMilestone &&
          new Date(interviewMilestone.fromDate) <=
            new Date(reviewMilestone.toDate)
        ) {
          return false;
        }

        return true;
      },
      {
        message:
          "Interview From Date must be after Application Review's To Date",
      }
    ),
});

const FormCreateScholarshipProgram = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [categories, setCategories] = useState<OptionType[]>([]);
  const [certificates, setCertificates] = useState<OptionType[]>([]);
  const [universities, setUniversities] = useState<OptionType[]>([]);
  const [majors, setMajors] = useState<OptionType[]>([]);
  const [imageFile, setImageFile] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isContractOpen, setContractOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedUniversity, setSelectedUniversity] =
    useState<OptionType | null>(null);
  const [selectedCertificates, setSelectedCertificates] = useState<
    OptionType[]
  >([]);
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
      reviewMilestones: [
        { description: "Application Review", fromDate: "", toDate: "" },
        { description: "Interview", fromDate: "", toDate: "" },
      ],
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      if (!file.type.startsWith("image/")) {
        notification.error({
          message: "Invalid File",
          description: "Please upload an image file.",
        });
        return;
      }
      setImageFile([file]);
    }
  };

  // const {
  //   fields: criteriaFields,
  //   append: appendCriteria,
  //   remove: removeCriteria,
  // } = useFieldArray({
  //   name: "criteria",
  //   control: form.control,
  // });

  // const { fields: reviewMilestoneFields, append: appendReviewMilestone } =
  //   useFieldArray({
  //     name: "reviewMilestones",
  //     control: form.control,
  //   });

  const handleCategoryChange = (selectedOption: OptionType | null) => {
    setSelectedCategory(selectedOption ? selectedOption.value : "");
    form.clearErrors("scholarshiptype");
  };

  const handleUniversityChange = (selectedOption: OptionType | null) => {
    setSelectedUniversity(selectedOption);
    form.clearErrors("university");
  };

  const handleCertificatesChange = (
    selectedOptions: MultiValue<OptionType>
  ) => {
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
    form.setValue(
      "university",
      selectedUniversity ? selectedUniversity.value : ""
    );
  }, [selectedUniversity, form]);

  useEffect(() => {
    form.setValue(
      "certificate",
      selectedCertificates.map((certificate) => certificate.value)
    );
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

  const handleAddNewScholarshipProgram = async (
    values: z.infer<typeof formSchema>
  ) => {
    setIsLoading(true);
    if (!isChecked) {
      notification.error({
        message: "Error",
        description: "You must fill in check box to create.",
      });
      setIsLoading(false);
      return;
    }
    try {
      if (!funderId) throw new Error("Funder ID not available");

      const imageUrl = await uploadFile(imageFile);
      if (imageUrl) {
        values.imageUrl = imageUrl.data.toString();
      }

      const postData = {
        ...values,
        scholarshipAmount: parseFloat(values.price),
        description: values.description,
        numberOfScholarships: parseInt(values.quantity),
        numberOfAwardMilestones: parseInt(values.quantityOfAwardMilestones),
        funderId,
        categoryId: parseInt(values.scholarshiptype),
        universityId: parseInt(values.university),
        certificateIds: values.certificate.map((id) => parseInt(id)),
        majorId: parseInt(values.major),
        deadline: new Date(values.deadline).toISOString(),
      };

      const response = await axios.post(
        `${BASE_URL}/api/scholarship-programs`,
        postData
      );
      setIsLoading(false);
      if (response.status === 200 || response.status === 201) {
        notification.success({
          message: "Scholarship Program Created",
          description: "The program was successfully created.",
        });
        navigate(RouteNames.FUNDER_PROFILE);
      }
    } catch (error) {
      console.error("Error creating scholarship program", error);
      setIsLoading(false);
      notification.error({
        message: "Error",
        description:
          "Failed to create the scholarship program. Please try again.",
      });
    }
  };

  return (
    <>
      <div className="bg-white p-[50px] ">
        <p className="text-4xl font-semibold text-sky-600 flex items-center gap-2">
          <FaTrophy className="text-4xl text-sky-500" />
          Create Scholarship Program
        </p>
        <div className="block bg-sky-500 w-[24px] h-[6px] rounded-[8px] mt-[4px] ml-12 mb-5"></div>

        <form
          onSubmit={form.handleSubmit(handleAddNewScholarshipProgram)}
          className="space-y-6 "
        >
          <div className="flex items-center justify-center mb-6">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${
                step === 1 ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              1
            </div>
            <div className="h-1 w-20 bg-gray-300 mx-2"></div>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${
                step === 2 ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              2
            </div>
            <div className="h-1 w-20 bg-gray-300 mx-2"></div>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${
                step === 3 ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              3
            </div>
            <div className="h-1 w-20 bg-gray-300 mx-2"></div>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${
                step === 4 ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              4
            </div>
            <div className="h-1 w-20 bg-gray-300 mx-2"></div>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${
                step === 5 ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              5
            </div>
          </div>
          {step === 1 && (
            <>
            <InformationStep/>
            <div className="flex justify-end mt-4">
              <Button
                // variant="contained"
                style={{
                  backgroundColor: "#0ea5e9",
                  color: "white",
                }}
                onClick={() => setStep(2)}
                // disabled={!selectedApplications.length}
              >
                Next
              </Button>
            </div>
            </>
          )}

          {step === 2 && (
            <>
            <UcmStep/>
            <div className="flex justify-between mt-4">
              <Button  
              //  variant="outlined"
               onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                // variant="contained"
                style={{
                  backgroundColor: "#0ea5e9",
                  color: "white",
                }}
                onClick={() => setStep(3)}
                // disabled={!selectedApplications.length}
              >
                Next
              </Button>
            </div>
            </>
            
            )}

          {step === 3 && (
            <>
            <DocumentStep/>
            <div className="flex justify-between mt-4">
              <Button  
              //  variant="outlined"
               onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                // variant="contained"
                style={{
                  backgroundColor: "#0ea5e9",
                  color: "white",
                }}
                onClick={() => setStep(4)}
                // disabled={!selectedApplications.length}
              >
                Next
              </Button>
            </div>
            </>
            )}

          {step === 4 && (
            <>
            <ReviewMilestoneStep/>
            <div className="flex justify-between mt-4">
              <Button  
              //  variant="outlined"
               onClick={() => setStep(3)}>
                Back
              </Button>
              <Button
                // variant="contained"
                style={{
                  backgroundColor: "#0ea5e9",
                  color: "white",
                }}
                onClick={() => setStep(5)}
                // disabled={!selectedApplications.length}
              >
                Next
              </Button>
            </div>
            </>
            )}

          {step === 5 && (
            <>
            <AwardMilestoneStep/>
            <div className="flex justify-between mt-4">
              <Button  
              //  variant="outlined"
               onClick={() => setStep(4)}>
                Back
              </Button>
              
            </div>
            <div className="flex flex-col items-start">
            <span className="text-black">
              <input
                type="checkbox"
                id="agreement"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="mr-2"
              />
              I agree to SSAP{" "}
              <a
                href="#"
                className="mx-[4px] underline hover:no-underline"
                onClick={() => setContractOpen(true)}
              >
                Terms and Privacy
              </a>{" "}
              and proceed to read the scholarship contract.
            </span>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Create Program</Button>
          </div>
            </>
            )}

          
        </form>
        {isLoading && <ScreenSpinner />}
        <ScholarshipContractDialogForFunder
          isOpen={isContractOpen}
          onClose={() => setContractOpen(false)}
        />
      </div>
    </>
  );
};

export default FormCreateScholarshipProgram;
