import { Card } from "@/components/ui/card";
import ApplicationStatus from "@/constants/applicationStatus";

interface Expert {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  status: string;
}

interface ExpertListProps {
  experts: Expert[];
  loading: boolean;
  error: string | null;
}

const statusColor = {
  [ApplicationStatus.Active]: "green",
};

const ExpertList = ({ experts, loading, error }: ExpertListProps) => {
  if (loading) {
    return <div>Loading experts...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <Card className="p-4 shadow-lg">
      <div className="overflow-hidden">
        <div className="max-h-100 overflow-auto">
          <div className="grid grid-cols-4 gap-4 min-w-full">
            <div className="sticky top-0 bg-gray-100 font-semibold p-2 border-b">
              Username
            </div>
            <div className="sticky top-0 bg-gray-100 font-semibold p-2 border-b">
              Email
            </div>
            <div className="sticky top-0 bg-gray-100 font-semibold p-2 border-b">
              Phone Number
            </div>
            <div className="sticky top-0 bg-gray-100 font-semibold p-2 border-b">
              Status
            </div>

            {experts.map((expert) => (
              <>
                <div key={`username-${expert.id}`} className="p-2 border-b">
                  {expert.username}
                </div>
                <div key={`email-${expert.id}`} className="p-2 border-b">
                  {expert.email}
                </div>
                <div key={`phoneNumber-${expert.id}`} className="p-2 border-b">
                  {expert.phoneNumber}
                </div>
                <div className="flex justify-start gap-2 p-2 border-b items-center">
                  <span className="relative flex h-3 w-3">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${
                        statusColor[expert.status]
                      }-500 opacity-75`}
                    ></span>
                    <span
                      className={`relative overflow-hidden inline-flex rounded-full h-3 w-3 bg-${
                        statusColor[expert.status]
                      }-500`}
                    ></span>
                  </span>
                  <span
                    className={`text-${
                      statusColor[expert.status]
                    }-500 font-medium`}
                  >
                    {expert.status}
                  </span>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExpertList;
