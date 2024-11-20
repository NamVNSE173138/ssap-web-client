import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { List, Tabs, Tab } from "@mui/material";
import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import { getRequestsByApplicantId } from "@/services/ApiServices/requestService";
import ServiceDetails from "../ServiceDetail";
import ApplicantRequestInfo from "../ApplicantRequestInformation";

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
};

const RequestHistory = () => {
    const user = useSelector((state: RootState) => state.token.user);
    const [applicants, setApplicants] = useState({
        pending: [],
        finished: [],
    });
    const [activeTab, setActiveTab] = useState<number>(0);
    const [openServiceDetail, setOpenServiceDetail] = useState({ open: "", id: 0 });

    const fetchRequests = async () => {
        try {
            if (!user) return;

            const response = await getRequestsByApplicantId(parseInt(user?.id));
            if (response.statusCode === 200) {
                const requests = response.data;
                setApplicants({
                    pending: requests.filter((req: any) => req.status === "Pending"),
                    finished: requests.filter((req: any) => req.status === "Finished"),
                });
            } else {
                setApplicants({
                    pending: [],
                    finished: [],
                });
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [user]);

    const renderApplicants = (requests: any) => {
        return (
            <div className="flex justify-center">
                <div className="space-y-4 w-4/5">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg shadow-md">
                        <p className="w-1/12 text-center">No.</p>
                        <p className="w-4/12 ml-5">Service Name</p>
                        <p className="w-4/12 text-center">Request Date</p>
                        <p className="w-4/12 text-right">Action</p>
                    </div>
                    {requests.map((request: any, index: any) => (
                        <div
                            key={request.id}
                            className="flex justify-between items-center p-4 bg-white border hover:shadow-lg rounded-lg transition-transform transform hover:scale-105 duration-200"
                        >
                            <p className="w-1/12 text-center text-gray-800">{index + 1}</p>
                            <Link
                                to={`/services-history/services/${request.requestDetails[0].serviceId}`}
                                className="w-4/12 ml-5 text-blue-600 font-medium underline hover:text-blue-800 transition"
                            >
                                {request.service.name}
                            </Link>
                            <p className="w-4/12 text-center text-gray-600">{formatDate(request.requestDate)}</p>
                            <Link
                                to={`/services-history/request/${request.id}`}
                                className="w-4/12 text-right text-blue-600 font-medium underline hover:text-blue-800 transition"
                            >
                                View Request
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (openServiceDetail.open === "ServiceDetail") {
        return <ServiceDetails showButtons={false} serviceId={{ id: openServiceDetail.id }} />;
    }

    if (openServiceDetail.open === "RequestDetail") {
        return <ApplicantRequestInfo showButtons={true} requestId={{ id: openServiceDetail.id }} />;
    }

    return (
        <div>
            <div className="relative">
                <ScholarshipProgramBackground />
                <div className="absolute top-0 bg-black/40 left-0 w-full h-full flex flex-col justify-between items-start p-16 z-10">
                    <Breadcrumb>
                        <BreadcrumbList className="text-white">
                            <BreadcrumbItem>
                                <Link to="/" className="md:text-xl text-lg">Home</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Link to="/services" className="md:text-xl text-lg">Services</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <p className="text-white md:text-xl text-lg">History</p>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>

            <div className="p-10 bg-white rounded-lg shadow-lg">
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    centered
                    indicatorColor="primary"
                    textColor="inherit"
                    sx={{
                        "& .MuiTab-root": {
                            fontFamily: "'Roboto', sans-serif",
                            fontWeight: 'bold',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            transition: 'background-color 0.3s',
                        },
                        "& .Mui-selected": {
                            backgroundColor: 'rgba(255, 223, 186, 0.8)',
                            color: '#444',
                        },
                        "& .MuiTab-root:not(.Mui-selected):hover": {
                            backgroundColor: 'rgba(255, 223, 186, 0.6)',
                        },
                    }}
                >
                    <Tab label="Pending" />
                    <Tab label="Finished" />
                </Tabs>

                <List sx={{ maxHeight: 400, overflow: "auto", p: 2 }}>
                    {activeTab === 0 && renderApplicants(applicants.pending)}
                    {activeTab === 1 && renderApplicants(applicants.finished)}
                </List>
            </div>
        </div>
    );
};

export default RequestHistory;
