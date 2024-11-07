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
import { IoIosAddCircleOutline } from "react-icons/io";
import AddServiceModal from "../Activity/AddServiceModal";
import RouteNames from "@/constants/routeNames";

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
          setTotalPages(response.data.data.totalPages);
        }
      } else {
        setData([]);
        setTotalPages(1);
      }
    } catch (err) {
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, user]);

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

  return (
    <div>
      <div className="relative">
        <ScholarshipProgramBackground />
        <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-between items-start p-[70px] z-10">
          <Breadcrumb>
            <BreadcrumbList className="text-white">
              <BreadcrumbItem>
                <Link to="/" className="md:text-xl text-lg">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <p className="text-white md:text-xl text-lg">Services</p>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex justify-between p-4">
        {user?.role === "PROVIDER" && (
          <button
            onClick={() => setIsServiceModalOpen(true)}
            className="flex justify-start items-center hover:bg-blue-400 hover:text-white transition-all duration-200 gap-4 px-4 py-2 bg-white rounded-lg active:scale-95"
          >
            <IoIosAddCircleOutline className="text-3xl text-blue-500" />
            <p className="text-xl text-blue-600">Add Service</p>
          </button>
        )}

        {user?.role === "APPLICANT" && (
          <button
            onClick={handleViewHistory}
            className="flex justify-start items-center hover:bg-blue-400 hover:text-white transition-all duration-200 gap-4 px-4 py-2 bg-white rounded-lg active:scale-95"
          >
            <IoIosAddCircleOutline className="text-3xl text-blue-500" />
            <p className="text-xl text-blue-600">View History</p>
          </button>
        )}
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-10">
        {loading ? (
          <ServiceSkeleton />
        ) : error ? (
          <p>{error}</p>
        ) : data.length === 0 ? (
          <p>No services found</p>
        ) : (
          data.map((service) => <li key={service.id}><ServiceCard {...service} /></li>)
        )}
      </ul>

      <div className="flex justify-between p-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      <AddServiceModal
        isOpen={isServiceModalOpen}
        setIsOpen={setIsServiceModalOpen}
        fetchServices={() => { setCurrentPage(1); fetchData(); }}
      />
    </div>
  );
};

export default Service;
