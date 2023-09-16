import { groupBy } from "@/lib/utils";

export const SUPPORTED_EXTENSIONS = [
  {
    ext: "pdf",
    type: "text",
    mime: "application/pdf",
    icon: "fa-regular:file-pdf",
  },
  { ext: "txt", type: "text", mime: "text/plain" },
  { ext: "csv", type: "text", mime: "text/csv" },
  { ext: "json", type: "text", mime: "application/json" },
  { ext: "epub", type: "text", mime: "application/epub+zip" },
  // {
  //   ext: "doc",
  //   type: "text",
  //   mime: "application/msword",
  //   icon: "bxs:file-doc"
  // },
  {
    ext: "docx",
    type: "text",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    icon: "bxs:file-doc",
  },
  // {
  //   ext: "odt",
  //   type: "text",
  //   mime: "application/vnd.oasis.opendocument.text",
  //   icon: "material-symbols:odt-outline"
  // },
  {
    ext: "pptx",
    type: "presentation",
    mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    icon: "icon-park-outline:ppt",
  },
  // {
  //   ext: "ppt",
  //   type: "presentation",
  //   mime: "application/vnd.ms-powerpoint",
  //   icon: "icon-park-outline:ppt"
  // },
  // {
  //   ext: "odp",
  //   type: "presentation",
  //   mime: "application/vnd.oasis.opendocument.presentation",
  //   icon: "icon-park-outline:ppt"
  // },
  // { ext: "mp3", type: "audio", mime: "audio/mpeg", icon: "gridicons:audio" },
  // { ext: "mp4", type: "video", mime: "video/mp4", icon: "mingcute:video-line" },
  // {
  //   ext: "avi",
  //   type: "audio",
  //   mime: "video/x-msvideo",
  //   icon: "mingcute:video-line"
  // },
  // {
  //   ext: "webm",
  //   type: "video",
  //   mime: "video/webm",
  //   icon: "mingcute:video-line"
  // },
  // { ext: "ogv", type: "video", mime: "video/ogg", icon: "mingcute:video-line" }
];

export const SUPPORTED_EXTENSION_BY_TYPE = groupBy(
  SUPPORTED_EXTENSIONS,
  "type",
);

export const SUPPORTED_EXTENSION_FOR_DROPZONE = SUPPORTED_EXTENSIONS.reduce(
  (acc, item) => {
    acc[item.mime] = acc[item.mime]
      ? [...acc[item.mime], `.${item.ext}`]
      : [`.${item.ext}`];
    return acc;
  },
  {},
);

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 25 MB

export const MAX_TEXT_INPUT = 20_000;
export const MIN_TEXT_INPUT = 1;

export const MAX_UPLOADABLE_FILES = 5;
