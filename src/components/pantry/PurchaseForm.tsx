"use client";
import { useState } from "react";
import { User, Ticket, Coins } from "lucide-react";
import {
  Button,
  ComboBox,
  Input,
  Label,
  ListBox,
  Select,
  toast,
} from "@heroui/react";
import { useEmployeesBasic } from "@/hooks/employees/useEmployees";
import { useCreatePurchase } from "@/hooks/transactions/useCreatePurchase";

export default function PurchaseForm() {
  const { data: employees = [] } = useEmployeesBasic();
  const createPurchase = useCreatePurchase();

  const [employeeId, setEmployeeId] = useState("");

  const [amount, setAmount] = useState(50);

  const [stubType, setStubType] = useState<"WEEKLY" | "REWARD">("WEEKLY");

  const selectedEmployee = employees.find((emp) => emp.id === employeeId);

  const selectedEmployeeBalance = selectedEmployee?.balance ?? 0;

  const weekly = selectedEmployee?.weekly ?? 0;
  const reward = selectedEmployee?.reward ?? 0;
  const total = selectedEmployee?.balance ?? 0;

  const availableBalance = stubType === "WEEKLY" ? weekly : reward;

  const purchase = async () => {
    if (!employeeId) {
      return toast.warning("Please select an employee");
    }

    if (amount <= 0) {
      return toast.warning("Invalid amount");
    }

    const employee = selectedEmployee;
    // const employee = employees.find((e) => e.id === employeeId);

    if (!employee) {
      return toast.danger("Employee not found");
    }

    if (availableBalance <= 0) {
      return toast.danger(`${stubType} balance is zero`);
    }

    // if (employee.balance <= 0) {
    //   return toast.danger("Cannot purchase: employee has zero balance");
    // }

    // if (amount > employee.balance) {
    //   return toast.warning("Insufficient balance");
    // }
    if (amount > availableBalance) {
      return toast.warning(`Insufficient ${stubType.toLowerCase()} balance`);
    }

    try {
      await createPurchase.mutateAsync({
        employeeId,
        amount,
        sourceType: stubType,
      });
      toast.success("Purchase completed");

      setAmount(50);
    } catch (err) {
      console.error(err);
      toast.danger("Purchase failed");
    }
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
            <ListBox
              className="max-h-48 overflow-y-auto"
              renderEmptyState={() => (
                <div className="flex flex-col items-center gap-2 py-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="text-center">
                    <p className="font-medium text-slate-700">
                      No employees found
                    </p>

                    <p className="text-xs text-slate-500">
                      No employee matches your search.
                    </p>
                  </div>
                </div>
              )}
            >
              {employees.map((emp) => (
                <ListBox.Item
                  key={emp.id}
                  id={emp.id}
                  textValue={`${emp.fullName} ${emp.employeeNumber}`}
                >
                  <div className="flex items-center gap-1 w-full">
                    <span>
                      {emp.fullName} - {emp.employeeNumber}
                    </span>
                  </div>

                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </ComboBox.Popover>
        </ComboBox>
        {selectedEmployee && (
          <div className="rounded-md bg-slate-50 border border-slate-200 p-3 flex flex-col gap-[1px]">
            <p className="text-sm text-slate-600">
              Employee:{" "}
              <span className="font-medium">{selectedEmployee.fullName}</span>
            </p>

            <p className="text-sm text-blue-700 font-semibold">
              Weekly Balance: ₱{selectedEmployee.weekly ?? 0}
            </p>

            <p className="text-sm text-green-700 font-semibold">
              Reward Balance: ₱{selectedEmployee.reward ?? 0}
            </p>
          </div>
        )}
        <div>
          <Select
            selectedKey={stubType}
            onSelectionChange={(key) => setStubType(key as "WEEKLY" | "REWARD")}
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
                <ListBox.Item id="WEEKLY" textValue="Weekly Stub">
                  Weekly Stub
                  <ListBox.ItemIndicator />
                </ListBox.Item>

                <ListBox.Item id="REWARD" textValue="Reward Stub">
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
