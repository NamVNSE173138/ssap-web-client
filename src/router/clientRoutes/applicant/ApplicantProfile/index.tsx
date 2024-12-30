import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import {
  AiOutlineLock,
  AiOutlineProfile,
  AiOutlineClockCircle,
} from "react-icons/ai";
import ProfileSection from "./components/ProfileSection";
import AuthSection from "./components/AuthSection";
import ApplicationHistorySection from "./components/ApplicationHistorySection";

const ApplicantProfile = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");

  return (
    <div className="w-full max-w-8xl mx-auto my-0 p-6 shadow-lg rounded-lg">
      <Tabs.Root
        defaultValue="profile"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-row w-full"
        orientation="vertical"
      >
        {/* Tab List */}
        <Tabs.List
          aria-label="Applicant Profile Tabs"
          className="flex flex-col w-1/6  border-r border-gray-400 space-y-2 pr-2"
        >
          {/* Applicant Profile Tab */}
          <Tabs.Trigger
            value="profile"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-600 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-green-600"
          >
            <AiOutlineProfile className="text-lg" />
            Applicant Profile
          </Tabs.Trigger>

          {/* Application History Tab */}
          <Tabs.Trigger
            value="application-history"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-600 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-green-600"
          >
            <AiOutlineClockCircle className="text-lg" />
            Application History
          </Tabs.Trigger>

          {/* Authentication Tab */}
          <Tabs.Trigger
            value="password"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-600 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-green-600"
          >
            <AiOutlineLock className="text-lg" />
            Account Password
          </Tabs.Trigger>
        </Tabs.List>

        {/* Tab Panels */}

        <div className="w-5/6 pl-6">
          <ProfileSection />

          <ApplicationHistorySection />

          <AuthSection />
        </div>
      </Tabs.Root>
    </div>
  );
};

export default ApplicantProfile;
