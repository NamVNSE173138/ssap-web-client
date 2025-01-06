import React, { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaTimesCircle } from "react-icons/fa";
import { AiOutlineUser, AiOutlineCheckCircle } from "react-icons/ai";
import { getProviderProfile } from "@/services/ApiServices/providerService";
import { getFunderProfile } from "@/services/ApiServices/funderService";
import { AccountActiveEmail, SendNotificationAndEmailReject } from "@/services/ApiServices/notification";
import { notification } from "antd";
import { getAllAccounts, updateAccount } from "@/services/ApiServices/accountService";
import { Paper } from "@mui/material";

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
    accountId: string;
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
    const [_isLoading, setIsLoading] = useState<boolean>(false);
    const [emailContent, setEmailContent] = useState<string>("");
    const [rejectedUser, setRejectedUser] = useState<AccountWithRole | null>(null);
    const [_loading, setLoading] = useState(false);

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
                        return { ...provider, ...providerDetails.data, accountId: provider.id };
                    })
                );

                const fundersWithDetails: AccountWithDetails[] = await Promise.all(
                    filteredFunders.map(async (funder: AccountWithRole) => {
                        const funderDetails = await getFunderProfile(Number(funder.id));
                        console.log(funderDetails);
                        return { ...funder, ...funderDetails.data, accountId: funder.id };
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
                id: user.accountId,
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
            await AccountActiveEmail(Number(user.accountId));
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
                id: rejectedUser?.accountId,
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

    const renderTable = (data: AccountWithDetails[], _isProvider: boolean) => (
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
            {/* Header Row */}
            <div
                style={{
                    display: 'flex',
                    fontWeight: 'bold',
                    backgroundColor: '#f1f1f1',
                    padding: '10px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                }}
            >
                <div style={{ flex: 0.5 }}>No</div>
                <div style={{ flex: 0.5 }}>ID</div>
                <div style={{ flex: 1 }}>Avatar</div>
                <div style={{ flex: 2.5, marginRight:'20px' }}>Email</div>
                <div style={{ flex: 1.5, marginRight:'20px' }}>Organization Name</div>
                <div style={{ flex: 1, marginRight:'20px' }}>Contact Name</div>
                <div style={{ flex: 2.5, marginRight:'20px' }}>Documents</div>
                <div style={{ flex: 1, marginRight:'20px' }}>Status</div>
                <div style={{ flex: 2.5, marginRight:'20px' }}>Actions</div>
            </div>

            {/* Data Rows */}
            {data.map((user, index) => (
                <React.Fragment key={user.id}>
                    <div
                        style={{
                            display: 'flex',
                            padding: '10px',
                            cursor: 'pointer',
                            backgroundColor: '#fff',
                            borderBottom: '1px solid #ddd',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                    >
                        <div style={{ flex: 0.5 }}>{index + 1}</div>
                        <div style={{ flex: 0.5 }}>{user.accountId}</div>
                        <div style={{ flex: 1 }}>
                            <img
                                src={user.avatarUrl || 'https://github.com/shadcn.png'}
                                alt="avatar"
                                style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                            />
                        </div>
                        <div style={{ flex: 2.5, marginRight:'20px' }}>{user.email}</div>
                        <div style={{ flex: 1.5, marginRight:'20px' }}>{user.organizationName}</div>
                        <div style={{ flex: 1, marginRight:'20px' }}>{user.contactPersonName}</div>
                        <div style={{ flex: 2.5, marginRight:'20px' }}>
                            <ul>
                                {(user.providerDocuments || user.funderDocuments)?.map((doc, idx) => (
                                    <li key={idx} style={{ fontSize: '14px' }}>
                                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                                            {doc.name} - {doc.type}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{ flex: 1, marginRight:'20px' }}>
                            <span
                                style={{
                                    display: 'inline-block',
                                    padding: '5px 10px',
                                    borderRadius: '12px',
                                    backgroundColor: user.status === 'Active' ? '#4CAF50' : user.status === 'Pending' ? '#FFEB3B' : '#F44336',
                                    color: '#fff',
                                }}
                            >
                                {user.status}
                            </span>
                        </div>
                        <div style={{ flex: 2.5 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Button
                                    onClick={() => handleApprove(user)}
                                    style={{
                                        backgroundColor: 'green',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <AiOutlineCheckCircle style={{ marginRight: '8px' }} />
                                    Approve
                                </Button>
                                <Button
                                    onClick={() => handleReject(user)}
                                    style={{
                                        backgroundColor: 'red',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <FaTimesCircle style={{ marginRight: '8px' }} />
                                    Need Upload More
                                </Button>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </Paper>

    );


    return (
        <div className="">
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
