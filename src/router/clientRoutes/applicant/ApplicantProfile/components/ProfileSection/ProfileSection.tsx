import { getFullName } from "@/lib/stringUtils";
import * as Tabs from "@radix-ui/react-tabs";
import { AiOutlineBulb, AiOutlineEnvironment } from "react-icons/ai";
import { FaGraduationCap, FaMedal, FaTools } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  exportApplicantProfileToPdf,
  getApplicantProfileById,
} from "@/services/ApiServices/applicantProfileService";
import Spinner from "@/components/Spinner";
import { notification } from "antd";
import EducationSectionCard from "./EducationSection/EducationSectionCard";
import CertificateSectionCard from "./CertificateSection/CertificateSectionCard";
import SkillSectionCard from "./SkillSection/SkillSectionCard";
import ExperienceSectionCard from "./ExperienceSection/ExperienceSectionCard";
import Applicant from "../../types/Applicant";
import AvatarSection from "./AvatarSection/AvatarSection";
import GeneralInfoSection from "./GeneralInfoSection/GeneralInfoSection";

const ProfileSection = () => {
  const user = useSelector((state: RootState) => state.token.user);

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
          <AvatarSection setRefresh={setRefresh} profile={profile} />

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
            <GeneralInfoSection setRefresh={setRefresh} profile={profile} />
          </div>
        </div>

        {/* Right Column - Additional Information */}
        <div className="w-full lg:w-2/3 space-y-6">
          {/* Education Section */}
          <EducationSectionCard
            setRefresh={setRefresh}
            title="Education"
            icon={FaGraduationCap}
            items={profile.applicantEducations}
            placeholder="Share your past and current education."
            buttonText="Add education"
          />

          {/* Certificates Section */}
          <CertificateSectionCard
            setRefresh={setRefresh}
            title="Certificates"
            icon={FaMedal}
            items={profile.applicantCertificates}
            placeholder="Do you have any certificates?"
            buttonText="Add certificate"
          />

          {/* Skills Section */}
          <SkillSectionCard
            setRefresh={setRefresh}
            title="Skills"
            icon={FaTools}
            items={profile.applicantSkills}
            placeholder="Do you have any technical or soft skills?"
            buttonText="Add skill"
          />

          {/* Experience Section */}
          <ExperienceSectionCard
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
