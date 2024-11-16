import { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ServiceSkeleton from "./ServiceSkeleton";
import { BASE_URL } from "@/constants/api";
import { ServiceType } from "./data";
import ServiceCard from "@/components/Services/ServiceCard";
import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { IoIosAddCircleOutline, IoIosPaper } from "react-icons/io";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import AddServiceModal from "../Activity/AddServiceModal";
import RouteNames from "@/constants/routeNames";
import { Input } from "@/components/ui/input";
import { getAccountWallet } from "@/services/ApiServices/accountService";
import { Dialog } from "@mui/material";
import RequestFormModal from "../ServiceDetail/applicantRequestForm-dialog";

const Service = () => {
  const user = useSelector((state: RootState) => state.token.user);
  const [data, setData] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 6;
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState<ServiceType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState<boolean>(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/services/paginated`, {
        params: {
          pageIndex: currentPage,
          pageSize: pageSize,
        },
      });
      if (response.data.statusCode === 200) {
        const activeServices = response.data.data.items.filter((service: any) => service.status === "Active");
        if (user?.role === "PROVIDER") {
          const filteredServices = activeServices.filter((service: any) => service.providerId == user.id);
          setData(filteredServices);
          setTotalPages(Math.ceil(filteredServices.length / pageSize));
        } else {
          setData(activeServices);
          setFilteredData(activeServices);
          setTotalPages(response.data.data.totalPages);
        }
      } else {
        setData([]);
        setFilteredData([]);
        setTotalPages(1);
      }
    } catch (err) {
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const checkWallet = async () => {
    try {
      const response = await getAccountWallet(Number(user?.id));
      if (response.statusCode === 200) {
        setIsServiceModalOpen(true);
      }
    } catch (error: any) {
      if (error.response.data.statusCode === 400) {
        setIsWalletDialogOpen(true);
      }
      console.error('Error checking wallet:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, user]);

  useEffect(() => {
    setFilteredData(
      data.filter((service) => service.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, data]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      fetchData();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchData();
    }
  };

  const handleViewHistory = () => {
    navigate(RouteNames.APPLICANT_REQUEST_HISTORY);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleAddServiceClick = () => {
    checkWallet();
  };

  const handleCloseWalletDialog = () => {
    setIsWalletDialogOpen(false);
  };

  const handleNavigateToWallet = () => {
    setIsWalletDialogOpen(false);
    navigate(RouteNames.WALLET);
  };

  const handleRequestForm = () => {
    setIsRequestFormOpen(true);
  };

  return (
    <div>
      {/* Header Section with Background Image */}
      <div className="relative">
        <ScholarshipProgramBackground />
        <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-between items-start p-[70px] z-10">
          <Breadcrumb>
            <BreadcrumbList className="text-white">
              <BreadcrumbItem>
                <Link to="/" className="md:text-xl text-lg font-semibold hover:text-blue-400 transition-colors duration-300">
                  Home
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <p className="text-white md:text-xl text-lg font-semibold">Services</p>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Search and Action Buttons */}
      <div className="flex bg-blue-200 justify-between p-6 items-center">
        <div className="relative w-full max-w-md">
          <Input
            className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
            placeholder="Search for services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IoIosSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 text-xl" />
          {searchTerm && (
            <IoMdClose
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 cursor-pointer text-xl hover:text-red-500 transition-colors"
              onClick={clearSearch}
            />
          )}
        </div>

        {/* Conditional Button based on User Role */}
        {user?.role === "PROVIDER" && (
          <button
            onClick={handleAddServiceClick}
            className="flex justify-start items-center hover:bg-blue-500 hover:text-white transition-all duration-300 gap-4 px-5 py-3 bg-white rounded-xl shadow-md active:scale-95"
          >
            <IoIosAddCircleOutline className="text-3xl text-blue-500" />
            <p className="text-xl text-blue-600">Add Service</p>
          </button>
        )}

        {user?.role === "APPLICANT" && (
          <div className="flex gap-4">
            <button
              onClick={handleViewHistory}
              className="flex justify-start items-center hover:bg-blue-500 hover:text-white transition-all duration-300 gap-4 px-5 py-3 bg-white rounded-xl shadow-md active:scale-95"
            >
              <IoIosAddCircleOutline className="text-3xl text-blue-500" />
              <p className="text-xl text-blue-600">View History</p>
            </button>

            <button
              onClick={handleRequestForm}
              className="flex justify-start items-center hover:bg-blue-500 hover:text-white transition-all duration-300 gap-4 px-5 py-3 bg-white rounded-xl shadow-md active:scale-95"
            >
              <IoIosPaper className="text-3xl text-blue-500" />
              <p className="text-xl text-blue-600">Request Form</p>
            </button>
          </div>
        )}
      </div>

      {/* Services Grid */}
      <ul className="grid grid-cols-1 bg-blue-100 md:grid-cols-2 lg:grid-cols-3 gap-10 p-10">
        {loading ? (
          <ServiceSkeleton />
        ) : error ? (
          <p>{error}</p>
        ) : data.length === 0 ? (
          <p className="text-center text-xl text-gray-500">No services found</p>
        ) : (
          filteredData.map((service) => (
            <li key={service.id}>
              <ServiceCard {...service} />
            </li>
          ))
        )}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-between p-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 disabled:bg-gray-400 transition-all duration-300"
        >
          Previous
        </button>
        <span className="text-lg font-semibold">Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 disabled:bg-gray-400 transition-all duration-300"
        >
          Next
        </button>
      </div>

      {/* Request Form Modal */}
      <RequestFormModal
        isOpen={isRequestFormOpen}
        handleClose={() => setIsRequestFormOpen(false)}
        services={data}
        handleSubmit={()=>{}}
      />

      {/* Add Service Modal */}
      <AddServiceModal
        isOpen={isServiceModalOpen}
        setIsOpen={setIsServiceModalOpen}
        fetchServices={() => { setCurrentPage(1); fetchData(); }}
      />

      {/* Wallet Dialog */}
      <Dialog open={isWalletDialogOpen} onClose={handleCloseWalletDialog}>
        <div className="p-6">
          <h3 className="text-2xl font-semibold">You don't have a wallet yet!</h3>
          <p className="my-4 text-lg text-gray-600">
            You need to create a wallet to add services. Do you want to go to the Wallet page?
          </p>
          <div className="flex justify-end gap-4">
            <button onClick={handleCloseWalletDialog} className="bg-gray-300 px-5 py-2 rounded-full hover:bg-gray-400 transition-all">
              Cancel
            </button>
            <button onClick={handleNavigateToWallet} className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition-all">
              Yes
            </button>
          </div>
        </div>
      </Dialog>
    </div>

  );
};

export default Service;
