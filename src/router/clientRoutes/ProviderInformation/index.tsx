import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import Spinner from "@/components/Spinner";
import { getAccountById } from "@/services/ApiServices/accountService";
import { getServicesByProvider } from "@/services/ApiServices/serviceService";
import ServiceCard from "@/components/Services/ServiceCard";

const ProviderInformation = () => {
  const { id } = useParams();
  const [providerData, setProviderData] = useState<any>(null);
  const [services, setServices] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [averageRatings, setAverageRatings] = useState<number>(0);


  useEffect(() => {
    const fetchProviderData = async () => {
      setLoading(true);
      if (!id) return;
      try {
        const providerResponse = await getAccountById(parseInt(id));
        const servicesResponse = await getServicesByProvider(parseInt(id));
        console.log(providerResponse);
        console.log(servicesResponse);
        setProviderData(providerResponse);
        setServices(servicesResponse.data);

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
  return (
    <>
    <div className="relative">
      <ScholarshipProgramBackground />
      <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-start items-start p-[70px] gap-[170px] z-10">
        <Breadcrumb>
          <BreadcrumbList className="text-white">
            <BreadcrumbItem>
              <Link to="/" className="md:text-xl text-lg">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/services" className="text-white md:text-xl text-lg">Services</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <p className="text-white md:text-xl text-lg">Provider Information</p>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        </div>
        </div>
        <section className="bg-white py-10">     
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={providerData?.avatarUrl || "https://github.com/shadcn.png"}
              alt="Provider Avatar"
              className="w-24 h-24 rounded-full border-2 border-gray-300"
            />
            <div>
              <h2 className="text-3xl font-semibold">{providerData?.username}</h2>
              <p>Total Services: {totalServices}</p>
              <p>Average Rating: {averageRatings.toFixed(1)}</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Services Provided</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((service: any) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProviderInformation;
