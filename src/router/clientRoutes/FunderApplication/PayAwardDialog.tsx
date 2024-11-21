import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { Card } from "@/components/ScholarshipProgram";
import { CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { IoCard, IoCashOutline, IoWalletOutline } from "react-icons/io5";
import TextArea from "antd/es/input/TextArea";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { transferMoney } from "@/services/ApiServices/paymentService";
import { log } from "console";

interface AwardDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    application: any;
    amount: number;
    handlePayAwardProgress: (data:any) => void;
    awardName: string;
    scholarship: any;

}

const formSchema = z.object({
  senderId: z.number().min(1, "Please enter the senderId"),
  receiverId: z.number().min(1, "Please enter the receiverId"),
  description: z.string().min(1, "Please enter the description"),
  amount: z.number().min(1, "Please enter the amount"),
  paymentMethod: z.string(),
  
});


const PayAwardDialog = ({ isOpen, setIsOpen, application, amount, handlePayAwardProgress, awardName, scholarship }: AwardDialogProps) => {
    const { id } = useParams<{ id: string }>();
    const user = useSelector((state: RootState) => state.token.user);
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [applyLoading, setApplyLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiverId: application?.applicant?.id,
      senderId: user ? Number(user.id) : 1,
      amount: amount,
      paymentMethod: paymentMethod,
      description: `Award Progress ${awardName} - ${scholarship.name} for ${application.applicant.username}`
    },
  });

  const handlePayAward = async (data: z.infer<typeof formSchema>) => {
    try {
      //console.log(data);
      setApplyLoading(true);
      await handlePayAwardProgress(data);
      setIsOpen(false);
    } catch (error:any) {
        if(error.response.data.message.includes("Wallet with") || error.response.data.message.includes("less than the transfer amount")) {
            setError("Wallet not enough");
        }
    } finally {
      setApplyLoading(false);
    }
  };

   
    useEffect(() => {
        
    }, []);

      return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white p-6 rounded-lg shadow-lg w-1/2"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl mb-10">Pay Award</h3>
                            <button onClick={() => setIsOpen(false)} className="text-xl">
                                &times;
                            </button>
                        </div>
                      <form
                        onSubmit={form.handleSubmit(handlePayAward)}
                        className="flex flex-col gap-4"
                      >
                            {/* Scholarship Type */}
                            
                            {/* Name */}
                            <div className="space-y-1 grid grid-cols-3 items-center">
                              <Label>Applicant Name</Label>

                              <div className="flex gap-3 items-center col-span-2">
                                  <img
                                    src={application.applicant.avatarUrl??"https://github.com/shadcn.png"}
                                    alt="Icon"
                                    className="w-7 h-7 rounded-full"
                                  />
                                  <Input
                                    type="text"
                                    placeholder="Name"
                                    disabled
                                    value={application.applicant.username}
                                    //{/*...form.register("name")*/}
                                    className="col-span-2 "
                                  />
                              </div>
                            </div>

                            <div className="space-y-1 grid grid-cols-3 items-center">
                              <Label>Amount</Label>
                              
                                  <Input
                                    type="text"
                                    placeholder="Amount"
                                    disabled
                                    value={"$"+amount}
                                    //{/*...form.register("name")*/}
                                    className="col-span-2 font-semibold text-blue-700"
                                  />
                            </div>
                            <div className="space-y-1 grid grid-cols-3 items-center">
                              <Label>Description</Label>
                              
                                  <TextArea
                                    placeholder="Description"
                                    value={form.watch("description")}
                                    onChange={(e) => form.setValue("description", e.target.value)}
                                    className="col-span-2"
                                  />
                            </div>
                            <div>
                              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <IoCard className="text-blue-500" />
                                Choose Payment Method
                              </label>
                              <div className="flex gap-4">
                                {/* Wallet Option */}
                                <div
                                  onClick={() => form.setValue("paymentMethod","Wallet")}
                                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${form.watch("paymentMethod") === "Wallet"
                                      ? "border-blue-500 bg-blue-100"
                                      : "border-gray-300 hover:bg-gray-100"
                                    }`}
                                >
                                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full">
                                    <IoWalletOutline className="text-2xl" />
                                  </div>
                                  <span className="font-medium text-gray-800">Pay by Wallet</span>
                                </div>

                                {/* Cash Option */}
                                <div
                                  onClick={() => form.setValue("paymentMethod", "Cash")}
                                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${form.watch("paymentMethod") === "Cash"
                                      ? "border-green-500 bg-green-100"
                                      : "border-gray-300 hover:bg-gray-100"
                                    }`}
                                >
                                  <div className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full">
                                    <IoCashOutline className="text-2xl" />
                                  </div>
                                  <span className="font-medium text-gray-800">Cash</span>
                                </div>
                              </div>
                              {form.watch("paymentMethod") === "" && (
                                <p className="text-red-500 text-sm mt-2">Please select a payment method.</p>
                              )}
                            </div>

                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            {error == "Wallet not enough" && <Link to="/wallet" className="text-blue-500 underline">Add money to your wallet</Link>}

                            {/*JSON.stringify(application)*/}
                            <div className="w-full flex justify-end">
                              <Button
                                type="submit"
                                disabled={applyLoading}
                                className="bg-blue-500 hover:bg-blue-800 rounded-[2rem] w-36 h-12 text-xl"
                                //onClick={() => console.log(form.getValues())}
                              >
                                {applyLoading ? "Loading..." : "Submit"}
                              </Button>
                            </div>

                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
  }

  export default PayAwardDialog;
