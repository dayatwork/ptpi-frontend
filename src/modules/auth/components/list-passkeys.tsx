import { useState } from "react";
import { Fingerprint, Loader2, Trash } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/auth/auth-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { invalidateListPasskeys, useListPasskeys } from "../auth.query";

export function ListPasskeys() {
  const { data } = useListPasskeys();
  const [isOpen, setIsOpen] = useState(false);
  const [passkeyName, setPasskeyName] = useState("");

  const handleAddPasskey = async () => {
    if (!passkeyName) {
      toast.error("Passkey name is required");
      return;
    }
    setIsLoading(true);
    const res = await authClient.passkey.addPasskey({
      name: passkeyName,
    });
    await invalidateListPasskeys();
    setIsLoading(false);
    if (res?.error) {
      toast.error(res?.error.message);
    } else {
      toast.success("Passkey added successfully. You can now use it to login.");
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletePasskey, setIsDeletePasskey] = useState<boolean>(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-xs md:text-sm">
          <Fingerprint className="mr-2 h-4 w-4" />
          <span>Passkeys {data?.length ? `[${data?.length}]` : ""}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-11/12">
        <DialogHeader>
          <DialogTitle>Passkeys</DialogTitle>
          <DialogDescription>List of passkeys</DialogDescription>
        </DialogHeader>
        {data?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((passkey) => (
                <TableRow
                  key={passkey.id}
                  className="flex  justify-between items-center"
                >
                  <TableCell>{passkey.name || "My Passkey"}</TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={async () => {
                        await authClient.passkey.deletePasskey({
                          id: passkey.id,
                          fetchOptions: {
                            onRequest: () => {
                              setIsDeletePasskey(true);
                            },
                            onSuccess: () => {
                              toast("Passkey deleted successfully");
                              setIsDeletePasskey(false);
                            },
                            onError: (error) => {
                              toast.error(error.error.message);
                              setIsDeletePasskey(false);
                            },
                          },
                        });
                      }}
                    >
                      {isDeletePasskey ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash
                          size={15}
                          className="cursor-pointer text-red-600"
                        />
                      )}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">No passkeys found</p>
        )}
        {!data?.length && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="passkey-name" className="text-sm">
                New Passkey
              </Label>
              <Input
                id="passkey-name"
                value={passkeyName}
                onChange={(e) => setPasskeyName(e.target.value)}
                placeholder="My Passkey"
              />
            </div>
            <Button type="submit" onClick={handleAddPasskey} className="w-full">
              {isLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <>
                  <Fingerprint className="mr-2 h-4 w-4" />
                  Create Passkey
                </>
              )}
            </Button>
          </div>
        )}
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
