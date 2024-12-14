import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import ServiceSkeleton from "./ServiceSkeleton";
import { ServiceType } from "./data";
import ServiceCard from "@/components/Services/ServiceCard";
import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  IoIosAddCircleOutline,
  IoIosApps,
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosInformationCircle,
  IoMdCheckmarkCircleOutline,
  IoMdTime,
} from "react-icons/io";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import AddServiceModal from "../Activity/AddServiceModal";
import RouteNames from "@/constants/routeNames";
import {
  getAccountById,
  getAccountWallet,
} from "@/services/ApiServices/accountService";
import { Dialog } from "@mui/material";
import { IoPerson, IoWallet } from "react-icons/io5";
import {
  FaArrowUp,
  FaCalendarAlt,
  FaClock,
  FaCreditCard,
  FaDollarSign,
  FaInfoCircle,
  FaSadTear,
} from "react-icons/fa";
import MultiStepSubscriptionModal from "../Activity/SubscriptionModal";
import { Button, Modal, notification } from "antd";
import { getSubscriptionByProviderId } from "@/services/ApiServices/subscriptionService";
import { getPaginatedServices, getServicesByProviderPaginated } from "@/services/ApiServices/serviceService";
import { MdDateRange } from "react-icons/md";
import MultiStepUpgradeSubscriptionModal from "../Activity/SubscriptionUpgradeModal";

interface SubscriptionDetails {
  name: string;
  description: string;
  amount: number;
  numberOfServices: number;
  validMonths: number;
  subscriptionEndDate: string;
  purchaseDate: string;
}

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
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [numberOfServicesLeft, setNumberOfServicesLeft] = useState<number>(0);
  const [subscriptionDetails, setSubscriptionDetails] =
    useState<SubscriptionDetails | null>(null);
  const [isSubscriptionDetailModalOpen, setIsSubscriptionDetailModalOpen] =
    useState(false);
  const [isSubscriptionUpgradeModalOpen, setIsSubscriptionUpgradeModalOpen] =
    useState(false);
  const [_hasSubcription, setHasSubcription] = useState(false);

  const fetchSubscriptionDetails = async () => {
    try {
      if (user?.role === "Provider") {
        const subscriptionResponse = await getSubscriptionByProviderId(
          Number(user?.id),
        );
        console.log(subscriptionResponse);
        const accountResponse = await getAccountById(Number(user?.id));

        if (subscriptionResponse && subscriptionResponse.statusCode === 200) {
          const subscriptionData = subscriptionResponse?.data || {};
          const formattedEndDate = formatDate(
            accountResponse.subscriptionEndDate,
          );
          const purchaseDate = calculatePurchaseDate(
            formattedEndDate,
            subscriptionData.validMonths,
          );

          setSubscriptionDetails({
            name: subscriptionData.name || "N/A",
            description:
              subscriptionData.description || "No description available.",
            amount: subscriptionData.amount || 0,
            numberOfServices: subscriptionData.numberOfServices || 0,
            validMonths: subscriptionData.validMonths || 0,
            subscriptionEndDate: formattedEndDate || "N/A",
            purchaseDate: purchaseDate,
          });
          setHasSubcription(true);
        } else {
          setHasSubcription(false);
        }
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        setHasSubcription(false);
      } else {
        console.error("Error fetching subscription details:", error);
        setError("Failed to fetch subscription details");
      }
    }
  };

  const calculatePurchaseDate = (
    subscriptionEndDate: string,
    validMonths: number,
  ): string => {
    const endDate = parseFormattedDate(subscriptionEndDate);
    if (!endDate) return "N/A";

    endDate.setMonth(endDate.getMonth() - validMonths);

    return formatDate(endDate.toISOString());
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const parseFormattedDate = (dateString: string): Date | null => {
    const [day, month, year] = dateString.split("/").map(Number);
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day);
  };

  const isSubscriptionExpiringSoon = (): boolean => {
    if (
      !subscriptionDetails?.subscriptionEndDate ||
      subscriptionDetails.subscriptionEndDate === "N/A"
    ) {
      return false;
    }

    const endDate = parseFormattedDate(subscriptionDetails.subscriptionEndDate);
    if (!endDate) return false;

    const today = new Date();
    const diffInTime = endDate.getTime() - today.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    return diffInDays <= 7 && diffInDays > 0;
  };

  const handleInfoIconClick = () => {
    fetchSubscriptionDetails();
    setIsSubscriptionDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSubscriptionDetailModalOpen(false);
  };

  const updateNumberOfServicesLeft = (newLimit: number) => {
    setNumberOfServicesLeft(newLimit);
  };

  const handleBuySubscriptionClick = () => {
    setIsSubscriptionModalOpen(true);
  };

  const fetchSubscriptions = () => {
    console.log("Fetching subscriptions...");
  };

  const fetchSubscriptionForProvider = async () => {
    try {
      if (user?.role === "Provider") {
        const subscription = await getSubscriptionByProviderId(Number(user?.id));

        if (subscription && subscription.data) {
          const numberOfServicesAllowed = subscription.data.numberOfServices ?? 0;
          const totalServices = await fetchTotalServices();

          const servicesLeft = numberOfServicesAllowed - totalServices;
          updateNumberOfServicesLeft(Math.max(servicesLeft, 0));
        }
      }
    } catch (error) {
      console.error("Error fetching subscription for provider:", error);
      setError(
        "All your services 'Inactive'. Please buy subscription to view them!",
      );
    }
  };

  const fetchTotalServices = async (): Promise<any> => {
    try {
      if (!user) return null;
      let totalServices = 0;
      let pageIndex = 1;
      const pageSize = 6;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await getServicesByProviderPaginated(Number(user.id), currentPage, pageSize);

        if (response.data.statusCode === 200) {
          const services = response.data.data.items || [];
          totalServices += services.length;
          const totalPages = response.data.data.totalPages || 1;

          hasMorePages = pageIndex < totalPages;
          pageIndex++;
        } else {
          hasMorePages = false;
        }
      }

      return totalServices;
    } catch (err) {
      console.error("Error fetching total services:", err);
      setError("Failed to calculate total services");
      return 0;
    }
  };


  const fetchData = async () => {
    setLoading(true);
    try {
      let response: any = {};
      if (user?.role === "Provider") {
        response = await getServicesByProviderPaginated(Number(user.id), currentPage, pageSize);
        // response = await axios.get(
        //   `${BASE_URL}/api/services/by-provider-paginated/${user.id}`,
        //   {
        //     params: {
        //       pageIndex: currentPage,
        //       pageSize: pageSize,
        //     },
        //   },
        // );
        console.log(response);
      } else {
        response = await getPaginatedServices(currentPage, pageSize)
        // response = await axios.get(`${BASE_URL}/api/services/paginated`, {
        //   params: {
        //     pageIndex: currentPage,
        //     pageSize: pageSize,
        //   },
        // });
      }

      if (response.data.statusCode === 200) {
        const services = response.data.data.items || [];
        const totalPages = response.data.data.totalPages || 1;
        console.log(services)
        console.log(totalPages)

        if (user?.role === "Provider") {
          setData(services);
        } else {
          const activeServices = services.filter(
            (service: any) => service.status === "Active",
          );
          setData(activeServices);
          setFilteredData(activeServices);
        }
        setTotalPages(totalPages);
      } else {
        setData([]);
        setFilteredData([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
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
      console.error("Error checking wallet:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, user]);

  useEffect(() => {
    setFilteredData(
      data.filter((service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [searchTerm, data]);

  useEffect(() => {
    if (user?.role === "Provider") {
      fetchSubscriptionForProvider();
    }
  }, [data, user]);

  const handleNextPage = async () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = async () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleViewHistory = () => {
    navigate(RouteNames.APPLICANT_REQUEST_HISTORY);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleAddServiceClick = () => {
    if (numberOfServicesLeft === 0) {
      notification.success({
        message: "You need to buy a subscription to add services",
        description: "Please buy a subscription to continue adding services.",
      });
    } else {
      checkWallet();
    }
  };

  const handleCloseWalletDialog = () => {
    setIsWalletDialogOpen(false);
  };

  const handleNavigateToWallet = () => {
    setIsWalletDialogOpen(false);
    navigate(RouteNames.WALLET);
  };

  const handleNavigateProviderList = () => {
    navigate(RouteNames.PROVIDER_LIST);
  };

  const handleUpgradeSubscriptionClick = () => {
    setIsSubscriptionUpgradeModalOpen(true);
  };

  const isBuySubscriptionDisabled = numberOfServicesLeft > 0;
  const isUpgradeSubscriptionDisabled = numberOfServicesLeft === 0;

  const buySubscriptionTitle =
    numberOfServicesLeft > 0
      ? "You already have services left. Upgrade your subscription for more benefits."
      : "You need to buy a subscription to create more services.";

  const upgradeSubscriptionTitle =
    numberOfServicesLeft === 0
      ? "You can't upgrade without an active subscription. Please buy a subscription first."
      : "Upgrade your subscription for enhanced benefits.";

  return (
    <div>
      <div className="relative">
        <ScholarshipProgramBackground />

        <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-between items-start p-[40px] z-10">

          <Breadcrumb>
            <BreadcrumbList className="text-[#000]">
              <BreadcrumbItem>
                <Link to="/" className="md:text-xl text-lg">
                  Home
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <p className="text-[#000] font-medium md:text-xl text-lg">
                  Services
                </p>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="w-full mt-6">
          <div className="relative w-full">
        <input
          className="w-2/3 h-full pl-12 pr-12 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out bg-white text-lg"
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
          </div>
        </div>
      </div>


      <div className="flex bg-white justify-between p-4 items-center z-20">
        {user?.role === "Provider" && (
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center text-black text-lg">
              <span>Number of services created left: </span>
              <span className="font-semibold ml-2">{numberOfServicesLeft}</span>

              {numberOfServicesLeft > 0 && (
                <IoIosInformationCircle
                  onClick={handleInfoIconClick}
                  className="text-blue text-xl cursor-pointer hover:text-blue-500 transition-all duration-300 ml-2"
                />
              )}

              {isSubscriptionExpiringSoon() && (
                <p className="text-red-500 font-bold ml-4">
                  Your subscription will expire in less than 7 days!
                </p>
              )}
            </div>

            {/* Phần nút bấm - sát phải */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddServiceClick}
                className={`flex justify-center items-center hover:bg-blue-600 hover:text-white transition-all duration-300 gap-4 px-6 py-3 bg-white h-full shadow-lg active:scale-95 ${numberOfServicesLeft === 0
                  ? "bg-gray-400 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white"
                  }`}
                disabled={numberOfServicesLeft === 0}
                title={
                  numberOfServicesLeft === 0
                    ? "You need to buy a subscription to add service"
                    : ""
                }
              >
                <IoIosAddCircleOutline
                  className={`text-2xl ${numberOfServicesLeft === 0 ? "text-gray-500" : "text-blue-500"
                    } transition-all duration-300 ease-in-out transform hover:scale-110`}
                />
                <p
                  className={`text-xl ${numberOfServicesLeft === 0 ? "text-gray-500" : "text-blue-600"
                    } font-semibold`}
                >
                  Add Service
                </p>
              </Button>

              <Button
                onClick={handleBuySubscriptionClick}
                disabled={isBuySubscriptionDisabled}
                title={buySubscriptionTitle}
                className={`flex justify-center items-center gap-1 px-4 py-3 h-full shadow-lg active:scale-95 transition-all duration-300 ${isBuySubscriptionDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300 hover:text-gray-500"
                  : "bg-white hover:bg-green-600 hover:text-white"
                  }`}
              >
                <FaCreditCard className="text-2xl transition-all duration-300 ease-in-out transform hover:scale-110" />
                <p className="text-xl font-semibold">Buy Subscription</p>
              </Button>

              <Button
                onClick={handleUpgradeSubscriptionClick}
                disabled={isUpgradeSubscriptionDisabled}
                title={upgradeSubscriptionTitle}
                className={`flex justify-center items-center gap-1 px-4 py-3 h-full shadow-lg active:scale-95 transition-all duration-300 ${isUpgradeSubscriptionDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300 hover:text-gray-500"
                  : "bg-white hover:bg-yellow-600 hover:text-white"
                  }`}
              >
                <FaArrowUp className="text-2xl transition-all duration-300 ease-in-out transform hover:scale-110" />
                <p className="text-xl font-semibold">Upgrade Subscription</p>
              </Button>
            </div>
          </div>
        )}

        {user?.role === "Applicant" && (
          <div className="flex justify-end gap-4 w-full">
            <Button
              onClick={handleViewHistory}
              className="flex justify-center items-center bg-[#1eb2a6] hover:bg-[#0d978b] shadow-lg px-4 py-2 "
            >
              <IoMdTime className="text-2xl text-white" />
              <p className="text-xl text-white font-semibold">
                View History
              </p>
            </Button>
            <Button
              onClick={handleNavigateProviderList}
              className="flex justify-center items-center bg-[#1eb2a6] hover:bg-[#0d978b] shadow-lg px-4 py-2 "
            >
              <IoPerson className="text-2xl text-white" />
              <p className="text-xl text-white font-semibold">
                Provider List
              </p>
            </Button>
          </div>
        )}
      </div>


      <ul className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-10 p-10">
        {loading ? (
          <ServiceSkeleton />
        ) : error ? (
          <p>{error}</p>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <FaSadTear className="text-blue-500 text-6xl mb-4" />
            <p className="text-gray-700 text-lg">No services found.</p>
          </div>
        ) : (
          filteredData.map((service) => (
            <li key={service.id}>
              <ServiceCard {...service} />
            </li>
          ))
        )}
      </ul>
      {filteredData.length === 0 && searchTerm && (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <FaSadTear className="text-blue-500 text-6xl mb-4" />
          <p className="text-gray-700 text-lg">No services found.</p>
        </div>
      )}

      <div className="flex justify-between items-center p-6 bg-blue-50 rounded-lg shadow-md">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-[#1eb2a6] text-white px-5 py-2 rounded-full hover:bg-[#0d978b] disabled:bg-gray-400 transition-all duration-300 flex items-center gap-2"
        >
          <IoIosArrowBack className="text-xl" />
          <span>Previous</span>
        </button>

        <span className="text-lg font-semibold text-[#1eb2a6]">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-[#1eb2a6] text-white px-5 py-2 rounded-full hover:bg-[#0d978b] disabled:bg-gray-400 transition-all duration-300 flex items-center gap-2"
        >
          <span>Next</span>
          <IoIosArrowForward className="text-xl" />
        </button>
      </div>

      <AddServiceModal
        isOpen={isServiceModalOpen}
        setIsOpen={setIsServiceModalOpen}
        fetchServices={() => {
          setCurrentPage(1);
          fetchData();
        }}
      />

      <MultiStepSubscriptionModal
        isOpen={isSubscriptionModalOpen}
        setIsOpen={setIsSubscriptionModalOpen}
        fetchSubscriptions={fetchSubscriptions}
      />

      <MultiStepUpgradeSubscriptionModal
        isOpen={isSubscriptionUpgradeModalOpen}
        setIsOpen={setIsSubscriptionUpgradeModalOpen}
        fetchSubscriptions={fetchSubscriptions}
      />

      <Modal
        title={
          <div className="flex items-center gap-2 text-blue-400">
            <FaInfoCircle className="text-3xl" />
            <span className="text-2xl font-semibold">Subscription Details</span>
          </div>
        }
        open={isSubscriptionDetailModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button
            key="close"
            onClick={handleCloseModal}
            className="bg-blue-400 hover:bg-blue-500 text-white"
          >
            Close
          </Button>,
        ]}
        width={600}
        className="subscription-modal"
        style={{
          borderRadius: "10px",
          background: "#f0f8ff",
          padding: "20px",
        }}
      >
        {subscriptionDetails ? (
          <div className="text-gray-800">
            <br></br>
            <div className="flex items-center mb-3">
              <h3 className="text-2xl font-semibold text-blue-400">
                {subscriptionDetails.name}
              </h3>
            </div>
            <div className="flex items-center mb-3">
              <IoMdCheckmarkCircleOutline className="text-blue-400 text-2xl mr-2" />
              <p className="text-lg">
                <strong>Description:</strong> {subscriptionDetails.description}
              </p>
            </div>
            <div className="flex items-center mb-3">
              <FaDollarSign className="text-blue-400 text-2xl mr-2" />
              <p className="text-lg">
                <strong>Amount:</strong> ${subscriptionDetails.amount}
              </p>
            </div>
            <div className="flex items-center mb-3">
              <IoIosApps className="text-blue-400 text-2xl mr-2" />
              <p className="text-lg">
                <strong>Number of Services:</strong>{" "}
                {subscriptionDetails.numberOfServices}
              </p>
            </div>
            <div className="flex items-center mb-3">
              <FaClock className="text-blue-400 text-2xl mr-2" />
              <p className="text-lg">
                <strong>Valid Months:</strong> {subscriptionDetails.validMonths}
              </p>
            </div>
            <div className="flex items-center mb-3">
              <FaCalendarAlt className="text-blue-400 text-2xl mr-2" />
              <p className="text-lg">
                <strong>Purchase Date:</strong>{" "}
                {subscriptionDetails.purchaseDate}
              </p>
            </div>
            <div className="flex items-center mb-3">
              <MdDateRange className="text-blue-400 text-2xl mr-2" />
              <p className="text-lg">
                <strong>Subscription End Date:</strong>{" "}
                {subscriptionDetails.subscriptionEndDate}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-blue-400">
              Loading subscription details...
            </p>
          </div>
        )}
      </Modal>

      <Dialog open={isWalletDialogOpen} onClose={handleCloseWalletDialog}>
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
          <h3 className="text-2xl font-semibold text-blue-600 flex items-center gap-2">
            <IoWallet className="text-blue-500 text-3xl" />
            You don't have a wallet yet!
          </h3>
          <p className="my-4 text-lg text-gray-600">
            You need to create a wallet to add services. Do you want to go to
            the Wallet page?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={handleCloseWalletDialog}
              className="bg-gray-300 px-6 py-2 rounded-full hover:bg-gray-400 transition-all text-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleNavigateToWallet}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all text-lg flex items-center gap-2"
            >
              <IoIosArrowForward className="text-xl" />
              Yes
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Service;
