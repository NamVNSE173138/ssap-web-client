import { Separator } from "../ui/separator";
import { Link, useParams } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaDollarSign, FaClock, FaStar, FaRegCalendarAlt, FaAddressBook } from "react-icons/fa";
import { ServiceType } from "@/router/clientRoutes/Service/data";
import { useEffect, useState } from "react";
import { getServiceById } from "@/services/ApiServices/serviceService";
import { GoPersonFill } from "react-icons/go";

const truncateString = (str: string, num: number) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};

const ServiceCard = (service: ServiceType) => {
  const truncatedDescription = truncateString(service.description, 40);
  const [services, setServices] = useState<ServiceType | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [feedbackCount, setFeedbackCount] = useState<number>(0);

  useEffect(() => {
    const fetchService = async () => {
      if (service.id) {
        const fetchedService = await getServiceById(Number(service.id));
        setServices(fetchedService.data);
        console.log(fetchedService)
        const feedbacks = fetchedService.data.feedbacks;
        console.log(feedbacks)
        if (feedbacks && feedbacks.length > 0) {
          const totalRating = feedbacks.reduce((acc:any, feedback:any) => acc + (feedback.rating || 0), 0);
          const count = feedbacks.length;
          setAverageRating(totalRating / count);
          setFeedbackCount(count);
        }
      }
    };

    fetchService();
  }, [service.id]);

  if (!service) return null;

  return (
    <Link to={`/services/${service.id}`}>
  <div className="flex flex-col justify-between gap-6 p-4 rounded-xl shadow-lg bg-gradient-to-r from-indigo-100 via-blue-100 to-teal-50 cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:translate-y-1">
    <div className="flex flex-col justify-between gap-4">
      <p className="text-xl md:text-2xl lg:text-2xl font-semibold text-gray-800 hover:text-indigo-500 transition-all duration-300 ease-in-out">
        {service?.name}
      </p>

      <div className="mb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-gray-700 text-xs lg:text-sm">{truncatedDescription}</p>
            </TooltipTrigger>
            <TooltipContent className="bg-indigo-600 text-white p-3 rounded-md">
              <p className="text-sm">{service?.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Separator orientation="horizontal" className="border-t-2 border-gray-300 mb-3" />

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center gap-3 text-lg md:text-xl">
          <FaStar color="#FFB800" size={20} className="transition-transform transform hover:scale-110" />
          <p className="text-gray-800 font-medium">
            {averageRating.toFixed(1)} ({feedbackCount} {feedbackCount === 1 ? 'review' : 'reviews'})
          </p>
        </div>

        <div className="flex items-center gap-3 text-lg md:text-xl">
          <FaAddressBook color="#2D3748" size={20} className="transition-transform transform hover:scale-110" />
          <p className="text-gray-800">{service.type || "No Type Specified"}</p>
        </div>

        <div className="flex items-center gap-3 text-lg md:text-xl">
          <FaRegCalendarAlt color="#2D3748" size={20} className="transition-transform transform hover:scale-110" />
          <p className="text-gray-800">{service.duration ? new Date(service.duration).toLocaleDateString() : "No Duration"}</p>
        </div>

        <div className="flex items-center gap-3 text-lg md:text-xl">
          <FaDollarSign color="#2D3748" size={20} className="transition-transform transform hover:scale-110" />
          <p className="text-gray-800">{service.price ? `$${service.price.toFixed(2)}` : "Price not available"}</p>
        </div>
      </div>
    </div>
  </div>
</Link>

  );
};

export default ServiceCard;
