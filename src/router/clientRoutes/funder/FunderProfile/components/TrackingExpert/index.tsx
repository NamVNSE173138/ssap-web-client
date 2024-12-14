import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BASE_URL } from "@/constants/api";
import { useSelector } from "react-redux";
import axios from "axios";
import ExpertForm from "./createExpertForm";
import ExpertList from "./expertList";
import * as Tabs from "@radix-ui/react-tabs";
import AssigningExpert from "./assigningExpert";
import { uploadFile } from "@/services/ApiServices/fileUploadService";
import { notification } from "antd";
import ScoredList from "./scoredApplicationList";

const TrackingExpert = () => {
  const user = useSelector((state: any) => state.token.user);
  const userId = user?.id;

  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File[]>([]);

  const initialFormData = {
    name: "",
    description: "",
    major: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
    avatarUrl: "",
    loginWithGoogle: false,
    status: "Active",
    funderId: userId,
    roleId: 3,
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      if (!file.type.startsWith("image/")) {
        notification.error({
          message: "Invalid File",
          description: "Please upload an image file.",
        });
        return;
      }
      setImageFile([file]);
    }
  };

  const fetchExperts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/funders/${userId}/experts`,
      );
      const expertsData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setExperts(expertsData);
    } catch (err: any) {
      setError(err.message || "Failed to load experts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []); // Fetch experts on component mount

  const handleFormSubmit = async (formData: any) => {
    setError(null);
    setSuccess(false);
    try {
      const imageUrl = await uploadFile(imageFile);
      if (imageUrl && imageUrl.data) {
        formData.avatarUrl = imageUrl.data.toString();
      }

      console.log("EXPERT", formData);

      const response = await axios.post(`${BASE_URL}/api/experts`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response.data);
      setSuccess(true);

      fetchExperts();
    } catch (err: any) {
      console.error("Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Tabs.Content value="expert" className="pt-4 w-full">
      <div className="grid grid-cols-12">
        <div className="col-span-12 col-start-1 ">
          <Tabs.Root defaultValue="create">
            <Tabs.List className="flex space-x-4 border-b-2 my-5 bg-white shadow-2 rounded-lg">
              <Tabs.Trigger
                value="create"
                className="px-4 py-2 text-lg font-semibold focus:outline-none data-[state=active]:border-b-2 data-[state=active]:text-[#1eb2a6]"
              >
                Add Expert
              </Tabs.Trigger>
              <Tabs.Trigger
                value="list"
                className="px-4 py-2 text-lg font-semibold focus:outline-none data-[state=active]:border-b-2 data-[state=active]:text-[#1eb2a6]"
              >
                Expert List
              </Tabs.Trigger>
              <Tabs.Trigger
                value="assign"
                className="px-4 py-2 text-lg font-semibold focus:outline-none data-[state=active]:border-b-2 data-[state=active]:text-[#1eb2a6]"
              >
                Expert Assigning
              </Tabs.Trigger>
              <Tabs.Trigger
                value="scored"
                className="px-4 py-2 text-lg font-semibold focus:outline-none data-[state=active]:border-b-2 data-[state=active]:text-[#1eb2a6]"
              >
                Scored Application
              </Tabs.Trigger>
            </Tabs.List>

            <div className="pt-3">
              <Tabs.Content value="create">
                <Card className="p-6 shadow-lg">
                  <ExpertForm
                    onSubmit={handleFormSubmit}
                    initialData={initialFormData}
                    handelUploadFile={handleFileChange}
                    success = {success}
                  />
                </Card>
              </Tabs.Content>

              <Tabs.Content value="list">
                <ExpertList experts={experts} loading={loading} error={error} />
              </Tabs.Content>

              <Tabs.Content value="assign">
                <AssigningExpert />
              </Tabs.Content>
              <Tabs.Content value="scored">
                <ScoredList/>
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>
      </div>
    </Tabs.Content>
  );
};

export default TrackingExpert;
