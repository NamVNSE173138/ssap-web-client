import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaDollarSign, FaInfoCircle, FaClipboardList, FaCheckCircle, FaSadTear, FaCogs } from "react-icons/fa";
import * as Tabs from "@radix-ui/react-tabs";
import { getServicesByProvider } from "@/services/ApiServices/serviceService";
import ServiceSkeleton from "@/router/clientRoutes/Service/ServiceSkeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ServicesSection = () => {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = useSelector((state: RootState) => state.token.user);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            if (!user) return;

            setLoading(true);
            try {
                const response = await getServicesByProvider(Number(user.id));
                console.log(response)
                if (response.statusCode === 200) {
                    setServices(response.data);
                } else {
                    setServices([]);
                }
            } catch (err) {
                setError("Failed to load services");
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [user]);

    // Updated handleDetailsClick to accept the service ID as a parameter
    const handleDetailsClick = (id: number) => {
        navigate(`/services/${id}`);
    };

    return (
        <Tabs.Content value="service" className="pt-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Active Services</h1>
            </div>
            {loading ? (
                <ServiceSkeleton />
            ) : error ? (
                <p className="text-red-600 text-center">{error}</p>
            ) : services.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16">
                    <FaSadTear className="text-blue-500 text-6xl mb-4" />
                    <p className="text-gray-700 text-lg">No active services found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-t-4 border-[#1eb2a6]"
                        >
                            {/* Header with Service Name */}
                            <div className="bg-[#1eb2a6] text-white p-4 flex items-center space-x-3">
                                <FaInfoCircle className="text-2xl" />
                                <h2 className="text-xl font-bold overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[calc(100%)]" title={service.name}>
                                    {service.name.length > 26 ? `${service.name.substring(0, 26)}...` : service.name}
                                </h2>
                            </div>


                            {/* Body Content */}
                            <div className="p-6 space-y-6">
                                {/* Service Type */}
                                <div className="flex items-center space-x-4">
                                    <FaCogs className="text-blue-400 text-2xl" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Service Type</p>
                                        <p className="text-gray-700 font-semibold">{service.type}</p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-center space-x-4">
                                    <FaDollarSign className="text-green-500 text-2xl" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Price</p>
                                        <p className="text-gray-700 font-semibold">${service.price}</p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex items-center space-x-4">
                                    <FaCheckCircle
                                        className={`text-2xl ${service.status === "Active"
                                            ? "text-teal-500"
                                            : "text-red-500"
                                            }`}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Status</p>
                                        <p className={`font-semibold ${service.status === "Active" ? "text-teal-600" : "text-red-600"}`}>
                                            {service.status}
                                        </p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="flex items-start space-x-4">
                                    <FaClipboardList className="text-indigo-500 text-2xl" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">About This Service</p>
                                        <p className="text-gray-600">
                                            {service.description.length > 40 ? `${service.description.substring(0, 30)}...` : service.description}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 p-4 text-center">
                                <button
                                    onClick={() => handleDetailsClick(service.id)}
                                    className="bg-[#1eb2a6] text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition"
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Tabs.Content>
    );
};

export default ServicesSection;
