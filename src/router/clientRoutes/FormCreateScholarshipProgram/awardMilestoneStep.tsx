import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Milestone {
  id: number;
  name: string;
  date: string;
  amount: string;
}

const AwardMilestoneStep = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [nextId, setNextId] = useState(1);

  const addMilestone = () => {
    setMilestones([...milestones, { id: nextId, name: "", date: "", amount: "" }]);
    setNextId(nextId + 1);
  };

  const updateMilestone = (id: number, field: keyof Milestone, value: string) => {
    setMilestones(
      milestones.map((milestone) =>
        milestone.id === id ? { ...milestone, [field]: value } : milestone
      )
    );
  };

  const removeMilestone = (id: number) => {
    setMilestones(milestones.filter((milestone) => milestone.id !== id));
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-lg font-semibold mb-4">Scholarship Payment Milestones</h2>

        {/* Danh sách các cột mốc */}
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className="grid grid-cols-12 gap-4 items-center mb-4 border-b pb-4"
          >
            {/* Tên cột mốc */}
            <div className="col-span-4">
              <Label htmlFor={`milestone-name-${milestone.id}`} className="text-md">
                Milestone Name
              </Label>
              <Input
                id={`milestone-name-${milestone.id}`}
                type="text"
                placeholder="e.g., First Installment"
                value={milestone.name}
                onChange={(e) =>
                  updateMilestone(milestone.id, "name", e.target.value)
                }
              />
            </div>

            {/* Ngày chi trả */}
            <div className="col-span-4">
              <Label htmlFor={`milestone-date-${milestone.id}`} className="text-md">
                Payment Date
              </Label>
              <Input
                id={`milestone-date-${milestone.id}`}
                type="date"
                value={milestone.date}
                onChange={(e) =>
                  updateMilestone(milestone.id, "date", e.target.value)
                }
              />
            </div>

            {/* Số tiền */}
            <div className="col-span-3">
              <Label htmlFor={`milestone-amount-${milestone.id}`} className="text-md">
                Amount (USD)
              </Label>
              <Input
                id={`milestone-amount-${milestone.id}`}
                type="number"
                placeholder="e.g., 1000"
                value={milestone.amount}
                onChange={(e) =>
                  updateMilestone(milestone.id, "amount", e.target.value)
                }
              />
            </div>

            {/* Nút xoá */}
            <div className="col-span-1">
              <Button
                variant="destructive"
                className="mt-6"
                onClick={() => removeMilestone(milestone.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}

        {/* Nút thêm cột mốc */}
        <div className="mt-4">
          <Button variant="default" onClick={addMilestone}>
            Add Milestone
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AwardMilestoneStep;
