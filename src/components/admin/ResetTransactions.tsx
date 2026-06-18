// "use client";

// import { Button, toast } from "@heroui/react";
// import { useResetAllTransactions } from "@/hooks/reset/useResetAllTransactions";

// export default function ResetTransactions() {
//   const { mutate, isPending } = useResetAllTransactions();

//   const resetData = () => {
//     const ok = confirm("Delete ALL transactions? This cannot be undone.");
//     if (!ok) return;

//     mutate(undefined, {
//       onSuccess: () => {
//         toast.success("All transactions cleared");
//       },
//       onError: (err) => {
//         console.error(err);
//         toast.danger("Reset failed");
//       },
//     });
//   };

//   return (
//     <div className="w-full max-w-52 flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//       <div className="text-center">
//         <h3 className="text-sm font-semibold text-slate-900">System Tools</h3>
//         <p className="text-xs text-slate-500">Administrative actions</p>
//       </div>

//       <Button onClick={resetData} isPending={isPending} variant="danger">
//         {isPending ? "Resetting..." : "Reset Transactions"}
//       </Button>
//     </div>
//   );
// }
"use client";

import { Button, Modal, toast } from "@heroui/react";
import { TriangleAlert } from "lucide-react";
import { useResetAllTransactions } from "@/hooks/reset/useResetAllTransactions";
import { useState } from "react";

export default function ResetTransactions() {
  const { mutate, isPending } = useResetAllTransactions();
  const [open, setOpen] = useState(false);
  const handleReset = () => {
    mutate(undefined, {
      onSuccess: () => {
        toast.success("All transactions cleared");
        setOpen(false);
      },
      onError: (err) => {
        console.error(err);
        toast.danger("Reset failed");
      },
    });
  };

  return (
    <div className="w-full max-w-52 flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-center">
        <h3 className="text-sm font-semibold text-slate-900">System Tools</h3>
        <p className="text-xs text-slate-500">Administrative actions</p>
      </div>

      <Modal isOpen={open} onOpenChange={setOpen}>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Reset Transactions
        </Button>

        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-100">
              <Modal.CloseTrigger />

              <Modal.Header>
                <Modal.Icon className="bg-danger/10 text-danger">
                  <TriangleAlert className="size-5" />
                </Modal.Icon>
                <Modal.Heading>Reset All Transactions</Modal.Heading>
              </Modal.Header>

              <Modal.Body>
                <p>
                  This will permanently delete <strong>all transactions</strong>
                  . This action cannot be undone.
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
