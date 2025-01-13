import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";
import { FaDollarSign, FaAddressBook, FaStar } from "react-icons/fa";
import { ServiceType } from "@/router/clientRoutes/Service/data";
import { useEffect, useState } from "react";
import { getServiceById } from "@/services/ApiServices/serviceService";
import ServiceBanner from "../../assets/scholarship_banner.png";

const ServiceCard = (service: ServiceType) => {
  const [_services, setServices] = useState<ServiceType | null>(null);
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
            const totalRating = feedbacks.reduce(
              (acc: any, feedback: any) => acc + (feedback.rating || 0),
              0
            );
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
      <div className="relative h-[400px] flex flex-col justify-between rounded-3xl shadow shadow-gray-400 cursor-pointer hover:bg-gray-100 hover:shadow-xl transition-all">
        <div
          className="absolute top-0 left-0 w-full text-m p-2 rounded-t-3xl pl-6 z-10 font-bold"
          style={{
            backgroundColor:
              service.status === "Active" ? "#1eb2a6" : "lightgray",
            color: service.status === "Active" ? "white" : "black",
          }}
        >
          {service.status}
        </div>

        <div
          className="h-[150px] bg-cover bg-center flex items-center justify-center text-white text-2xl font-bold rounded-t-3xl pt-10"
          style={{
            backgroundImage: `url(${ServiceBanner})`,
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm" style={{ lineHeight: "1.2em" }}>
              Service Price
            </span>
            <span className="text-4xl" style={{ lineHeight: "1.2em" }}>
              {service.price === 0
                ? "Free"
                : `$${service.price.toLocaleString("en-US")}`}
            </span>
          </div>
        </div>

        <div className="flex flex-col flex-grow p-4">
          <div>
            <p
              className="text-lg md:text-xl lg:text-xl mt-4 font-bold text-black"
              style={{ height: "60px", lineHeight: "1.2em" }}
            >
              {service?.name}
            </p>
          </div>

          <div className="flex-grow mb-5" style={{ height: "40px" }}>
            <p className="text-gray-700 text-sm">
              {service.description.length > 80
                ? service.description.substring(0, 80) + "..."
                : service.description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-gray-700 mt-2">
            <FaStar color="#FFD700" size={18} />
            <p className="text-sm font-semibold">
              {averageRating.toFixed(1)} ({feedbackCount}{" "}
              {feedbackCount === 1 ? "review" : "reviews"})
            </p>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="grid grid-cols-2 gap-4 p-4 ml-2 mb-2">
          <div className="flex items-center gap-2 text-gray-700">
            <FaAddressBook color="#1eb2a6" size={24} />
            <p className="text-sm truncate">
              {service.type || "No Type Specified"}
            </p>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <FaDollarSign color="#1eb2a6" size={24} />
            <p className="text-sm truncate">
              {service.price === 0
                ? "Free"
                : service.price
                ? `$${service.price.toLocaleString("en-US")}`
                : "Price not available"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
