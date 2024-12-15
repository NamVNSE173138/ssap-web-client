import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const UserGuide = () => {
    const user = useSelector((state: RootState) => state.token.user);
    if (user?.role === "Provider") {
        return (
            <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif', backgroundColor: '#e5f6f6' }}>
                <h1 style={{ fontSize: '38px', color: '#2C3E50', fontWeight: '700', marginBottom: '20px', marginTop: '50px' }}>
                    Provider Guide
                </h1>

                <div
                    style={{
                        fontSize: '20px',
                        lineHeight: '1.8',
                        color: '#555',
                        margin: '40px auto',
                        maxWidth: '900px',
                        padding: '30px 40px',
                        backgroundColor: '#ffffff',
                        borderRadius: '20px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                        textAlign: 'left',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            width: '60px',
                            height: '60px',
                            backgroundColor: '#FF6F20',
                            borderRadius: '50%',
                            opacity: 0.2,
                        }}
                    ></div>

                    <p style={{ marginBottom: '20px' }}>
                        First, once you successfully register as a Provider to create services for the SSAP, you must wait for us to review your application for system confirmation.
                    </p>
                    <p style={{ marginBottom: '20px' }}>
                        If your application is denied, you will need to resubmit your documents. If they are complete, we will review them again.
                    </p>
                    <p style={{ marginBottom: '20px' }}>
                        Once confirmed, you can create a wallet and add money to it. After funding your wallet, you can purchase our Subscription packages, which provide you with usage credits to “Add Service,” each of which has a validity period.
                    </p>
                    <p style={{ marginBottom: '20px' }}>
                        Upon successfully purchasing a Subscription package, you can “Add Service.” Each time you add a service, you will use one credit. You can also upgrade your package to increase your credits.
                    </p>
                    <p style={{ marginBottom: '20px' }}>
                        Once you add a service, if any applicants wish to utilize your services (we will notify you via the notification bell at the top), they will pay into your wallet. You can then find the service and view the applicants through the “View Applicants” button.
                    </p>
                    <p style={{ marginBottom: '20px' }}>
                        You must respond to applicant requests by commenting. If you do not comment within 7 days, we will temporarily lock your account due to unprofessional conduct.
                    </p>
                    <br></br>
                    <p style={{ fontWeight: 'bold', marginLeft: '570px' }}>
                        We wish you success!
                    </p>
                </div>
            </div>
        );
    }

    if (user?.role === "Applicant") {
        return (
            <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif', backgroundColor: '#e5f6f6' }}>
                <h1 style={{ fontSize: '38px', color: '#2C3E50', fontWeight: '700', marginBottom: '20px', marginTop: '50px' }}>
                    Applicant Guide
                </h1>

                <div style={{ position: 'relative' }}>
                    <div
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            width: '60px',
                            height: '60px',
                            backgroundColor: '#FF6F20',
                            borderRadius: '50%',
                            opacity: 0.2,
                        }}
                    ></div>
                    <div
                        style={{
                            fontSize: '20px',
                            lineHeight: '1.8',
                            color: '#555',
                            margin: '40px auto',
                            maxWidth: '900px',
                            padding: '30px 40px',
                            backgroundColor: '#ffffff',
                            borderRadius: '20px',
                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                            textAlign: 'left',
                        }}
                    >
                        <p style={{ marginBottom: '20px' }}>
                            First, once you successfully register as an Applicant on our SSAP, you must wait for the funder to review your application to confirm that you meet the criteria and requirements for the scholarship.
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            You need to create your own wallet and add funds because:
                        </p>
                        <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                            <li>- You may need money to purchase services from the Service Providers in our system. These services may include reviewing your CV or other assistance. When you purchase a service, you must pay 100% of the service fee, and the Provider will provide feedback.</li>
                            <li>- You can also chat with the Provider if you have questions about the service. After the Provider comments on your request, you can click "Finish" to complete the process, and you can provide feedback within 3 days of clicking Finish.</li>
                            <li>- You can view your transaction history through the "Wallet" section.</li>
                            <li>- The purpose of this wallet is for the funder to transfer money to you if you win the scholarship.</li>
                        </ul>
                        <p style={{ marginBottom: '20px' }}>
                            The funder will select the winners for the scholarship, and if you are denied, you will need to apply again (optional).
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            You must also submit the required documentation, such as your academic transcript reports, for each scholarship term. If you fail to submit these, the funder has the right to terminate the contract and stop funding your scholarship.
                        </p>
                        <p style={{ fontWeight: 'bold', marginLeft: '570px' }}>
                            We wish you success!
                        </p>
                    </div>
                </div>

            </div>
        );
    }

    if (user?.role === "Funder") {
        return (
            <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif', backgroundColor: '#e5f6f6' }}>
                <h1 style={{ fontSize: '38px', color: '#2C3E50', fontWeight: '700', marginBottom: '20px', marginTop: '50px' }}>
                    Funder Guide  
                </h1>

                <div
                    style={{
                        fontSize: '20px',
                        lineHeight: '1.8',
                        color: '#555',
                        margin: '40px auto',
                        maxWidth: '900px',
                        padding: '30px 40px',
                        backgroundColor: '#ffffff',
                        borderRadius: '20px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                        textAlign: 'left',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            width: '60px',
                            height: '60px',
                            backgroundColor: '#FF6F20',
                            borderRadius: '50%',
                            opacity: 0.2,
                        }}
                    ></div>

                    <p style={{ marginBottom: '20px' }}>
                        1. First, once you successfully register as a Funder to create services for the SSAP, you must wait for us to review your application for system confirmation.
                    </p>
                    <p style={{ marginBottom: '20px' }}>
                        If your application is denied, you will need to resubmit your documents. If they are complete, we will review them again.
                    </p>
                    <p style={{ marginBottom: '20px' }}>
                        2. Once confirmed, you can create a wallet and add money to it for your business.
                    </p>
                    <p style={{ marginBottom: '20px' }}>
                        3. Create a Scholarship Program Navigate to the **Scholarship Program** tab in your profile section to create a program. You can also view all programs you have created in this section.
                    </p>
                    <p style={{ marginBottom: '20px' }}>
                        4. View Applications: Click on a specific program to see all applications submitted by applicants.
                    </p>
                    <p style={{ marginBottom: '20px' }}>
                        5. Create Review Milestones: Set up two rounds of review milestones for the program:
                    </p>
                    <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                        <li>
                            - First Review: Application Review.
                        </li>
                        <li>
                            - Second Review: Interview.
                        </li>
                    </ul>
                    <p style={{ marginBottom: '20px' }}>
                        6. Assign Experts: Assign at least two experts with the same major as the program to review applications:
                    </p>
                    <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                        <li>
                            - Select Expert 1 → Assign Application 1 → System saves as First Review.
                            - Expert 1 scores the application (score out of 100).
                        </li>
                        <li>
                            - Select Expert 2 → Assign Application 1 → System saves as Second Review.
                            - Expert 2 scores the application (score out of 100).
                        </li>
                    </ul>
                    <p style={{ marginBottom: '20px' }}>
                        7. Choose Winners: After experts have reviewed and scored applications:
                    </p>
                    <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                        <li>
                            - View the First Review scores provided by Expert 1.
                        </li>
                        <li>
                            - View the Second Review scores provided by Expert 2.
                        </li>
                        <li>
                            - Calculate the average score from both reviews and approve applications to be awarded scholarships.
                        </li>
                    </ul>
                    <p style={{ marginBottom: '20px' }}>
                        8. Create Award Milestones: Distribute scholarships to the approved applications. The funder can ensure timely funding for successful applicants.
                    </p>
                    <br />
                    <p style={{ fontWeight: 'bold', marginLeft: '570px' }}>
                        We wish you success!
                    </p>
                </div>
            </div>
        );
    }
};

export default UserGuide;