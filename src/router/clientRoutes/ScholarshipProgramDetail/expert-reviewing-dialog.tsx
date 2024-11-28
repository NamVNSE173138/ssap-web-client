import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface ReviewingApplicationDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  expert: any;
  fetchApplications: () => Promise<any[]>;
}

const ReviewingApplicationDialog: React.FC<ReviewingApplicationDialogProps> = ({
  open,
  onClose,
  expert,
  fetchApplications,
}) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      try {
        const fetchedApplications = await fetchApplications();
        setApplications(fetchedApplications);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadApplications();
    }
  }, [open, fetchApplications]);

  return (
    <Dialog open={open} onClose={() => onClose(false)} fullWidth maxWidth="md">
      <DialogTitle>Reviewing Applications for {expert?.name}</DialogTitle>
      <DialogContent>
  {loading ? (
    <p>Loading applications...</p>
  ) : applications && applications.length > 0 ? (
    <ul className="space-y-4">
      {applications.map((app) => (
        <li
          key={app.id}
          className="p-4 border rounded-lg shadow bg-gray-100"
        >
          <p><strong>Application ID:</strong> {app.id}</p>
          <p><strong>Status:</strong> {app.status}</p>
          <p>
            <strong>Applied Date:</strong>{" "}
            {new Date(app.appliedDate).toLocaleDateString()}
          </p>
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
    <p>No applications assigned to this expert yet.</p>
  )}
</DialogContent>

      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewingApplicationDialog;
