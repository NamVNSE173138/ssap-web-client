import { useEffect, useState } from "react";
import { Alert, Spin, message, } from "antd";
import { useParams } from "react-router-dom";
import {
  getAccountById,
  updateAccount,
} from "@/services/ApiServices/accountService";
import { Sidebar } from "@/components/AccountInfo";
import { GoPencil } from "react-icons/go";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const AccountInfo = () => {
  const user = useSelector((state: RootState) => state.token.user);
  const [profileData, setProfileData] = useState<any>(null);
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
    try {
      await updateAccount({ ...formValues, Id: profileData.id });
      message.success("Profile updated successfully!");
      setProfileData({ ...profileData, ...formValues });
      setIsEditing(false);
    } catch (error) {
      message.error("Failed to update profile.");
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
        <div className="col-start-3 col-end-13 flex flex-col justify-start gap-1 p-5 ">
          <form
            className="lg:px-28 flex flex-col gap-9 "
            onSubmit={handleSave}
          >
            <div className="flex justify-start items-center gap-8">
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  name="avatarUrl"
                  className="hidden"
                />
                <img
                  src={profileData?.avatarUrl || "https://via.placeholder.com/150"}
                  alt="avatar"
                  className="rounded-full lg:w-32 w-24 ml-7 lg:ml-0"
                />
                <div className="bg-[#FFB142] rounded-full w-fit p-1 absolute lg:right-2 right-0 lg:bottom-4 bottom-0">
                  <GoPencil size={24} color="white" />
                </div>
              </label>
              <div className="flex flex-col gap-2">
                <p className="text-xl font-semibold">{profileData?.username}</p>
                <p className="text-sm lg:text-base">
                  {user?.role}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:gap-8 gap-0 lg:mx-0 mx-2">
              <div className="columns-1">
                <label htmlFor="username">Username:</label>
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
              <div className="columns-1">
                <label htmlFor="email">Email:</label>
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
            <div className="grid grid-cols-2 lg:gap-8 gap-0 lg:mx-0 mx-2">
              <div className="columns-1">
                <label htmlFor="phoneNumber">Phone number:</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
                  value={formValues.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="columns-1">
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
                  value={formValues.address}
                  onChange={handleInputChange}
                />
              </div>
              {/*<div className="columns-1">
    <label htmlFor="password">Password:</label>
    <input
      type="password"
      id="password"
      className="lg:w-full lg:h-15 h-9 w-[95%] lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl cursor-not-allowed"
      value={formValues.hashedPassword || ""}
      readOnly
    />
  </div>*/}
              {/*<div className="columns-1">
    <label htmlFor="gender">Gender:</label>
    <select
      id="gender"
      name="gender"
      className="lg:w-full lg:h-15 h-9 w-[95%] lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
      value={formValues.gender}
      onChange={handleInputChange}
      required
    >
      <option value="">Select your gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Others">Others</option>
    </select>
  </div>*/}
            </div>
            <div className="lg:mx-0 mx-2">
              <div>

              </div>
            </div>


            <div className="flex justify-center ">
              <button
                type="submit"
                className="lg:mb-7 mb-5 bg-[#067CEB] text-primary-foreground lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className=" ml-[10px] lg:mb-7 mb-5 bg-[#067CEB] text-primary-foreground lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="col-start-3 col-end-13 flex flex-col justify-start gap-1 p-5 ">
          <form className="lg:px-28 flex flex-col gap-12">
            <div className="flex justify-start items-center gap-8">
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  //name="avatarUrl"
                  className="hidden"
                />
                <img
                  src={profileData?.avatarUrl || "https://via.placeholder.com/150"}
                  alt="avatar"
                  className="rounded-full lg:w-32 w-24 ml-7 lg:ml-0"
                />
                <div className="bg-[#FFB142] rounded-full w-fit p-1 absolute lg:right-2 right-0 lg:bottom-4 bottom-0">
                  <GoPencil size={24} color="white" />
                </div>
              </label>
              <div className="flex flex-col gap-2">
                <p className="text-xl font-semibold">{profileData?.username}</p>
                <p className="text-sm lg:text-base">
                  {user?.role}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:gap-8 gap-0 lg:mx-0 mx-2">
              <div className="columns-1">
                <label
                  htmlFor="username"
                  className="{(accInfoStyle.label.large, accInfoStyle.label.small)}"
                >
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
                  value={profileData?.username || ""}
                  readOnly
                />
              </div>
              <div className="columns-1">
                <label
                  htmlFor="email"
                  className="{(accInfoStyle.label.large, accInfoStyle.label.small)}"
                >
                  Email:
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
            <div className="grid grid-cols-2 lg:gap-8 gap-0 lg:mx-0 mx-2">
              <div className="columns-1">
                <label
                  htmlFor="phoneNumber"
                  className="{(accInfoStyle.label.large, accInfoStyle.label.small)}"
                >
                  Phone number:
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl"
                  value={profileData?.phoneNumber || ""}
                  readOnly
                />
              </div>
              <div className="columns-1">
                <label
                  htmlFor="address"
                  className="{(accInfoStyle.label.large, accInfoStyle.label.small)}"
                >
                  Address:
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

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleEdit}
                className="lg:mb-7 mb-5 bg-[#067CEB] text-primary-foreground lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base"
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
