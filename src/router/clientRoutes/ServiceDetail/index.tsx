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
import { deleteService, getServiceById, updateService } from "@/services/ApiServices/serviceService";
import { checkUserRequest, createRequest, getRequestsByService } from "@/services/ApiServices/requestService";
import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import AccountApplicantDialog from "./applicantrequests-dialog";
import { uploadFile } from "@/services/ApiServices/testService";
import { faL } from "@fortawesome/free-solid-svg-icons";

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
    const [applicationFileUrl, setapplicationFileUrl] = useState<any>(null);
    const [editData, setEditData] = useState<ServiceType | null>(null);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.token.user);
    const isProvider = user?.role === "PROVIDER";
    const isFunder = user?.role === "FUNDER";
    const [canEdit, setCanEdit] = useState<boolean>(true);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await getServiceById(Number(id));
                const response = await fetchApplicants(data.data.id);
                console.log(response)
                setServiceData(data.data);
                if (response.length == 0) {
                    setCanEdit(true);
                } else {
                    setCanEdit(false);
                }
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    const openEditDialog = () => {
        setEditData(serviceData);
        setEditDialogOpen(true);
    };

    const handleEditChange = (field: keyof ServiceType, value: string | number | Date) => {
        if (editData) {
            setEditData({ ...editData, [field]: value });
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editData) return;

        setLoading(true);
        try {
            await updateService(Number(id), editData);
            setServiceData(editData);
            setEditDialogOpen(false);
            alert("Service updated successfully!");
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplicants = async (serviceId: number) => {
        try {
            const response = await getRequestsByService(serviceId);
            if (response.statusCode == 200) {
                setApplicants(response.data);
                return response.data;
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
        if (!serviceData) return;
        await fetchApplicants(parseInt(serviceData?.id));
        setLoading(false);
        setApplicantDialogOpen(true);
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Do you really want to delete?");
        if (!confirmDelete || !serviceData) return;

        setLoading(true);
        try {
            const updatedData = { ...serviceData, status: "Inactive" };
            await updateService(Number(id), updatedData);

            setServiceData(updatedData);
            alert("Service marked as inactive successfully!");
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
        setapplicationFileUrl("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("File", applicationFileUrl);

        const fileUrl = await uploadFile(formData);

        const requestData = {
            description: "SERVICE REQUESTED",
            requestDate: new Date(),
            status: "REQUESTED",
            applicantId: user?.id,
            requestDetails: [{
                expectedCompletionTime,
                applicationNotes,
                scholarshipType,
                applicationFileUrl: fileUrl.url,
                serviceId: serviceData?.id,
            }
            ]
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
                            <div className="mb-4">
                                <label className="block text-gray-700">Application File</label>
                                <input
                                    type="file"
                                    onChange={(e) => setapplicationFileUrl(e.target.files?.[0])}
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
                                {(!isFunder && !isProvider) ? (
                                    <button
                                        onClick={handleRequestNow}
                                        className="text-xl w-full bg-blue-700 rounded-[25px]"
                                    >
                                        Request now
                                    </button>
                                ) : ((!isFunder && isProvider) ?(
                                    <>
                                        <button onClick={() => openEditDialog()} className="text-xl w-full bg-blue-700 rounded-[25px]" disabled={!canEdit}>
                                            Edit
                                        </button>
                                        {isEditDialogOpen && (
                                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                                <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full space-y-6">
                                                    <h2 className="text-2xl font-semibold text-center text-blue-800">Edit Service Details</h2>

                                                    <form onSubmit={handleEditSubmit} className="space-y-4">
                                                        {[
                                                            { label: "Name", field: "name", type: "text" },
                                                            { label: "Description", field: "description", type: "textarea" },
                                                            { label: "Type", field: "type", type: "text" },
                                                            { label: "Price", field: "price", type: "number" },
                                                            { label: "Status", field: "status", type: "text", disabled: true },
                                                        ].map(({ label, field, type, disabled }) => (
                                                            <div key={field} className="space-y-1">
                                                                <label className="block text-gray-700 font-medium">{label}</label>
                                                                {type === "textarea" ? (
                                                                    <textarea
                                                                        value={(editData as any)[field] || ""}
                                                                        onChange={(e) => handleEditChange(field as keyof ServiceType, e.target.value)}
                                                                        className="w-full text-black-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        placeholder={`Enter ${label.toLowerCase()}`}
                                                                        disabled={disabled}
                                                                    />
                                                                ) : (
                                                                    <input
                                                                        type={type}
                                                                        value={(editData as any)[field] || ""}
                                                                        onChange={(e) => handleEditChange(field as keyof ServiceType, e.target.value)}
                                                                        className="w-full p-2 text-black-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        placeholder={`Enter ${label.toLowerCase()}`}
                                                                        disabled={disabled}
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}

                                                        <div className="space-y-1">
                                                            <label className="block text-gray-700 font-medium">Duration</label>
                                                            <input
                                                                type="date"
                                                                value={editData?.duration ? new Date(editData.duration).toISOString().substring(0, 10) : ""}
                                                                onChange={(e) => handleEditChange("duration", new Date(e.target.value))}
                                                                className="w-full p-2 border text-black-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>

                                                        <div className="flex justify-end space-x-3 pt-6">
                                                            <button
                                                                type="button"
                                                                onClick={() => setEditDialogOpen(false)}
                                                                className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 ${loading ? "opacity-50 cursor-not-allowed" : ""
                                                                    }`}
                                                                disabled={loading}
                                                            >
                                                                {loading ? "Updating..." : "Update"}
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        )}


                                        <button onClick={handleOpenApplicantDialog} className="text-xl w-full bg-blue-700 rounded-[25px]">
                                            View Request
                                        </button>
                                        <button onClick={handleDelete} className="text-xl w-full bg-red-900 rounded-[25px]">
                                            Delete
                                        </button>
                                    </>
                                ):(<div></div>))}
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
                onClose={() => setApplicantDialogOpen(false)} applications={applicants ?? []} />
        </div>
    );
};

export default ServiceDetails;
