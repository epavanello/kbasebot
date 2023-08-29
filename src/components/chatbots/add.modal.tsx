import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { MenubarShortcut } from "@/components/ui/menubar";
import { Title } from "@/builder/components/typography";
import { MagicWandIcon } from "@radix-ui/react-icons";

const AddModal = () => {
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  // const [problem, setProblem] = useState("");
  // const [targetAudience, setTargetAudience] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Step 1
  const [designChoice, setDesignChoice] = useState("digital-art"); // Default to 'photo'

  const [loading, setLoading] = useState(false);

  const { push } = useRouter();

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setName(e.target.value);
  };

  const aiCall = async (e) => {
    e.preventDefault();
    setLoading(true);
    // call the /api/create endpoint with description
    // setLoading(true);

    try {
      const res = await axios.post("/api/sites/create", {
        description,
        name,
        // problem,
        // targetAudience,
        designChoice,
      });

      const { site, page } = res?.data;

      if (site && page)
        return push(`/app/sites/${site.id}/pages/${page.id}/processing`);

      // closeDialog();
    } catch (e) {
      console.log({ e });
      setLoading(false);
    }
  };

  const closeDialog = (state) => {
    if (!loading) setIsDialogOpen(state);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      onDismiss={closeDialog}
      dissmissOnEsc={true}
    >
      <DialogTrigger
        className={cn(buttonVariants({ variant: "default" }), "mt-4")}
      >
        Create a new site
      </DialogTrigger>

      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        overlayClass="backdrop-blur-2xl bg-white\/90 bg-cover bg-center bg-no-repeat bg-contain"
        className="overflow-visible bg-red md:max-w-2xl"
        overlayStyle={{
          backgroundImage: "url(/blobanimation.svg)",
        }}
      >
        <>
          <DialogDescription className="m-auto">
            <Title className="mb-2 text-2xl">Create New Site</Title>
            <form onSubmit={aiCall}>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                autoFocus={isDialogOpen}
                placeholder="🪄 Describe your website's purpose or main features"
                onChange={(e: any) => handleDescriptionChange(e)}
                className="mt-1 mb-5 text-2xl font-bold border-none focus:ring-0 focus:outline-none"
                value={description}
              />
              <Label htmlFor="Name">Name</Label>
              <Input
                id="Name"
                placeholder="🏷️ Does it have a name?"
                onChange={(e: any) => handleNameChange(e)}
                className="mt-1 mb-5 text-xl font-bold border-none focus:ring-none focus:ring-0 focus:outline-none"
                value={name}
              />
              {/* ADD here a selct bewteen 2 value ILLUSTRATION or PHOTO */}

              <Label htmlFor="designChoice">Design Choice</Label>
              <div id="designChoice" className="flex gap-1 mt-2 mb-5">
                <Button
                  type="button"
                  className={`btn ${
                    designChoice === "digital-art" ? "bg-slate-200" : ""
                  }`}
                  variant="outline"
                  size="sm"
                  onClick={() => setDesignChoice("digital-art")}
                >
                  Illustration
                </Button>
                <Button
                  className={`btn ${
                    designChoice === "photographic" ? "bg-slate-200" : ""
                  }`}
                  variant="outline"
                  type="button"
                  size="sm"
                  onClick={() => setDesignChoice("photographic")}
                >
                  Photo
                </Button>
                <Button
                  className={`btn ${
                    designChoice === "isometric" ? "bg-slate-200" : ""
                  }`}
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setDesignChoice("isometric")}
                >
                  Isometric
                </Button>
              </div>

              <div className="flex justify-center gap-1 mt-2">
                <Button
                  className="text-gray-800"
                  onClick={() => setIsDialogOpen(false)}
                  size={"lg"}
                  type="button"
                  loading={loading}
                  disabled={loading}
                  variant="ghost"
                >
                  Go back
                </Button>
                <Button
                  className="text-xl text-white "
                  type="submit"
                  size={"lg"}
                  loading={loading}
                  disabled={loading || !description || !name}
                >
                  <MagicWandIcon className="w-8 h-8 mr-2" />
                  Let's go
                  <MenubarShortcut className="mt-1 ml-2 text-xltext-white">
                    &#9166;
                  </MenubarShortcut>
                </Button>
              </div>
            </form>
          </DialogDescription>
        </>
      </DialogContent>
    </Dialog>
  );
};

export default AddModal;
