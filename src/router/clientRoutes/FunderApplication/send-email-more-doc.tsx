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
import QuillEditor from "@/components/Quill/QuillEditor";

interface SendReasonDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    application: any;
    handleNeedExtend: (status:string,data:any) => void;
    status: string;
}

const formSchema = z.object({
  topic: z.string().min(1, "Please enter the receiverId"),
  title: z.string().min(1, "Please enter the title"),
  body: z.string().min(1, "Please enter the description"),
  link: z.string().min(1, "Please enter the link"),
  
});


const SendReasonDialog = ({ isOpen, setIsOpen, application, handleNeedExtend, status }: SendReasonDialogProps) => {
    const { id } = useParams<{ id: string }>();
    const user = useSelector((state: RootState) => state.token.user);

    const [applyLoading, setApplyLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: application?.applicant?.id+"",
      title: "",
      body: "",
      link: "/funder/application/"+id,
    },
  });

  const handleSendReason = async (data: z.infer<typeof formSchema>) => {
    try {
      setApplyLoading(true);
      //console.log(data);
      await handleNeedExtend(status,data);
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
                <div className="fixed z-50 inset-0  bg-black bg-opacity-50 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white p-6 rounded-lg shadow-lg w-1/2"
                    >
                        <div className="flex justify-between items-center ">
                            <h3 className="text-2xl mb-10">Send Reason of Need Extend</h3>
                            <button onClick={() => setIsOpen(false)} className="text-xl">
                                &times;
                            </button>
                        </div>
                      <form
                        onSubmit={form.handleSubmit(handleSendReason)}
                        className="flex flex-col gap-4 max-h-[500px] overflow-y-scroll"
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
                                  {form.formState.errors.topic && <p className="text-red-500 text-sm">{form.formState.errors.topic.message}</p>}
                              </div>
                            </div>

                            <div className="">
                              <Label>Title</Label>
                              
                                  <Input
                                    type="text"
                                    placeholder="Title"
                                    value={form.watch("title")}
                                    onChange={(e) => form.setValue("title", e.target.value)}
                                    className=""
                                  />
                            </div>
                            <div className="">
                              <Label>Body</Label>
                                  <QuillEditor value={form.getValues("body")??""} isHTML={true} onChange={(value: any) => {
                                    form.setValue("body",value)
                                }} />
                                {form.formState.errors.body && <p className="text-red-500 text-sm">{form.formState.errors.body.message}</p>}
                            </div>
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

  export default SendReasonDialog;
