import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import Spinner from "@/components/Spinner";
import { getAccountById } from "@/services/ApiServices/accountService";
import { getServicesByProvider } from "@/services/ApiServices/serviceService";
import ServiceCard from "@/components/Services/ServiceCard";
import { FaSadTear, FaServicestack, FaStar, FaTasks, FaUser } from "react-icons/fa";
import { IoIosPaper } from "react-icons/io";
import RequestFormModal from "../ServiceDetail/applicantRequestForm-dialog";

const ProviderInformation = () => {
  const { id } = useParams();
  const [providerData, setProviderData] = useState<any>(null);
  const [services, setServices] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [averageRatings, setAverageRatings] = useState<number>(0);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchProviderData = async () => {
      setLoading(true);
      if (!id) return;
      try {
        const providerResponse = await getAccountById(parseInt(id));
        const servicesResponse = await getServicesByProvider(parseInt(id));
        const activeServices = servicesResponse.data.filter((service: any) => service.status === 'Active');
        setProviderData(providerResponse);
        setServices(activeServices);

        const allFeedbacks = servicesResponse.data.reduce((acc: any[], service: any) => {
          return acc.concat(service.feedbacks);
        }, []);

        const totalRatings = allFeedbacks.reduce((acc: number, feedback: any) => {
          return acc + (feedback.rating || 0);
        }, 0);

        const averageRating = allFeedbacks.length > 0
          ? totalRatings / allFeedbacks.length
          : 0;

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
    setIsRequestFormOpen(true);
  };

  const handleCloseRequestFormModal = () => {
    setIsRequestFormOpen(false);
  };

  return (
    <>
      <div className="relative">
        <ScholarshipProgramBackground />
        <div className="absolute top-0 bg-black/40 left-0 w-full h-full flex flex-col justify-start items-start p-[70px] gap-[170px] z-10">
          <Breadcrumb>
            <BreadcrumbList className="text-white">
              <BreadcrumbItem>
                <Link to="/" className="md:text-xl text-lg hover:text-blue-300 transition-all">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link to="/services" className="text-white md:text-xl text-lg hover:text-blue-300 transition-all">Services</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link to="/provider-list" className="md:text-xl text-lg hover:text-blue-300 transition-all">Providers List</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <p className="text-white md:text-xl text-lg">Provider Information</p>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <section className="bg-gray-200 py-12 shadow-xl rounded-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-8 mb-10 bg-gradient-to-r from-cyan-500 to-blue-300 p-8 rounded-lg shadow-lg">
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
                  <FaTasks className="text-green-400" /> Total Services: {totalServices}
                </p>
                <p className="flex items-center gap-2 text-gray-100">
                  <FaStar className="text-yellow-400" /> Average Rating: {averageRatings.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
              <FaServicestack className="text-blue-500" />
              Services Provided
            </h3>
            <button
              onClick={handleRequestForm}
              className="flex justify-center items-center hover:bg-blue-600 hover:text-white transition-all duration-300 gap-4 px-8 py-4 bg-white rounded-xl shadow-xl transform hover:scale-105"
            >
              <IoIosPaper className="text-3xl text-blue-500 transition-all ease-in-out transform hover:scale-110" />
              <p className="text-xl text-blue-600 font-semibold">Request Form</p>
            </button>
          </div>

          {/* Services Grid */}
          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {services.map((service: any) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <FaSadTear className="text-blue-500 text-6xl mb-4" />
              <p className="text-gray-700 text-lg">This provider has not created any services yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Request Form Modal */}
      <RequestFormModal
        isOpen={isRequestFormOpen}
        handleClose={handleCloseRequestFormModal}
        services={services}
        handleSubmit={() => { }}
      />
    </>

  );
};

export default ProviderInformation;
