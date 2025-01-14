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
import { Button, Paper, Tab, Tabs } from "@mui/material";
import {
  FaSpinner,
  FaUserTie,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import { getRequestsByApplicantId } from "@/services/ApiServices/requestService";
import { getAllAccounts } from "@/services/ApiServices/accountService";
import { IoIosEye } from "react-icons/io";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US");
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
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "#fafafa",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* List Header */}
        <div
          style={{
            display: "flex",
            fontWeight: "bold",
            backgroundColor: "#f1f1f1",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <div style={{ flex: "0.5", marginLeft: "20px" }}>No.</div>
          <div style={{ flex: "2" }}>Service Name</div>
          <div style={{ flex: "1.5" }}>Request Date</div>
          <div style={{ flex: "1.5" }}>Action</div>
        </div>

        {/* Provider Requests List */}
        {providerRequests.map((request, index) => (
          <div
            key={request.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
              backgroundColor: "#ffffff",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
              marginBottom: "10px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0px 4px 12px rgba(0, 0, 0, 0.2)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            {/* No */}
            <div style={{ flex: "0.5", color: "#333", marginLeft: "20px" }}>
              {index + 1}
            </div>

            {/* Service Name */}
            <div style={{ flex: "2", color: "#333", fontWeight: "500" }}>
              <Link
                to={`/services-history/services/${request.requestDetails[0].serviceId}`}
                style={{
                  color: "#1e88e5",
                  textDecoration: "none",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1565c0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1e88e5")}
              >
                {request.service.name}
              </Link>
            </div>

            {/* Request Date */}
            <div style={{ flex: "1.5", color: "#555", fontWeight: "500" }}>
              {formatDate(request.requestDate)}
            </div>

            {/* Action */}
            <div style={{ flex: "1.5" }}>
              <Button
                onClick={() =>
                  (window.location.href = `/services-history/request/${request.id}`)
                }
                style={{
                  backgroundColor: "#1e88e5",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: "5px",
                  fontWeight: "500",
                  display: "inline-flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1565c0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1e88e5")
                }
              >
                <IoIosEye style={{ marginRight: "8px" }} />
                View Request
              </Button>
            </div>
          </div>
        ))}
      </Paper>
    );
  };

  const renderProviders = () => (
    <div className="space-y-6 w-3/4">
      {providers.map((provider) => (
        <div
          key={provider.id}
          className="bg-white border rounded-lg shadow-md overflow-hidden "
        >
          <div
            className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-400 to-blue-400 text-white font-semibold cursor-pointer"
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
            <div className="p-4 ">{renderProviderServices(provider.id)}</div>
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
          onChange={(_e, newValue) => setActiveTab(newValue)}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Pending Requests" />
          <Tab label="Finished Requests" />
        </Tabs>
      </div>

      <div className="mt-6 p-6 bg-white rounded-lg shadow-md flex justify-center">
        {renderProviders()}
      </div>
    </div>
  );
};

export default RequestHistory;
