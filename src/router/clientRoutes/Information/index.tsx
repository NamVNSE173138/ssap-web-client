import { useEffect, useState } from "react";
import { Alert, DatePicker, Spin, message } from "antd";
import { useParams } from "react-router-dom";
import { getAllApplicantProfilesByApplicant, getApplicantProfileById, updateApplicantProfile, exportApplicantProfileToPdf, addApplicantProfile } from "@/services/ApiServices/applicantProfileService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Sidebar } from "@/components/AccountInfo";
import { FaCalendarAlt, FaFlag, FaMale, FaMapMarkerAlt, FaRegEdit, FaUserAlt } from "react-icons/fa";
import { AiOutlineFilePdf, AiOutlineSave } from "react-icons/ai";

const Information = () => {
  const user = useSelector((state: RootState) => state.token.user);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    birthDate: new Date().toISOString(),
    gender: "",
    nationality: "",
    ethnicity: "",
    applicantId: user?.id,
  });

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        let data = await getAllApplicantProfilesByApplicant(Number(id || user?.id));
        data = data.data
        if (isMounted) {
          setProfileData(data);
          setFormValues({
            firstName: data.firstName,
            lastName: data.lastName,
            birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
            gender: data.gender,
            nationality: data.nationality,
            ethnicity: data.ethnicity,
            applicantId: user?.id,
          });
        }
      } catch (error) {
        if (isMounted) {
          setProfileData([]);
          setFormValues({
            firstName: "",
            lastName: "",
            birthDate: new Date().toISOString(),
            gender: "",
            nationality: "",
            ethnicity: "",
            applicantId: user?.id,
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [id, user?.id]);

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsAdd(false);
    setIsEditing(true);
  };

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsAdd(true);
    setIsEditing(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isAdd) {
        await addApplicantProfile({ ...formValues, id: profileData.id });
        setHasProfile(true);
      }
      else {
        await updateApplicantProfile(profileData.applicantId, { ...formValues, id: profileData.id });
      }
      message.success("Profile updated successfully!");
      setProfileData({ ...profileData, ...formValues });
      setIsEditing(false);
    } catch (error) {
      message.error("Failed to update profile.");
    }
  };

  const handleExportPDF = async () => {
    try {
      const pdfBlob = await exportApplicantProfileToPdf(profileData.applicantId);
      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${profileData.firstName}_${profileData.lastName}_Profile.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success("Exported PDF successfully!");
    } catch (error) {
      message.error("Failed to export PDF.");
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  if (!profileData) {
    return <Alert message="Profile not found." type="warning" />;
  }

  return (
    <div className="grid grid-cols-12 ">
      <Sidebar className="col-start-2 col-end-4 h-auto self-start" needRefresh={hasProfile} />

      {isEditing ? (
        <div className="mt-10 ml-5 mb-2 col-span-8 flex flex-col justify-start gap-5 p-6 bg-white shadow-lg rounded-xl">
          <form className="lg:px-28 flex flex-col gap-9" onSubmit={handleSave}>
            {/* Name Fields */}
            <div className="grid grid-cols-2 lg:gap-8 gap-4">
              <div>
                <label htmlFor="firstName" className="flex items-center gap-2 text-gray-700">
                  <FaUserAlt size={20} /> First Name:
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="flex items-center gap-2 text-gray-700">
                  <FaUserAlt size={20} /> Last Name:
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Date of Birth & Gender */}
            <div className="grid grid-cols-2 lg:gap-8 gap-4">
              <div>
                <label htmlFor="birthDate" className="flex items-center gap-2 text-gray-700">
                  <FaCalendarAlt size={20} /> Birth Date:
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
                  value={formValues.birthDate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="gender" className="flex items-center gap-2 text-gray-700">
                  <FaMale size={20} /> Gender:
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
                  value={formValues.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Nationality & Ethnicity */}
            <div className="grid grid-cols-2 lg:gap-8 gap-4">
              <div>
                <label htmlFor="nationality" className="flex items-center gap-2 text-gray-700">
                  <FaFlag size={20} /> Nationality:
                </label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
                  value={formValues.nationality}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="ethnicity" className="flex items-center gap-2 text-gray-700">
                  <FaMapMarkerAlt size={20} /> Ethnicity:
                </label>
                <input
                  type="text"
                  id="ethnicity"
                  name="ethnicity"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
                  value={formValues.ethnicity}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Hidden applicantId */}
            <input
              type="text"
              id="applicantId"
              name="applicantId"
              className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
              value={formValues.applicantId}
              onChange={handleInputChange}
              style={{ display: 'none' }}
            />

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                type="submit"
                className="lg:mb-7 mb-5 bg-[#067CEB] text-white lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base flex items-center justify-center gap-2"
              >
                <AiOutlineSave size={22} /> Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="ml-3 lg:mb-7 mb-5 bg-[#FF5C5C] text-white lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base flex items-center justify-center gap-2"
              >
                <FaRegEdit size={22} /> Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mt-10 ml-5 mb-2 col-span-8 flex flex-col justify-start gap-5 p-6 bg-white shadow-lg rounded-xl">
          <div className="lg:px-28 flex flex-col gap-12">
            {/* Profile Fields */}
            <div className="grid grid-cols-2 lg:gap-8 gap-4">
              <div>
                <label htmlFor="firstName" className="flex items-center gap-2 text-gray-700">
                  <FaUserAlt size={20} /> First Name:
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
                  value={profileData?.firstName || ""}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="lastName" className="flex items-center gap-2 text-gray-700">
                  <FaUserAlt size={20} /> Last Name:
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
                  value={profileData?.lastName || ""}
                  readOnly
                />
              </div>
            </div>

            {/* Date of Birth & Gender */}
            <div className="grid grid-cols-2 lg:gap-8 gap-4">
              <div>
                <label htmlFor="birthDate" className="flex items-center gap-2 text-gray-700">
                  <FaCalendarAlt size={20} /> Birth Date:
                </label>
                <input
                  type="text"
                  id="birthDate"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
                  value={profileData?.birthDate?.split("T")[0] || ""}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="gender" className="flex items-center gap-2 text-gray-700">
                  <FaMale size={20} /> Gender:
                </label>
                <input
                  type="text"
                  id="gender"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
                  value={profileData?.gender || ""}
                  readOnly
                />
              </div>
            </div>

            {/* Nationality & Ethnicity */}
            <div className="grid grid-cols-2 lg:gap-8 gap-4">
              <div>
                <label htmlFor="nationality" className="flex items-center gap-2 text-gray-700">
                  <FaFlag size={20} /> Nationality:
                </label>
                <input
                  type="text"
                  id="nationality"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
                  value={profileData?.nationality || ""}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="ethnicity" className="flex items-center gap-2 text-gray-700">
                  <FaMapMarkerAlt size={20} /> Ethnicity:
                </label>
                <input
                  type="text"
                  id="ethnicity"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
                  value={profileData?.ethnicity || ""}
                  readOnly
                />
              </div>
            </div>

            <div className="flex justify-center">
              {/*JSON.stringify(profileData)*/}
              {profileData.constructor == Array && <button
                type="button"
                onClick={handleAdd}
                className="lg:mb-7 mb-5 bg-[#1eb2a6] text-primary-foreground lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base"
              >
                Add Profile
              </button>}
              {profileData.constructor != Array && <button
                type="button"
                onClick={handleEdit}
                className="ml-[10px] lg:mb-7 mb-5 bg-[#067CEB] text-primary-foreground lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base"
              >
                Edit Profile
              </button>}
              <button
                type="button"
                onClick={handleExportPDF}
                className="ml-3 lg:mb-7 mb-5 bg-[#067CEB] text-white lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base flex items-center justify-center gap-2"
              >
                <AiOutlineFilePdf size={22} /> Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Information;
