import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import QuillEditor from "@/components/Quill/QuillEditor";
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
          fromDate: z.string().nonempty("From date is required."),
          toDate: z.string().nonempty("To date is required."),
          amount: z
            .number({ invalid_type_error: "Amount must be a number." })
            .min(1, "Amount must be greater than 0."),
          note: z.string().optional(),
          awardMilestoneDocuments: z
            .array(
              z.object({
                type: z.string().nonempty("Document type is required."),
              })
            )
            .optional(),
        })
      ),
    })
    .refine(
      (data) =>
        data.awardMilestones.every(
          (milestone) => new Date(milestone.fromDate) < new Date(milestone.toDate)
        ),
      {
        message: "The 'From' date must be earlier than the 'To' date.",
        path: ["toDate"],
      }
    ).refine(
      (data) => data.awardMilestones.every((milestone) =>
        new Date(milestone.fromDate) > new Date(formData.deadline) &&
        new Date(milestone.toDate) > new Date(formData.deadline),
      ),
      {
        message: `The 'From' and 'To' date must be later than the scholarship deadline. which is ${formatDate(
          formData.deadline
        )}`,
        path: ["toDate"],
      }
    ).refine(
      (data) => data.awardMilestones.every((milestone) =>
        !formData.reviewMilestones ||
        formData.reviewMilestones.length === 0 ||
        formData.reviewMilestones.every(
          (review: any) => new Date(review.toDate) < new Date(milestone.fromDate)
        ),
        {
          message: `The 'From' and 'To' date must be later than the all of review milestones. which is ${formData.reviewMilestones.length > 0
            ? formatDate(
              formData.reviewMilestones.sort(
                (a: any, b: any) =>
                  new Date(a.toDate).getTime() - new Date(b.toDate).getTime()
              )[formData.reviewMilestones.length - 1].toDate
            )
            : ""
            }`,
          path: ["toDate"],
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
      <div>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Payment Milestones
          </h2>

          <form className="space-y-8">
            {awardMilestones.map((milestone, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
              >
                <h3 className="text-md font-bold text-green-700 mb-4">
                  Milestone {index + 1}
                </h3>

                {/* Grid layout for fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
                  {/* From Date */}
                  <div className="max-w-sm w-full text-black-2">
                    <Label htmlFor={`fromDate-${index}`}>From Date</Label>
                    <Input
                      id={`fromDate-${index}`}
                      type="date"
                      value={milestone.fromDate || ""}
                      onChange={(e) =>
                        updateAwardMilestone(index, "fromDate", e.target.value)
                      }
                      className="w-full"
                    />
                    {errors.awardMilestones?.[index]?.fromDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.awardMilestones[index].fromDate?.message}
                      </p>
                    )}
                  </div>

                  {/* To Date */}
                  <div className="max-w-sm w-full text-black-2">
                    <Label htmlFor={`toDate-${index}`}>To Date</Label>
                    <Input
                      id={`toDate-${index}`}
                      type="date"
                      value={milestone.toDate || ""}
                      onChange={(e) =>
                        updateAwardMilestone(index, "toDate", e.target.value)
                      }
                      className="w-full"
                    />
                    {errors.awardMilestones?.[index]?.toDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.awardMilestones[index].toDate?.message}
                      </p>
                    )}
                  </div>

                  {/* Required File Types */}
                  <div className="max-w-sm w-full text-black-2">
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
                          className="w-full"
                        />
                      )}
                    />
                  </div>

                  {/* Amount */}
                  <div className="max-w-sm w-full text-black-2">
                    <Label htmlFor={`amount-${index}`}>Amount</Label>
                    <div className="flex">
                      <span className="text-md text-green-500 bg-gray-100 border border-gray-200 px-3 flex items-center rounded-l-md">
                        $
                      </span>
                      <Input
                        id={`amount-${index}`}
                        type="number"
                        placeholder="Enter amount"
                        value={milestone.amount || ""}
                        onChange={(e) =>
                          updateAwardMilestone(
                            index,
                            "amount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full rounded-r-md"
                      />
                    </div>
                    {errors.awardMilestones?.[index]?.amount && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.awardMilestones[index].amount?.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submission Guide */}
                {/* Submission Guide */}
                <div className="sm:col-span-2 mt-6 max-w-230 mx-auto text-black-2">
                  <Label htmlFor={`note-${index}`}>Submission Guide</Label>
                  <Textarea
                    id={`note-${index}`}
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

export default AwardMilestoneStep;
