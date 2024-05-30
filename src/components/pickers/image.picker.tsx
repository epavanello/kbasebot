import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useDropzone } from "react-dropzone";
import { ImageOff } from "lucide-react";
import { cn, getErrorMessage } from "@/lib/utils";
import NextImage from "next/image";
import LoadingDots from "@/components/ui/loading-dots";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface IImagePickerToolbarProps {
  value?: string;
  label?: string;
  onChange: (file: string) => void;
  imgClass?: string;
  imgWrapperClass?: string;
  imageUploading?: (data: boolean) => void;
  bucket?: string;
}

const ImagePicker = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & IImagePickerToolbarProps>(
  ({ value, onChange, bucket = "chatbot_assets", label, imgClass, imgWrapperClass, imageUploading }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
      if (value) setImageUrl(value);
    }, [value]);

    const { supabase, user } = useSupabaseAuth();

    const uploadImage = async (files: any[]) => {
      try {
        setUploading(true);
        imageUploading && imageUploading(true);
        // @ts-ignore
        if (!files || !files?.length) {
          throw new Error("You must select an image to upload.");
        }

        const file: File = files[0];

        const url = URL.createObjectURL(file);

        const img = new Image();
        img.onload = async function () {
          try {
            let { width, height } = img;
            const aspectRatio = width / height;

            if (aspectRatio !== 1) {
              throw new Error("Please upload an square image");
            }

            const { data, error } = await supabase.storage.from(bucket).upload(`${user?.id}/${file.name}`, file, {
              cacheControl: "3600",
              upsert: true,
            });

            if (error) throw new Error("File upload failed");

            const {
              data: { publicUrl },
            } = supabase.storage.from(bucket).getPublicUrl(data.path, {
              // transform: {
              //   width: 150,
              //   height: 150, //FIXME: may be need pro supabase
              // },
            });

            onChange?.(publicUrl);
          } catch (error) {
            console.log({ error });
            toast({
              title: "Error uploading image",
              description: getErrorMessage(error, "Something went wrong, please try again"),
              variant: "destructive",
            });
          }
        };

        img.src = url;
      } catch (error) {
        console.error(error);
        toast({
          title: "Error uploading image",
          description: getErrorMessage(error, "Something went wrong, please try again"),
          variant: "destructive",
        });
      } finally {
        setUploading(false);
        imageUploading && imageUploading(false);
      }
    };

    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (files) => uploadImage(files),
      multiple: false,
      noClick: true,
    });

    const deleteImage = async () => {
      onChange?.("");
      setImageUrl("");
    };

    return (
      <>
        {!!label && <label className="text-xs font-bold">{label}</label>}
        <div ref={ref} className="relative max-w-xl" {...getRootProps()}>
          <label className="flex w-full cursor-pointer appearance-none flex-col items-center justify-center rounded-md border border-gray-500 p-3 px-4 text-xs transition hover:border-gray-600 focus:outline-none">
            {uploading ? (
              <LoadingDots />
            ) : (
              <>
                <span className="flex items-center space-x-2">
                  <Icon className="text-2xl text-gray-700" icon="ic:outline-cloud-upload" />{" "}
                  <span className="font-medium text-gray-700">
                    Drop Image to {imageUrl ? "Change" : "Attach"}, or{" "}
                    <span className="text-blue-600 underline">Browse</span>
                  </span>
                </span>
                {imageUrl && (
                  <div className={cn("relative mt-4 h-16 w-full overflow-hidden", imgWrapperClass || "")}>
                    <NextImage
                      alt="image selected"
                      fill={true}
                      ref={imageRef}
                      src={imageUrl}
                      className={cn("rounded-full object-contain", imgClass || "")}
                    />
                  </div>
                )}
                {!imageUrl && (
                  <div className="flex items-center justify-center p-6">
                    <ImageOff size={32} />
                  </div>
                )}
              </>
            )}

            <input
              {...getInputProps()}
              ref={inputRef}
              type="file"
              name="file_upload"
              accept="image/jpeg,image/png,image/gif,image/svg+xml"
            />
          </label>
        </div>
        <Button
          disabled={!imageUrl}
          type="button"
          size="sm"
          variant={"outline"}
          onClick={deleteImage}
          className="h-auto w-full px-2 py-1 text-xs"
        >
          <Icon icon={"ph:trash"} className="mr-1 text-lg text-red-500" />
          Remove Image
        </Button>
      </>
    );
  },
);

ImagePicker.displayName = "ImagePicker";

export default ImagePicker;
