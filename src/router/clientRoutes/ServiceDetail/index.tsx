import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Spinner from "@/components/Spinner";
import RouteNames from "@/constants/routeNames";
import { deleteService, getServiceById } from "@/services/ApiServices/serviceService";
import { createRequest, getRequestsByService } from "@/services/ApiServices/requestService";
import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import AccountApplicantDialog from "./applicantrequests-dialog";

interface ServiceType {
    id: string;
    name: string;
    description: string;
    type: string;
    price: number;
    duration: string;
    status: string;
    providerId: string;
}

const ServiceDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [serviceData, setServiceData] = useState<ServiceType | null>(null);
    const [applicants, setApplicants] = useState<any>(null);
    const [applicantDialogOpen, setApplicantDialogOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    const [expectedCompletionTime, setExpectedCompletionTime] = useState<Date | null>(null);
    const [applicationNotes, setApplicationNotes] = useState<string>("");
    const [scholarshipType, setScholarshipType] = useState<string>("");
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.token.user);
    const isProvider = user?.role === "PROVIDER";

    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await getServiceById(Number(id));
                setServiceData(data.data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    const fetchApplicants = async (serviceId: number) => {
        try {
          const response = await getRequestsByService(serviceId);
          if (response.statusCode == 200) {
            setApplicants(response.data);
          }
          else {
            setError("Failed to get applicants");
          }
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      };
    
      const handleOpenApplicantDialog = async () => {
        setLoading(true);
        if(!serviceData) return;
        await fetchApplicants(parseInt(serviceData?.id));
        setLoading(false);
        setApplicantDialogOpen(true);
      };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteService(Number(id));
            navigate(RouteNames.ACTIVITY);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestNow = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setExpectedCompletionTime(null);
        setApplicationNotes("");
        setScholarshipType("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const requestData = {
            requestDate: new Date(),
            status: "REQUESTED",
            description: "SERVICE REQUESTED",
            serviceId: serviceData?.id,
            expectedCompletionTime,
            applicationNotes,
            scholarshipType,
            applicationFileUrl: "",
            applicantId: user?.id,
        };

        try {
            await createRequest(requestData);
            alert("Request created successfully!");
            closeDialog();
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner size="large" />;
    if (error) return <p className="text-center text-xl font-semibold">{error}</p>;
    if (!serviceData) return <p className="text-center text-xl font-semibold">Service not found</p>;

    return (
        <div>
            {isDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Create Request</h2>
                        {error && <p className="text-red-500">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Expected Completion Time</label>
                                <input
                                    type="date"
                                    onChange={(e) => setExpectedCompletionTime(new Date(e.target.value))}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700"> Notes</label>
                                <textarea
                                    onChange={(e) => setApplicationNotes(e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Scholarship Type</label>
                                <input
                                    type="text"
                                    onChange={(e) => setScholarshipType(e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeDialog}
                                    className="mr-2 bg-gray-300 rounded px-4 py-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white rounded px-4 py-2"
                                    disabled={loading}
                                >
                                    {loading ? "Submitting..." : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="relative">
                <ScholarshipProgramBackground />
                <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-start items-start p-[70px] gap-[170px] z-10">
                    <div>
                        <Breadcrumb>
                            <BreadcrumbList className="text-white">
                                <BreadcrumbItem>
                                    <Link to="/" className="md:text-xl text-lg">
                                        Home
                                    </Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <Link to="/services" className="text-white md:text-xl text-lg">
                                        Services
                                    </Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <p className="text-white md:text-xl text-lg">{serviceData.name}</p>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className={isProvider ? "w-2/3" : ""}>
                        <div className="lg:flex-row items-center flex-row flex gap-[20px]">
                            <div>
                                <p className="text-white text-5xl lg:line-clamp-3 line-clamp-5">
                                    {serviceData.name}
                                </p>
                            </div>
                        </div>
                        <div className="text-white text-center flex h-[50px] mt-[26px]">
                            <div className="flex justify-between w-full gap-10">
                                {!isProvider ? (
                                    <button
                                        onClick={handleRequestNow}
                                        className="text-xl w-full bg-blue-700 rounded-[25px]"
                                    >
                                        Request now
                                    </button>
                                ) : (
                                <>
                                    <button onClick={() => navigate("")} className="text-xl w-full bg-blue-700 rounded-[25px]">
                                        Edit
                                    </button>
                                    <button onClick={handleOpenApplicantDialog} className="text-xl w-full bg-blue-700 rounded-[25px]">
                                        View Request
                                    </button>
                                    <button onClick={handleDelete} className="text-xl w-full bg-red-900 rounded-[25px]">
                                        Delete
                                    </button>
                                </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="bg-white py-10">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-semibold mb-6">Service Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="font-semibold">Service Type:</p>
                            <p>{serviceData.type}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Price:</p>
                            <p>${serviceData.price}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Duration:</p>
                            <p>{new Date(serviceData.duration).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Status:</p>
                            <p>{serviceData.status}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Provider Information:</p>
                            <p>{serviceData.providerId}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gray-100 py-10">
                <div className="container mx-auto px-6">
                    <h3 className="text-2xl font-semibold mb-4">About This Service</h3>
                    <p>{serviceData.description}</p>
                </div>
            </section>
            <AccountApplicantDialog open={applicantDialogOpen} 
            onClose={() => setApplicantDialogOpen(false)} applications={applicants ?? []}/>
        </div>
    );
};

export default ServiceDetails;
