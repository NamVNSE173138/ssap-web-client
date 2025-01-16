import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "@/constants/api";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AssigningExpert = () => {
  const user = useSelector((state: any) => state.token.user);
  const funderId = user?.id;

  const [experts, setExperts] = useState<any[]>([]);
  const [applications, setApplications] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFunderExpertsAndApplications = async () => {
      if (!funderId) {
        setError("Funder ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const expertsResponse = await axios.get(
          `${BASE_URL}/api/funders/${funderId}/experts`
        );
        const fetchedExperts = expertsResponse.data.data || [];
        setExperts(fetchedExperts);
        
        const applicationsPromises = fetchedExperts.map((expert: any) =>
          axios
            .get(`${BASE_URL}/api/experts/${expert.expertId}/assigned-applications`)
            .then((res) => ({ expertId: expert.expertId, data: res.data.data }))
        );

        const results = await Promise.all(applicationsPromises);
        console.log("results", results);

        const applicationsMap: Record<number, any[]> = {};
        results.forEach((result) => {
          applicationsMap[result.expertId] = result.data;
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

  if (loading) return <p>Loading experts and applications...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      {experts.length === 0 ? (
        <p>No experts have been created yet.</p>
      ) : (
        <div className="space-y-4">
          {experts.map((expert, index) => (
            <Accordion key={expert.expertId} defaultExpanded={index === 0}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${expert.id}-content`}
                id={`panel-${expert.id}-header`}
              >
                <h3 className="text-lg font-semibold">
                  {expert.name} ({expert.email})
                </h3>
              </AccordionSummary>
              <AccordionDetails>
                <p>Major: {expert.major}</p>
                {applications[expert.expertId]?.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {applications[expert.expertId].map((app) => (
                      <li
                        key={app.id}
                        className="p-2 border rounded-lg bg-gray-100"
                      >
                        <p>
                          <strong>Applicant Name:</strong> {app.applicantName}
                        </p>
                        <p>
                          <strong>Status:</strong> {app.status}
                        </p>
                        <p>
                          <strong>Applied Date:</strong>{" "}
                          {new Date(app.appliedDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Score:</strong>{" "}
                          {app.applicationReviews[0]?.score}
                        </p>

                        {/* Show Application Documents */}
                        <div>
                          <strong>Documents:</strong>
                          <ul className="ml-4 list-disc">
                            {app.applicationDocuments.map((doc: any) => (
                              <li key={doc.id}>
                                {doc.name} ({doc.type}) -{" "}
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline"
                                >
                                  View
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-gray-500">
                    No applications assigned to this expert yet.
                  </p>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssigningExpert;
