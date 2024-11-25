import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { AiOutlineUser } from "react-icons/ai";
import AccountSection from "./components/AccountSection";
import LogoutSection from "./components/LogoutSection";
import AuthSection from "./components/AuthSection";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaClipboardList } from "react-icons/fa";

const ProviderProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [provider, setProvider] = useState({
    username: "john_doe",
    email: "johndoe@example.com",
    phoneNumber: "+1234567890",
    address: "1234 Main St, Springfield",
    avatar: "https://via.placeholder.com/150",
    organizationName: "Tech Providers Inc.",
    contactPersonName: "Jane Smith",
    accountStatus: "Active", // Possible values: Active, Pending, Suspended
    documents: [
      {
        name: "Organization Registration",
        url: "https://res.cloudinary.com/djiztef3a/raw/upload/v1732419389/jh9olwxn5fir9zrmklli.pdf",
      },
      {
        name: "Tax Certificate",
        url: "https://res.cloudinary.com/djiztef3a/raw/upload/v1732419389/jh9olwxn5fir9zrmklli.pdf",
      },
    ],
  });

  const providerData = {
    username: "john_doe",
    email: "johndoe@example.com",
    phoneNumber: "+1234567890",
    address: "1234 Main St, Springfield",
    avatar: "https://via.placeholder.com/150",
    organizationName: "Tech Providers Inc.",
    contactPersonName: "Jane Smith",
    accountStatus: "Active", // Possible values: Active, Pending, Suspended
    documents: [
      {
        name: "Organization Registration",
        url: "https://res.cloudinary.com/djiztef3a/raw/upload/v1732419389/jh9olwxn5fir9zrmklli.pdf",
      },
      {
        name: "Tax Certificate",
        url: "https://res.cloudinary.com/djiztef3a/raw/upload/v1732419389/jh9olwxn5fir9zrmklli.pdf",
      },
    ],
  };

  // Function to get badge styles based on account status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <Tabs.Root
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col"
      >
        <Tabs.List
          aria-label="Provider Profile Tabs"
          className="flex space-x-4 border-b border-gray-200 pb-2"
        >
          <Tabs.Trigger
            value="account"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <AiOutlineUser className="text-lg" />
            My Account
          </Tabs.Trigger>

          <Tabs.Trigger
            value="service"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <FaClipboardList className="text-lg" />
            Services
          </Tabs.Trigger>

          <Tabs.Trigger
            value="password"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <AiOutlineUser className="text-lg" />
            Authentication
          </Tabs.Trigger>

          <Tabs.Trigger
            value="logout"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <AiOutlineUser className="text-lg" />
            Logout
          </Tabs.Trigger>
        </Tabs.List>

        <AccountSection
          getStatusBadge={getStatusBadge}
          providerData={providerData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
        />

        <AuthSection />

        <LogoutSection dispatch={dispatch} navigate={navigate} />
      </Tabs.Root>
    </div>
  );
};

export default ProviderProfile;
