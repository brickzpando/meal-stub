"use client";
import { useState } from "react";
import { toast } from "@heroui/react";
import { useEmployeesBasic } from "@/hooks/employees/useEmployees";
import { useIssueRewardStub } from "@/hooks/transactions/useIssueRewardStub";
import {
  Button,
  ComboBox,
  Input,
  Label,
  ListBox,
  TextArea,
} from "@heroui/react";
import { Gift, PhilippinePeso, FileText, Award } from "lucide-react";

export default function RewardStubForm() {
  const [employeeId, setEmployeeId] = useState("");
  const [amount, setAmount] = useState(100);
  const [reason, setReason] = useState("");

  const { data: employees = [] } = useEmployeesBasic();

  const { mutate: issueReward, isPending } = useIssueRewardStub();

  const handleSubmit = () => {
    if (!employeeId) {
      toast.warning("No employee selected", {
        description: "Please select an employee.",
      });
      return;
    }

    if (!reason.trim()) {
      toast.warning("Missing reward reason", {
        description: "Please provide a reward reason.",
      });
      return;
    }

    if (amount <= 0) {
      toast.warning("Invalid amount", {
        description: "Reward amount must be greater than zero.",
      });
      return;
    }

    issueReward(
      {
        employeeId,
        amount,
        reason,
      },
      {
        onSuccess: () => {
          setEmployeeId("");
          setAmount(100);
          setReason("");

          toast.success("Reward issued", {
            description: `₱${amount} reward successfully granted.`,
          });
        },

        onError: (err) => {
          toast.danger("Failed to issue reward", {
            description:
              err instanceof Error ? err.message : "Something went wrong.",
          });
        },
      },
    );
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
          <Gift className="h-5 w-5 text-emerald-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Reward Stub Issuance
          </h3>
          <p className="text-sm text-slate-500">
            Issue reward credits for achievements.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="mb-2 block text-sm font-medium text-slate-700">
            Employee
          </Label>

          <ComboBox
            selectedKey={employeeId}
            onSelectionChange={(key) => setEmployeeId(String(key))}
          >
            <ComboBox.InputGroup>
              <Input className="border border-gray-300" />
              <ComboBox.Trigger />
            </ComboBox.InputGroup>

            <ComboBox.Popover>
              <ListBox className="max-h-48 overflow-y-auto">
                {employees.map((emp) => (
                  <ListBox.Item
                    key={emp.id}
                    id={emp.id}
                    textValue={emp.fullName}
                  >
                    {emp.fullName}
                  </ListBox.Item>
                ))}
              </ListBox>
            </ComboBox.Popover>
          </ComboBox>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <PhilippinePeso className="h-4 w-4" />
            Reward Amount
          </label>

          <Input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="border border-gray-300"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <FileText className="h-4 w-4" />
            Reward Reason
          </label>

          <TextArea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-300"
          />
        </div>

        <Button
          size="lg"
          className="w-full rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
          onPress={handleSubmit}
          isDisabled={isPending}
        >
          <Award className="h-4 w-4" />
          Grant Reward
        </Button>
      </div>
    </div>
  );
}
