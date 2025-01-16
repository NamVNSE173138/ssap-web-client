import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import {
  AiOutlineLock,
  AiOutlineProfile,
  AiOutlineClockCircle,
  AiOutlineUser,
} from "react-icons/ai";
import ProfileSection from "./components/ProfileSection/ProfileSection";
import ApplicationHistorySection from "./components/ApplicationHistorySection/ApplicationHistorySection";
import AuthSection from "./components/PasswordSection/AuthSection";
import RequestHistory from "../../RequestServiceHistory";
import { useSearchParams } from "react-router-dom";

const ApplicantProfile = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<string>(tab || "profile");

  return (
    <div className="w-full mx-auto rounded-lg">
      <Tabs.Root
        defaultValue="profile"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col md:flex-row w-full"
        orientation="vertical"
      >
        <Tabs.List
          aria-label="Applicant Profile Tabs"
          className="flex flex-col w-full md:w-1/6 p-6 border-r md:border-r border-gray-400 space-y-4 pr-2 md:space-y-4 md:pr-4"
        >
          <div className="text-xl font-semibold text-gray-800">
            Account Settings
          </div>

          <Tabs.Trigger
            value="profile"
            className="flex items-center gap-2 text-gray-700 hover:text-[#1eb2a6] focus:outline-none data-[state=active]:text-[#1eb2a6] data-[state=active]:font-bold"
          >
            <AiOutlineUser className="text-lg" />
            Profile
          </Tabs.Trigger>

          <Tabs.Trigger
            value="password"
            className="flex items-center gap-2 text-gray-700 hover:text-[#1eb2a6] focus:outline-none data-[state=active]:text-[#1eb2a6] data-[state=active]:font-bold"
          >
            <AiOutlineLock className="text-lg" />
            Change Password
          </Tabs.Trigger>

          <Tabs.Trigger
            value="application-history"
            className="flex items-center gap-2 text-gray-700 hover:text-[#1eb2a6] focus:outline-none data-[state=active]:text-[#1eb2a6] data-[state=active]:font-bold"
          >
            <AiOutlineProfile className="text-lg" />
            Application History
          </Tabs.Trigger>

          <Tabs.Trigger
            value="services-history"
            className="flex items-center gap-2 text-gray-700 hover:text-[#1eb2a6] focus:outline-none data-[state=active]:text-[#1eb2a6] data-[state=active]:font-bold"
          >
            <AiOutlineClockCircle className="text-lg" />
            Service History
          </Tabs.Trigger>
        </Tabs.List>

        <div className="w-full md:w-5/6 p-6">
          <ProfileSection />
          <ApplicationHistorySection />
          <RequestHistory />
          <AuthSection />
        </div>
      </Tabs.Root>
    </div>
  );
};

export default ApplicantProfile;
