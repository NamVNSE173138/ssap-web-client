import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FaInfoCircle } from "react-icons/fa";
const ReviewMilestoneStep = () => {
  return (
    <Card className="">
              <CardContent>
                <div className=" grid grid-cols-6 gap-4 my-5 ">
                  

                  <div className="space-y-2 col-start-1 col-end-7">
                    <Label
                      htmlFor="reviewMilestone"
                      className="text-md flex items-center gap-2"
                    >
                      Review Milestones
                      <FaInfoCircle
                        className="text-gray-600 cursor-pointer"
                        title="The start day must be after the deadline"
                      />
                    </Label>

                    {/* Milestone 1: Review Application */}
                    <div className="space-y-2">
                      <Input
                        value="Application Review"
                        disabled
                        className="bg-gray-100 cursor-not-allowed"
                      />
                      <Input
                        // {...form.register("reviewMilestones.0.fromDate", {
                        //   required: "From Date is required",
                        // })}
                        // type="date"
                        // placeholder="From Date"
                      />
                      {/* {form.formState.errors.reviewMilestones?.[0]
                        ?.fromDate && (
                        <span className="text-red-500">
                          {
                            form.formState.errors.reviewMilestones[0].fromDate
                              .message
                          }
                        </span>
                      )} */}

                      <Input
                        // {...form.register("reviewMilestones.0.toDate", {
                        //   required: "To Date is required",
                        // })}
                        // type="date"
                        // placeholder="To Date"
                      />
                      {/* {form.formState.errors.reviewMilestones?.[0]?.toDate && (
                        <span className="text-red-500">
                          {
                            form.formState.errors.reviewMilestones[0].toDate
                              .message
                          }
                        </span>
                      )} */}
                    </div>

                    {/* Milestone 2: Interview */}
                    <div className="space-y-2">
                      <Input
                        value="Interview"
                        disabled
                        className="bg-gray-100 cursor-not-allowed"
                      />
                      <Input
                        // {...form.register("reviewMilestones.1.fromDate", {
                        //   required: "From Date is required",
                        //   validate: (value) => {
                        //     const reviewToDate = form.getValues(
                        //       "reviewMilestones.0.toDate"
                        //     );
                        //     if (new Date(value) <= new Date(reviewToDate)) {
                        //       return "From Date must be after Application Review's To Date";
                        //     }
                        //     return true;
                        //   },
                        // })}
                        // type="date"
                        // placeholder="From Date"
                      />
                      {/* {form.formState.errors.reviewMilestones?.root
                        ?.message && (
                        <span className="text-red-500">
                          {
                            form.formState.errors.reviewMilestones?.root
                              ?.message
                          }
                        </span>
                      )} */}
                      <Input
                        // {...form.register("reviewMilestones.1.toDate", {
                        //   required: "To Date is required",
                        //   validate: (value) => {
                        //     const interviewFromDate = form.getValues(
                        //       "reviewMilestones.1.fromDate"
                        //     );
                        //     if (
                        //       new Date(value) <= new Date(interviewFromDate)
                        //     ) {
                        //       return "To Date must be after Interview's From Date";
                        //     }
                        //     return true;
                        //   },
                        // })}
                        // type="date"
                        // placeholder="To Date"
                      />
                      {/* {form.formState.errors.reviewMilestones?.[1]?.toDate && (
                        <span className="text-red-500">
                          {
                            form.formState.errors.reviewMilestones[1].toDate
                              .message
                          }
                        </span>
                      )} */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
  )
}

export default ReviewMilestoneStep