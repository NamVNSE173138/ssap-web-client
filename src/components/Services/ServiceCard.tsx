import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaDollarSign, FaClock, FaStar, FaRegCalendarAlt, FaAddressBook, FaClipboardList } from "react-icons/fa";
import { ServiceType } from "@/router/clientRoutes/Service/data";
import { useEffect, useState } from "react";
import { getServiceById } from "@/services/ApiServices/serviceService";

const truncateString = (str: string, num: number) => {
  return str.length <= num ? str : str.slice(0, num) + "...";
};

const ServiceCard = (service: ServiceType) => {
  const truncatedDescription = truncateString(service.description, 40);
  const [services, setServices] = useState<ServiceType | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [feedbackCount, setFeedbackCount] = useState<number>(0);

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
  <div className="flex flex-col justify-between gap-6 p-4 rounded-xl shadow-md bg-gradient-to-r from-blue-50 to-indigo-100 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:translate-y-1">
    {/* Service Name */}
    <div>
      <h2 className="text-lg md:text-xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
        {service?.name}
      </h2>
    </div>

    {/* Service Description with Tooltip */}
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm text-gray-700">{truncatedDescription}</p>
          </TooltipTrigger>
          <TooltipContent className="bg-indigo-600 text-white p-3 rounded-md shadow-lg">
            <p className="text-sm">{service?.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <Separator orientation="horizontal" className="border-gray-300 my-3" />

    {/* Service Details */}
    <div className="flex flex-col gap-6">
      {/* Rating Section */}
      <div className="flex items-center gap-3 text-sm md:text-base hover:text-indigo-600 transition-colors">
        <FaStar
          color="#FFD700"
          className="transition-all transform hover:scale-150 hover:animate-pulse ease-in-out duration-300"
        />
        <p className="text-gray-800">
          {averageRating.toFixed(1)} ({feedbackCount} {feedbackCount === 1 ? "review" : "reviews"})
        </p>
      </div>

      {/* Service Type Section */}
      <div className="flex items-center gap-3 text-sm md:text-base hover:text-indigo-600 transition-colors">
        <FaAddressBook
          color="#2D3748"
          className="transition-all transform hover:scale-125 hover:animate-bounce ease-in-out duration-300"
        />
        <p className="text-gray-800">{service.type || "No Type Specified"}</p>
      </div>

      {/* Service Description Section */}
      <div className="flex items-center gap-3 text-sm md:text-base hover:text-indigo-600 transition-colors">
        <FaClipboardList
          color="#2D3748"
          className="transition-all transform hover:scale-125 hover:animate-ping ease-in-out duration-300"
        />
        <p className="text-gray-800">{service.description || "No description Specified"}</p>
      </div>

      {/* Price Section */}
      <div className="flex items-center gap-3 text-sm md:text-base hover:text-indigo-600 transition-colors">
        <FaDollarSign
          color="#2D3748"
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
