import { useEffect, useState } from "react";
import { Alert, DatePicker, Spin, message } from "antd";
import { useParams } from "react-router-dom";
import { addOrUpdateApplicantProfile, getAllApplicantProfilesByApplicant, getApplicantProfileById, updateApplicantProfile, exportApplicantProfileToPdf } from "@/services/ApiServices/applicantProfileService";
import { GoPencil } from "react-icons/go";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Sidebar } from "@/components/AccountInfo";

const Information = () => {
  const user = useSelector((state: RootState) => state.token.user);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
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
        const data = await getAllApplicantProfilesByApplicant(Number(id || user?.id));
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
      await addOrUpdateApplicantProfile({ ...formValues, id: profileData.id });
      message.success("Profile updated successfully!");
      setProfileData({ ...profileData, ...formValues });
      setIsEditing(false);
    } catch (error) {
      message.error("Failed to update profile.");
    }
  };

  const handleExportPDF = async () => {
    try {
      const pdfBlob = await exportApplicantProfileToPdf(profileData.id);
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
    <div className="grid grid-cols-12 h-full">
      <Sidebar className="col-start-1 col-end-3" />
      {isEditing ? (
        <div className="mt-15 mb-2 col-start-3 col-end-13 flex flex-col justify-start gap-1 p-5">
          <form className="lg:px-28 flex flex-col gap-9" onSubmit={handleSave}>
            <div className="grid grid-cols-2 lg:gap-8 gap-0 lg:mx-0 mx-2">
              <div className="columns-1">
                <label htmlFor="firstName">First Name:</label>
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
              <div className="columns-1">
                <label htmlFor="lastName">Last Name:</label>
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

            <div className="grid grid-cols-2 lg:gap-8 gap-0 lg:mx-0 mx-2">
              <div className="columns-1">
                <label htmlFor="birthDate">Birth Date:</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
                  value={formValues.birthDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="columns-1">
                <label htmlFor="gender">Gender:</label>
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

            <div className="grid grid-cols-2 lg:gap-8 gap-0 lg:mx-0 mx-2">
              <div className="columns-1">
                <label htmlFor="nationality">Nationality:</label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
                  value={formValues.nationality}
                  onChange={handleInputChange}
                />
              </div>
              <div className="columns-1">
                <label htmlFor="ethnicity">Ethnicity:</label>
                <input
                  type="text"
                  id="ethnicity"
                  name="ethnicity"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
                  value={formValues.ethnicity}
                  onChange={handleInputChange}
                />
              </div>
              
              <input
                type="text"
                id="applicantId"
                name="applicantId"
                className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
                value={formValues.applicantId}
                onChange={handleInputChange}
                style={{ display: "none" }}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="lg:mb-7 mb-5 bg-[#067CEB] text-primary-foreground lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="ml-[10px] lg:mb-7 mb-5 bg-[#067CEB] text-primary-foreground lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mt-15 mb-2 col-start-3 col-end-13 flex flex-col justify-start gap-1 p-5">
          <div className="lg:px-28 flex flex-col gap-12">
            <div className="grid grid-cols-2 lg:gap-8 gap-0 lg:mx-0 mx-2">
              <div className="columns-1">
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
                  value={profileData?.firstName || ""}
                  readOnly
                />
              </div>
              <div className="columns-1">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
                  value={profileData?.lastName || ""}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-2 lg:gap-8 gap-0 lg:mx-0 mx-2">
              <div className="columns-1">
                <label htmlFor="birthDate">Birth Date:</label>
                <input
                  type="text"
                  id="birthDate"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
                  value={profileData?.birthDate?.split("T")[0] || ""}
                  readOnly
                />
              </div>
              <div className="columns-1">
                <label htmlFor="gender">Gender:</label>
                <input
                  type="text"
                  id="gender"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
                  value={profileData?.gender || ""}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-2 lg:gap-8 gap-0 lg:mx-0 mx-2">
              <div className="columns-1">
                <label htmlFor="nationality">Nationality:</label>
                <input
                  type="text"
                  id="nationality"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
                  value={profileData?.nationality || ""}
                  readOnly
                />
              </div>
              <div className="columns-1">
                <label htmlFor="ethnicity">Ethnicity:</label>
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
              <button
                type="button"
                onClick={handleEdit}
                className="lg:mb-7 mb-5 bg-[#067CEB] text-primary-foreground lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base"
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={handleExportPDF}
                className="ml-[10px] lg:mb-7 mb-5 bg-[#067CEB] text-primary-foreground lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Information;
