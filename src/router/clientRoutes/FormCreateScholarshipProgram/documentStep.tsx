import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const DocumentStep = () => {
  const documentOptions = [
    { id: 1, name: "Transcript" },
    { id: 2, name: "CV (Curriculum Vitae)" },
    { id: 3, name: "Recommendation Letter" },
    { id: 4, name: "Personal Statement" },
    { id: 5, name: "Portfolio" },
  ];

  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);

  const handleCheckboxChange = (id: number) => {
    setSelectedDocuments((prev) =>
      prev.includes(id) ? prev.filter((doc) => doc !== id) : [...prev, id]
    );
  };

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-6 gap-4 my-5">
          <div className="col-span-6">
            <h2 className="text-lg font-semibold">Required Documents</h2>
            <p className="text-sm text-gray-500">
              Select the documents applicants must submit for this scholarship.
            </p>
          </div>

          <div className="col-span-6 space-y-2">
            {documentOptions.map((doc) => (
              <div key={doc.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`doc-${doc.id}`}
                  checked={selectedDocuments.includes(doc.id)}
                  onCheckedChange={() => handleCheckboxChange(doc.id)}
                />
                <Label htmlFor={`doc-${doc.id}`} className="text-md">
                  {doc.name}
                </Label>
              </div>
            ))}
          </div>

          
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentStep;
