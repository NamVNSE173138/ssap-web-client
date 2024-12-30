import { calculateAge, formatNaturalDate } from "@/lib/dateUtils";
import { getFullName } from "@/lib/stringUtils";
import * as Tabs from "@radix-ui/react-tabs";
import { AiOutlineBulb, AiOutlineEnvironment } from "react-icons/ai";
import ProfileSectionCard from "./ProfileSectionCard";
import { FaGraduationCap, FaMedal, FaTools } from "react-icons/fa";

const ProfileSection = (props: any) => {
  const { profile, handleExportPDF } = props;

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
            title="Experience"
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
