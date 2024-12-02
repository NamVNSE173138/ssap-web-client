import { Button } from "@/components/ui/button";
import { formatOnlyDate } from "@/lib/date-formatter";
import * as Avatar from "@radix-ui/react-avatar";
import * as Separator from "@radix-ui/react-separator";
import * as Tabs from "@radix-ui/react-tabs";

const ProfileSection = (props: any) => {
  const {
    profile,
    handleAvatarChange,
    handleInputChange,
    handleListChange,
    handleAddField,
    handleRemoveField,
    isEditing,
    handleSaveClick,
    handleEditClick,
    handleExportPDF,
  } = props;

  return (
    <Tabs.Content value="profile" className="pt-4">
      <div className="profile-tab-container space-y-8">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar.Root className="inline-flex h-24 w-24 select-none items-center justify-center overflow-hidden rounded-full bg-gray-100 ">
                  <img
                    src={profile.avatarUrl}
                    alt="User Avatar"
                    className="w-40 h-40 rounded-full border-2 border-gray-300 object-cover"
                  />

                  {isEditing && (
                    <label
                      htmlFor="avatar"
                      className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600"
                    >
                      <input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      ✎
                    </label>
                  )}
                </Avatar.Root>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                      className="border rounded p-1 mb-3"
                    />
                  ) : (
                    profile.firstName
                  )}{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                      className="border rounded p-1 mb-3"
                    />
                  ) : (
                    profile.lastName
                  )}{" "}
                </h1>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleInputChange}
                    className="border rounded p-1"
                  />
                ) : (
                  <p className="text-gray-500">{profile.username}</p>
                )}
              </div>{" "}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                {
                  label: "Email",
                  name: "email",
                  value: profile.email,
                  type: "text",
                  editable: false,
                },
                {
                  label: "Phone",
                  name: "phone",
                  value: profile.phone,
                  type: "text",
                  editable: true,
                },
                {
                  label: "Address",
                  name: "address",
                  value: profile.address,
                  type: "text",
                  editable: true,
                },
                {
                  label: "Gender",
                  name: "gender",
                  value: profile.gender,
                  type: "select",
                  options: ["Male", "Female", "Other"],
                  editable: true,
                },
                {
                  label: "Birthdate",
                  name: "birthdate",
                  value: profile.birthdate,
                  type: "date",
                  editable: true,
                },
                {
                  label: "Nationality",
                  name: "nationality",
                  value: profile.nationality,
                  type: "text",
                  editable: true,
                },
                {
                  label: "Ethnicity",
                  name: "ethnicity",
                  value: profile.ethnicity,
                  type: "text",
                  editable: true,
                },
                {
                  label: "Major",
                  name: "major",
                  value: profile.major,
                  type: "text",
                  editable: true,
                },
                {
                  label: "Current School",
                  name: "school",
                  value: profile.school,
                  type: "text",
                  editable: true,
                },
                {
                  label: "GPA",
                  name: "gpa",
                  value: profile.gpa,
                  type: "number",
                  editable: true,
                },
              ].map(({ label, name, value, type, editable, options }) => (
                <div key={name}>
                  <h2 className="text-sm font-medium text-gray-500">{label}</h2>
                  {isEditing && editable ? (
                    type === "select" ? (
                      <select
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border rounded p-1"
                      >
                        {options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        name={name}
                        defaultValue={
                          type === "date"
                            ? new Date(value).toISOString().split("T")[0]
                            : value
                        }
                        value={value}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border rounded p-1"
                      />
                    )
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {value !== null
                        ? type === "date"
                          ? formatOnlyDate(value)
                          : value
                        : "N/A"}
                    </p>
                  )}
                </div>
              ))}{" "}
            </div>
          </div>

          <Separator.Root className="bg-gray-200 h-px w-full" />

          <Tabs.Root defaultValue="skill" className="w-full">
            <Tabs.List
              className="flex border-b border-gray-200"
              aria-label="Applicant information tabs"
            >
              <Tabs.Trigger
                value="skill"
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300"
              >
                Skill
              </Tabs.Trigger>

              <Tabs.Trigger
                value="experience"
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300"
              >
                Experience
              </Tabs.Trigger>

              <Tabs.Trigger
                value="achievement"
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300"
              >
                Achievement
              </Tabs.Trigger>

              <Tabs.Trigger
                value="certificate"
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300"
              >
                Certificate
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="skill" className="py-4">
              <h3 className="text-lg font-medium text-gray-900">Skills</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-500">
                {profile.skills.map((skill: any, index: any) => (
                  <li key={index} className="flex items-center gap-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) =>
                          handleListChange("skills", index, e.target.value)
                        }
                        className="border rounded p-1 flex-1 mb-3"
                      />
                    ) : (
                      skill
                    )}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveField("skills", index)}
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}{" "}
              </ul>
              {isEditing && (
                <button
                  onClick={() => handleAddField("skills")}
                  className="mt-2 text-blue-500 hover:underline"
                >
                  Add Skill
                </button>
              )}
            </Tabs.Content>

            <Tabs.Content value="experience" className="py-4">
              <h3 className="text-lg font-medium text-gray-900">Experience</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-500">
                {profile.experience.map((exp: any, index: any) => (
                  <li key={index} className="flex items-center gap-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={exp}
                        onChange={(e) =>
                          handleListChange("experience", index, e.target.value)
                        }
                        className="border rounded p-1 flex-1 mb-3"
                      />
                    ) : (
                      exp
                    )}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveField("experience", index)}
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {isEditing && (
                <button
                  onClick={() => handleAddField("experience")}
                  className="mt-2 text-blue-500 hover:underline"
                >
                  Add Experience
                </button>
              )}{" "}
            </Tabs.Content>

            <Tabs.Content value="achievement" className="py-4">
              <h3 className="text-lg font-medium text-gray-900">
                Achievements
              </h3>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-500">
                {profile.achievements.map((achievement: any, index: any) => (
                  <li key={index} className="flex items-center gap-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) =>
                          props.handleListChange(
                            "achievements",
                            index,
                            e.target.value,
                          )
                        }
                        className="border rounded p-1 flex-1 mb-3"
                      />
                    ) : (
                      achievement
                    )}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveField("achievements", index)}
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {isEditing && (
                <button
                  onClick={() => handleAddField("achievements")}
                  className="mt-2 text-blue-500 hover:underline"
                >
                  Add Achievement
                </button>
              )}{" "}
            </Tabs.Content>

            <Tabs.Content value="certificate" className="py-4">
              <h3 className="text-lg font-medium text-gray-900">
                Certificates
              </h3>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-500">
                {profile.certificates.map((certificate: any, index: any) => (
                  <li key={index} className="flex items-center gap-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={certificate}
                        onChange={(e) =>
                          handleListChange(
                            "certificates",
                            index,
                            e.target.value,
                          )
                        }
                        className="border rounded p-1 flex-1 mb-3"
                      />
                    ) : (
                      certificate
                    )}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveField("certificates", index)}
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {isEditing && (
                <button
                  onClick={() => handleAddField("certificates")}
                  className="mt-2 text-blue-500 hover:underline"
                >
                  Add Certificate
                </button>
              )}{" "}
            </Tabs.Content>
          </Tabs.Root>
        </div>

        <div className="flex justify-end gap-4">
          {isEditing ? (
            <>
              <Button
                onClick={handleSaveClick}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Save Changes
              </Button>
            </>
          ) : (
            <div className="flex gap-4 mt-4">
              <Button
                onClick={handleEditClick}
                className="bg-blue-500 text-white p-2 rounded w-full h-full"
              >
                Edit Profile
              </Button>

              <Button
                onClick={handleExportPDF}
                className="bg-green-500 text-white p-2 rounded w-full h-full"
              >
                Export PDF
              </Button>
            </div>
          )}
        </div>
      </div>{" "}
    </Tabs.Content>
  );
};

export default ProfileSection;
