

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaInfoCircle } from "react-icons/fa";
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
}: {
  formData: any;
  onSave: (data: any) => void;
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
      <Card>
        <CardContent>
          <form
            className="grid grid-cols-6 gap-4 my-5"
          >
            <div className="space-y-2 col-start-1 col-end-7">
              <Label
                htmlFor="reviewMilestones"
                className="text-md flex items-center gap-2"
              >
                Review Milestones
                <FaInfoCircle
                  className="text-gray-600 cursor-pointer"
                  title="The start day must be after the deadline"
                />
              </Label>

              {fields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <Input
                    // value={field.name}
                    value={watch(`reviewMilestones.${index}.description`)}
                    disabled={index < 2}
                    onChange={(e) =>
                      setValue(`reviewMilestones.${index}.description`, e.target.value)
                    }
                    className={`${
                      index < 2 ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  />
                  <Input
                    type="date"
                    value={watch(`reviewMilestones.${index}.fromDate`)}
                    onChange={(e) =>
                      setValue(
                        `reviewMilestones.${index}.fromDate`,
                        e.target.value
                      )
                    }
                    className="w-full"
                  />
                  {errors?.reviewMilestones?.[index]?.fromDate && (
                    <span className="text-red-500">
                      {errors.reviewMilestones[index].fromDate.message}
                    </span>
                  )}

                  <Input
                    type="date"
                    value={watch(`reviewMilestones.${index}.toDate`)}
                    onChange={(e) =>
                      setValue(
                        `reviewMilestones.${index}.toDate`,
                        e.target.value
                      )
                    }
                    className="w-full"
                  />
                  {errors?.reviewMilestones?.[index]?.toDate && (
                    <span className="text-red-500">
                      {errors.reviewMilestones[index].toDate.message}
                    </span>
                  )}
                </div>
              ))}

              
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="flex justify-end mt-4">
        <Button
          type="button"
          className="bg-blue-500 text-white py-2 px-4 rounded "
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default ReviewMilestoneStep;
