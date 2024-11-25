import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { formatDate } from "@/lib/date-formatter";
import { useSelector } from "react-redux";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

type ApprovalItem = {
  id: number;
  applicantName: string;
  scholarshipName: string;
  university: string;
  appliedDate: string;
  status: "Submitted" | "Approved" | "Rejected";
  details: string;
};

const ApprovalList = () => {
  const user = useSelector((state: any) => state.token.user);
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [applications, setApplications] = useState<ApprovalItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchApplicationReview = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/experts/${user.id}/assigned-applications`
      );

      if (response.data.statusCode === 200) {
        const rawApplications = response.data.data;

        const detailedApplications = await Promise.all(
          rawApplications.map(async (app: any) => {
            const applicantResponse = await axios.get(
              `${BASE_URL}/api/accounts/${app.applicantId}`
            );
            const scholarshipResponse = await axios.get(
              `${BASE_URL}/api/scholarship-programs/${app.scholarshipProgramId}`
            );

            return {
              ...app,
              applicantName: applicantResponse.data.username,
              scholarshipName: scholarshipResponse.data.data.name,
              university: scholarshipResponse.data.data.university.name,
              details: scholarshipResponse.data.data.description,
            };
          })
        );

        setApplications(detailedApplications);
      } else {
        setError("Failed to fetch scholarship programs");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationReview();
  }, [user.id]);

  const handleRowClick = (item: ApprovalItem) => {
    setSelectedItem(item);
  };

  const handleApprove = async (id: number) => {
    try {
      await axios.put(`${BASE_URL}/api/applications/${id}`, {
        status: "Approved",
      });
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "Approved" } : app
        )
      );
    } catch (error) {
      console.error("Failed to approve application:", error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await axios.put(`${BASE_URL}/api/applications/${id}`, {
        status: "Rejected",
      });
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "Rejected" } : app
        )
      );
    } catch (error) {
      console.error("Failed to reject application:", error);
    }
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.scholarshipName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Approval List</h1>
      <input
        type="text"
        placeholder="Search by applicant, scholarship, or university..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
      />
      {loading ? (
        <div className="flex justify-center items-center">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="w-full text-left bg-white border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Applicant
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Scholarship Name
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  University
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Applied On
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(item)}
                >
                  <td className="p-4 text-sm text-gray-800">
                    {item.applicantName}
                  </td>
                  <td className="p-4 text-sm text-gray-800">
                    {item.scholarshipName}
                  </td>
                  <td className="p-4 text-sm text-gray-800">
                    {item.university}
                  </td>
                  <td className="p-4 text-sm text-gray-800">
                    {formatDate(item.appliedDate)}
                  </td>
                  <td
                    className={`p-4 text-sm font-medium ${
                      item.status === "Approved"
                        ? "text-green-600"
                        : item.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {item.status}
                  </td>
                  <td className="p-4 text-sm text-gray-800">
                    {item.status === "Submitted" ? (
                      <div className="flex space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(item.id);
                          }}
                          className="text-green-600 hover:text-green-800"
                          title="Approve"
                        >
                          <CheckIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(item.id);
                          }}
                          className="text-red-600 hover:text-red-800"
                          title="Reject"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">
                        {item.status === "Approved" ? "Approved" : "Rejected"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Dialog.Root
        open={!!selectedItem}
        onOpenChange={() => setSelectedItem(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
            {selectedItem && (
              <div>
                <Dialog.Title className="text-xl font-bold">
                  {selectedItem.scholarshipName}
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-gray-600">
                  {selectedItem.details}
                </Dialog.Description>
                <p className="mt-4">
                  <strong>Applicant:</strong> {selectedItem.applicantName}
                </p>
                <p>
                  <strong>University:</strong> {selectedItem.university}
                </p>
                <p>
                  <strong>Applied On:</strong>{" "}
                  {formatDate(selectedItem.appliedDate)}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`${
                      selectedItem.status === "Approved"
                        ? "text-green-600"
                        : selectedItem.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {selectedItem.status}
                  </span>
                </p>
                <div className="mt-6 flex justify-end">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      Close
                    </button>
                  </Dialog.Close>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default ApprovalList;
