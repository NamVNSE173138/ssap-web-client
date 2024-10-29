import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaDollarSign, FaClock, FaStar, FaRegCalendarAlt, FaAddressBook } from "react-icons/fa";
import { ServiceType } from "@/router/clientRoutes/Service/data";

const truncateString = (str: string, num: number) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};

const ServiceCard = (service: ServiceType) => {
  const truncatedDescription = truncateString(service.description, 40);

  return (
    <Link to={`/services/${service.id}`}>
      <div className="flex flex-col justify-between gap-8 p-4 rounded-3xl shadow shadow-gray-400 cursor-pointer hover:bg-gray-200 hover:scale-105 hover:shadow-xl transition-all">
        <div className="flex flex-col justify-between gap-2">
          <p className="text-lg md:text-xl lg:text-xl mt-4 font-bold">{service?.name}</p>
          <div className="mb-5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p>{truncatedDescription}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{service?.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Separator orientation="horizontal" />

          <div className="flex flex-col gap-4 mt-5">
            <div className="flex items-center gap-2">
              <FaStar color="#060606" size={20} />
              <p>{service.providerId ? `Provider ID: ${service.providerId}` : "No Provider"}</p>
            </div>

            <div className="flex items-center gap-2">
              <FaAddressBook color="#060606" size={20} />
              <p>{service.type || "No Type Specified"}</p>
            </div>

            <div className="flex items-center gap-2">
              <FaRegCalendarAlt color="#060606" size={20} />
              <p>{service.duration ? new Date(service.duration).toLocaleDateString() : "No Duration"}</p>
            </div>

            <div className="flex items-center gap-2">
              <FaDollarSign color="#060606" size={20} />
              <p>{service.price ? `$${service.price.toFixed(2)}` : "Price not available"}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
