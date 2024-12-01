import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Tabs from "@radix-ui/react-tabs";

const AccountSection = (props: any) => {
  const {
    majors,
    expertData,
    getStatusBadge,
    isEditing,
    setIsEditing,
    handleSaveClick,
    handleAvatarChange,
    handleInputChange,
  } = props;

  return (
    <Tabs.Content value="account" className="pt-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Funder Profile</h1>
        <Button
          onClick={(e) => {
            if (isEditing) {
              handleSaveClick(e);
            }
            setIsEditing(!isEditing);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative">
          <img
            src={expertData.avatarUrl || "https://github.com/shadcn.png"}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
          />
          {isEditing && (
            <Label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600">
              <Input
                type="file"
                className="hidden"
                onChange={handleAvatarChange}
              />
              ✎
            </Label>
          )}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "Username", name: "username", editable: true },
            { label: "Email", name: "email", editable: false },
            { label: "Phone Number", name: "phoneNumber", editable: true },
            { label: "Address", name: "address", editable: true },
            {
              label: "Name",
              name: "name",
              editable: true,
            },
            {
              label: "Description",
              name: "description",
              editable: true,
            },
            {
              label: "Major",
              name: "major",
              editable: true,
            },

            {
              label: "Account Status",
              name: "status",
              editable: false,
              value: (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                    expertData.status,
                  )}`}
                >
                  {expertData.status}
                </span>
              ),
            },
          ].map((field, idx) => (
            <div key={idx}>
              <p className="font-medium text-gray-600">{field.label}:</p>
              <p className="mt-1">
                {isEditing && field.editable ? (
                  field.name === "major" ? ( // Handle "Major" field separately
                    <select
                      name="major"
                      value={expertData.major} // Bind to current major
                      onChange={handleInputChange} // Handle selection changes
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>
                        Select a major
                      </option>
                      {majors.map((major: string, idx: number) => (
                        <option key={idx} value={major}>
                          {major}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={field.name}
                      defaultValue={expertData[field.name]}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )
                ) : (
                  <span className="text-gray-800">
                    {field.value || expertData[field.name]}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Tabs.Content>
  );
};

export default AccountSection;
