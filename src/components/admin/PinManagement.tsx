"use client";
import { useEffect, useState } from "react";
import {
  KeyRound,
  Shield,
  Users,
  UtensilsCrossed,
  Lock,
  TriangleAlert,
  Eye,
  EyeOff,
} from "lucide-react";
import { usePins } from "@/hooks/admin/usePins";
import { useSavePins } from "@/hooks/admin/useSavePins";
import { Button, Modal, Skeleton, toast } from "@heroui/react";

export default function PinManagement() {
  const [hr, setHr] = useState("");
  const [open, setOpen] = useState(false);
  const [pantry, setPantry] = useState("");
  const [showHr, setShowHr] = useState(false);
  const [showPantry, setShowPantry] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [admin, setAdmin] = useState("");

  const { data, isLoading } = usePins();

  const { mutateAsync, isPending } = useSavePins();

  useEffect(() => {
    if (!data) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHr(data.hr);
    setPantry(data.pantry);
    setAdmin(data.admin);
  }, [data]);

  const savePins = async () => {
    try {
      await mutateAsync({
        hr,
        pantry,
        admin,
      });

      setOpen(false);

      toast.success("PINs saved successfully", {
        description: "All role PINs have been updated.",
      });
    } catch (error) {
      console.error(error);

      toast.danger("Failed to save PINs", {
        description: "An error occurred while saving PINs.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-xl" />

          <div className="space-y-2">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="mb-2 h-4 w-24 rounded-md" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}

          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
          <KeyRound className="h-5 w-5 text-indigo-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            PIN Management
          </h3>

          <p className="text-sm text-slate-500">
            Configure access PINs for each system role.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Users className="h-4 w-4" />
            HR PIN
          </label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type={showHr ? "text" : "password"}
              value={hr}
              onChange={(e) => setHr(e.target.value)}
              placeholder="Enter HR PIN"
              className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-12 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <button
              type="button"
              onClick={() => setShowHr(!showHr)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showHr ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <UtensilsCrossed className="h-4 w-4" />
            Pantry PIN
          </label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type={showPantry ? "text" : "password"}
              value={pantry}
              onChange={(e) => setPantry(e.target.value)}
              placeholder="Enter Pantry PIN"
              className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-12 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <button
              type="button"
              onClick={() => setShowPantry(!showPantry)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPantry ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Shield className="h-4 w-4" />
            Admin PIN
          </label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type={showAdmin ? "text" : "password"}
              value={admin}
              onChange={(e) => setAdmin(e.target.value)}
              placeholder="Enter Admin PIN"
              className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-12 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <button
              type="button"
              onClick={() => setShowAdmin(!showAdmin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showAdmin ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        <Button
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700"
          onPress={() => setOpen(true)}
        >
          <KeyRound className="h-4 w-4" />
          Save PINs
        </Button>
        <Modal isOpen={open} onOpenChange={setOpen}>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog className="sm:max-w-md">
                <Modal.CloseTrigger />

                <Modal.Header>
                  <Modal.Icon className="bg-warning/10 text-warning">
                    <TriangleAlert className="size-5" />
                  </Modal.Icon>

                  <Modal.Heading>Confirm PIN Update</Modal.Heading>
                </Modal.Header>

                <Modal.Body>
                  <p className="text-sm text-slate-600">
                    Are you sure you want to update the system PINs?
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    This will immediately change the access PINs for HR, Pantry,
                    and Admin users.
                  </p>
                </Modal.Body>

                <Modal.Footer>
                  <Button
                    onPress={() => setOpen(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>

                  <Button
                    className="flex-1"
                    variant="primary"
                    onPress={savePins}
                    isDisabled={isPending}
                  >
                    {isPending ? "Saving..." : "Confirm Save"}
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      </div>
    </div>
  );
}
