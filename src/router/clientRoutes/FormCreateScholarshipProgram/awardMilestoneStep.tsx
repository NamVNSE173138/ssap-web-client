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
import { format } from "date-fns";

const AwardMilestoneStep = ({
  formData,
  onSave,
  onBack,
}: {
  formData: any;
  onSave: (data: any) => void;
  onBack: (data: any) => void;
}) => {
  const awardFormSchema = z
    .object({
      awardMilestones: z.array(
        z.object({
          fromDate: z.string(),
          toDate: z.string(),
          amount: z.number().optional(),
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
    //Date super refine
    .superRefine((data, ctx) => {
      data.awardMilestones.forEach((milestone, index) => {
        if (!milestone.fromDate) {
          ctx.addIssue({
            code: "custom",
            path: ["awardMilestones", index, "fromDate"],
            message: "From date is required.",
          });
        }
        if (!milestone.toDate) {
          ctx.addIssue({
            code: "custom",
            path: ["awardMilestones", index, "toDate"],
            message: "To date is required.",
          });
        } else if (new Date(milestone.fromDate) >= new Date(milestone.toDate)) {
          ctx.addIssue({
            code: "custom", // Must specify the error type
            path: ["awardMilestones", index, "toDate"], // Correct path structure
            message: "The 'From' date must be earlier than the 'To' date.",
          });
        } else if (
          new Date(milestone.fromDate) < new Date(formData.deadline) &&
          new Date(milestone.toDate) < new Date(formData.deadline)
        ) {
          ctx.addIssue({
            code: "custom", // Must specify the error type
            path: ["awardMilestones", index, "toDate"], // Correct path structure
            message: `The 'From' and 'To' date must be later than the scholarship deadline. which is ${format(
              formData.deadline,
              "dd/MM/yyyy"
            )}`,
          });
        } else if (
          formData.reviewMilestones &&
          formData.reviewMilestones.length > 0 &&
          formData.reviewMilestones.some(
            (review: any) =>
              new Date(review.toDate) >= new Date(milestone.fromDate)
          )
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["awardMilestones", index, "toDate"],
            message: `The 'From' and 'To' date must be later than the all of review milestones. which is ${formData.reviewMilestones.length > 0
              ? formatDate(
                formData.reviewMilestones.sort(
                  (a: any, b: any) =>
                    new Date(a.toDate).getTime() -
                    new Date(b.toDate).getTime()
                )[formData.reviewMilestones.length - 1].toDate
              )
              : ""
              }`,
          });
        } else if (
          data.awardMilestones
            .filter((_milestone, id) => id < index)
            .some(
              (otherMilestone) =>
                new Date(otherMilestone.toDate) > new Date(milestone.fromDate)
            )
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["awardMilestones", index, "toDate"],
            message: `The 'From' and 'To' date must be later than the all of award milestones. which is ${formatDate(
              data.awardMilestones
                .filter((_milestone, id) => id < index)
                .sort(
                  (a: any, b: any) =>
                    new Date(a.toDate).getTime() - new Date(b.toDate).getTime()
                )[
                data.awardMilestones.filter((_milestone, id) => id < index)
                  .length - 1
              ]?.toDate
            )}`,
          });
        }
      });
    })
    //Amount super refine
    .superRefine((data: any, ctx) => {
      data.awardMilestones.forEach((milestone: any, index: any) => {
        const amount = milestone.amount; // Now `amount` is a number

        // Check that amount is a valid number greater than 0
        if (typeof amount !== "number" || amount <= 0) {
          ctx.addIssue({
            code: "custom",
            path: ["awardMilestones", index, "amount"],
            message: "Amount must be a valid number greater than 0.",
          });
        } else if (
          Number(formData.value) -
          data.awardMilestones.reduce(
            (sum: number, award: any) => sum + award.amount,
            0
          ) !=
          0
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["awardMilestones", index, "amount"],
            message: `The sum of all award 'Amount' must be equal to the total amount. which is ${Number(
              formData.value
            )}`,
          });
        }
      });
    });

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
      reset(formData);
    }
  }, [formData, reset]);

  useEffect(() => {
    if (formData && formData.awardProgress) {
      const progressCount = parseInt(formData.awardProgress, 10) || 0;
      const milestones = Array(progressCount)
        .fill(null)
        .map((_, _index) => ({
          fromDate: "",
          toDate: "",
          amount: progressCount == 1 ? Number(formData.value) : 0,
          note: "",
          awardMilestoneDocuments: [],
        }));

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

  const updateAwardMilestones = (values: any[]) => {
    const updatedMilestones = [...awardMilestones];
    for (const value of values) {
      updatedMilestones[value.index] = {
        ...updatedMilestones[value.index],
        [value.field]: value.value,
      };
    }
    setValue("awardMilestones", updatedMilestones, { shouldDirty: true });
  };

  const handleNext = async () => {
    const isValid = await trigger(["awardMilestones"]);
    if (!isValid) {
      console.log("data", getValues());
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
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="border-b pb-6">
            <h2 className="text-3xl font-bold text-blue-700">Award Milestones</h2>
          </div>

          {/* Award Value */}
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">
              Value of Award:{" "}
              <span className="text-green-600">${Number(formData.value).toLocaleString("en-US")}</span>
            </h3>
          </div>

          {/* Form */}
          <form className="space-y-10">
            {awardMilestones.map((milestone, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-blue-700">
                    Milestone {index + 1}
                  </h3>
                </div>

                {/* Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* From Date */}
                  <div className="flex flex-col">
                    <Label htmlFor={`fromDate-${index}`}>From Date</Label>
                    <Input
                      id={`fromDate-${index}`}
                      type="date"
                      value={milestone.fromDate || ""}
                      onChange={(e) => updateAwardMilestone(index, "fromDate", e.target.value)}
                      className="mt-1"
                    />
                    {errors.awardMilestones?.[index]?.fromDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.awardMilestones[index].fromDate?.message}
                      </p>
                    )}
                  </div>

                  {/* To Date */}
                  <div className="flex flex-col">
                    <Label htmlFor={`toDate-${index}`}>To Date</Label>
                    <Input
                      id={`toDate-${index}`}
                      type="date"
                      value={milestone.toDate || ""}
                      onChange={(e) => updateAwardMilestone(index, "toDate", e.target.value)}
                      className="mt-1"
                    />
                    {errors.awardMilestones?.[index]?.toDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.awardMilestones[index].toDate?.message}
                      </p>
                    )}
                  </div>

                  {/* Required File Types */}
                  <div className="flex flex-col">
                    <Label>Required File Types</Label>
                    <Controller
                      control={control}
                      name={`awardMilestones.${index}.awardMilestoneDocuments`}
                      render={({ field }) => (
                        <Select
                          isMulti
                          options={[
                            { value: "Academic Transcript", label: "Academic Transcript" },
                            { value: "Financial Report", label: "Financial Report" },
                          ]}
                          value={field.value?.map((doc) =>
                            [
                              { value: "Academic Transcript", label: "Academic Transcript" },
                              { value: "Financial Report", label: "Financial Report" },
                            ].find((option) => option.value === doc.type)
                          )}
                          onChange={(selected) =>
                            field.onChange(
                              selected.map((item: any) => ({ type: item.value }))
                            )
                          }
                          className="mt-1"
                        />
                      )}
                    />
                  </div>

                  {/* Amount */}
                  <div className="flex flex-col">
                    <Label htmlFor={`amount-${index}`}>Amount</Label>
                    <div className="relative flex">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-green-600">
                        $
                      </span>
                      <Input
                        id={`amount-${index}`}
                        type="number"
                        placeholder="Enter amount"
                        value={
                          index === awardMilestones.length - 1
                            ? Number(formData.value)
                            : Number(milestone.amount)
                        }
                        disabled={index === awardMilestones.length - 1}
                        onChange={(e) => {
                          if (index === awardMilestones.length - 1) return;
                          const remainingAmount =
                            Number(formData.value) -
                            awardMilestones.reduce(
                              (sum, award, id) =>
                                id === awardMilestones.length - 1
                                  ? sum
                                  : sum + (id === index ? parseFloat(e.target.value) : Number(award.amount)),
                              0
                            );
                          updateAwardMilestones([
                            { index, field: "amount", value: parseFloat(e.target.value) || 0 },
                            {
                              index: awardMilestones.length - 1,
                              field: "amount",
                              value: Math.max(0, remainingAmount),
                            },
                          ]);
                        }}
                        className="pl-8"
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
                <div>
                  <Label htmlFor={`note-${index}`}>Submission Guide</Label>
                  <Textarea
                    id={`note-${index}`}
                    value={milestone.note || ""}
                    onChange={(e) => {
                      const updatedMilestones = [...awardMilestones];
                      updatedMilestones[index] = { ...updatedMilestones[index], note: e.target.value };
                      setValue("awardMilestones", updatedMilestones, { shouldDirty: true });
                    }}
                    rows={4}
                    placeholder="Provide guidance for submission"
                    className="mt-1"
                  />
                </div>
              </div>
            ))}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded" onClick={onBack}>
                Back
              </Button>
              <Button type="button" className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleNext}>
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
