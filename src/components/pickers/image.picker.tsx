import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useDropzone } from "react-dropzone";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
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
}

const ImagePicker: FunctionComponent<IImagePickerToolbarProps> = ({
  value,
  onChange,
  bucket = "chatbot_assets",
  label,
  imgClass,
  imgWrapperClass,
  imageUploading,
}) => {
  const inputRef = useRef<any>();
  const imageRef = useRef();

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
          let { width, height } = this;
          const aspectRatio = width / height;

          if (aspectRatio !== 1) {
            throw new Error("Please upload an square image");
          }

          const {
            data: { path },
            error,
          } = await supabase.storage
            .from(bucket)
            .upload(`${user?.id}/${file.name}`, file, {
              cacheControl: "3600",
              upsert: true,
            });

          if (error) throw new Error("File upload failed");

          const {
            data: { publicUrl },
          } = supabase.storage.from(bucket).getPublicUrl(path, {
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
            description:
              typeof error?.message === "string"
                ? error.message
                : "Something went wrong, please try again",
            variant: "destructive",
          });
        }
      };

      img.src = url;
    } catch (error) {
      console.error(error);
      toast({
        title: "Error uploading image",
        description:
          typeof error?.message === "string"
            ? error.message
            : "Something went wrong, please try again",
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
  });

  const deleteImage = async () => {
    onChange?.("");
    setImageUrl("");
  };

  return (
    <>
      {!!label && <label className="text-xs font-bold">{label}</label>}
      <div className="relative max-w-xl" {...getRootProps()}>
        <label className="flex flex-col text-xs items-center justify-center w-full p-3 px-4 transition border border-gray-500  rounded-md appearance-none cursor-pointer hover:border-gray-600 focus:outline-none">
          {uploading ? (
            <LoadingDots />
          ) : (
            <>
              <span className="flex items-center space-x-2">
                <Icon
                  className="text-2xl text-gray-700"
                  icon="ic:outline-cloud-upload"
                />{" "}
                <span className="font-medium text-gray-700">
                  Drop Image to {imageUrl ? "Change" : "Attach"}, or{" "}
                  <span className="text-blue-600 underline">Browse</span>
                </span>
              </span>
              {imageUrl && (
                <div
                  className={cn(
                    "relative mt-4 overflow-hidden w-full h-16",
                    imgWrapperClass || "",
                  )}
                >
                  <NextImage
                    alt="image selected"
                    fill={true}
                    ref={imageRef}
                    src={imageUrl}
                    className={cn(
                      "rounded-full object-contain",
                      imgClass || "",
                    )}
                  />
                </div>
              )}
              {!imageUrl && (
                <div className="flex justify-center items-center p-6">
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
        className="py-1 px-2 h-auto w-full text-xs"
      >
        <Icon icon={"ph:trash"} className="text-red-500 text-lg mr-1" />
        Remove Image
      </Button>
    </>
  );
};

export default ImagePicker;
