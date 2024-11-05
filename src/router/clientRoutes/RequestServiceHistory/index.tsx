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
        accepted: [],
        rejected: [],
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
                    accepted: requests.filter((req: any) => req.status === "Accepted"),
                    rejected: requests.filter((req: any) => req.status === "Rejected"),
                    finished: requests.filter((req: any) => req.status === "Finished"),
                });
            } else {
                setApplicants({
                    pending: [],
                    accepted: [],
                    rejected: [],
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
            <div className="space-y-2">
                <div className="flex justify-between items-center p-4 bg-gray-200 font-semibold text-gray-700 rounded-lg">
                    <p className="w-1/3">Service Name</p>
                    <p className="w-1/3 text-center">Request Date</p>
                    <p className="w-1/3 text-right">Action</p>
                </div>

                {requests.map((request: any) => (
                    <div
                        key={request.id}
                        className="flex justify-between items-center p-4 border-b hover:bg-gray-100 rounded-lg transition"
                    >
                        <Link
                        to={``}
                        onClick={() => {
                            setOpenServiceDetail({open: "ServiceDetail", id: request.requestDetails[0].service.id});
                        }}
                        className="w-1/3 text-blue-600 underline hover:text-blue-800"
                    >
                        {request.requestDetails[0].service.name}
                    </Link>
                        <p className="w-1/3 text-center">{formatDate(request.requestDate)}</p>
                        <Link
                            to={``}
                            onClick={() => {
                                setOpenServiceDetail({open:"RequestDetail", id:request.id});
                            }}
                            className="w-1/3 text-right text-blue-600 underline hover:text-blue-800"
                        >
                            View Request
                        </Link>
                    </div>
                ))}
            </div>
        );
    };
    if(openServiceDetail.open == "ServiceDetail"){return <ServiceDetails showButtons={false} serviceId={{id: openServiceDetail.id}}/>}
    if(openServiceDetail.open == "RequestDetail"){return <ApplicantRequestInfo showButtons={true} requestId={{id: openServiceDetail.id}}/>}

    return (
        <div>
            <div className="relative">
                <ScholarshipProgramBackground />
                <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-between items-start p-[70px] z-10">
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

            <div className="p-10">
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    centered
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                    <Tab label="Pending" />
                    <Tab label="Accepted" />
                    <Tab label="Rejected" />
                    <Tab label="Finished" />
                </Tabs>

                <List sx={{ maxHeight: 400, overflow: "auto", p: 2 }}>
                    {activeTab === 0 && renderApplicants(applicants.pending)}
                    {activeTab === 1 && renderApplicants(applicants.accepted)}
                    {activeTab === 2 && renderApplicants(applicants.rejected)}
                    {activeTab === 3 && renderApplicants(applicants.finished)}
                </List>
            </div>
        </div>
    );
};

export default RequestHistory;
