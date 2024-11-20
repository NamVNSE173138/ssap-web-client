import { useEffect, useState } from "react";
import { Alert, Spin, message, } from "antd";
import {
    changeAvatar,
  getAccountById,
  updateAccount,
} from "@/services/ApiServices/accountService";
import { Sidebar } from "@/components/AccountInfo";
import { GoPencil } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { log } from "console";
import { setUser } from "@/reducers/tokenSlice";
import { AiOutlineCamera } from "react-icons/ai";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const AccountInfo = () => {
  const user = useSelector((state: RootState) => state.token.user);
  const avatar = useSelector((state: RootState) => state.token.avatar);
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    hashedPassword: "",
    address: "",
    status: "",
    loginWithGoogle: 0,
    roleId: "",
    avatarUrl: "",
  });


  useEffect(() => {

    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const data = await getAccountById(Number(user?.id));
        if (isMounted) {
          setProfileData(data);
          setFormValues({
            username: data.username,
            phoneNumber: data.phoneNumber,
            email: data.email,
            hashedPassword: data.hashedPassword,
            address: data.address,
            status: data.status,
            roleId: data.roleId,
            loginWithGoogle: data.loginWithGoogle,
            avatarUrl: data.avatarUrl,
          });
        }
      } catch (error) {
        if (isMounted) {
          setError("Failed to load profile data.");
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
  }, [user?.id]);

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
    try 
    {
      setProfileData({ ...profileData, ...formValues });
      //console.log(profileData);
      if (avatarFile) {
        const formData = new FormData();
        formData.append("File", avatarFile);
        setAvatarFile(null);
        setLoading(true);
        await changeAvatar(profileData.id, formData);
      }
      var updated = await getAccountById(profileData.id);
      dispatch(setUser({ ...user, avatar: updated.avatarUrl }));
      await updateAccount({ ...formValues, avatarUrl: updated.avatarUrl, id: profileData.id });
      setLoading(false);
      message.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to update profile.");
    }
  };

  const handleAvatarChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
        const fileUrl = URL.createObjectURL(file);
        setFormValues({ ...formValues, avatarUrl: fileUrl });
        setProfileData({ ...profileData, avatarUrl: fileUrl });
        setAvatarFile(file);
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
<div className="grid grid-cols-12 h-full gap-4">
  <Sidebar className="col-start-1 col-end-3" />

  {isEditing ? (
    <div className="col-start-3 col-end-13 flex flex-col justify-start gap-4 p-5 bg-white shadow-lg rounded-xl">
      <form className="lg:px-28 flex flex-col gap-9" onSubmit={handleSave}>
        {/* Avatar and Edit Button */}
        <div className="flex justify-start items-center gap-8">
          <label className="relative cursor-pointer">
            <input
              type="file"
              name="avatarUrl"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <img
              src={profileData?.avatarUrl || "https://via.placeholder.com/150"}
              alt="avatar"
              className="rounded-full lg:w-32 lg:h-32 w-24 h-24 ml-7 lg:ml-0"
            />
            <div className="bg-[#FFB142] rounded-full w-fit p-1 absolute lg:right-2 right-0 lg:bottom-4 bottom-0">
              <AiOutlineCamera size={24} color="white" />
            </div>
          </label>
          <div className="flex flex-col gap-2">
            <p className="text-xl font-semibold text-gray-800">{profileData?.username}</p>
            <p className="text-sm lg:text-base text-gray-500">{user?.role}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 lg:gap-8 gap-4 mx-2">
          <div>
            <label htmlFor="username" className="flex items-center gap-2 text-gray-700">
              <GoPencil size={18} /> Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
              value={formValues.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="flex items-center gap-2 text-gray-700">
              <FaEnvelope size={18} /> Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="lg:w-full lg:h-15 h-9 w-[95%] lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
              value={formValues.email}
              onChange={handleInputChange}
              disabled
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:gap-8 gap-4 mx-2">
          <div>
            <label htmlFor="phoneNumber" className="flex items-center gap-2 text-gray-700">
              <FaPhoneAlt size={18} /> Phone number:
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
              value={formValues.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="address" className="flex items-center gap-2 text-gray-700">
              <FaMapMarkerAlt size={18} /> Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
              value={formValues.address}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            type="submit"
            className="lg:mb-7 mb-5 bg-[#067CEB] text-white lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base shadow-lg hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="ml-[10px] lg:mb-7 mb-5 bg-[#FF5C5C] text-white lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base shadow-lg hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  ) : (
    <div className="col-start-3 col-end-13 flex flex-col justify-start gap-4 p-5 bg-white shadow-lg rounded-xl">
      <form className="lg:px-28 flex flex-col gap-9">
        {/* Avatar and View Mode */}
        <div className="flex justify-start items-center gap-8">
          <label className="relative cursor-pointer">
            <input type="file" className="hidden" disabled />
            <img
              src={profileData?.avatarUrl || "https://via.placeholder.com/150"}
              alt="avatar"
              className="rounded-full lg:w-32 lg:h-32 w-24 h-24 ml-7 lg:ml-0"
            />
          </label>
          <div className="flex flex-col gap-2">
            <p className="text-xl font-semibold text-gray-800">{profileData?.username}</p>
            <p className="text-sm lg:text-base text-gray-500">{user?.role}</p>
          </div>
        </div>

        {/* Display Read-Only Information */}
        <div className="grid grid-cols-2 lg:gap-8 gap-4 mx-2">
          <div>
            <label htmlFor="username" className="flex items-center gap-2 text-gray-700">
              <GoPencil size={18} /> Username:
            </label>
            <input
              type="text"
              id="username"
              className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
              value={profileData?.username || ""}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="email" className="flex items-center gap-2 text-gray-700">
              <FaEnvelope size={18} /> Email:
            </label>
            <input
              type="email"
              id="email"
              className="lg:w-full lg:h-15 h-9 w-[95%] lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
              value={profileData?.email || ""}
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:gap-8 gap-4 mx-2">
          <div>
            <label htmlFor="phoneNumber" className="flex items-center gap-2 text-gray-700">
              <FaPhoneAlt size={18} /> Phone number:
            </label>
            <input
              type="text"
              id="phoneNumber"
              className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
              value={profileData?.phoneNumber || ""}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="address" className="flex items-center gap-2 text-gray-700">
              <FaMapMarkerAlt size={18} /> Address:
            </label>
            <input
              type="text"
              id="address"
              className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
              value={profileData?.address || ""}
              readOnly
            />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={handleEdit}
            className="bg-[#067CEB] text-white lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base shadow-lg hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      </form>
    </div>
  )}
</div>

  );
};

export default AccountInfo;
