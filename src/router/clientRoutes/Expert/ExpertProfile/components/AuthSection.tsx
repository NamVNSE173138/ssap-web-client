import { Button } from "@/components/ui/button";
import * as Tabs from "@radix-ui/react-tabs";

const AuthSection = (_props: any) => {
  return (
    <Tabs.Content value="password" className="pt-4">
      <h2 className="text-3xl text-black font-bold mb-6">Password & Authentication</h2>
      <form className="space-y-6">
        {/* Password */}
        <div>
          <label
            htmlFor="oldPassword"
            className="block text-gray-700 font-medium"
          >
            Old Password
          </label>
          <input
            type="password"
            id="oldPassword"
            placeholder="Enter old password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
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
        <div>
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
          />
        </div>

        {/* Save Button */}
        <div>
          <Button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none">
            Save Changes
          </Button>
        </div>
      </form>
    </Tabs.Content>
  );
};

export default AuthSection;
