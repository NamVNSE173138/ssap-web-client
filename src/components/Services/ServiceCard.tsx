import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";
import { FaDollarSign, FaStar, FaAddressBook, FaClipboardList, FaCheckCircle } from "react-icons/fa";
import { ServiceType } from "@/router/clientRoutes/Service/data";
import { useEffect, useState } from "react";
import { getServiceById } from "@/services/ApiServices/serviceService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ServiceCard = (service: ServiceType) => {
  const [_services, setServices] = useState<ServiceType | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [feedbackCount, setFeedbackCount] = useState<number>(0);
  const user = useSelector((state: RootState) => state.token.user);

  useEffect(() => {
    const fetchService = async () => {
      if (service.id) {
        try {
          const fetchedService = await getServiceById(Number(service.id));
          setServices(fetchedService.data);

          const feedbacks = fetchedService.data.feedbacks || [];
          if (feedbacks.length > 0) {
            const totalRating = feedbacks.reduce((acc: any, feedback: any) => acc + (feedback.rating || 0), 0);
            setAverageRating(totalRating / feedbacks.length);
            setFeedbackCount(feedbacks.length);
          }
        } catch (error) {
          console.error("Failed to fetch service data:", error);
        }
      }
    };

    fetchService();
  }, [service.id]);

  if (!service) return null;

  return (
    <Link to={`/services/${service.id}`}>
      <div className="flex flex-col justify-between gap-6 p-4 rounded-3xl shadow shadow-gray-400  cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:translate-y-1">
        <div>
          <h2
            className="text-lg md:text-xl mt-5 font-medium text-gray-800 hover:text-indigo-600 transition-colors truncate"
            style={{ maxWidth: 'calc(100% - 0px)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {service?.name}
          </h2>
        </div>

        <Separator orientation="horizontal" className="border-gray-300 my-3" />
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 text-sm md:text-base hover:text-indigo-600 transition-colors">
            <FaStar
              color="#FFD700"
              className="transition-all transform hover:scale-150 hover:animate-pulse ease-in-out duration-300"
            />
            <p className="text-gray-800">
              {averageRating.toFixed(1)} ({feedbackCount} {feedbackCount === 1 ? "review" : "reviews"})
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm md:text-base hover:text-indigo-600 transition-colors">
            <FaAddressBook
              color="#1eb2a6"
              className="transition-all transform hover:scale-125 hover:animate-bounce ease-in-out duration-300"
            />
            <p className="text-gray-800">{service.type || "No Type Specified"}</p>
          </div>

          <div className="flex items-center gap-3 text-sm md:text-base hover:text-indigo-600 transition-colors">
            <FaClipboardList
              color="#1eb2a6"
              className="transition-all transform hover:scale-125 hover:animate-ping ease-in-out duration-300"
            />
            <p className="text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap max-w-full" style={{ maxWidth: '50ch' }}>
              {service.description || "No description Specified"}
            </p>
          </div>

          {user?.role === 'Provider' && (
            <div className="flex items-center gap-3 text-sm md:text-base hover:text-indigo-600 transition-colors">
              <FaCheckCircle
                className={`text-2xl ${service.status === "Active" ? "text-teal-500" : "text-red-500"}`}
              />
              <div>
                <p className={`text-ellipsis ${service.status === "Active" ? "text-teal-600" : "text-red-600"}`}>
                  {service.status}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm md:text-base hover:text-indigo-600 transition-colors">
            <FaDollarSign
              color="#1eb2a6"
              className="transition-all transform hover:scale-125 hover:animate-wiggle ease-in-out duration-300"
            />
            <p className="text-gray-800">{service.price ? `$${service.price.toFixed(2)}` : "Price not available"}</p>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
