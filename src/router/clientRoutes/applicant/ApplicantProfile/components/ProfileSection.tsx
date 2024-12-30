import { calculateAge, formatNaturalDate } from "@/lib/dateUtils";
import { getFullName } from "@/lib/stringUtils";
import * as Tabs from "@radix-ui/react-tabs";
import { AiOutlineBulb, AiOutlineEnvironment } from "react-icons/ai";
import ProfileSectionCard from "./ProfileSectionCard";
import { FaGraduationCap, FaMedal, FaTools } from "react-icons/fa";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Applicant from "../types/Applicant";
import {
  exportApplicantProfileToPdf,
  getApplicantProfileById,
} from "@/services/ApiServices/applicantProfileService";
import { uploadFile } from "@/services/ApiServices/testService";
import { setUser } from "@/reducers/tokenSlice";
import Spinner from "@/components/Spinner";
import { notification } from "antd";

const ProfileSection = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.token.user);

  const [avatar, setAvatar] = useState<File[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [profile, setProfile] = useState<Applicant>({
    applicantId: 0,
    avatar: "",
    firstName: "",
    lastName: "",
    bio: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    birthDate: "",
    nationality: "",
    ethnicity: "",
    applicantSkills: [],
    applicantEducations: [],
    applicantExperience: [],
    applicantCertificates: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getApplicantProfileById(Number(user?.id));
        setProfile(response.data);
      } catch (error) {
        setError("Failed to get profile details");
      } finally {
        setIsLoading(false);
        setRefresh(false);
      }
    };

    fetchProfile();
  }, [user?.id, refresh]);

  const handleSaveClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        bio: profile.bio,
        address: profile.address,
        gender: profile.gender,
        birthdate: profile.birthDate,
        nationality: profile.nationality,
        ethnicity: profile.ethnicity,
        skills: profile.applicantSkills,
        experience: profile.applicantExperience,
        certificates: profile.applicantCertificates,
      };

      console.log("Post data", postData);

      dispatch(setUser({ ...user, avatar: profile.avatar }));
      setRefresh(true);
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
    return <Spinner />;
  }

  if (error) {
    notification.error({
      message: "Error",
      description: error,
    });
  }

  return (
    <Tabs.Content value="profile" className="pt-4">
      <div className="w-full flex flex-col lg:flex-row gap-6 p-6">
        {/* Left Column - General Information */}
        <div className="w-full lg:w-1/3 flex flex-col items-center bg-gray-50 p-4 rounded-lg border border-gray-200 self-start">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <img
              src={profile.avatar || "https://github.com/shadcn.png"}
              alt="User Avatar"
              className="rounded-full border-2 border-gray-300 object-cover"
            />
          </div>

          {/* Name */}
          <h2 className="mt-4 text-lg font-semibold">
            {getFullName(profile.firstName, profile.lastName)}
          </h2>

          {/* Username */}
          <h3 className="text-sm font-medium">
            @{profile.username || "Your Username"}
          </h3>

          {/* Location */}
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <AiOutlineEnvironment className="text-lg" />
            {profile.address || "City, Country"}
          </div>

          {/* Additional Information */}
          <div className="mt-4 w-full text-sm space-y-2">
            <p>
              <strong>Birthdate:</strong>{" "}
              {formatNaturalDate(profile.birthDate) || "N/A"}
            </p>
            <p>
              <strong>Age:</strong> {calculateAge(profile.birthDate) || "N/A"}
            </p>
            <p>
              <strong>Gender:</strong> {profile.gender || "N/A"}
            </p>
            <p>
              <strong>Nationality:</strong> {profile.nationality || "N/A"}
            </p>
            <p>
              <strong>Ethnicity:</strong> {profile.ethnicity || "N/A"}
            </p>
          </div>
        </div>

        {/* Right Column - Additional Information */}
        <div className="w-full lg:w-2/3 space-y-6">
          {/* Bio Section */}
          <ProfileSectionCard
            section="bio"
            title="Bio"
            icon={AiOutlineBulb}
            items={profile.bio}
            placeholder="Share your background, interests, and experiences to stand out from other applicants."
            buttonText="Add bio"
          />

          {/* Education Section */}
          <ProfileSectionCard
            section="education"
            title="Education"
            icon={FaGraduationCap}
            items={profile.applicantEducations}
            placeholder="Share your past and current education."
            buttonText="Add education"
          />

          {/* Certificates Section */}
          <ProfileSectionCard
            section="certificate"
            title="Certificates"
            icon={FaMedal}
            items={profile.applicantCertificates}
            placeholder="Do you have any certificates?"
            buttonText="Add certificate"
          />

          {/* Skills Section */}
          <ProfileSectionCard
            section="skill"
            title="Skills"
            icon={FaTools}
            items={profile.applicantSkills}
            placeholder="Do you have any technical or soft skills?"
            buttonText="Add skill"
          />

          {/* Experience Section */}
          <ProfileSectionCard
            section="experience"
            setRefresh={setRefresh}
            title="Experiences"
            icon={AiOutlineBulb}
            items={profile.applicantExperience}
            placeholder="Do you have any current or past experience?"
            buttonText="Add experience"
          />
        </div>
      </div>
    </Tabs.Content>
  );
};

export default ProfileSection;
