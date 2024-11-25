import * as Collapsible from "@radix-ui/react-collapsible";
import { FaFilePdf } from "react-icons/fa";
import * as Tabs from "@radix-ui/react-tabs";

const AccountSection = (props: any) => {
  const {
    providerData,
    getStatusBadge,
    isEditing,
    setIsEditing,
    previewUrl,
    setPreviewUrl,
  } = props;

  return (
    <Tabs.Content value="account" className="pt-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Provider Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
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
              <input type="file" className="hidden" />✎
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
            {
              label: "Username",
              value: providerData.username,
              editable: true,
            },
            { label: "Email", value: providerData.email, editable: true },
            {
              label: "Phone Number",
              value: providerData.phoneNumber,
              editable: true,
            },
            { label: "Address", value: providerData.address, editable: true },
            {
              label: "Organization Name",
              value: providerData.organizationName,
              editable: true,
            },
            {
              label: "Contact Person Name",
              value: providerData.contactPersonName,
              editable: true,
            },
            {
              label: "Account Status",
              value: (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                    providerData.accountStatus,
                  )}`}
                >
                  {providerData.accountStatus}
                </span>
              ),
              editable: false,
            },
          ].map((field, idx) => (
            <div key={idx}>
              <p className="font-medium text-gray-600">{field.label}:</p>
              <p className="mt-1">
                {isEditing && field.editable ? (
                  <input
                    type="text"
                    defaultValue={field.value}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-gray-800">{field.value}</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Collapsible.Root>
          <Collapsible.Trigger className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer flex items-center">
            <FaFilePdf className="mr-2" />
            Your Documents
            {providerData.documents.length > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded-full">
                {providerData.documents.length}
              </span>
            )}{" "}
          </Collapsible.Trigger>
          <Collapsible.Content>
            <div className="mt-6 p-6 bg-gray-100 rounded-lg border border-gray-200">
              {providerData.documents.length > 0 ? (
                <ul className="space-y-4">
                  {providerData.documents.map((doc, index) => (
                    <li key={index}>
                      <div className="flex items-center justify-between">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          {doc.name}
                        </a>
                        <button
                          onClick={() => setPreviewUrl(doc.url)}
                          className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                        >
                          Preview
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No documents available.</p>
              )}
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>

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
