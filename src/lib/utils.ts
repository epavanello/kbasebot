import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NEXT_PUBLIC_URL } from "./env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalize = (s: string = "") => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const truncate = (str: string, num: number) => {
  if (!str) return str;
  if (str?.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};

export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const response = await fetch(input, init || {});

  return response.json();
}

export const getPublicUrl = () => {
  try {
    return new URL(NEXT_PUBLIC_URL);
  } catch (e) {
    console.warn("No Public Url", e);
    return "";
  }
};

export function isObjEmpty(obj) {
  if (obj === null || obj === undefined) {
    return true;
  }
  return Object.keys(obj).length === 0;
}

export function sayGreeting() {
  let date = new Date();
  let hour = date.getHours();
  let greeting = "";

  if (hour < 12) {
    greeting = "Good Morning 🌞";
  } else if (hour < 18) {
    greeting = "Good Afternoon ☀️";
  } else {
    greeting = "Good Evening 🌙";
  }

  return greeting;
}

export const getRandomArrayIndex = (arr) =>
  Math.floor(Math.random() * arr?.length);

export const getRandomArrayValue = (arr = []) => {
  return arr[Math.floor(Math.random() * arr?.length)];
};

export function getErrorMessage(e: unknown): string {
  try {
    if (typeof e === "string") {
      return e;
    } else if (e instanceof Error) {
      return e.message;
    } else if (
      typeof e == "object" &&
      e &&
      "data" in e &&
      typeof e.data == "string"
    ) {
      return JSON.parse(e.data)?.message || "";
    }
  } catch (error) {
    return getErrorMessage(error);
  }
  return "unknown";
}
export const toCapitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const bytesToMb = (bytes: number): number => {
  return Math.round(bytes / 1024 / 1024);
};

export const groupBy = (arr: {}[], key: string) => {
  return arr.reduce((acc, next) => {
    (acc[next[key]] = acc[next[key]] || []).push(next);
    return acc;
  }, {});
};

export const formatDate = (dateString) => {
  const date = new Date(dateString).toUTCString();
  return date;
};

export function isContrastColorWhite(hexColor: string): boolean {
  if (hexColor.indexOf("#") === 0) {
    hexColor = hexColor.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hexColor.length === 3) {
    hexColor =
      hexColor[0] +
      hexColor[0] +
      hexColor[1] +
      hexColor[1] +
      hexColor[2] +
      hexColor[2];
  }
  if (hexColor.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);
  // Calcolo la luminosità del colore
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

export function textColorBasedOnBg(bgColor: string) {
  const primaryColor = bgColor || "#262424";
  return isContrastColorWhite(primaryColor) ? "white" : "black";
}
