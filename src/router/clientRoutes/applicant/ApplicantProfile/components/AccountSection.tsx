import * as Tabs from "@radix-ui/react-tabs";

const AccountSection = (props: any) => {
  return (
    <Tabs.Content value="account" className="pt-4">
      <h2 className="text-xl font-bold mb-6">My Account</h2>
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src="https://via.placeholder.com/150"
            alt="User Avatar"
            className="w-40 h-40 rounded-full border-2 border-gray-300 object-cover"
          />
          <div className="mt-4 text-center text-gray-600 font-semibold">
            Applicant
          </div>
        </div>

        {/* Account Details */}
        <div className="flex-grow">
          <div className="space-y-6">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium"
              >
                Username
              </label>
              <div className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed">
                JohnDoe
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium"
              >
                Email
              </label>
              <div className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed">
                johndoe@example.com
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-gray-700 font-medium"
              >
                Phone Number
              </label>
              <div className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed">
                +1 (555) 123-4567
              </div>
            </div>
            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-gray-700 font-medium"
              >
                Address
              </label>
              <div className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed">
                Ho Chi Minh, Vietnam
              </div>
            </div>
          </div>
          <div className="mt-8 flex space-x-4">
            {/* Edit Profile Button */}
            <button
              onClick={() => {
                props.setActiveTab("profile");
                props.setIsEditing(true);
              }}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              Edit Profile
            </button>

            {/* Change Password Button */}
            <button
              onClick={() => props.setActiveTab("password")}
              className="px-6 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </Tabs.Content>
  );
};

export default AccountSection;