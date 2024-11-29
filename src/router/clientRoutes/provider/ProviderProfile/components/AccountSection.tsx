import * as Collapsible from "@radix-ui/react-collapsible";
import * as Tabs from "@radix-ui/react-tabs";

const AccountSection = (props: any) => {
  const {
    providerData,
    getStatusBadge,
    isEditing,
    setIsEditing,
    handleSaveClick,
    handleAvatarChange,
    handleDocumentChange,
    handleInputChange,
    handleAddField,
    handleRemoveField,
    handleListChange,
    previewUrl,
    setPreviewUrl,
  } = props;

  return (
    <Tabs.Content value="account" className="pt-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Provider Profile</h1>
        <button
          onClick={(e) => {
            if (isEditing) {
              handleSaveClick(e);
            }
            setIsEditing(!isEditing);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative">
          <img
            src={providerData.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
          />
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600">
              <input
                type="file"
                className="hidden"
                onChange={handleAvatarChange}
              />
              ✎
            </label>
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
            { label: "Phone Number", name: "phone", editable: true },
            { label: "Address", name: "address", editable: true },
            {
              label: "Organization Name",
              name: "organizationName",
              editable: true,
            },
            {
              label: "Contact Person Name",
              name: "contactPersonName",
              editable: true,
            },
            {
              label: "Your Subscription",
              name: "subscriptionName",
              editable: false,
            },
            {
              label: "Account Status",
              name: "status",
              editable: false,
              value: (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                    providerData.status,
                  )}`}
                >
                  {providerData.status}
                </span>
              ),
            },
          ].map((field, idx) => (
            <div key={idx}>
              <p className="font-medium text-gray-600">{field.label}:</p>
              <p className="mt-1">
                {isEditing && field.editable ? (
                  <input
                    type="text"
                    name={field.name}
                    defaultValue={providerData[field.name]}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-gray-800">
                    {field.value || providerData[field.name]}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Collapsible.Root>
        <Collapsible.Trigger className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer">
          Your Documents
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div className="mt-6 p-6 bg-gray-100 rounded-lg border border-gray-200">
            <div className="grid grid-cols-[2fr_2fr_1fr_auto] gap-4 font-semibold text-gray-600 border-b pb-2 mb-4">
              <div>Document Name</div>
              <div>Type</div>
              <div>File</div>
              <div>Actions</div>
            </div>
            <ul className="space-y-4">
              {providerData.providerDocuments.map((doc, index) => (
                <li
                  key={index}
                  className="grid grid-cols-[2fr_2fr_1fr_auto] gap-4 items-center"
                >
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        placeholder="File Name"
                        value={doc.name}
                        onChange={(e) =>
                          handleListChange(index, "name", e.target.value)
                        }
                        className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={doc.type}
                        onChange={(e) =>
                          handleListChange(index, "type", e.target.value)
                        }
                        className="p-2 border rounded-md"
                      >
                        <option value="">Select Type</option>
                        <option value="Organizational Document">
                          Organizational Document
                        </option>
                        <option value="Proof of Funds">Proof of Funds</option>
                        <option value="Other">Other</option>
                      </select>
                      <input
                        type="file"
                        onChange={(e) =>
                          e.target.files &&
                          handleDocumentChange(index, e.target.files?.[0])
                        }
                        className="w-full"
                      />
                      <button
                        onClick={() => handleRemoveField(index)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="font-medium">{doc.name}</div>
                      <div>{doc.type}</div>
                      <div>
                        <button
                          onClick={() => setPreviewUrl(doc.fileUrl)}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                        >
                          Preview
                        </button>
                      </div>
                      <div>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          Download
                        </a>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
            {isEditing && (
              <button
                onClick={handleAddField}
                className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
              >
                Add Document
              </button>
            )}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>

      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b bg-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                Document Preview
              </h2>
              <button
                onClick={() => setPreviewUrl(null)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                ✖
              </button>
            </div>
            <div className="p-6">
              <iframe
                src={previewUrl}
                width="100%"
                height="600px"
                className="border border-gray-300 rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </Tabs.Content>
  );
};

export default AccountSection;
