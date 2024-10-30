import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { BASE_URL } from "@/constants/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateScholarshipModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

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
//     .min(1, "Vui lòng nhập ít nhất một trường đại học"),
//   majors: z.array(z.string()).min(1, "Vui lòng nhập ít nhất một ngành học"),
//   certificates: z
//     .array(z.string())
//     .min(1, "Vui lòng nhập ít nhất một chứng chỉ"),
//   skills: z.array(z.string()).min(1, "Vui lòng nhập ít nhất một kỹ năng"),
// });
const formSchema = z.object({
  scholarshiptype: z.string().min(1, "Vui lòng chọn loại dịch vụ"),
  name: z.string().min(1, "Vui lòng nhập tên chương trình"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  price: z.string().refine((price) => !isNaN(parseFloat(price)), {
    message: "Giá phải là số",
  }),
  quantity: z.string().refine((quantity) => !isNaN(parseInt(quantity)), {
    message: "Số lượng phải là số",
  }),
  imageUrl: z.string(),
  deadline: z.string(),
  status: z.string(),
  universities: z.string().min(1, "Vui lòng nhập ít nhất một trường đại học"),
  majors: z.string().min(1, "Vui lòng nhập ít nhất một ngành học"),
  certificates: z.string().min(1, "Vui lòng nhập ít nhất một chứng chỉ"),
  skills: z.string().min(1, "Vui lòng nhập ít nhất một kỹ năng"),
});

const CreateScholarshipModal = ({
  isOpen,
  setIsOpen,
}: CreateScholarshipModalProps) => {
  const [categories, setCategories] = useState([]);
  const funder = useSelector((state: any) => state.token.user);
  const funderId = funder?.id;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleAddNewScholarshipProgram = async (
    values: z.infer<typeof formSchema>
  ) => {
    console.log("Selected scholarship type:", form.getValues("scholarshiptype"));

    try {
      if (!funderId) {
        throw new Error("Funder ID not available");
      }

      const postData = {
        name: values.name,
        imageUrl: "string",
        description: values.description,
        scholarshipAmount: values.price,
        numberOfScholarships: values.quantity,
        funderId,
        categories: [parseInt(values.scholarshiptype)],
        universities: values.universities,
        majors: values.majors,
        certificates: values.certificates,
        skills: values.skills,
      };

      console.log("Posting data to API:", postData);
      const response = await axios.post(
        `${BASE_URL}/api/scholarship-programs`,
        postData
      );
      console.log("API response:", response.data);
      setIsOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response?.data);
      } else {
        console.error("Error creating scholarship program", error);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      axios
        .get(`${BASE_URL}/api/categories`)
        .then((response) => {
          setCategories(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching categories", error);
        });
    }
  }, [isOpen]);


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-lg w-1/2"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-2xl mb-10">Add new Scholarship Program</h3>
              <button onClick={() => setIsOpen(false)} className="text-xl">
                &times;
              </button>
            </div>
            <form
              onSubmit={form.handleSubmit(handleAddNewScholarshipProgram)}
              className="flex flex-col gap-4"
            >
              <Tabs defaultValue="information">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="information">Information</TabsTrigger>
                  <TabsTrigger value="majors">Majors</TabsTrigger>
                  <TabsTrigger value="certificates">Certificates</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>
                <TabsContent value="information">
                  <Card>
                    <CardContent className="space-y-2">
                      <div className="space-y-1 grid grid-cols-2 items-center w-full">
                        <Label htmlFor="scholarshiptype">Type</Label>
                        <Select {...form.register("scholarshiptype")}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {categories.map((category: any) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      {form.formState.errors.scholarshiptype && (
                        <span className="text-red-500 text-sm">
                          {form.formState.errors.scholarshiptype.message}
                        </span>
                      )}
                      <div className="space-y-1 grid grid-cols-2 items-center">
                        <Label>Name</Label>
                        <Input
                          type="text"
                          id="name"
                          placeholder="Name of Scholarship Program"
                          {...form.register("name")}
                        />
                      </div>
                      {form.formState.errors.name && (
                        <span className="text-red-500 text-sm">
                          {form.formState.errors.name.message}
                        </span>
                      )}
                      <div className="space-y-1 grid grid-cols-2 items-center">
                        <Label>Description</Label>
                        <Input
                          type="text"
                          id="description"
                          placeholder="Description"
                          {...form.register("description")}
                        />
                      </div>
                      {form.formState.errors.description && (
                        <span className="text-red-500 text-sm">
                          {form.formState.errors.description.message}
                        </span>
                      )}
                      <div className="space-y-1 grid grid-cols-2 items-center">
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          id="amount"
                          placeholder="Amount"
                          {...form.register("price")}
                        />
                      </div>
                      {form.formState.errors.price && (
                        <span className="text-red-500 text-sm">
                          {form.formState.errors.price.message}
                        </span>
                      )}
                      <div className="space-y-1 grid grid-cols-2 items-center">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          id="quantity"
                          placeholder="Quantity"
                          {...form.register("quantity")}
                        />
                      </div>
                      {form.formState.errors.quantity && (
                        <span className="text-red-500 text-sm">
                          {form.formState.errors.quantity.message}
                        </span>
                      )}
                      <div className="space-y-1 grid grid-cols-2 items-center">
                        <Label>Deadline</Label>
                        <Input
                          type="text"
                          id="deadline"
                          placeholder="Set deadline"
                          {...form.register("deadline")}
                        />
                      </div>
                      {form.formState.errors.deadline && (
                        <span className="text-red-500 text-sm">
                          {form.formState.errors.deadline.message}
                        </span>
                      )}
                      <div className="space-y-1 grid grid-cols-2 items-center">
                        <Label>Status</Label>
                        <Input
                          type="text"
                          id="status"
                          placeholder="Set status"
                          {...form.register("status")}
                        />
                      </div>
                      {form.formState.errors.status && (
                        <span className="text-red-500 text-sm">
                          {form.formState.errors.status.message}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="majors">
                  <Card>
                    <CardContent>
                      <div className="space-y-1 grid grid-cols-2 items-center">
                        <Label>Universities</Label>
                        <Input
                          type="text"
                          id="universities"
                          placeholder="Universities (comma-separated)"
                          {...form.register("universities")}
                        />
                      </div>
                      {form.formState.errors.universities && (
                        <span className="text-red-500 text-sm">
                          {form.formState.errors.universities.message}
                        </span>
                      )}
                      <div className="space-y-1 grid grid-cols-2 items-center">
                        <Label>Majors</Label>
                        <Input
                          type="text"
                          id="majors"
                          placeholder="Majors (comma-separated)"
                          {...form.register("majors")}
                        />
                      </div>
                      {form.formState.errors.majors && (
                        <span className="text-red-500 text-sm">
                          {form.formState.errors.majors.message}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="certificates">
                  <Card>
                    <CardContent>
                      <div className="space-y-1 grid grid-cols-2 items-center">
                        <Label>Certificates</Label>
                        <Input
                          type="text"
                          id="certificates"
                          placeholder="Certificates (comma-separated)"
                          {...form.register("certificates")}
                        />
                      </div>
                      {form.formState.errors.certificates && (
                        <span className="text-red-500 text-sm">
                          {form.formState.errors.certificates.message}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="skills">
                  <Card>
                    <CardContent>
                      <div className="space-y-1 grid grid-cols-2 items-center">
                        <Label>Skills</Label>
                        <Input
                          type="text"
                          id="skills"
                          placeholder="Skills (comma-separated)"
                          {...form.register("skills")}
                        />
                      </div>
                      {form.formState.errors.skills && (
                        <span className="text-red-500 text-sm">
                          {form.formState.errors.skills.message}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              <div className="w-full flex justify-end mt-4">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-800 rounded-[2rem] w-36 h-12 text-xl"
                  // disabled={
                  //   !form.formState.isValid || form.formState.isSubmitting
                  // }
                >
                  Add
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateScholarshipModal;
