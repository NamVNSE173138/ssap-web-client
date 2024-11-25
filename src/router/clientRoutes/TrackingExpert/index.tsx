import { useState, useEffect } from "react";
import { Sidebar } from "@/components/AccountInfo";
import { Card } from "@/components/ui/card";
import { BASE_URL } from "@/constants/api";
import { useSelector } from "react-redux";
import axios from "axios";
import ExpertForm from "./createExpertForm";
import ExpertList from "./expertList"; // Import ExpertList component
import * as Tabs from "@radix-ui/react-tabs";

const TrackingExpert = () => {
  const user = useSelector((state: any) => state.token.user);
  const userId = user?.id;

  const [experts, setExperts] = useState<any[]>([]); // Store the experts data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/funders/${userId}/experts`
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

    fetchExperts();
  }, []); 

  const handleFormSubmit = async (formData: any) => {
    setError(null);
    try {
      const response = await axios.post(`${BASE_URL}/api/experts`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response:", response.data);
      setSuccess(true);
    } catch (err: any) {
      console.error("Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="grid grid-cols-12">
      <Sidebar className="col-start-1 col-end-3" />
      <div className="col-span-10 mx-10 p-5 ">
        <Tabs.Root defaultValue="account">
          <Tabs.List className="flex space-x-4 border-b-2 mb-4">
            <Tabs.Trigger
              value="create"
              className="px-4 py-2 text-lg font-semibold focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
            >
              Add Expert
            </Tabs.Trigger>
            <Tabs.Trigger
              value="list"
              className="px-4 py-2 text-lg font-semibold focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
            >
              Expert List
            </Tabs.Trigger>
            <Tabs.Trigger
              value="assign"
              className="px-4 py-2 text-lg font-semibold focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
            >
              Expert Assigning
            </Tabs.Trigger>
          </Tabs.List>

          <div className="pt-3">
            <Tabs.Content value="create">
              <Card className="p-6 shadow-lg">
                <ExpertForm
                  onSubmit={handleFormSubmit}
                  initialData={initialFormData}
                />
                {error && <p className="text-red-600 mt-4">{error}</p>}
                {success && (
                  <p className="text-green-600 mt-4">
                    Expert data submitted successfully!
                  </p>
                )}
              </Card>
            </Tabs.Content>

            <Tabs.Content value="list">
              <ExpertList experts={experts} loading={loading} error={error} />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default TrackingExpert;
