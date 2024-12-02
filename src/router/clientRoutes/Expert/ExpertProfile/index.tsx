import { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {
  AiOutlineContacts,
  AiOutlineLock,
  AiOutlineUser,
} from "react-icons/ai";
import AccountSection from "./components/AccountSection";
import AuthSection from "./components/AuthSection";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { uploadFile } from "@/services/ApiServices/fileUploadService";
import Spinner from "@/components/Spinner";
import { setUser } from "@/reducers/tokenSlice";
import {
  getExpertProfile,
  updateExpertProfile,
} from "@/services/ApiServices/expertService";
import ApprovalList from "./components/ReviewSection";
import { getMajors } from "@/services/ApiServices/majorService";

const ExpertProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.token.user);

  const [majors, setMajors] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProfileUpdated, setIsProfileUpdated] = useState<boolean>(false);
  const [expertData, setExpertData] = useState({
    username: "john_doe",
    email: "johndoe@example.com",
    phoneNumber: "+1234567890",
    address: "1234 Main St, Springfield",
    avatarUrl: "https://via.placeholder.com/150",
    major: "Tech Funders Inc.",
    description: "Jane Smith",
    name: "Jane Smith",
    status: "Active", // Possible values: Active, Pending, Suspended
    funderId: 0,
  });

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await getMajors();
        const majors = response.data.map((m: any) => m.name);
        setMajors(majors);
      } catch (error) {
        setError("Failed to get majors");
        console.log(error);
      }
    };

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getExpertProfile(Number(user?.id));
        setExpertData(response.data);
      } catch (error) {
        setError("Failed to get profile details");
        console.log(error);
      } finally {
        setIsLoading(false);
        setIsProfileUpdated(false);
      }
    };

    fetchProfile();
    fetchMajors();
  }, [user?.id, isProfileUpdated]);

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

  const handleSaveClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(false);
    setIsLoading(true);
    try {
      const uploadAvatarResponse = await uploadFile(avatar);
      const avatarUrls = uploadAvatarResponse.data;
      setExpertData({ ...expertData, avatarUrl: avatarUrls[0] });

      const postData = {
        avatar: avatarUrls[0] || expertData.avatarUrl,
        username: expertData.username,
        phone: expertData.phoneNumber,
        address: expertData.address,
        status: expertData.status,
        name: expertData.name,
        description: expertData.description,
        major: expertData.major,
      };
      console.log("Post data", postData);

      await updateExpertProfile(Number(user?.id), postData);
      dispatch(setUser({ ...user, avatar: expertData.avatarUrl }));
      setIsProfileUpdated(true);
    } catch (error) {
      setError("Update profile failed");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar([file]);
      setExpertData((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setExpertData({ ...expertData, [name]: value });

    console.log(expertData);
  };

  if (isLoading) {
    return <Spinner size="large" />;
  }

  return (
    <div className="w-full max-w-8xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <Tabs.Root
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-row w-full"
        orientation="vertical"
      >
        <Tabs.List
          aria-label="Funder Profile Tabs"
          className="flex flex-col w-1/4 border-r border-gray-200 space-y-2 pr-4"
        >
          <Tabs.Trigger
            value="account"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <AiOutlineUser className="text-lg" />
            My Account
          </Tabs.Trigger>

          <Tabs.Trigger
            value="password"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <AiOutlineLock className="text-lg" />
            Authentication
          </Tabs.Trigger>

          <Tabs.Trigger
            value="review"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <AiOutlineContacts className="text-lg" />
            Review
          </Tabs.Trigger>
        </Tabs.List>

        <div className="w-3/4 pl-6">
          <AccountSection
            majors={majors}
            getStatusBadge={getStatusBadge}
            expertData={expertData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSaveClick={handleSaveClick}
            handleAvatarChange={handleAvatarChange}
            handleInputChange={handleInputChange}
          />

          <AuthSection />

          <ApprovalList />
        </div>
      </Tabs.Root>
    </div>
  );
};

export default ExpertProfile;
