import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import { BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import RouteNames from "@/constants/routeNames";
import { getAllAccounts } from "@/services/ApiServices/accountService";
import { List } from "@mui/material";
import { Breadcrumb } from "antd";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import React, { useEffect, useState } from "react";
import { FaUsers, FaEye, FaPhoneAlt, FaEnvelope, FaSpinner } from "react-icons/fa"; // Added icons for better UX
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

  <div className="flex justify-center">
    <div className="space-y-4 w-4/5">
      {/* Table Header */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-400 to-blue-400 text-white font-semibold rounded-lg shadow-md">
        <p className="w-1/12 text-center">No.</p>
        <p className="w-3/12">Provider Name</p>
        <p className="w-4/12">Email</p>
        <p className="w-2/12">Phone</p>
        <p className="w-2/12">Action</p>
      </div>

      {/* Providers List */}
      {providers.map((provider, index) => (
        <div
          key={provider.id}
          className="flex justify-between items-center p-4 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition duration-300"
        >
          <p className="w-1/12 text-center text-gray-800">{index + 1}</p>
          <p className="w-3/12 text-gray-800 font-medium">{provider.username}</p>
          <p className="w-4/12 text-gray-800">
            <FaEnvelope className="inline mr-2 text-cyan-500" />
            {provider.email || "Not Available"}
          </p>
          <p className="w-2/12 text-gray-800">
            <FaPhoneAlt className="inline mr-2 text-green-500" />
            {provider.phoneNumber || "Not Available"}
          </p>
          <Link
            to={RouteNames.PROVIDER_INFORMATION.replace(":id", provider.id)}
            className="w-2/12 text-blue-600 font-medium underline hover:text-blue-800 transition"
          >
            <FaEye className="mr-2 inline text-xl text-blue-500" />
            View Services
          </Link>
        </div>
      ))}
    </div>
  </div>
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
                <Link to="/" className="md:text-xl text-lg">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link to="/services" className="md:text-xl text-lg">Services</Link>
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
