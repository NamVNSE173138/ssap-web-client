import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

interface CreateScholarshipModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const formSchema = z.object({
  scholarshiptype: z
    .string({ required_error: "Vui lòng chọn loại dịch vụ" })
    .min(1, "Vui lòng chọn loại dịch vụ"),
  name: z
    .string({ required_error: "Vui lòng nhập tên chương trình" })
    .min(1, "Vui lòng nhập tên chương trình"),
  description: z
    .string({ required_error: "Vui lòng nhập mô tả" })
    .min(1, "Vui lòng nhập mô tả"),
  price: z
    .string()
    .refine((price) => !isNaN(parseFloat(price)), {
      message: "Giá phải là số",
    }),
  quantity: z
    .string()
    .refine((quantity) => !isNaN(parseFloat(quantity)), {
      message: "Số lượng phải là số",
    }),
  quantity_renewal: z
    .string()
    .refine((quantity) => !isNaN(parseFloat(quantity)), {
      message: "Số lượng phải là số",
    }),
});

const CreateScholarshipModal = ({
  isOpen,
  setIsOpen,
}: CreateScholarshipModalProps) => {


//     const [data, setData] = useState([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
  
//    const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:5254/api/scholarship-programs/by-funder-id/${funderId}`
//       );
//       if (response.data.statusCode === 200) {
//         setData(response.data.data);
//       } else {
//         setError("Failed to fetch data");
//       }
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [categories, setCategories] = useState([]);
  const funder = useSelector((state: any) => state.token.user);
  const funderId = funder?.id;

  const handleAddNewScholarshipProgram = async (
    values: z.infer<typeof formSchema>
  ) => {
    console.log("Form submitted"); 
    try {
      if (!funderId) {
        throw new Error("Funder ID not available");
      }

      const postData = {
        name: values.name,
        description: values.description,
        scholarshipAmount: parseFloat(values.price),
        numberOfScholarships: parseInt(values.quantity),
        numberOfRenewals: parseInt(values.quantity_renewal),
        funderId, 
        categories: [parseInt(values.scholarshiptype)], 
      };

      const response = await axios.post(
        "http://localhost:5254/api/scholarship-programs",
        postData
      );

      console.log("Success:", response.data);
      setIsOpen(false);
      
        // await fetchData()
      
    } catch (error) {
      console.error("Error creating scholarship program", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      axios
        .get("http://localhost:5254/api/categories")
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
              className="flex flex-col gap-4 mt-4"
            >
              <div className="flex gap-12">
                <img
                  src="https://via.placeholder.com/150"
                  alt="profile"
                  className="rounded-3xl w-44"
                />
                <div>
                  <div className="grid grid-cols-2 items-center">
                    <label htmlFor="scholarshiptype" className="">
                      Scholarship Type:
                    </label>
                    <select
                      {...form.register("scholarshiptype")}
                      className="w-[180px] px-4 py-2 rounded-3xl border-2 border-blue-500 text-black mb-2"
                    >
                      <option selected hidden value="">
                        Choose type
                      </option>
                      {categories.map((category: any) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 items-center mb-2">
                    <label className="">Name:</label>
                    <input
                      type="text"
                      id="name"
                      className="columns-1 h-8 indent-2"
                      placeholder="Name of Scholarship Program...."
                      {...form.register("name")}
                    />
                  </div>
                  <div className="grid grid-cols-2 items-center mb-2">
                    <label className="">Description:</label>
                    <input
                      type="text"
                      id="description"
                      className="columns-1 h-8 indent-2"
                      placeholder="Description...."
                      {...form.register("description")}
                    />
                  </div>
                  <div className="grid grid-cols-2 items-center">
                    <label className="columns-1"> Amount:</label>
                    <input
                      type="number"
                      id="amount"
                      min="0"
                      className="columns-1 h-8 indent-2"
                      placeholder="Amount...."
                      {...form.register("price")}
                    />
                  </div>
                  <div className="grid grid-cols-2 items-center">
                    <label className="columns-1">Quantity:</label>
                    <input
                      type="number"
                      id="quantity"
                      min="0"
                      className="columns-1 h-8 indent-2"
                      placeholder="Quantity...."
                      {...form.register("quantity")}
                    />
                  </div>
                  <div className="grid grid-cols-2 items-center">
                    <label className="columns-1">Quantity of Renewals:</label>
                    <input
                      type="number"
                      id="quantity_renewal"
                      min="0"
                      className="columns-1 h-8 indent-2"
                      placeholder="Quantity...."
                      {...form.register("quantity_renewal")}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-end mt-4">
                {/* Ensure the button has type="submit" */}
                <Button type="submit" className="bg-blue-500 hover:bg-blue-800 rounded-[2rem] w-36 h-12 text-xl">
                  Thêm
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

