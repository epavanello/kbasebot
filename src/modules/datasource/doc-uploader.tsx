import { bytesToMb } from "@/lib/utils";
import { Icon } from "@iconify/react";
import React, { FunctionComponent, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

import { LoadingIcon } from "@/components/ui/icons";

import { MAX_FILE_SIZE, SUPPORTED_EXTENSION_FOR_DROPZONE, SUPPORTED_EXTENSIONS } from "./docs-constant";
import { IFile, useDatasourceStore } from "@/lib/store/use-datasource-store";
import { useSupabaseAuth } from "@/lib/store/use-user";
import ContentList from "./content-list";
import axios from "axios";

interface IDocumentUploaderProps {
  label?: string;
  chatbotId: string;
  single?: boolean;
}

const DocumentUploader: FunctionComponent<IDocumentUploaderProps> = ({
  label,
  single = false,
  chatbotId,
}: IDocumentUploaderProps) => {
  const inputRef = useRef<any>();

  const { docs, appendDocs, deleteDoc, deleteAllDocs } = useDatasourceStore((state) => ({
    docs: state.docs,
    appendDocs: state.appendDocs,
    deleteDoc: state.deleteDoc,
    deleteAllDocs: state.deleteAllDocs,
  }));

  const { supabase } = useSupabaseAuth();

  const handleUploadFiles = async (files: File[]) => {
    files.forEach(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post<IFile>(`/api/chatbots/datasource/load-files?chatbot_id=${chatbotId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      if (res.data) {
        appendDocs([
          {
            id: res.data.id,
            name: res.data.name,
            chars: res.data.chars,
          } as IFile,
        ]);
      }
    });
  };

  const handleDeleteDoc = async (doc: IFile) => {
    await supabase.storage.from("files").remove([`${chatbotId}/${doc.name}`]);
    deleteDoc(doc.id);
  };

  const handleDeleteAllDocs = async () => {
    await supabase.storage.from("files").remove([`${chatbotId}/*`]);
    deleteAllDocs();
  };

  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (uploadedFiles: File[]) => {
    try {
      setUploading(true);

      // @ts-ignore
      if (!uploadedFiles || !uploadedFiles?.length) {
        throw new Error("You must select at least a file to upload.");
      }

      if (single && uploadedFiles?.length > 1) throw new Error("You can upload only one file");

      if (single) {
        if (docs?.length || 0 > 0) {
          handleDeleteAllDocs();
        }
        handleUploadFiles(
          // Filter the files to check if there's any file with duplicate name
          uploadedFiles.filter((uploadedFile) => !docs?.find((f) => f.name === uploadedFile.name)),
        );
      } else {
        handleUploadFiles(
          // Filter the files to check if there's any file with duplicate name
          uploadedFiles.filter((uploadedFile) => !docs?.find((f) => f.name === uploadedFile.name)),
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
    noClick: true,
  });

  return (
    <div className="flex w-full flex-col items-center">
      {!!label && <label className="text-xs font-bold">{label}</label>}
      <div className="my-1 w-full" {...getRootProps()}>
        <label className="flex w-full cursor-pointer appearance-none flex-col items-center justify-center gap-4 rounded-md border border-dashed border-gray-300 px-4 pb-8 pt-14 text-xs transition hover:border-gray-600 focus:outline-none">
          {uploading ? (
            <LoadingIcon />
          ) : (
            <>
              <span className="flex items-center space-x-2">
                <Icon className="text-4xl text-gray-700" icon="tabler:upload" />{" "}
                <span className="font-medium text-gray-700">
                  Drop files here or <span className="text-blue-600 underline">Browse Files</span>
                </span>
              </span>
              <div className="text-gray-400">
                <p className="mb-1 mt-2 text-[13px] font-bold">You can upload {bytesToMb(MAX_FILE_SIZE)}MB Max</p>
                <div className="flex flex-wrap gap-2 text-[12px]">
                  {SUPPORTED_EXTENSIONS.map((item) => (
                    <small key={item.ext}>.{item.ext}</small>
                  ))}
                </div>
              </div>
            </>
          )}

          <input {...getInputProps()} ref={inputRef} type="file" name="file_upload" />
        </label>
      </div>
      <ContentList
        title="Loaded files"
        items={(docs || []).map((doc) => ({
          value: doc.name,
          chars: doc.chars,
          id: doc.id,
          trained: doc.trained,
          data: doc,
        }))}
        onDelete={(doc) => handleDeleteDoc(doc.data!)}
        onDeleteAll={() => handleDeleteAllDocs()}
      />
    </div>
  );
};

export default DocumentUploader;
