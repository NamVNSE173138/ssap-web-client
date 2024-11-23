import React, { useState } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { Upload } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import Sidebar from "./components/Sidebar"; // Assuming Sidebar is already created
import { useToast } from "@/components/ui/use-toast";

interface ApplicantProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  gender: string; // Added gender field
  avatarUrl: string;
}

export default function ApplicantProfile() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<ApplicantProfile>({
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    dateOfBirth: "1990-01-01",
    address: "123 Main St, Anytown, USA",
    gender: "Male", // Added gender default value
    avatarUrl: "/placeholder.svg?height=100&width=100",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile((prev) => ({
        ...prev,
        avatarUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Profile updated",
        description: "Your profile was successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar Navigation */}
      <Sidebar className="w-1/4" />

      <div className="w-3/4 p-8">
        {/* Tabs for Sections */}
        <Tabs.Root defaultValue="account" orientation="vertical">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Applicant Profile</h1>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <Tabs.List className="mb-6 flex space-x-4">
            <Tabs.Trigger
              value="account"
              className="px-4 py-2 rounded-md text-lg font-semibold hover:bg-gray-200 cursor-pointer"
            >
              Account
            </Tabs.Trigger>
            <Tabs.Trigger
              value="profile"
              className="px-4 py-2 rounded-md text-lg font-semibold hover:bg-gray-200 cursor-pointer"
            >
              Profile
            </Tabs.Trigger>
          </Tabs.List>

          {/* Tab Panels */}
          <Tabs.TabsContent value="account">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar.Root className="w-24 h-24 rounded-full overflow-hidden">
                  <Avatar.Image
                    src={profile.avatarUrl}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-full h-full object-cover"
                  />
                  <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-xl font-semibold">
                    {profile.firstName[0]}
                    {profile.lastName[0]}
                  </Avatar.Fallback>
                </Avatar.Root>
                <label
                  htmlFor="avatar"
                  className="cursor-pointer text-sm text-blue-500 hover:text-blue-700 flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Change Avatar</span>
                  <input
                    type="file"
                    id="avatar"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <input
                    type="text"
                    name="gender"
                    value={profile.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Email and Phone Number */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </Tabs.TabsContent>

          {/* Profile Tab Content */}
          <Tabs.TabsContent value="profile">
            <div className="space-y-6">
              {/* Additional Profile Information (Skills, Achievements, etc.) */}
              {/* You can add more sections here if needed */}
            </div>
          </Tabs.TabsContent>
        </Tabs.Root>
      </div>
    </div>
  );
}
