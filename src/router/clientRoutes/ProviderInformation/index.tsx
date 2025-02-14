import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import Spinner from "@/components/Spinner";
import {
  getAccountById,
  getAccountWallet,
} from "@/services/ApiServices/accountService";
import { getServicesByProvider } from "@/services/ApiServices/serviceService";
import ServiceCard from "@/components/Services/ServiceCard";
import {
  FaExclamationTriangle,
  FaSadTear,
  FaServicestack,
  FaStar,
  FaTasks,
  FaTimes,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import { IoIosPaper } from "react-icons/io";
import RequestFormModal from "../ServiceDetail/applicantRequestForm-dialog";
import RouteNames from "@/constants/routeNames";
import { useSelector } from "react-redux";
import { Dialog } from "@mui/material";

const ITEMS_PER_PAGE = 8;

const ProviderInformation = () => {
  const { id } = useParams();
  const [providerData, setProviderData] = useState<any>(null);
  const [services, setServices] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [averageRatings, setAverageRatings] = useState<number>(0);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState<boolean>(false);
  const [_isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.token.user);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(services?.length / ITEMS_PER_PAGE);
  const paginatedmServices = services?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchProviderData = async () => {
      setLoading(true);
      if (!id) return;
      try {
        const providerResponse = await getAccountById(parseInt(id));
        const servicesResponse = await getServicesByProvider(parseInt(id));
        const activeServices = servicesResponse.data.filter(
          (service: any) => service.status === "Active"
        );
        setProviderData(providerResponse);
        setServices(activeServices);

        const allFeedbacks = servicesResponse.data.reduce(
          (acc: any[], service: any) => {
            return acc.concat(service.feedbacks);
          },
          []
        );

        const totalRatings = allFeedbacks.reduce(
          (acc: number, feedback: any) => {
            return acc + (feedback.rating || 0);
          },
          0
        );

        const averageRating =
          allFeedbacks.length > 0 ? totalRatings / allFeedbacks.length : 0;

        setAverageRatings(averageRating);
      } catch (error) {
        console.error("Failed to fetch provider information", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, [id]);

  if (loading) return <Spinner size="large" />;

  const totalServices = services.length;

  const handleRequestForm = () => {
    checkWallet();
    setIsRequestFormOpen(true);
  };

  const handleCloseRequestFormModal = () => {
    setIsRequestFormOpen(false);
  };

  const handleNavigateToWallet = () => {
    navigate(RouteNames.WALLET);
    setIsWalletDialogOpen(false);
  };

  const handleCloseWalletDialog = () => {
    setIsWalletDialogOpen(false);
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
      console.error("Error checking wallet:", error);
    }
  };

  return (
    <>
      <div className="relative">
        <ScholarshipProgramBackground />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-start items-start p-[70px] gap-[170px] z-10">
          <Breadcrumb>
            <BreadcrumbList className="text-white">
              <BreadcrumbItem>
                <Link
                  to="/"
                  className="md:text-xl text-lg hover:text-blue-300 transition-all"
                >
                  Home
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link
                  to="/services"
                  className="text-white md:text-xl text-lg hover:text-blue-300 transition-all"
                >
                  Services
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link
                  to="/provider-list"
                  className="md:text-xl text-lg hover:text-blue-300 transition-all"
                >
                  Providers List
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <p className="text-white md:text-xl text-lg">
                  Provider Information
                </p>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <section className="bg-white py-12 rounded-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-8 mb-10 bg-teal-500 p-8 rounded-xl">
            <img
              src={providerData?.avatarUrl || "https://github.com/shadcn.png"}
              alt="Provider Avatar"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
            />
            <div className="text-white">
              <h2 className="text-4xl font-semibold flex items-center gap-2">
                <FaUser className="text-blue-200" />
                {providerData?.username}
              </h2>
              <div className="text-lg mt-2">
                <p className="flex items-center gap-2 text-gray-100">
                  <FaTasks className="text-green-400" /> Total Services:{" "}
                  {totalServices}
                </p>
                <p className="flex items-center gap-2 text-gray-100">
                  <FaStar className="text-yellow-400" /> Average Rating:{" "}
                  {averageRatings.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
              <FaServicestack className="text-teal-500" />
              Services Provided
            </h3>
            <button
              disabled={!user || user?.role !== "Applicant"}
              onClick={handleRequestForm}
              className={`group flex justify-center items-center border-1 border-gray-300 shadow-lg transition-all duration-300 gap-4 px-8 py-4 rounded-xl transform ${
                !user
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white text-teal-600 hover:bg-[#1eb2a6] hover:text-white"
              }`}
            >
              <IoIosPaper
                className={`text-3xl transition-all ease-in-out transform ${
                  !user
                    ? "text-gray-500"
                    : "text-teal-600 group-hover:text-white"
                }`}
              />
              <p
                className={`text-xl font-semibold ${
                  !user
                    ? "text-gray-500"
                    : "text-teal-600 group-hover:text-white"
                }`}
              >
                Request Form
              </p>
            </button>
          </div>

          {/* Services Grid */}
          {paginatedmServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {services.map((service: any) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <FaSadTear className="text-blue-500 text-6xl mb-4" />
              <p className="text-gray-700 text-lg">
                This provider has not created any services yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Request Form Modal */}
      <RequestFormModal
        isOpen={isRequestFormOpen}
        handleClose={handleCloseRequestFormModal}
        services={services}
        handleSubmit={() => {}}
      />

      <Dialog open={isWalletDialogOpen} onClose={handleCloseWalletDialog}>
        <div className="p-8 bg-white rounded-lg shadow-xl max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <FaExclamationTriangle className="text-yellow-500 text-4xl mr-4" />
            <h3 className="text-2xl font-semibold text-gray-800">
              You don't have a wallet yet!
            </h3>
          </div>
          <p className="my-4 text-lg text-gray-600">
            You need to create a wallet to add services. Do you want to go to
            the Wallet page?
          </p>
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleCloseWalletDialog}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-400 transition-all flex items-center gap-2"
            >
              <FaTimes className="text-gray-700" /> Cancel
            </button>
            <button
              onClick={handleNavigateToWallet}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              <FaWallet className="text-white" /> Yes, Go to Wallet
            </button>
          </div>
        </div>
      </Dialog>
      <div
        style={{
          paddingTop: "20px",
          marginBottom: "10px",
          display: "flex",
          justifyContent: "end",
          backgroundColor: "white",
        }}
      >
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              backgroundColor:
                currentPage === index + 1 ? "#419f97" : "#f1f1f1",
              color: currentPage === index + 1 ? "white" : "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default ProviderInformation;
