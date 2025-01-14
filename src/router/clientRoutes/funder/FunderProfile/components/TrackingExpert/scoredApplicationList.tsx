import { Card } from "@/components/ui/card";
import { BASE_URL } from "@/constants/api";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ScoredList = () => {
  const user = useSelector((state: any) => state.token.user);
  const funderId = user?.id;

  const [experts, setExperts] = useState<any[]>([]);
  const [applications, setApplications] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const statusColor: any = {
    Submitted: "blue",
    Approved: "green",
    Rejected: "red",
    Failed: "red",
    Reviewing: "yellow",
    Passed:"green",
  };

  useEffect(() => {
    const fetchFunderExpertsAndApplications = async () => {
      if (!funderId) {
        setError("Funder ID is missing.");
        setLoading(false);
        return;
      }

      try {
        // Step 1: Fetch Experts Created by Funder
        const expertsResponse = await axios.get(
          `${BASE_URL}/api/funders/${funderId}/experts`
        );
        const fetchedExperts = expertsResponse.data.data || [];
        setExperts(fetchedExperts);

        // Step 2: Fetch Assigned Applications for Each Expert
        const applicationsPromises = fetchedExperts.map((expert: any) =>
          axios
            .get(`${BASE_URL}/api/experts/${expert.expertId}/assigned-applications`)
            .then((res) => ({
              expertId: expert.expertId,
              data: res.data.data,
            }))
        );

        const results = await Promise.all(applicationsPromises);

        // Combine results into a dictionary (expertId -> applications)
        const applicationsMap: Record<number, any[]> = {};
        results.forEach((result) => {
          // Filter applications with valid scores and sort them by score (descending)
          const filteredApplications = result.data
            .filter(
              (application: any) =>
                application.applicationReviews?.length > 0 &&
                application.applicationReviews[0]?.score !== undefined &&
                !isNaN(application.applicationReviews[0]?.score)
            )
            .sort(
              (a: any, b: any) =>
                Number(b.applicationReviews[0]?.score) -
                Number(a.applicationReviews[0]?.score)
            );

          applicationsMap[result.expertId] = filteredApplications;
        });

        setApplications(applicationsMap);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchFunderExpertsAndApplications();
  }, [funderId]);

  // Function to format date
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  if (loading) return <p>Loading experts and applications...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <Card className="p-4 shadow-lg">
      <div className="overflow-hidden">
        <div className="max-h-100 overflow-auto">
          <div className="grid grid-cols-6 gap-4 min-w-full">
            <div className="sticky top-0 bg-gray-100 font-semibold p-2 border-b">
              Name
            </div>
            <div className="sticky top-0 bg-gray-100 font-semibold p-2 border-b">
              Apply Date
            </div>
            <div className="sticky top-0 bg-gray-100 font-semibold p-2 border-b">
              Scholarship
            </div>
            <div className="sticky top-0 bg-gray-100 font-semibold p-2 border-b">
              Reviewed Expert
            </div>
            <div className="sticky top-0 bg-gray-100 font-semibold p-2 border-b">
              Score
            </div>
            <div className="sticky top-0 bg-gray-100 font-semibold p-2 border-b">
              Status
            </div>

            {/* Render sorted applications */}
            {experts.map((expert) =>
              applications[expert.expertId]?.map((application) => (
                <React.Fragment key={application.id}>
                  <div className="p-2 border-b">{application.applicantName}</div>
                  <div className="p-2 border-b">
                    {formatDate(application.appliedDate)}
                  </div>
                  <div className="p-2 border-b">
                    {application.scholarshipName}
                  </div>
                  <div className="p-2 border-b">{expert.name}</div>
                  <div className="p-2 border-b">
                    {application.applicationReviews[0]?.score}
                  </div>
                  <div className="p-2 border-b">
                    <span className={`relative inline-flex items-center justify-center h-3 w-3 rounded-full bg-${statusColor[application.applicationReviews[0]?.status]}-500`}>
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${statusColor[application.applicationReviews[0]?.status]}-500 opacity-75`}></span>
                    </span>
                    <span className={`text-${statusColor[application.applicationReviews[0]?.status]}-500 font-medium ml-2`}>
                      {application.applicationReviews[0]?.status}
                    </span>
                  </div>
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ScoredList;
