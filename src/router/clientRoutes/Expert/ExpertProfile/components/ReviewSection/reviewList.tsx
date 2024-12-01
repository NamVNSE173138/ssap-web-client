// import React from "react";
// import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
// import { formatDate } from "@/lib/date-formatter";
// import { Button } from "@/components/ui/button";

// type ApprovalItem = {
//   id: number;
//   applicantName: string;
//   scholarshipName: string;
//   university: string;
//   appliedDate: string;
//   status: "Reviewing" | "Approved" | "Rejected";
//   details: string;
// };

// type ApprovalTableProps = {
//   applications: ApprovalItem[];
//   onRowClick: (item: ApprovalItem) => void;
//   onApprove: (id: number) => void;
//   onReject: (id: number) => void;
// };

// const ReviewList: React.FC<ApprovalTableProps> = ({
//   applications,
//   onRowClick,
//   onApprove,
//   onReject,
// }) => {
//   return (
//     <div className="overflow-auto bg-white shadow rounded-lg">
//       <table className="w-full table-auto border-collapse">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-4 text-left text-sm font-semibold text-gray-600">
//               Applicant
//             </th>
//             <th className="p-4 text-left text-sm font-semibold text-gray-600">
//               Scholarship Name
//             </th>
//             <th className="p-4 text-left text-sm font-semibold text-gray-600">
//               University
//             </th>
//             <th className="p-4 text-left text-sm font-semibold text-gray-600">
//               Applied On
//             </th>
//             <th className="p-4 text-left text-sm font-semibold text-gray-600">
//               Status
//             </th>
//             <th className="p-4 text-left text-sm font-semibold text-gray-600">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {applications.map((item) => (
//             <tr
//               key={item.id}
//               className="hover:bg-gray-50 cursor-pointer"
//               onClick={() => onRowClick(item)}
//             >
//               <td className="p-4 text-sm text-gray-800">{item.applicantName}</td>
//               <td className="p-4 text-sm text-gray-800">{item.scholarshipName}</td>
//               <td className="p-4 text-sm text-gray-800">{item.university}</td>
//               <td className="p-4 text-sm text-gray-800">{formatDate(item.appliedDate)}</td>
//               <td
//                 className={`p-4 text-sm font-medium ${
//                   item.status === "Approved"
//                     ? "text-green-600"
//                     : item.status === "Rejected"
//                     ? "text-red-600"
//                     : "text-yellow-600"
//                 }`}
//               >
//                 {item.status}
//               </td>
//               <td className="p-4 text-sm">
//                 {item.status === "Reviewing" ? (
//                   <div className="flex space-x-2">
//                     <Button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onApprove(item.id);
//                       }}
//                       className="text-green-600 hover:text-green-800"
//                       title="Approve"
//                     >
//                       <CheckIcon className="w-5 h-5" />
//                     </Button>
//                     <Button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onReject(item.id);
//                       }}
//                       className="text-red-600 hover:text-red-800"
//                       title="Reject"
//                     >
//                       <XMarkIcon className="w-5 h-5" />
//                     </Button>
//                   </div>
//                 ) : (
//                   <span className="text-gray-500">
//                     {item.status === "Approved" ? "Approved" : "Rejected"}
//                   </span>
//                 )}
                
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ReviewList;














import React from "react";
import { formatDate } from "@/lib/date-formatter";
import { Button } from "@/components/ui/button";

type ApprovalItem = {
  id: number;
  applicantName: string;
  scholarshipName: string;
  university: string;
  appliedDate: string;
  status: "Reviewing" | "Approved" | "Rejected";
  details: string;
  documentUrl?: string; // Added to store document URL
  applicationReviews?: { id: number }[];
};

type ApprovalTableProps = {
  applications: ApprovalItem[];
  onRowClick: (item: ApprovalItem) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
};

const ReviewList: React.FC<ApprovalTableProps> = ({
  applications,
  onRowClick,
  onApprove,
  onReject,
}) => {
  return (
    <div className="overflow-auto bg-white shadow rounded-lg">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-gray-600">
              Applicant
            </th>
            <th className="p-4 text-left text-sm font-semibold text-gray-600">
              Scholarship Name
            </th>
            <th className="p-4 text-left text-sm font-semibold text-gray-600">
              University
            </th>
            <th className="p-4 text-left text-sm font-semibold text-gray-600">
              Applied On
            </th>
            <th className="p-4 text-left text-sm font-semibold text-gray-600">
              Status
            </th>
            <th className="p-4 text-left text-sm font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick(item)}
              className="hover:bg-gray-50"
            >
              <td className="p-4 text-sm text-gray-800">
                {item.applicantName}
              </td>
              <td className="p-4 text-sm text-gray-800">
                {item.scholarshipName}
              </td>
              <td className="p-4 text-sm text-gray-800">{item.university}</td>
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
              <td className="p-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Button
                    className="w-full h-full bg-green-500 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onApprove(item.id);
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    className="w-full h-full bg-red-500 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReject(item.id);
                    }}
                  >
                    Reject
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewList;












