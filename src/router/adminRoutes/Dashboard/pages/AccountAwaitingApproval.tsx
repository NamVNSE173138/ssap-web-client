import { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaTimesCircle } from "react-icons/fa";
import { AiOutlineUser, AiOutlineCheckCircle } from "react-icons/ai";
import { getProviderProfile } from "@/services/ApiServices/providerService";
import { getFunderProfile } from "@/services/ApiServices/funderService";
import { SendNotificationAndEmailReject } from "@/services/ApiServices/notification";
import { notification } from "antd";
import { getAllAccounts, updateAccount } from "@/services/ApiServices/accountService";

type AccountWithRole = {
    id: string;
    username: string;
    phoneNumber?: string;
    email?: string;
    hashedPassword: string;
    roleId?: number;
    address?: string;
    loginWithGoogle: boolean;
    avatarUrl?: string;
    status?: string;
    roleName: string;
};

interface AccountWithDetails extends AccountWithRole {
    organizationName?: string;
    contactPersonName?: string;
    providerDocuments?: { name: string, type: string, fileUrl: string }[];
    funderDocuments?: { name: string, type: string, fileUrl: string }[];
}


const AccountAwaitingApproval = () => {
    const [activeTab, setActiveTab] = useState("providers");
    const [providers, setProviders] = useState<AccountWithRole[]>([]);
    const [funders, setFunders] = useState<AccountWithRole[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [emailContent, setEmailContent] = useState<string>("");
    const [rejectedUser, setRejectedUser] = useState<AccountWithRole | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfiles = async () => {
            setIsLoading(true);
            try {
                const getAllAccountsResponse = await getAllAccounts();
                console.log(getAllAccountsResponse);

                const filteredProviders = getAllAccountsResponse.filter(
                    (account: AccountWithRole) => account.roleId === 4 && account.status === "Pending"
                );

                const filteredFunders = getAllAccountsResponse.filter(
                    (account: AccountWithRole) => account.roleId === 2 && account.status === "Pending"
                );

                const providersWithDetails: AccountWithDetails[] = await Promise.all(
                    filteredProviders.map(async (provider: AccountWithRole) => {
                        const providerDetails = await getProviderProfile(Number(provider.id));
                        console.log(providerDetails);
                        return { ...provider, ...providerDetails.data };
                    })
                );

                const fundersWithDetails: AccountWithDetails[] = await Promise.all(
                    filteredFunders.map(async (funder: AccountWithRole) => {
                        const funderDetails = await getFunderProfile(Number(funder.id));
                        console.log(funderDetails);
                        return { ...funder, ...funderDetails.data };
                    })
                );

                setProviders(providersWithDetails);
                setFunders(fundersWithDetails);
            } catch (error) {
                console.error("Error fetching profiles", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    const handleApprove = async (user: AccountWithRole) => {
        setLoading(true);
        try {
            await updateAccount({
                id: user.id,
                username: user.username,
                phoneNumber: user.phoneNumber,
                email: user.email,
                hashedPassword: user.hashedPassword,
                roleId: user.roleId,
                address: user.address,
                avatarUrl: user.avatarUrl,
                status: "Active",
                roleName: user.roleName,
            });
            notification.success({ message: "Account approved successfully." });
        } catch (error) {
            console.error("Error approving account:", error);
            notification.error({ message: "Error approving account." });
        } finally {
            setLoading(false);
        }
    };

    const handleReject = (user: AccountWithRole) => {
        setRejectedUser(user);
        setEmailContent("");
    };

    const handleSendRejectionEmail = async () => {
        if (!emailContent) {
            notification.error({ message: "Please provide a rejection reason." });
            return;
        }
        setLoading(true);
        try {
            await SendNotificationAndEmailReject(rejectedUser?.id + "", emailContent);

            await updateAccount({
                id: rejectedUser?.id,
                username: rejectedUser?.username,
                phoneNumber: rejectedUser?.phoneNumber,
                email: rejectedUser?.email,
                hashedPassword: rejectedUser?.hashedPassword,
                roleId: rejectedUser?.roleId,
                address: rejectedUser?.address,
                avatarUrl: rejectedUser?.avatarUrl,
                status: "NeedUploadMore",
                roleName: rejectedUser?.roleName,
            });
            notification.success({ message: "Rejection email sent successfully." });
            setRejectedUser(null);
        } catch (error) {
            console.error("Error rejecting account:", error);
            notification.error({ message: "Error rejecting account." });
        } finally {
            setLoading(false);
        }
    };

    const renderTable = (data: AccountWithDetails[], isProvider: boolean) => (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg mt-4 ml-0">
            <table className="min-w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        <th className="px-6 py-3 border-b text-sm font-medium">No</th>
                        <th className="px-6 py-3 border-b text-sm font-medium">ID</th>
                        <th className="px-6 py-3 border-b text-sm font-medium">Avatar</th>
                        <th className="px-6 py-3 border-b text-sm font-medium">Email</th>
                        <th className="px-6 py-3 border-b text-sm font-medium">Organization Name</th>
                        <th className="px-6 py-3 border-b text-sm font-medium">Contact Person</th>
                        <th className="px-6 py-3 border-b text-sm font-medium">Documents</th>
                        <th className="px-6 py-3 border-b text-sm font-medium">Status</th>
                        <th className="px-6 py-3 border-b text-sm font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user, index) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-all duration-200">
                            <td className="px-6 py-4 border-b text-sm">{index + 1}</td>
                            <td className="px-6 py-4 border-b text-sm">{user.id}</td>
                            <td className="px-6 py-4 border-b text-sm">
                                <img src={user.avatarUrl || "https://github.com/shadcn.png"} alt="avatar" className="w-12 h-12 rounded-full" />
                            </td>
                            <td className="px-6 py-4 border-b text-sm">{user.email}</td>
                            <td className="px-6 py-4 border-b text-sm">{user.organizationName}</td>
                            <td className="px-6 py-4 border-b text-sm">{user.contactPersonName}</td>
                            <td className="px-6 py-4 border-b text-sm">
                                <ul className="list-disc pl-4">
                                    {(user.providerDocuments || user.funderDocuments)?.map((doc, idx) => (
                                        <li key={idx} className="text-blue-600 hover:underline text-sm">
                                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                                {doc.name} - {doc.type}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td className="px-6 py-4 border-b text-sm">
                                <span className={`px-2 py-1 rounded-md text-white ${user.status === "Active" ? "bg-green-500" : user.status === "Pending" ? "bg-yellow-500" : "bg-red-500"}`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 border-b text-sm">
                                <Button onClick={() => handleApprove(user)} className="bg-green-500 text-white hover:bg-green-600 mr-2 flex items-center">
                                    <AiOutlineCheckCircle className="inline-block mr-2" />
                                    Approve
                                </Button>
                                <Button onClick={() => handleReject(user)} className="bg-red-500 text-white hover:bg-red-600 flex items-center mt-2">
                                    <FaTimesCircle className="inline-block mr-2" />
                                    Need Upload More
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );


    return (
        <div className="w-full max-w-8xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
                <Tabs.List className="flex justify-center space-x-6 mb-6">
                    <Tabs.Trigger
                        value="providers"
                        className="py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:bg-indigo-700 rounded-t-md"
                    >
                        <AiOutlineUser className="inline-block mr-2" />
                        Providers
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="funders"
                        className="py-2 px-4 bg-gradient-to-r from-green-500 to-teal-500 text-white hover:bg-teal-700 rounded-t-md"
                    >
                        <AiOutlineUser className="inline-block mr-2" />
                        Funders
                    </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="providers" className="pt-4">
                    {renderTable(providers, true)}
                </Tabs.Content>

                <Tabs.Content value="funders" className="pt-4">
                    {renderTable(funders, false)}
                </Tabs.Content>
            </Tabs.Root>

            {rejectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold text-red-600">
                            <FaTimesCircle className="inline-block mr-2" />
                            Reject User
                        </h3>
                        <p className="mt-2 text-gray-700">Please provide a reason for rejecting the user.</p>
                        <Input
                            type="text"
                            value={emailContent}
                            onChange={(e) => setEmailContent(e.target.value)}
                            placeholder="Rejection reason"
                            className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                        />
                        <div className="mt-4 flex justify-between space-x-4">
                            <Button onClick={handleSendRejectionEmail} className="bg-red-500 text-white hover:bg-red-600">
                                Send Email
                            </Button>
                            <Button onClick={() => setRejectedUser(null)} className="bg-gray-500 text-white hover:bg-gray-600">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountAwaitingApproval;
