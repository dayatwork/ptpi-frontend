import { useState } from "react";
import { Edit, Loader2, X } from "lucide-react";
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
import { convertImageToBase64 } from "../utils/convert-image-to-base64";
import { invalidateUserSession, useUserSession } from "../auth.query";

export function EditUserDialog() {
  const { data } = useUserSession();
  const [name, setName] = useState<string>();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2" variant="secondary">
          <Edit size={13} />
          Edit User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-11/12">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Edit user information</DialogDescription>
        </DialogHeader>
        <div className="grid gap-1">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="name"
            placeholder={data?.user.name}
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="image">Profile Image</Label>
          <div className="flex items-end gap-4">
            {imagePreview && (
              <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex items-center gap-2 w-full">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-muted-foreground"
              />
              {imagePreview && (
                <X
                  className="cursor-pointer"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              await authClient.updateUser({
                image: image ? await convertImageToBase64(image) : undefined,
                name: name ? name : undefined,
                fetchOptions: {
                  onSuccess: async () => {
                    toast.success("User updated successfully");
                    await invalidateUserSession();
                  },
                  onError: (error) => {
                    toast.error(error.error.message);
                  },
                },
              });
              setName("");
              // router.refresh();
              setImage(null);
              setImagePreview(null);
              setIsLoading(false);
              setOpen(false);
            }}
          >
            {isLoading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              "Update"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
