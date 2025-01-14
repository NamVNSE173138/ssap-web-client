import { Button } from "@/components/ui/button";
import * as Tabs from "@radix-ui/react-tabs";

const AuthSection = (_props: any) => {
  return (
    <Tabs.Content value="password" className="pt-4">
      <h2 className="text-3xl text-black font-bold mb-6">Password & Authentication</h2>
      <form className="space-y-6">
        <div className="max-w-5xl mx-auto p-6 bg-[rgba(255,255,255,0.75)] shadow-lg rounded-md">

          {/* Old Password */}
          <div>
            <label htmlFor="oldPassword" className="block text-gray-700 font-medium">
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              placeholder="Enter old password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* New Password and Confirm Password - Flex layout */}
          <div className="flex space-x-6">

            {/* New Password */}
            <div className="flex-1 mt-5">
              <label htmlFor="password" className="block text-gray-700 font-medium">
                New Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter new password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex-1 mt-5">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <Button className="bg-[#1eb2a6] text-white px-4 py-2 rounded hover:bg-[#51b8af]">
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Tabs.Content>
  );
};

export default AuthSection;
