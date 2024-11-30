// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
// import { Link } from "react-router-dom";
// import { List, Tabs, Tab } from "@mui/material";
// import { FaTasks, FaCalendarAlt, FaChevronRight, FaSearch, FaInfoCircle, FaUserTie, FaChevronUp, FaSpinner, FaChevronDown, FaListOl, FaClipboardList, FaHashtag, FaClock, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa"; // Added icons for search and info
// import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
// import { getRequestsByApplicantId } from "@/services/ApiServices/requestService";
// import ServiceDetails from "../ServiceDetail";
// import ApplicantRequestInfo from "../ApplicantRequestInformation";
// import { getAllAccounts } from "@/services/ApiServices/accountService";

// const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB");
// };

// const RequestHistory = () => {
//     const user = useSelector((state: RootState) => state.token.user);
//     const [applicants, setApplicants] = useState({
//         pending: [],
//         finished: [],
//     });
//     const [activeTab, setActiveTab] = useState<number>(0);
//     const [openServiceDetail, setOpenServiceDetail] = useState({ open: "", id: 0 });
//     const [providers, setProviders] = useState<any[]>([]);
//     const [requests, setRequests] = useState<any[]>([]);
//     const [expandedProvider, setExpandedProvider] = useState<number | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const [tabValue, setTabValue] = useState(0);

//     const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//         setTabValue(newValue);
//     };

//     const fetchRequestsAndProviders = async () => {
//         setLoading(true);
//         try {
//             if (!user) return;

//             const [accountsResponse, requestsResponse] = await Promise.all([
//                 getAllAccounts(),
//                 getRequestsByApplicantId(parseInt(user.id)),
//             ]);

//             const providerAccounts = accountsResponse.filter(
//                 (account: any) => account.roleName === "Provider"
//             );
//             setProviders(providerAccounts);

//             if (requestsResponse.statusCode === 200) {
//                 setRequests(requestsResponse.data);
//                 console.log(accountsResponse)
//                 console.log(requestsResponse)
//             } else {
//                 setRequests([]);
//             }
//         } catch (error) {
//             console.error("Failed to fetch data", error);
//             setError("Failed to fetch data.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchRequestsAndProviders();
//     }, [user]);

//     const toggleProvider = (id: number) => {
//         setExpandedProvider(expandedProvider === id ? null : id);
//     };

//     const filteredRequests = tabValue === 0
//         ? requests.filter(request => request.status === "Pending")
//         : requests.filter(request => request.status === "Finished");

//     const renderProviderServices = (providerId: number) => {
//         const providerRequests = filteredRequests.filter(
//             (req) => req.service?.providerId === providerId
//         );

//         if (providerRequests.length === 0) {
//             return (
//                 <p className="text-gray-500 italic text-center">
//                     No request to this Provider's Service
//                 </p>
//             );
//         }

//         return providerRequests.map((request, index) => (
//             <div className="flex justify-center" key={request.id}>

//                 <p className="w-1/12 text-center text-gray-800 flex items-center justify-center">
//                     <FaHashtag className="mr-1 text-cyan-500" /> {index + 1}
//                 </p>

//                 <Link
//                     to={`/services-history/services/${request.requestDetails[0].serviceId}`}
//                     className="w-4/12 ml-5 text-blue-600 font-medium underline hover:text-blue-800 transition flex items-center"
//                 >
//                     <FaChevronRight className="mr-2 text-cyan-500" /> {request.service.name}
//                 </Link>

//                 <p className="w-4/12 text-center text-gray-600 flex items-center justify-center">
//                     <FaClock className="mr-2 text-green-500" />
//                     {formatDate(request.requestDate)}
//                 </p>

//                 <Link
//                     to={`/services-history/request/${request.id}`}
//                     className="w-4/12 text-right text-blue-600 font-medium underline hover:text-blue-800 transition flex items-center justify-end"
//                 >
//                     <FaInfoCircle className="mr-2 text-indigo-500" />
//                     View Request
//                 </Link>
//             </div>
//         ));
//     };

//     const renderProviders = () => (
//         <div className="space-y-6 bg-gradient-to-r from-blue-100 to-grey-300 p-8 rounded-lg shadow-2xl">
//             <div className="space-y-4">
//                 {providers.map((provider) => (
//                     <div
//                         key={provider.id}
//                         className="bg-white border-2 border-gray-200 rounded-lg shadow-md overflow-hidden transition-all transform hover:scale-105 hover:shadow-xl"
//                     >
//                         <div
//                             className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-400 to-blue-200 text-white font-semibold cursor-pointer hover:shadow-lg transition-shadow"
//                             onClick={() => toggleProvider(provider.id)}
//                         >
//                             <div className="flex items-center space-x-3">
//                                 <FaUserTie className="text-2xl text-white" />
//                                 <span className="text-lg font-medium">{provider.username}</span>
//                             </div>
//                             {expandedProvider === provider.id ? (
//                                 <FaChevronUp className="text-xl text-white" />
//                             ) : (
//                                 <FaChevronDown className="text-xl text-white" />
//                             )}
//                         </div>

//                         {expandedProvider === provider.id && (
//                             <div className="p-4 space-y-3 bg-gray-50 rounded-b-lg transition-all transform">
//                                 <div className="text-lg font-medium text-gray-700">
//                                     {renderProviderServices(provider.id)}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center p-10">
//                 <FaSpinner className="animate-spin text-3xl text-blue-500" />
//             </div>
//         );
//     }

//     if (error) {
//         return <p className="text-center text-red-500 mt-6">{error}</p>;
//     }

//     return (
//         <div>
//             <div className="relative">
//                 <ScholarshipProgramBackground />
//                 <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-between items-start p-[40px] z-10">
//                     <Breadcrumb>
//                         <BreadcrumbList className="text-black">
//                             <BreadcrumbItem>
//                                 <Link to="/" className="md:text-xl text-lg">
//                                     Home
//                                 </Link>
//                             </BreadcrumbItem>
//                             <BreadcrumbSeparator />
//                             <BreadcrumbItem>
//                                 <Link to="/services" className=" text-[#000] md:text-xl font-medium text-lg">
//                                     Services
//                                 </Link>
//                             </BreadcrumbItem>
//                             <BreadcrumbSeparator />
//                             <BreadcrumbItem>
//                                 <p className="text-[#000] md:text-xl text-lg font-semibold">History</p>
//                             </BreadcrumbItem>
//                         </BreadcrumbList>
//                     </Breadcrumb>
//                 </div>
//             </div>

//             <Tabs
//                 value={tabValue}
//                 onChange={handleTabChange}
//                 aria-label="Request Status"
//                 centered
//                 indicatorColor="primary"
//                 textColor="primary"
//                 className="mb-6 mt-7"
//                 sx={{
//                     "& .MuiTabs-indicator": {
//                         backgroundColor: "#4F8EF7",
//                         borderRadius: "16px",
//                         height: "4px",
//                     },
//                 }}
//             >
//                 <Tab
//                     label={
//                         <div className="flex items-center space-x-2">
//                             <FaClipboardList className="text-xl text-blue-500" />
//                             <span className="text-lg font-semibold">Pending</span>
//                         </div>
//                     }
//                     sx={{
//                         textTransform: "none",
//                         fontWeight: "bold",
//                         fontSize: "1.1rem",
//                         color: "#1D4ED8",
//                         borderRadius: "10px",
//                         padding: "10px 20px",
//                         '&:hover': { backgroundColor: '#E0F7FF' },
//                         '&.Mui-selected': {
//                             backgroundColor: '#A7C7FF',
//                             color: '#1D4ED8',
//                             transform: "scale(1.1)",
//                         },
//                     }}
//                 />
//                 <Tab
//                     label={
//                         <div className="flex items-center space-x-2">
//                             <FaCheckCircle className="text-xl text-green-500" />
//                             <span className="text-lg font-semibold">Finished</span>
//                         </div>
//                     }
//                     sx={{
//                         textTransform: "none",
//                         fontWeight: "bold",
//                         fontSize: "1.1rem",
//                         color: "#10B981",
//                         borderRadius: "10px",
//                         padding: "10px 20px",
//                         '&:hover': { backgroundColor: '#D1FAE5' },
//                         '&.Mui-selected': {
//                             backgroundColor: '#A7F3D0',
//                             color: '#10B981',
//                             transform: "scale(1.1)",
//                         },
//                     }}
//                 />
//             </Tabs>

//             <div className="p-10 bg-white rounded-lg shadow-xl">
//                 {renderProviders()}
//             </div>
//         </div>
//     );
// };

// export default RequestHistory;

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Tab, Tabs } from "@mui/material";
import {
  FaSpinner,
  FaUserTie,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaHashtag,
  FaChevronCircleRight,
} from "react-icons/fa";
import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import { getRequestsByApplicantId } from "@/services/ApiServices/requestService";
import { getAllAccounts } from "@/services/ApiServices/accountService";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

const RequestHistory = () => {
  const user = useSelector((state: RootState) => state.token.user);
  const [providers, setProviders] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedProvider, setExpandedProvider] = useState<number | null>(null);

  const fetchRequestsAndProviders = async () => {
    setLoading(true);
    try {
      if (!user) return;

      const [accountsResponse, requestsResponse] = await Promise.all([
        getAllAccounts(),
        getRequestsByApplicantId(parseInt(user.id)),
      ]);

      const providerAccounts = accountsResponse.filter(
        (account: any) => account.roleName === "Provider"
      );
      setProviders(providerAccounts);

      setRequests(requestsResponse?.data || []);
    } catch (error) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestsAndProviders();
  }, [user]);

  const toggleProvider = (id: number) => {
    setExpandedProvider(expandedProvider === id ? null : id);
  };

  const filteredRequests = requests.filter((request) =>
    activeTab === 0
      ? request.status === "Pending"
      : request.status === "Finished"
  );

  const renderProviderServices = (providerId: number) => {
    const providerRequests = filteredRequests.filter(
      (req) => req.service?.providerId === providerId
    );

    if (!providerRequests.length) {
      return (
        <p className="text-gray-400 italic">
          No requests for this provider's services.
        </p>
      );
    }

    return (
      <ul className="space-y-3">
        {providerRequests.map((request, index) => (
          <li
            key={request.id}
            className="bg-gray-100 p-4 rounded-lg flex justify-between items-center shadow-sm"
          >
            <p className="w-1/12 text-center text-gray-800 flex items-center justify-center">
              <FaHashtag className="mr-1 text-cyan-500" /> {index + 1}
            </p>
            <Link
              to={`/services-history/services/${request.requestDetails[0].serviceId}`}
              className="w-4/12 ml-5 text-blue-600 font-medium underline hover:text-blue-800 transition flex items-center"
            >
              <FaChevronCircleRight className="mr-2 text-cyan-500" />{" "}
              {request.service.name}
            </Link>

            <p className="w-4/12 text-center text-gray-600 flex items-center justify-center">
              <FaClock className="mr-2 text-green-500" />
              {formatDate(request.requestDate)}
            </p>

            <Link
              to={`/services-history/request/${request.id}`}
              className="w-4/12 text-right text-blue-600 font-medium underline hover:text-blue-800 transition flex items-center justify-end"
            >
              <FaInfoCircle className="mr-2 text-indigo-500" />
              View Request
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const renderProviders = () => (
    <div className="space-y-6">
      {providers.map((provider) => (
        <div
          key={provider.id}
          className="bg-white border rounded-lg shadow-md overflow-hidden"
        >
          <div
            className="flex justify-between items-center p-4 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-semibold cursor-pointer"
            onClick={() => toggleProvider(provider.id)}
          >
            <div className="flex items-center space-x-3">
              <FaUserTie className="text-xl" />
              <span>{provider.username}</span>
            </div>
            {expandedProvider === provider.id ? (
              <FaChevronUp className="text-xl" />
            ) : (
              <FaChevronDown className="text-xl" />
            )}
          </div>
          {expandedProvider === provider.id && (
            <div className="p-4">{renderProviderServices(provider.id)}</div>
          )}
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div>
      <div className="relative">
        <ScholarshipProgramBackground />
        <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-between items-start p-[40px] z-10">
          <Breadcrumb>
            <BreadcrumbList className="text-black">
              <BreadcrumbItem>
                <Link to="/" className="md:text-xl text-lg">
                  Home
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link
                  to="/services"
                  className="text-black md:text-xl font-medium text-lg"
                >
                  Services
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <p className="text-black md:text-xl text-lg font-semibold">
                  History
                </p>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="mt-6">
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Pending Requests" />
          <Tab label="Finished Requests" />
        </Tabs>
      </div>

      <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        {renderProviders()}
      </div>
    </div>
  );
};

export default RequestHistory;
