import { bytesToMb } from "@/lib/utils";
import { Icon } from "@iconify/react";
import React, { FunctionComponent, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

import { LoadingIcon } from "@/components/ui/icons";

import {
  MAX_FILE_SIZE,
  SUPPORTED_EXTENSION_FOR_DROPZONE,
  SUPPORTED_EXTENSIONS,
} from "./docs-constant";
import { useDatasourceStore } from "@/lib/store/use-datasource-store";

interface IDocumentUploaderProps {
  label?: string;
}

const DocumentUploader: FunctionComponent<IDocumentUploaderProps> = ({
  label,
  single = false,
}) => {
  const inputRef = useRef<any>();

  const { docs, setDocs, deleteDoc } = useDatasourceStore((state) => ({
    docs: state.docs,
    setDocs: state.setDocs,
    deleteDoc: state.deleteDoc,
  }));

  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (uploadedFiles: any[]) => {
    try {
      setUploading(true);

      // @ts-ignore
      if (!uploadedFiles || !uploadedFiles?.length) {
        throw new Error("You must select at least a file to upload.");
      }

      if (single && uploadedFiles?.length > 1)
        throw new Error("You can upload only one file");

      if (single) {
        deleteDoc(docs[0]?.name);
        setDocs(
          // Filter the files to check if there's any file with duplicate name
          uploadedFiles.filter(
            (uploadedFile) => !docs.find((f) => f.name === uploadedFile.name),
          ),
        );
      } else {
        setDocs(
          // Filter the files to check if there's any file with duplicate name
          uploadedFiles.filter(
            (uploadedFile) => !docs.find((f) => f.name === uploadedFile.name),
          ),
        );
      }
    } catch (error) {
      alert("Error uploading file!");
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (docs) => uploadFiles(docs),
    multiple: !single,
    accept: SUPPORTED_EXTENSION_FOR_DROPZONE,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <div className="w-full flex flex-col items-center max-w-3xl">
      {!!label && <label className="text-xs font-bold">{label}</label>}
      <div className="w-full my-1" {...getRootProps()}>
        <label className="flex flex-col text-xs items-center justify-center w-full py-10 px-4 transition border border-dashed border-gray-300 rounded-md appearance-none cursor-pointer hover:border-gray-600 focus:outline-none">
          {uploading ? (
            <LoadingIcon />
          ) : (
            <>
              <span className="flex items-center space-x-2">
                <Icon className="text-4xl text-gray-700" icon="tabler:upload" />{" "}
                <span className="font-medium text-gray-700">
                  Drop files here or{" "}
                  <span className="text-blue-600 underline">Browse File</span>
                </span>
              </span>
            </>
          )}

          <input
            {...getInputProps()}
            ref={inputRef}
            type="file"
            name="file_upload"
          />
        </label>
      </div>
      {!!docs.length && (
        <ul className="relative mt-4 w-full flex flex-col gap-1">
          {docs.map((doc) => {
            return (
              <li
                className="flex items-center gap-1 text-[12px] mb-1"
                key={doc.name}
              >
                <Icon
                  icon={
                    SUPPORTED_EXTENSIONS.find((i) => {
                      return i.ext === doc?.type.split("/").pop();
                    })?.icon || "bx:file"
                  }
                />{" "}
                {doc.name}
                <button
                  onClick={() => deleteDoc(doc.name)}
                  className="ml-4 text-red-400 hover:text-red-600"
                >
                  <Icon icon={"ph:trash"} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <div className="text-gray-400">
        <p className="text-[13px] mb-1 mt-2 font-bold">
          You can upload {bytesToMb(MAX_FILE_SIZE)}MB Max
        </p>
        <div className="flex gap-2 flex-wrap text-[12px]">
          {SUPPORTED_EXTENSIONS.map((item) => (
            <small key={item.ext}>.{item.ext}</small>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
