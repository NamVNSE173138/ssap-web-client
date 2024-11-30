
// ====================RUNNING=======================

// import { useEffect, useState } from "react";
// import * as Dialog from "@radix-ui/react-dialog";
// import axios from "axios";
// import { BASE_URL } from "@/constants/api";
// import { formatDate } from "@/lib/date-formatter";
// import { useSelector } from "react-redux";
// import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
// import { Sidebar } from "@/components/AccountInfo";

// type ApprovalItem = {
//   id: number;
//   applicantName: string;
//   scholarshipName: string;
//   university: string;
//   appliedDate: string;
//   status: "Submitted" | "Approved" | "Rejected";
//   details: string;
// };

// const ApprovalList = () => {
//   const user = useSelector((state: any) => state.token.user);
//   const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [applications, setApplications] = useState<ApprovalItem[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>("");

//   const fetchApplicationReview = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/api/experts/${user.id}/assigned-applications`
//       );

//       if (response.data.statusCode === 200) {
//         const rawApplications = response.data.data;

//         const detailedApplications = await Promise.all(
//           rawApplications.map(async (app: any) => {
//             const applicantResponse = await axios.get(
//               `${BASE_URL}/api/accounts/${app.applicantId}`
//             );
//             const scholarshipResponse = await axios.get(
//               `${BASE_URL}/api/scholarship-programs/${app.scholarshipProgramId}`
//             );

//             return {
//               ...app,
//               applicantName: applicantResponse.data.username,
//               scholarshipName: scholarshipResponse.data.data.name,
//               university: scholarshipResponse.data.data.university.name,
//               details: scholarshipResponse.data.data.description,
//             };
//           })
//         );

//         setApplications(detailedApplications);
//       } else {
//         setError("Failed to fetch scholarship programs");
//       }
//     } catch (error) {
//       console.error(error);
//       setError("An error occurred while fetching data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchApplicationReview();
//   }, [user.id]);

//   const handleRowClick = (item: ApprovalItem) => {
//     setSelectedItem(item);
//   };

//   const handleApprove = async (id: number) => {
//     try {
//       await axios.put(`${BASE_URL}/api/applications/${id}`, {
//         status: "Approved",
//       });
//       setApplications((prev) =>
//         prev.map((app) =>
//           app.id === id ? { ...app, status: "Approved" } : app
//         )
//       );
//     } catch (error) {
//       console.error("Failed to approve application:", error);
//     }
//   };

//   const handleReject = async (id: number) => {
//     try {
//       await axios.put(`${BASE_URL}/api/applications/${id}`, {
//         status: "Rejected",
//       });
//       setApplications((prev) =>
//         prev.map((app) =>
//           app.id === id ? { ...app, status: "Rejected" } : app
//         )
//       );
//     } catch (error) {
//       console.error("Failed to reject application:", error);
//     }
//   };

//   const filteredApplications = applications.filter(
//     (app) =>
//       app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       app.scholarshipName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       app.university.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="grid grid-cols-12 gap-4 p-4">
//       {/* Sidebar */}
//       <Sidebar className="col-start-1 col-end-3" />
  
//       {/* Main Content */}
//       <div className="col-start-3 col-end-13 space-y-6">
//         <h1 className="text-3xl font-bold text-gray-800">Approval List</h1>
  
//         {/* Search Bar */}
//         <input
//           type="text"
//           placeholder="Search by applicant, scholarship, or university..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
  
//         {/* Error Message */}
//         {error && (
//           <div className="p-4 bg-red-100 text-red-800 rounded-md">
//             {error}
//           </div>
//         )}
  
//         {/* Loading State */}
//         {loading ? (
//           <div className="flex justify-center items-center h-40">
//             <p className="text-lg text-gray-600">Loading...</p>
//           </div>
//         ) : (
//           /* Table */
//           <div className="overflow-auto bg-white shadow rounded-lg">
//             <table className="w-full table-auto border-collapse">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Applicant</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Scholarship Name</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">University</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Applied On</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredApplications.map((item) => (
//                   <tr
//                     key={item.id}
//                     className="hover:bg-gray-50 cursor-pointer"
//                     onClick={() => handleRowClick(item)}
//                   >
//                     <td className="p-4 text-sm text-gray-800">{item.applicantName}</td>
//                     <td className="p-4 text-sm text-gray-800">{item.scholarshipName}</td>
//                     <td className="p-4 text-sm text-gray-800">{item.university}</td>
//                     <td className="p-4 text-sm text-gray-800">{formatDate(item.appliedDate)}</td>
//                     <td
//                       className={`p-4 text-sm font-medium ${
//                         item.status === "Approved"
//                           ? "text-green-600"
//                           : item.status === "Rejected"
//                           ? "text-red-600"
//                           : "text-yellow-600"
//                       }`}
//                     >
//                       {item.status}
//                     </td>
//                     <td className="p-4 text-sm">
//                       {item.status === "Submitted" ? (
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleApprove(item.id);
//                             }}
//                             className="text-green-600 hover:text-green-800"
//                             title="Approve"
//                           >
//                             <CheckIcon className="w-5 h-5" />
//                           </button>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleReject(item.id);
//                             }}
//                             className="text-red-600 hover:text-red-800"
//                             title="Reject"
//                           >
//                             <XMarkIcon className="w-5 h-5" />
//                           </button>
//                         </div>
//                       ) : (
//                         <span className="text-gray-500">
//                           {item.status === "Approved" ? "Approved" : "Rejected"}
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
  
//         {/* Dialog */}
//         <Dialog.Root open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
//           <Dialog.Portal>
//             <Dialog.Overlay className="fixed inset-0 bg-black/50" />
//             <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//               {selectedItem && (
//                 <div>
//                   <Dialog.Title className="text-2xl font-bold text-gray-800">
//                     {selectedItem.scholarshipName}
//                   </Dialog.Title>
//                   <Dialog.Description className="mt-2 text-gray-600">
//                     {selectedItem.details}
//                   </Dialog.Description>
//                   <div className="mt-4 space-y-2">
//                     <p>
//                       <strong>Applicant:</strong> {selectedItem.applicantName}
//                     </p>
//                     <p>
//                       <strong>University:</strong> {selectedItem.university}
//                     </p>
//                     <p>
//                       <strong>Applied On:</strong> {formatDate(selectedItem.appliedDate)}
//                     </p>
//                     <p>
//                       <strong>Status:</strong>{" "}
//                       <span
//                         className={`${
//                           selectedItem.status === "Approved"
//                             ? "text-green-600"
//                             : selectedItem.status === "Rejected"
//                             ? "text-red-600"
//                             : "text-yellow-600"
//                         }`}
//                       >
//                         {selectedItem.status}
//                       </span>
//                     </p>
//                   </div>
//                   <div className="mt-6 flex justify-end">
//                     <Dialog.Close asChild>
//                       <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
//                         Close
//                       </button>
//                     </Dialog.Close>
//                   </div>
//                 </div>
//               )}
//             </Dialog.Content>
//           </Dialog.Portal>
//         </Dialog.Root>
//       </div>
//     </div>
//   );
  
// };

// export default ApprovalList;





// ====================TESTING WITHOUT SCORE=======================


// import { useEffect, useState } from "react";
// import * as Dialog from "@radix-ui/react-dialog";
// import axios from "axios";
// import { BASE_URL } from "@/constants/api";
// import { useSelector } from "react-redux";
// import { Sidebar } from "@/components/AccountInfo";
// import ReviewList from "./reviewList";
// import { formatDate } from "@/lib/date-formatter";

// type ApprovalItem = {
//   id: number;
//   applicantName: string;
//   scholarshipName: string;
//   university: string;
//   appliedDate: string;
//   status: "Reviewing" | "Approved" | "Rejected";
//   details: string;
//   documentUrl?: string; // Added to store document URL
// };

// const ApprovalList = () => {
//   const user = useSelector((state: any) => state.token.user);
//   const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [applications, setApplications] = useState<ApprovalItem[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   const fetchApplicationReview = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/api/experts/${user.id}/assigned-applications`
//       );

//       if (response.data.statusCode === 200) {
//         const rawApplications = response.data.data;

//         const detailedApplications = await Promise.all(
//           rawApplications.map(async (app: any) => {
//             const applicantResponse = await axios.get(
//               `${BASE_URL}/api/accounts/${app.applicantId}`
//             );
//             const scholarshipResponse = await axios.get(
//               `${BASE_URL}/api/scholarship-programs/${app.scholarshipProgramId}`
//             );

//             return {
//               id: app.id,
//               applicantName: applicantResponse.data.username,
//               scholarshipName: scholarshipResponse.data.data.name,
//               university: scholarshipResponse.data.data.university.name,
//               appliedDate: app.appliedDate,
//               status: app.status,
//               details: scholarshipResponse.data.data.description,
//               documentUrl: app.applicationDocuments[0]?.fileUrl, // Get document URL
//             };
//           })
//         );

//         setApplications(detailedApplications);
//       } else {
//         setError("Failed to fetch applications");
//       }
//     } catch (error) {
//       console.error(error);
//       setError("An error occurred while fetching data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchApplicationReview();
//   }, [user.id]);

//   const handleRowClick = (item: ApprovalItem) => {
//     setSelectedItem(item);
//   };

//   const handleApprove = async (id: number) => {
//     try {
//       await axios.put(`${BASE_URL}/api/applications/${id}`, {
//         status: "Approved",
//       });
//       setApplications((prev) =>
//         prev.map((app) =>
//           app.id === id ? { ...app, status: "Approved" } : app
//         )
//       );
//     } catch (error) {
//       console.error("Failed to approve application:", error);
//     }
//   };

//   const handleReject = async (id: number) => {
//     try {
//       await axios.put(`${BASE_URL}/api/applications/${id}`, {
//         status: "Rejected",
//       });
//       setApplications((prev) =>
//         prev.map((app) =>
//           app.id === id ? { ...app, status: "Rejected" } : app
//         )
//       );
//     } catch (error) {
//       console.error("Failed to reject application:", error);
//     }
//   };

//   const filteredApplications = applications.filter(
//     (app) =>
//       app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       app.scholarshipName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       app.university.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="grid grid-cols-12 gap-4 p-4">
//       {/* Sidebar */}
//       <Sidebar className="col-start-1 col-end-3" />

//       {/* Main Content */}
//       <div className="col-start-3 col-end-13 space-y-6">
//         <h1 className="text-3xl font-bold text-gray-800">Approval List</h1>

//         {/* Search Bar */}
//         <input
//           type="text"
//           placeholder="Search by applicant, scholarship, or university..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         {/* Error Message */}
//         {error && (
//           <div className="p-4 bg-red-100 text-red-800 rounded-md">{error}</div>
//         )}

//         {/* Loading State */}
//         {loading ? (
//           <div className="flex justify-center items-center h-40">
//             <p className="text-lg text-gray-600">Loading...</p>
//           </div>
//         ) : (
//           <ReviewList
//             applications={filteredApplications}
//             onRowClick={handleRowClick}
//             onApprove={handleApprove}
//             onReject={handleReject}
//           />
//         )}

//         {/* Dialog */}
//         <Dialog.Root
//           open={!!selectedItem}
//           onOpenChange={() => setSelectedItem(null)}
//         >
//           <Dialog.Portal>
//             <Dialog.Overlay className="fixed inset-0 bg-black/50" />
//             <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//               {selectedItem && (
//                 <div>
//                   <Dialog.Title className="text-2xl font-bold text-gray-800">
//                     {selectedItem.scholarshipName}
//                   </Dialog.Title>
//                   <Dialog.Description className="mt-2 text-gray-600">
//                     {selectedItem.details}
//                   </Dialog.Description>
//                   <div className="mt-4 space-y-2">
//                     <p>
//                       <strong>Applicant:</strong> {selectedItem.applicantName}
//                     </p>
//                     <p>
//                       <strong>University:</strong> {selectedItem.university}
//                     </p>
//                     <p>
//                       <strong>Applied On:</strong>{" "}
//                       {formatDate(selectedItem.appliedDate)}
//                     </p>
//                     <p>
//                       <strong>Status:</strong>{" "}
//                       <span
//                         className={`${
//                           selectedItem.status === "Approved"
//                             ? "text-green-600"
//                             : selectedItem.status === "Rejected"
//                             ? "text-red-600"
//                             : "text-yellow-600"
//                         }`}
//                       >
//                         {selectedItem.status}
//                       </span>
//                     </p>
//                     {selectedItem.documentUrl && (
//                       <p>
//                         <strong>Document:</strong>{" "}
//                         <a
//                           href={selectedItem.documentUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-500 underline"
//                         >
//                           View Document
//                         </a>
//                       </p>
//                     )}
//                   </div>
//                   <div className="mt-6 flex justify-end">
//                     <Dialog.Close asChild>
//                       <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
//                         Close
//                       </button>
//                     </Dialog.Close>
//                   </div>
//                 </div>
//               )}
//             </Dialog.Content>
//           </Dialog.Portal>
//         </Dialog.Root>
//       </div>
//     </div>
//   );
// };

// export default ApprovalList;






// ====================TESTING WITH SCORE=======================






import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { useSelector } from "react-redux";
import { Sidebar } from "@/components/AccountInfo";
import ReviewList from "./reviewList";
import { formatDate } from "@/lib/date-formatter";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ApprovalItem = {
  id: number;
  applicantName: string;
  scholarshipName: string;
  university: string;
  appliedDate: string;
  status: "Reviewing" | "Approved" | "Rejected";
  details: string;
  documentUrl?: string;
  applicationReviews?: { id: number }[]; // Ensure to include applicationReviews for ID
};

const ApprovalList: React.FC = () => {
  const user = useSelector((state: any) => state.token.user);
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<ApprovalItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [score, setScore] = useState<number | string>(""); 
  const [comment, setComment] = useState(""); 
  const [isFirstReview, setIsFirstReview] = useState(true); 

  const fetchApplicationReview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/experts/${user.id}/assigned-applications`
      );
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
            id: app.id,
            applicantName: applicantResponse.data.username,
            scholarshipName: scholarshipResponse.data.data.name,
            university: scholarshipResponse.data.data.university.name,
            appliedDate: app.appliedDate,
            status: app.status,
            details: scholarshipResponse.data.data.description,
            documentUrl: app.applicationDocuments?.[0]?.fileUrl,
            applicationReviews: app.applicationReviews, // Add reviews data
          };
        })
      );

      setApplications(detailedApplications);
    } catch (err) {
      setError("Failed to fetch applications. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationReview();
  }, [user.id]);

  const handleRowClick = (item: ApprovalItem) => {
    setSelectedItem(item);
    setScore(""); // Reset score and comment when opening new item
    setComment("");
  };

  const handleApprove = async (id: number) => {
    try {
      await axios.put(`${BASE_URL}/api/applications/${id}`, { status: "Approved" });
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
      await axios.put(`${BASE_URL}/api/applications/${id}`, { status: "Rejected" });
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "Rejected" } : app
        )
      );
    } catch (error) {
      console.error("Failed to reject application:", error);
    }
  };

  const handleScoreSubmit = async () => {
    if (!selectedItem || score === "") return; // Ensure item and score are valid

    const reviewId = selectedItem.applicationReviews?.[0]?.id;
    if (!reviewId) {
      console.error("Review ID not found.");
      return;
    }
    const numericScore = Number(score);
    try {
      const payload = {
        applicationReviewId: reviewId,
        comment,
        isPassed: numericScore >= 3, // Assuming passing score is 3 or above
        score: Number(score),
        isFirstReview,
      };
      await axios.put(`${BASE_URL}/api/applications/reviews/result`, payload);
      console.log("Review submitted successfully:", payload);

      // Optionally, reset fields or update application status
      setScore("");
      setComment("");
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const filteredApplications = applications.filter((app) =>
    [app.applicantName, app.scholarshipName, app.university]
      .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      <Sidebar className="col-start-1 col-end-3" />

      <div className="col-start-3 col-end-13 space-y-6">
        <h1 className="text-3xl font-bold">Approval List</h1>

        <input
          type="text"
          placeholder="Search by applicant, scholarship, or university..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        {error && <div className="p-4 bg-red-100 text-red-800">{error}</div>}

        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : (
          <ReviewList
            applications={filteredApplications}
            onRowClick={handleRowClick}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}

        <Dialog.Root open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-md">
              {selectedItem && (
                <div>
                  <Dialog.Title className="text-2xl font-bold">
                    {selectedItem.scholarshipName}
                  </Dialog.Title>
                  <Dialog.Description className="mt-2 text-sm text-gray-600">
                    {selectedItem.details}
                  </Dialog.Description>

                  <div className="mt-4">
                    <p>
                      <strong>Applicant:</strong> {selectedItem.applicantName}
                    </p>
                    <p>
                      <strong>University:</strong> {selectedItem.university}
                    </p>
                    <p>
                      <strong>Applied On:</strong>{" "}
                      {formatDate(selectedItem.appliedDate)}
                    </p>
                  </div>

                  {selectedItem.documentUrl && (
                    <a
                      href={selectedItem.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      View Document
                    </a>
                  )}

                  {/* Add form for scoring */}
                  <div className="mt-4">
                    <Label className="block text-sm font-medium text-gray-700">Score</Label>
                    <Input
                      type="number"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      className="w-full h-full p-3 mt-2 border border-gray-300 rounded-lg"
                      placeholder="Enter score (1-5)"
                      min={1}
                      max={5}
                    />

                    <Label className="block text-sm font-medium text-gray-700 mt-4">Comment</Label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                      placeholder="Enter comment"
                    />

                    <Button
                      onClick={handleScoreSubmit}
                      className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg"
                    >
                      Submit Review
                    </Button>
                  </div>
                </div>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};

export default ApprovalList;
