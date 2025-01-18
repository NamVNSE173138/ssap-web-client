import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/services/ApiServices/accountService";
import { RootState } from "@/store/store";
import * as Tabs from "@radix-ui/react-tabs";
import { notification } from "antd";
import { ChangeEvent, useState } from "react";
import { useSelector } from "react-redux";

const AuthSection = () => {
  const user = useSelector((state: RootState) => state.token.user);
  const [form, setForm] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    const payload = {
      email: user?.email,
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    };

    try {
      await changePassword(Number(user?.id), payload);
      notification.success({
        message: "Success",
        description: "Change password successfully",
      });
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error",
        description: "Change password failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<any>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  if (isLoading) return <Spinner />;

  return (
    <Tabs.Content value="password" className="pt-4">
      <h2 className="text-3xl text-black font-bold mb-6">Change Password</h2>
      <form className="space-y-6">
        <div className="max-w-6xl mx-auto p-6 border-2 border-gray-200 rounded-md">
          {/* Old Password */}
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-gray-700 font-medium"
            >
              Old Password
            </label>
            <input
              name="oldPassword"
              type="password"
              id="oldPassword"
              placeholder="Enter old password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          {/* New Password and Confirm Password - Flex layout */}
          <div className="flex space-x-6">
            {/* New Password */}
            <div className="flex-1 mt-5">
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-medium"
              >
                New Password
              </label>
              <input
                name="newPassword"
                type="password"
                id="password"
                placeholder="Enter new password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
            </div>

            {/* Confirm Password */}
            <div className="flex-1 mt-5">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <Button
              onClick={handleSubmit}
              className="bg-[#1eb2a6] text-white px-4 py-2 rounded hover:bg-[#51b8af]"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Tabs.Content>
  );
};

export default AuthSection;
