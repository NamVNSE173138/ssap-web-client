import * as Tabs from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import {
  AiOutlineUser,
  AiOutlineLock,
  AiOutlineProfile,
  AiOutlineAudit,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { BiLogOutCircle } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileSection from "./components/ProfileSection";
import AccountSection from "./components/AccountSection";
import AuthSection from "./components/AuthSection";
import LogoutSection from "./components/LogoutSection";
import ApplicationHistorySection from "./components/ApplicationHistorySection";
import RequestHistorySection from "./components/RequestHistorySection";

const ApplicantProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    avatar: "/placeholder.svg?height=96&width=96",
    firstName: "John",
    lastName: "Doe",
    username: "@johndoe",
    email: "johndoe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA 12345",
    gender: "Male",
    birthdate: "January 1, 1990",
    nationality: "Vietnam",
    ethnicity: "Asian",
    skills: ["JavaScript", "React", "Node.js"],
    achievements: ["Dean's List, 4 semesters", "Hackathon 2021 Winner"],
    experience: [
      "Software Developer Intern at Tech Solutions Inc., Summer 2021",
    ],
    certificates: ["Certified Web Developer", "React Specialist Certification"],
  });

  useEffect(() => {
    // Fetch or load user profile data here
    // For now, it's statically initialized above
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    console.log(profile);
    // Save the updated profile data (API call to save changes)
    // Example: api.saveProfile(profileData);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setAvatarPreview(fileUrl);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleAddField = (type: "skills" | "achievements") => {
    setProfile({ ...profile, [type]: [...profile[type], ""] });
  };

  const handleRemoveField = (
    type: "skills" | "achievements" | "experience" | "certificates",
    index: number,
  ) => {
    const updatedList = [...profile[type]];
    updatedList.splice(index, 1);
    setProfile({ ...profile, [type]: updatedList });
  };

  const handleListChange = (
    type: "skills" | "achievements" | "experience" | "certificates",
    index: number,
    value: string,
  ) => {
    const updatedList = [...profile[type]];
    updatedList[index] = value;
    setProfile({ ...profile, [type]: updatedList });
  };

  const handleExportPDF = () => {};

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <Tabs.Root
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col"
      >
        {/* Tab List */}
        <Tabs.List
          aria-label="Applicant Profile Tabs"
          className="flex space-x-4 border-b border-gray-200 pb-2"
        >
          {/* Account Info Tab */}
          <Tabs.Trigger
            value="account"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <AiOutlineUser className="text-lg" />
            My Account
          </Tabs.Trigger>

          {/* Applicant Profile Tab */}
          <Tabs.Trigger
            value="profile"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <AiOutlineProfile className="text-lg" />
            Applicant Profile
          </Tabs.Trigger>

          {/* Application History Tab */}
          <Tabs.Trigger
            value="application-history"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <AiOutlineAudit className="text-lg" />
            Application History
          </Tabs.Trigger>

          {/* Request History Tab */}
          <Tabs.Trigger
            value="request-history"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <AiOutlineClockCircle className="text-lg" />
            Request History
          </Tabs.Trigger>

          {/* Authentication Tab */}
          <Tabs.Trigger
            value="password"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <AiOutlineLock className="text-lg" />
            Authentication
          </Tabs.Trigger>

          {/* Logout Tab */}
          <Tabs.Trigger
            value="logout"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <BiLogOutCircle className="text-lg" />
            Log Out
          </Tabs.Trigger>
        </Tabs.List>

        {/* Tab Panels */}
        <AccountSection
          setActiveTab={setActiveTab}
          setIsEditing={setIsEditing}
        />

        <ProfileSection
          avatarPreview={avatarPreview}
          profile={profile}
          setProfile={setProfile}
          handleAvatarChange={handleAvatarChange}
          handleInputChange={handleInputChange}
          handleListChange={handleListChange}
          handleAddField={handleAddField}
          handleRemoveField={handleRemoveField}
          isEditing={isEditing}
          handleSaveClick={handleSaveClick}
          handleEditClick={handleEditClick}
          handleExportPDF={handleExportPDF}
        />

        <ApplicationHistorySection />

        <RequestHistorySection />

        <AuthSection />

        <LogoutSection dispatch={dispatch} navigate={navigate} />
      </Tabs.Root>
    </div>
  );
};

export default ApplicantProfile;
