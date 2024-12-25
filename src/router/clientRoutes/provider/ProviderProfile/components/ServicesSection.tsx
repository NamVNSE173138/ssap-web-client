import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaDollarSign, FaInfoCircle, FaClipboardList, FaCheckCircle, FaSadTear, FaCogs } from "react-icons/fa";
import * as Tabs from "@radix-ui/react-tabs";
import { getServicesByProvider } from "@/services/ApiServices/serviceService";
import ServiceSkeleton from "@/router/clientRoutes/Service/ServiceSkeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Paper } from "@mui/material";

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
                <Paper elevation={3} style={{ padding: '20px', borderRadius: '10px' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#1eb2a6', color: 'white', textAlign: 'left' }}>
                                    <th style={{ padding: '12px', fontWeight: '600' }}>#</th>
                                    <th style={{ padding: '12px', fontWeight: '600' }}>Name</th>
                                    <th style={{ padding: '12px', fontWeight: '600' }}>Description</th>
                                    <th style={{ padding: '12px', fontWeight: '600' }}>Service Type</th>
                                    <th style={{ padding: '12px', fontWeight: '600' }}>Price</th>
                                    <th style={{ padding: '12px', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '12px', fontWeight: '600' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((service, index) => (
                                    <tr
                                        key={service.id}
                                        style={{
                                            backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                                            transition: 'background-color 0.3s ease',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : '#fff')}
                                    >
                                        <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>{index + 1}</td>
                                        <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>
                                            {service.name.length > 26 ? `${service.name.substring(0, 20)}...` : service.name}
                                        </td>
                                        <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>
                                            {service.description.length > 60
                                                ? service.description.slice(0, 60) + '...'
                                                : service.description}
                                        </td>
                                        <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>{service.type}</td>
                                        <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>${service.price}</td>
                                        <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>
                                            <span
                                                style={{
                                                    color: service.status === 'Active' ? '#1eb2a6' : '#f44336',
                                                    fontWeight: '600',
                                                }}
                                            >
                                                {service.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleDetailsClick(service.id)}
                                                style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '5px',
                                                    backgroundColor: '#1eb2a6',
                                                    color: 'white',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.3s ease',
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1eb2a6')}
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Paper>

            )}
        </Tabs.Content>
    );
};

export default ServicesSection;
