"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useResetAllEmployeeBalances } from "@/hooks/reset/useResetAllEmployeeBalances";
import { Button, Modal, toast } from "@heroui/react";

export default function ResetEmployeeBalances() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useResetAllEmployeeBalances();

  const handleReset = () => {
    mutate(undefined, {
      onSuccess: () => {
        toast.success("Employee Balances reset successful");
        setOpen(false);
      },
      onError: (err) => {
        console.error(err);
        toast.danger("Reset failed");
      },
    });
  };

  return (
    <div className="w-full max-w-56 justify-center items-center flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-center">
        <h3 className="text-sm font-semibold text-slate-900">System Tools</h3>
        <p className="text-xs text-slate-500">Administrative actions</p>
      </div>

      <Modal isOpen={open} onOpenChange={setOpen}>
        <Button size="sm" variant="danger" onClick={() => setOpen(true)}>
          Reset Employee Balances
        </Button>

        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-100">
              <Modal.CloseTrigger />

              <Modal.Header>
                <Modal.Icon className="bg-danger/10 text-danger">
                  <TriangleAlert className="size-5" />
                </Modal.Icon>

                <Modal.Heading>Reset Employee Balances</Modal.Heading>
              </Modal.Header>

              <Modal.Body>
                <p>
                  This will reset the balances of <strong>all employees</strong>
                  .
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Are you sure you want to continue?
                </p>
              </Modal.Body>

              <Modal.Footer className="flex gap-2">
                <Button
                  variant="secondary"
                  slot="close"
                  className="flex-1"
                  isDisabled={isPending}
                >
                  Cancel
                </Button>

                <Button
                  variant="danger"
                  className="flex-1"
                  isPending={isPending}
                  onClick={handleReset}
                >
                  {isPending ? "Resetting..." : "Confirm Reset"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
