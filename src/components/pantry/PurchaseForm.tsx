"use client";
import { useState } from "react";
import { User, Ticket, Coins } from "lucide-react";
import { useMealStub } from "@/context/MealStubContext";
import { Button, ComboBox, Input, Label, ListBox, Select } from "@heroui/react";
import { currentWeek, today } from "@/lib/helpers";
import { wkBal, rwBal, totalBal } from "@/lib/balance";

export default function PurchaseForm() {
  const { transactions, setTransactions, employees } = useMealStub();

  const [employeeId, setEmployeeId] = useState("");

  const [amount, setAmount] = useState(50);

  const selectedEmployee = employees.find((emp) => emp.id === employeeId);

  const [stubType, setStubType] = useState<"weekly" | "reward">("weekly");

  const week = currentWeek();

  const selectedEmployeeBalance = selectedEmployee
    ? totalBal(selectedEmployee.id, week, transactions)
    : 0;
  const purchase = () => {
    if (!employeeId) {
      alert("Select employee");
      return;
    }

    const balance =
      stubType === "weekly"
        ? wkBal(employeeId, week, transactions)
        : rwBal(employeeId, transactions);

    if (amount <= 0) {
      alert("Invalid amount");
      return;
    }

    if (amount > balance) {
      alert("Insufficient balance");
      return;
    }

    setTransactions([
      ...transactions,
      {
        id: crypto.randomUUID(),
        empId: employeeId,
        type: "purchase",
        stubType,
        amount,
        date: today(),
        week,
        note: "Pantry Purchase",
      },
    ]);

    alert("Purchase completed");

    setAmount(50);
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Purchase Stub</h2>

        <p className="text-sm text-slate-500 mt-1">
          Deduct meal stub balance from an employee.
        </p>
      </div>

      <div className="space-y-4">
        <Label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
          <User size={16} />
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
                  {emp.name} - ₱{totalBal(emp.id, week, transactions)}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </ComboBox.Popover>
        </ComboBox>
        {selectedEmployee && (
          <div className="rounded-md bg-slate-50 border border-slate-200 p-3">
            <p className="text-sm text-slate-600">
              Employee:{" "}
              <span className="font-medium">{selectedEmployee.name}</span>
            </p>

            <p className="text-sm text-green-700 font-semibold">
              Available Balance: ₱{selectedEmployeeBalance}
            </p>
          </div>
        )}
        <div>
          <Select
            selectedKey={stubType}
            onSelectionChange={(key) => setStubType(key as "weekly" | "reward")}
            className="w-full "
          >
            <Label className="flex items-center gap-2 text-slate-700">
              <Ticket size={16} />
              Stub Type
            </Label>

            <Select.Trigger className="border border-slate-300 rounded-md">
              <Select.Value />
              <Select.Indicator className="text-black" />
            </Select.Trigger>

            <Select.Popover>
              <ListBox>
                <ListBox.Item id="weekly" textValue="Weekly Stub">
                  Weekly Stub
                  <ListBox.ItemIndicator />
                </ListBox.Item>

                <ListBox.Item id="reward" textValue="Reward Stub">
                  Reward Stub
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        <div>
          <Label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Coins size={16} />
            Amount
          </Label>
          <Input
            type="number"
            className="w-full border border-gray-300"
            min={1}
            value={amount === 0 ? "" : String(amount)}
            onChange={(e) =>
              setAmount(e.target.value === "" ? 0 : Number(e.target.value))
            }
          />
        </div>
        <Button
          onClick={purchase}
          className="w-full bg-blue-700 h-10 text-white rounded-md"
        >
          Deduct Balance
        </Button>
      </div>
    </div>
  );
}
