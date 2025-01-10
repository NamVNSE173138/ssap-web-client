

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

const milestoneSchema = z.object({
  reviewMilestones: z
    .array(
      z.object({
        description: z.string().nonempty("Milestone name is required"),
        fromDate: z.string().nonempty("From Date is required"),
        toDate: z.string().nonempty("To Date is required"),
      })
    )
    .min(2, "Please add at least two review milestones")
    .refine(
      (milestones) => {
        const reviewMilestone = milestones[0];
        const interviewMilestone = milestones[1];

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

type MilestoneFormData = z.infer<typeof milestoneSchema>;

const ReviewMilestoneStep = ({
  formData,
  onSave,
  onBack,
}: {
  formData: any;
  onSave: (data: any) => void;
  onBack: (data: any) => void;
}) => {
  const {
    control,
    formState: { errors },
    setValue,
    trigger,
    watch,
    getValues,
  } = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      ...formData,
      reviewMilestones: [
        { description: "Application Review", fromDate: "", toDate: "" },
        { description: "Interview", fromDate: "", toDate: "" },
      ],
    },
  });

  useEffect(() => {
    if (formData && formData.reviewMilestones) {
      formData.reviewMilestones.forEach((milestone: any, index: number) => {
        setValue(
          `reviewMilestones.${index}.description`,
          milestone.description || (index === 0 ? "Application Review" : "Interview")
        );
        setValue(`reviewMilestones.${index}.fromDate`, milestone.fromDate || "");
        setValue(`reviewMilestones.${index}.toDate`, milestone.toDate || "");
      });
    }
  }, [formData, setValue]);

  const handleNext = async () => {
    console.log("Form data before validation: ", getValues());
    const isValid = await trigger();
    if (!isValid) {
      console.error("Validation failed", errors);
      return;
    }
    const data = getValues();
    if (data) {
      console.log("Form data: ", data);
      onSave(data);
    }
  };

  const { fields } = useFieldArray({
    control,
    name: "reviewMilestones",
  });



  return (
    <>
      <div>
        <div>
          <form className="bg-white p-8 rounded-lg shadow-lg max-w-6xl mx-auto space-y-10">
            <h2 className="text-3xl font-bold text-blue-700 mb-8 border-b-2 pb-4">
              Review Milestones
            </h2>

            <div className="col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-2 border rounded-lg p-4 bg-gray-50 relative">
                  {/* Description Input */}
                  <div className="space-y-2">
                    {/* Input with Data */}
                    <p className="text-lg font-bold text-black-500 mb-6">
                      {watch(`reviewMilestones.${index}.description`) || "No description provided."}
                    </p>
                    <Input
                      id={`description-${index}`}
                      value={watch(`reviewMilestones.${index}.description`)}
                      disabled={index < 2}
                      onChange={(e) =>
                        setValue(`reviewMilestones.${index}.description`, e.target.value)
                      }
                      className={`${index < 2 ? "bg-gray-100 cursor-not-allowed hidden" : ""}`}
                    />

                    {/* Display the data below the input */}

                  </div>


                  {/* From Date Input */}
                  <div>
                    <Label htmlFor={`fromDate-${index}`} className="text-sm font-medium">
                      From Date
                    </Label>
                    <Input
                      id={`fromDate-${index}`}
                      type="date"
                      value={watch(`reviewMilestones.${index}.fromDate`)}
                      onChange={(e) =>
                        setValue(`reviewMilestones.${index}.fromDate`, e.target.value)
                      }
                      className="w-full"
                    />
                    {errors?.reviewMilestones?.[index]?.fromDate && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.reviewMilestones[index].fromDate.message}
                      </p>
                    )}
                  </div>

                  {/* To Date Input */}
                  <div>
                    <Label htmlFor={`toDate-${index}`} className="text-sm font-medium">
                      To Date
                    </Label>
                    <Input
                      id={`toDate-${index}`}
                      type="date"
                      value={watch(`reviewMilestones.${index}.toDate`)}
                      onChange={(e) =>
                        setValue(`reviewMilestones.${index}.toDate`, e.target.value)
                      }
                      className="w-full"
                    />
                    {errors?.reviewMilestones?.[index]?.toDate && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.reviewMilestones[index].toDate.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="col-span-6 flex justify-between mt-4">
              <Button
                type="button"
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={onBack}
              >
                Back
              </Button>
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

export default ReviewMilestoneStep;
