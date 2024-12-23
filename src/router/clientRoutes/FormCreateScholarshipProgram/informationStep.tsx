import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const InformationStep = () => {
  return (
    <>
      <Card className="">
        <CardContent>
          <div className=" grid grid-cols-6 gap-4 my-5 ">
          <div className="col-span-6">
            <h2 className="text-xl font-semibold">General Information</h2>
          </div>
            <div className="space-y-2 col-start-1 col-end-4">
              <Label htmlFor="scholarshiptype" className="text-md">
                Scholarship Type
                <span className="text-red-700 text-lg"> *</span>
              </Label>
              <Select
              //   name="scholarshiptype"
              //   options={categories}
              //   value={categories.find(
              //     (option) => option.value === selectedCategory
              //   )}
              //   onChange={handleCategoryChange}
              //   isSearchable
              />
              {/* {form.formState.errors.scholarshiptype && (
                      <span className="text-red-500">
                        {form.formState.errors.scholarshiptype.message}
                      </span>
                    )} */}
            </div>

            <div className="space-y-2 col-end-7 col-span-3">
              <Label htmlFor="name" className="text-md">
                Scholarship Name
                <span className="text-red-700 text-lg"> *</span>{" "}
              </Label>
              <Input
              //   {...form.register("name")}
              //   type="text"
              //   id="name"
              //   placeholder="Enter scholarship name (Name must be at most 100 characters)"
              />
              {/* {form.formState.errors.name && (
                      <span className="text-red-500">
                        {form.formState.errors.name.message}
                      </span>
                    )} */}
            </div>

            <div className="space-y-2 col-start-1 col-end-7">
              <Label htmlFor="description" className="text-md">
                Scholarship Description
                <span className="text-red-700 text-lg"> *</span>{" "}
              </Label>
              <Textarea
              //   {...form.register("description")}
              //   id="description"
              //   placeholder="Enter description (Description must be at most 200 characters)"
              //   rows={4}
              />

              {/* {form.formState.errors.description && (
                      <span className="text-red-500">
                        {form.formState.errors.description.message}
                      </span>
                    )} */}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="price" className="text-md">
                Value of Scholarship
                <span className="text-red-700 text-lg"> *</span>{" "}
              </Label>
              <Input
              //   {...form.register("price")}
              //   type="text"
              //   id="price"
              //   placeholder="Enter price"
              />
              {/* {form.formState.errors.price && (
                      <span className="text-red-500">
                        {form.formState.errors.price.message}
                      </span>
                    )} */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-md">
                Quantity of Scholarship
                <span className="text-red-700 text-lg"> *</span>{" "}
              </Label>
              <Input
              //   {...form.register("quantity")}
              //   type="text"
              //   id="quantity"
              //   placeholder="Quantity of Scholarship Program"
              />
              {/* {form.formState.errors.quantity && (
                      <span className="text-red-500">
                        {form.formState.errors.quantity.message}
                      </span>
                    )} */}
            </div>

            <div className="space-y-2 col-start-4 col-end-6">
              <Label htmlFor="imageUrl" className="text-md">
                Upload Image
              </Label>
              <Input
              //   type="file"
              //   id="imageUrl"
              //   onChange={handleFileChange}
              //   accept="image/*"
              //   className="block w-full border p-2 rounded"
              />
              {/* {form.formState.errors.imageUrl && (
                      <span className="text-red-500">
                        {form.formState.errors.imageUrl.message}
                      </span>
                    )} */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-md">
                Application Deadline
                <span className="text-red-700 text-lg"> *</span>{" "}
              </Label>
              <Input
              //   {...form.register("deadline")}
              //   type="date"
              //   id="deadline"
              //   placeholder="Enter deadline"
              />
              {/* {form.formState.errors.deadline && (
                      <span className="text-red-500">
                        {form.formState.errors.deadline.message}
                      </span>
                    )} */}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default InformationStep;
