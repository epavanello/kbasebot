import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import LoadingDots from "@/components/ui/LoadingDots";
import { Center } from "@/builder/components/flex";

const SiteRemoveModal = React.forwardRef<HTMLButtonElement>(
  ({ id, table, onDelete, btnClass, btnLabel = "Remove" }, ref) => {
    const supabase = useSupabaseClient();
    const [isLoading, setLoading] = useState(false);

    const removeSite = async () => {
      setLoading(true);
      try {
        await supabase.from(table).delete().eq("id", id).throwOnError();

        return onDelete();
      } catch (e) {
        console.log({ e });
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 5000);
      }
    };

    return (
      <AlertDialog ref={ref}>
        <AlertDialogTrigger className={`flex ${btnClass}`}>
          <TrashIcon size={18} />
          {btnLabel && <span className="ml-2">{btnLabel}</span>}
        </AlertDialogTrigger>
        <AlertDialogContent>
          {isLoading ? (
            <>
              <Center className="flex flex-col">
                <AlertDialogTitle>Deleting your {table}</AlertDialogTitle>
                <div>
                  <LoadingDots className="bg-gray-500" />
                </div>
              </Center>
            </>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your {table} and can&apos;t be recovered.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={removeSite}>
                  Delete anyway
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);

SiteRemoveModal.displayName = "SiteRemoveModal";

export default SiteRemoveModal;
