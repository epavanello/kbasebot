import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

const SiteReadyModal = ({ open, sitePublicUrl }) => {
  const router = useRouter();

  const onOpenChange = (val) => {
    if (!val) {
      return removeSiteReadyParam();
    }
  };

  const removeSiteReadyParam = () => {
    delete router.query.site_ready;
    return router.replace(
      { pathname: router.pathname, query: router.query },
      undefined,
      { shallow: true }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClass="backdrop-blur-md bg-white\/50"
        className="md:max-w-xl bg-transparent"
      >
        <DialogHeader>
          <DialogTitle className={cn("text-7xl font-black")}>
            Your Site is Ready 🎉
          </DialogTitle>
          <DialogDescription className="text-lg">
            Live on {sitePublicUrl}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={removeSiteReadyParam} variant={"outline"}>
            Stay on Dashboard
          </Button>
          {typeof window !== "undefined" && (
            <Button
              onClick={() => {
                window.open(sitePublicUrl, "_ blank");
                return removeSiteReadyParam();
              }}
            >
              Visit your site
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SiteReadyModal;
