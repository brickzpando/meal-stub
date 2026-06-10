"use client";
import { useState } from "react";
import { useMealStub } from "@/context/MealStubContext";
import { currentWeek, today } from "@/lib/helpers";
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
  const { transactions, setTransactions, employees } = useMealStub();

  const [employeeId, setEmployeeId] = useState("");

  const [amount, setAmount] = useState(100);

  const [reason, setReason] = useState("");

  const issueReward = () => {
    if (!employeeId) {
      alert("Select employee");
      return;
    }

    if (amount <= 0) {
      alert("Invalid amount");
      return;
    }

    const transaction = {
      id: crypto.randomUUID(),
      empId: employeeId,
      type: "reward" as const,
      stubType: "reward" as const,
      amount,
      date: today(),
      week: currentWeek(),
      note: reason,
    };

    setTransactions([...transactions, transaction]);

    setEmployeeId("");

    setAmount(100);

    setReason("");

    alert("Reward issued");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
          <Gift className="h-5 w-5 text-emerald-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Reward Stub Issuance
          </h3>

          <p className="text-sm text-slate-500">
            Issue reward credits for achievements and incentives.
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
            className="w-full"
          >
            <ComboBox.InputGroup>
              <Input className="border border-gray-300" />
              <ComboBox.Trigger />
            </ComboBox.InputGroup>

            <ComboBox.Popover>
              <ListBox className="max-h-48">
                {employees.map((emp) => (
                  <ListBox.Item key={emp.id} id={emp.id} textValue={emp.name}>
                    {emp.name}

                    <ListBox.ItemIndicator />
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
            className="border border-gray-300"
            min={1}
            value={amount === 0 ? "" : String(amount)}
            onChange={(e) =>
              setAmount(e.target.value === "" ? 0 : Number(e.target.value))
            }
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <FileText className="h-4 w-4" />
            Reward Reason
          </label>

          <TextArea
            className="w-full border border-gray-300"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <Button
          size="lg"
          className="w-full rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
          onPress={issueReward}
        >
          <Award className="h-4 w-4" />
          Grant Reward
        </Button>
      </div>
    </div>
  );
}
