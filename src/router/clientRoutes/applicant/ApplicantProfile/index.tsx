import * as Tabs from "@radix-ui/react-tabs";
import { FormEvent, useEffect, useState } from "react";
import {
  AiOutlineUser,
  AiOutlineLock,
  AiOutlineProfile,
  AiOutlineAudit,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileSection from "./components/ProfileSection";
import AccountSection from "./components/AccountSection";
import AuthSection from "./components/AuthSection";
import ApplicationHistorySection from "./components/ApplicationHistorySection";
import RequestHistorySection from "./components/RequestHistorySection";
import {
  exportApplicantProfileToPdf,
  getApplicantProfileDetails,
  updateApplicantProfileDetails,
} from "@/services/ApiServices/applicantProfileService";
import { RootState } from "@/store/store";
import Spinner from "@/components/Spinner";
import { uploadFile } from "@/services/ApiServices/fileUploadService";
import { setUser } from "@/reducers/tokenSlice";

const ApplicantProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.token.user);

  const [avatar, setAvatar] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<string>("account");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProfileUpdated, setIsProfileUpdated] = useState<boolean>(false);
  const [profile, setProfile] = useState({
    avatar: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    birthdate: "",
    nationality: "",
    ethnicity: "",
    major: "",
    gpa: "",
    school: "",
    skills: [],
    achievements: [],
    experience: [],
    certificates: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getApplicantProfileDetails(Number(user?.id));
        setProfile(response.data);
      } catch (error) {
        setError("Failed to get profile details");
        console.log(error);
      } finally {
        setIsLoading(false);
        setIsProfileUpdated(false);
      }
    };

    fetchProfile();
  }, [user?.id, isProfileUpdated]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(false);
    setIsLoading(true);
    console.log(profile);
    try {
      const uploadFileResponse = await uploadFile(avatar);
      const fileUrls = uploadFileResponse.data;

      const postData = {
        avatarUrl: fileUrls[0],
        firstName: profile.firstName,
        lastName: profile.lastName,
        username: profile.username,
        phone: profile.phone,
        address: profile.address,
        gender: profile.gender,
        birthdate: profile.birthdate,
        nationality: profile.nationality,
        ethnicity: profile.ethnicity,
        major: profile.major,
        gpa: Number(profile.gpa),
        school: profile.school,
        achievements: profile.achievements,
        skills: profile.skills,
        experience: profile.experience,
        certificates: profile.certificates,
      };

      console.log("Post data", postData);

      await updateApplicantProfileDetails(Number(user?.id), postData);
      dispatch(setUser({ ...user, avatar: profile.avatar }));
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
      setProfile((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
      setAvatar([file]);
    }
    console.log("Profile after avatar change:", profile);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });

    console.log(profile);
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

  const handleExportPDF = async () => {
    try {
      const pdfBlob = await exportApplicantProfileToPdf(Number(user?.id));
      console.log("PDF Blob:", pdfBlob);

      const url = window.URL.createObjectURL(
        new Blob([pdfBlob], { type: "application/pdf" }),
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `${profile.firstName}_${profile.lastName}_CV.pdf`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      console.log("Exported PDF successfully!");
    } catch (error) {
      console.log("Failed to export PDF.");
    }
  };

  if (isLoading) {
    return <Spinner size="large" />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <Tabs.Root
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-row w-full"
        orientation="vertical"
      >
        {/* Tab List */}
        <Tabs.List
          aria-label="Applicant Profile Tabs"
          className="flex flex-col w-1/4 border-r border-gray-200 space-y-2 pr-4"
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
        </Tabs.List>

        {/* Tab Panels */}

        <div className="w-3/4 pl-6">
          <AccountSection
            profile={profile}
            setActiveTab={setActiveTab}
            setIsEditing={setIsEditing}
          />

          <ProfileSection
            profile={profile}
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
        </div>
      </Tabs.Root>
    </div>
  );
};

export default ApplicantProfile;
