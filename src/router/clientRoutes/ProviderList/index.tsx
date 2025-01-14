import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import {
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import RouteNames from "@/constants/routeNames";
import { getAllAccounts } from "@/services/ApiServices/accountService";
import { Button, List, Paper } from "@mui/material";
import { Breadcrumb } from "antd";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import { useEffect, useState } from "react";
import { FaUsers, FaSpinner } from "react-icons/fa";
import { IoIosEye } from "react-icons/io";
import { Link } from "react-router-dom";

const ProviderList = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const response = await getAllAccounts();
        const providerAccounts = response.filter(
          (account: any) => account.roleName === "Provider"
        );
        setProviders(providerAccounts);
      } catch (err) {
        setError("Failed to fetch provider data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const renderProviders = () => (
    <div className="space-y-6 bg-gradient-to-r from-blue-100 to-grey-300 p-8 rounded-lg shadow-2xl">
      <div className="flex items-center justify-center mb-6">
        <h2 className="flex items-center text-3xl font-semibold text-gray-800 bg-gradient-to-r from-blue-400 to-blue-400 p-4 rounded-lg shadow-xl">
          <FaUsers className="mr-3 text-white text-2xl" />
          <span className="text-white">Providers List</span>
        </h2>
      </div>

      <Paper
        elevation={3}
        style={{
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "#fafafa",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Table Header */}
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
          <div style={{ flex: "1", marginLeft: "20px" }}>No.</div>
          <div style={{ flex: "2" }}>Provider Name</div>
          <div style={{ flex: "2" }}>Email</div>
          <div style={{ flex: "2" }}>Phone</div>
          <div style={{ flex: "2" }}>Action</div>
        </div>

        {/* Providers List */}
        {providers.map((provider, index) => (
          <div
            key={provider.id}
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
            <div
              style={{
                flex: "1",
                marginLeft: "20px",
                color: "#333",
                fontWeight: "500",
              }}
            >
              {index + 1}
            </div>
            <div style={{ flex: "2", fontWeight: "500", color: "#333" }}>
              {provider.username}
            </div>
            <div style={{ flex: "2", color: "#555" }}>
              <span
                style={{
                  color: "#0099cc",
                  marginRight: "8px",
                  fontWeight: "500",
                }}
              >
                📧
              </span>
              {provider.email || "Not Available"}
            </div>
            <div style={{ flex: "2", color: "#555" }}>
              <span
                style={{
                  color: "#00cc66",
                  marginRight: "8px",
                  fontWeight: "500",
                }}
              >
                📞
              </span>
              {provider.phoneNumber || "Not Available"}
            </div>
            <div style={{ flex: "2" }}>
              <Button
                onClick={() =>
                  (window.location.href =
                    RouteNames.PROVIDER_INFORMATION.replace(":id", provider.id))
                }
                style={{
                  backgroundColor: "#1e88e5",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: "5px",
                  fontWeight: "500",
                  textDecoration: "none",
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
                View Services
              </Button>
            </div>
          </div>
        ))}
      </Paper>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-6">{error}</p>;
  }

  return (
    <div>
      <div className="relative">
        <ScholarshipProgramBackground />
        <div className="absolute top-0 bg-black/40 left-0 w-full h-full flex flex-col justify-between items-start p-16 z-10">
          <Breadcrumb>
            <BreadcrumbList className="text-white">
              <BreadcrumbItem>
                <Link to="/" className="md:text-xl text-lg">
                  Home
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link to="/services" className="md:text-xl text-lg">
                  Services
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <p className="text-white md:text-xl text-lg">Providers List</p>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="p-10 bg-white rounded-lg shadow-lg">
        <List style={{ maxHeight: 400, overflow: "auto", padding: 2 }}>
          {renderProviders()}
        </List>
      </div>
    </div>
  );
};

export default ProviderList;
