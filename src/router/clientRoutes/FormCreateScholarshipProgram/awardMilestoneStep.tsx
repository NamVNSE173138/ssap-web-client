// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";
// import { z } from "zod";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Select from "react-select";
// import QuillEditor from "@/components/Quill/QuillEditor";

// const awardFormSchema = z
//   .object({
//     awardMilestones: z.array(
//       z.object({
//         fromDate: z.string().nonempty("From date is required."),
//         toDate: z.string().nonempty("To date is required."),
//         amount: z
//           .number({ invalid_type_error: "Amount must be a number." })
//           .min(1, "Amount must be greater than 0."),
//         note: z.string().optional(),
//         awardMilestoneDocuments: z
//           .array(
//             z.object({
//               type: z.string().nonempty("Document type is required."),
//             })
//           )
//           .optional(),
//       })
//     ),
//   })
//   .refine(
//     (data) =>
//       data.awardMilestones.every(
//         (milestone) => new Date(milestone.fromDate) < new Date(milestone.toDate)
//       ),
//     {
//       message: "The 'From' date must be earlier than the 'To' date.",
//       path: ["awardMilestones"],
//     }
//   );

// type AwardFormData = z.infer<typeof awardFormSchema>;

// const AwardMilestoneStep = ({
//   formData,
//   onSave,
// }: {
//   formData: any;
//   onSave: (data: any) => void;
// }) => {
//   const [submitLoading, setSubmitLoading] = useState<boolean>(false);

//   const typeOptions = [
//     { value: "Academic Transcript", label: "Academic Transcript" },
//     { value: "Financial Report", label: "Financial Report" },
//   ];

//   const {
//     control,
//     setValue,
//     trigger,
//     watch,
//     formState: { errors },
//     getValues,
//     reset,
//   } = useForm<AwardFormData>({
//     resolver: zodResolver(awardFormSchema),
//     defaultValues: {
//       ...formData,
//       awardMilestones: [
//         {
//           fromDate: "",
//           toDate: "",
//           amount: 0,
//           note: "",
//           awardMilestoneDocuments: [{type: ""}],
//         },
//       ],
//     },
//   });

//   useEffect(() => {
//     if (formData) {
//       reset({
//         ...formData, // Gán dữ liệu mới từ formData
//       });
//     }
//   }, [formData, reset]);

//   const awardMilestones = watch("awardMilestones");

//   const updateAwardMilestone = (index: number, field: string, value: any) => {
//     const updatedMilestones = [...awardMilestones];
//     updatedMilestones[index] = {
//       ...updatedMilestones[index],
//       [field]: value,
//     };
//     // setValue("awardMilestones", updatedMilestones);
//     setValue("awardMilestones", updatedMilestones, { shouldDirty: true });
//   };

//   const handleNext = async () => {
//     const isValid = await trigger();
//     if (!isValid) {
//       console.error("Validation failed", errors);
//       return;
//     }
//     setSubmitLoading(true);
//     const data = getValues();
//     console.log("Form data: ", data);
//     onSave(data);
//     setSubmitLoading(false);
//   };

//   return (
//     <>
//       <Card>
//         <CardContent>
//           <h2 className="text-lg font-semibold mb-4">
//             Scholarship Payment Milestones
//           </h2>

//           <form className="flex flex-col gap-4 max-h-[500px] overflow-y-scroll">
//             {awardMilestones.map((milestone, index) => (
//               <div key={index}>
//                 <div>
//                   <Label>From Date</Label>
//                   <Input
//                     type="date"
//                     placeholder="From Date"
//                     value={milestone.fromDate || ""}
//                     onChange={(e) =>
//                       updateAwardMilestone(index, "fromDate", e.target.value)
//                     }
//                   />
//                   {errors.awardMilestones?.[index]?.fromDate && (
//                     <p className="text-red-500 text-sm">
//                       {errors.awardMilestones[index].fromDate?.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label>To Date</Label>
//                   <Input
//                     type="date"
//                     placeholder="To Date"
//                     value={milestone.toDate || ""}
//                     onChange={(e) =>
//                       updateAwardMilestone(index, "toDate", e.target.value)
//                     }
//                   />
//                   {errors.awardMilestones?.[index]?.toDate && (
//                     <p className="text-red-500 text-sm">
//                       {errors.awardMilestones[index].toDate?.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label>Required File Types</Label>
//                   <Controller
//                     control={control}
//                     name={`awardMilestones.${index}.awardMilestoneDocuments`}
//                     render={({ field }) => (
//                       <Select
//                         isMulti
//                         options={typeOptions}
//                         value={field.value?.map((doc) =>
//                           typeOptions.find((option) => option.value === doc.type)
//                         )}
//                         onChange={(selected) =>
//                           field.onChange(
//                             selected.map((item: any) => ({ type: item.value }))
//                           )
//                         }
//                         className="col-span-2"
//                       />
//                     )}
//                   />
//                 </div>

//                 <div>
//                   <Label>Amount</Label>
//                   <div className="flex items-center">
//                     <span className="text-md text-green-500 bg-gray-100 border border-gray-200 p-2 rounded-sm">
//                       $
//                     </span>
//                     <Input
//                       type="number"
//                       placeholder="Amount"
//                       value={milestone.amount || ""}
//                       onChange={(e) =>
//                         updateAwardMilestone(
//                           index,
//                           "amount",
//                           parseFloat(e.target.value) || 0
//                         )
//                       }
//                       className="ml-2 flex-1"
//                     />
//                   </div>
//                   {errors.awardMilestones?.[index]?.amount && (
//                     <p className="text-red-500 text-sm">
//                       {errors.awardMilestones[index].amount?.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label>Submission Guide</Label>
//                   <QuillEditor
//                     value={milestone.note || ""}
//                     onChange={(value: string) =>
//                       updateAwardMilestone(index, "note", value)
//                     }
//                   />
//                 </div>
//               </div>
//             ))}

//             <Button
//               className="bg-sky-500 hover:bg-sky-600 text-white w-full py-3 rounded-full mt-4"
//               type="button"
//               onClick={() => {
//                 const newMilestone = {
//                   fromDate: "",
//                   toDate: "",
//                   amount: 0,
//                   note: "",
//                   awardMilestoneDocuments: [],
//                 };
//                 setValue("awardMilestones", [
//                   ...awardMilestones,
//                   newMilestone,
//                 ]);
//               }}
//             >
//               Add Award Milestone
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       <div className="flex justify-end mt-4">
//         <Button
//           type="button"
//           className="bg-blue-500 text-white py-2 px-4 rounded"
//           onClick={handleNext}
//           disabled={submitLoading}
//         >
//           {submitLoading ? "Loading..." : "Next"}
//         </Button>
//       </div>
//     </>
//   );
// };

// export default AwardMilestoneStep;

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/date-formatter";

const AwardMilestoneStep = ({
  formData,
  onSave,
}: {
  formData: any;
  onSave: (data: any) => void;
}) => {
  const awardFormSchema = z
    .object({
      awardMilestones: z.array(
        z.object({
          fromDate: z.string().min(1, { message: "From date is required." }),
          toDate: z.string().min(1, { message: "To date is required." }),
          amount: z
            .number({ invalid_type_error: "Amount must be a number." })
            .min(1, "Amount must be greater than 0."),
          note: z.string().optional(),
          awardMilestoneDocuments: z
            .array(
              z.object({
                type: z
                  .string()
                  .min(1, { message: "Document type is required." }),
              })
            )
            .optional(),
        })
      ),
    })
    .refine(
      (data) =>
        data.awardMilestones.every(
          (milestone) =>
            new Date(milestone.fromDate) < new Date(milestone.toDate)
        ),
      {
        message: "The 'From' date must be earlier than the 'To' date.",
        path: ["toDate"],
      }
    )
    .refine(
      (data) =>
        data.awardMilestones.every(
          (milestone) =>
            new Date(milestone.fromDate) > new Date(formData.deadline) &&
            new Date(milestone.toDate) > new Date(formData.deadline)
        ),
      {
        message: `The 'From' and 'To' date must be later than the scholarship deadline. which is ${formatDate(
          formData.deadline
        )}`,
        path: ["toDate"],
      }
    )
    .refine((data) =>
      data.awardMilestones.every(
        (milestone) =>
          !formData.reviewMilestones ||
          formData.reviewMilestones.length === 0 ||
          formData.reviewMilestones.every(
            (review: any) =>
              new Date(review.toDate) < new Date(milestone.fromDate)
          ),
        {
          message: `The 'From' and 'To' date must be later than the all of review milestones. which is ${
            formData.reviewMilestones.length > 0
              ? formatDate(
                  formData.reviewMilestones.sort(
                    (a: any, b: any) =>
                      new Date(a.toDate).getTime() -
                      new Date(b.toDate).getTime()
                  )[formData.reviewMilestones.length - 1].toDate
                )
              : ""
          }`,
          path: ["toDate"],
        }
      )
    )
    .refine((data) =>
      data.awardMilestones.every(
        (milestone) =>
          !formData.awardMilestones ||
          formData.awardMilestones.length === 0 ||
          formData.awardMilestones.every(
            (award: any) =>
              new Date(award.toDate) < new Date(milestone.fromDate)
          ),
        {
          message: `The 'From' and 'To' date must be later than the all of award milestones before. which is ${
            formData.awardMilestones.length > 0
              ? formatDate(
                  formData.awardMilestones.sort(
                    (a: any, b: any) =>
                      new Date(a.toDate).getTime() -
                      new Date(b.toDate).getTime()
                  )[formData.awardMilestones.length - 1].toDate
                )
              : ""
          }`,
          path: ["toDate"],
        }
      )
    )
    .refine((data) =>
      data.awardMilestones.every(
        (milestone) =>
          Number(milestone.amount) <=
          formData.value -
            formData.awardMilestones.reduce(
              (sum: number, award: any) => sum + award.amount,
              0
            ),
        {
          message: `The 'Amount' must be less than or equal to the remaining amount. which is ${
            formData.value -
            formData.awardMilestones.reduce(
              (sum: number, award: any) => sum + award.amount,
              0
            )
          }`,
          path: ["amount"],
        }
      )
    ).refine(
      (data) => data.awardMilestones.every(
        (milestone) =>
        formData.awardMilestones.length == formData.awardProgress - 1 ||
        Number(milestone.amount) <
          formData.value -
            formData.awardMilestones.reduce(
              (sum: number, award: any) => sum + award.amount,
              0
            ),
      {
        message: `The 'Amount' of the not last award milestone must be less than the remaining amount. which is ${
          formData.value -
          formData.awardMilestones.reduce(
            (sum: number, award: any) => sum + award.amount,
            0
          )
        }`,
        path: ["amount"], // This will add the error message to `toDate`
      }
    )
    ).refine(
      (data) => data.awardMilestones.every(
        (milestone) =>
        formData.awardMilestones.length != formData.awardProgress - 1 ||
        Number(milestone.amount) ==
          formData.value -
            formData.awardMilestones.reduce(
              (sum: number, award: any) => sum + award.amount,
              0
            ),
      {
        message: `The 'Amount' of the last award milestone must be equal to the remaining amount. which is ${
          formData.value -
          formData.awardMilestones.reduce(
            (sum: number, award: any) => sum + award.amount,
            0
          )
        }`,
        path: ["amount"], // This will add the error message to `toDate`
      }
    )
    );

  type AwardFormData = z.infer<typeof awardFormSchema>;
  const {
    control,
    setValue,
    trigger,
    watch,
    formState: { errors },
    getValues,
    reset,
  } = useForm<AwardFormData>({
    resolver: zodResolver(awardFormSchema),
    defaultValues: {
      ...formData,
      awardMilestones: [],
    },
  });

  const awardMilestones = watch("awardMilestones");

  useEffect(() => {
    if (formData) {
      reset(formData); // Đặt lại giá trị của form từ formData
    }
  }, [formData, reset]);

  useEffect(() => {
    if (formData && formData.awardProgress) {
      const progressCount = parseInt(formData.awardProgress, 10) || 0;
      const existingMilestones = formData.awardMilestones || [];
      const milestones = Array(progressCount)
        .fill(null)
        .map(
          (_, index) =>
            existingMilestones[index] || {
              fromDate: "",
              toDate: "",
              amount: 0,
              note: "",
              awardMilestoneDocuments: [],
            }
        );

      setValue("awardMilestones", milestones);
    }
  }, [formData, setValue]);

  const updateAwardMilestone = (index: number, field: string, value: any) => {
    const updatedMilestones = [...awardMilestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      [field]: value,
    };
    setValue("awardMilestones", updatedMilestones, { shouldDirty: true });
  };

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

  return (
    <>
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">
            Scholarship Payment Milestones
          </h2>

          <form className="flex flex-col gap-4 max-h-[500px] overflow-y-scroll">
            {awardMilestones.map((milestone, index) => (
              <div key={index}>
                <div>
                  <Label>From Date</Label>
                  <Input
                    type="date"
                    placeholder="From Date"
                    value={milestone.fromDate || ""}
                    onChange={(e) =>
                      updateAwardMilestone(index, "fromDate", e.target.value)
                    }
                  />
                  {errors.awardMilestones?.[index]?.fromDate && (
                    <p className="text-red-500 text-sm">
                      {errors.awardMilestones[index].fromDate?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>To Date</Label>
                  <Input
                    type="date"
                    placeholder="To Date"
                    value={milestone.toDate || ""}
                    onChange={(e) =>
                      updateAwardMilestone(index, "toDate", e.target.value)
                    }
                  />
                  {errors.awardMilestones?.[index]?.toDate && (
                    <p className="text-red-500 text-sm">
                      {errors.awardMilestones[index].toDate?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Required File Types</Label>
                  <Controller
                    control={control}
                    name={`awardMilestones.${index}.awardMilestoneDocuments`}
                    render={({ field }) => (
                      <Select
                        isMulti
                        options={[
                          {
                            value: "Academic Transcript",
                            label: "Academic Transcript",
                          },
                          {
                            value: "Financial Report",
                            label: "Financial Report",
                          },
                        ]}
                        value={field.value?.map((doc) =>
                          [
                            {
                              value: "Academic Transcript",
                              label: "Academic Transcript",
                            },
                            {
                              value: "Financial Report",
                              label: "Financial Report",
                            },
                          ].find((option) => option.value === doc.type)
                        )}
                        onChange={(selected) =>
                          field.onChange(
                            selected.map((item: any) => ({ type: item.value }))
                          )
                        }
                      />
                    )}
                  />
                </div>

                <div>
                  <Label>Amount</Label>
                  <div className="flex items-center">
                    <span className="text-md text-green-500 bg-gray-100 border border-gray-200 p-2 rounded-sm">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={milestone.amount || ""}
                      onChange={(e) =>
                        updateAwardMilestone(
                          index,
                          "amount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="ml-2 flex-1"
                    />
                  </div>
                  {errors.awardMilestones?.[index]?.amount && (
                    <p className="text-red-500 text-sm">
                      {errors.awardMilestones[index].amount?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Submission Guide</Label>
                  {/* <QuillEditor
                    value={milestone.note || ""}
                    onChange={(value: string) =>
                      updateAwardMilestone(index, "note", value)
                    }
                  /> */}
                  <Textarea
                    value={milestone.note || ""}
                    onChange={(e) => {
                      const updatedMilestones = [...awardMilestones];
                      updatedMilestones[index] = {
                        ...updatedMilestones[index],
                        note: e.target.value,
                      };
                      setValue("awardMilestones", updatedMilestones, {
                        shouldDirty: true,
                      });
                    }}
                    rows={4}
                    placeholder="Enter submission guide"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
            ))}
          </form>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-4">
        <Button
          type="button"
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default AwardMilestoneStep;
