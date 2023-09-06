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

export function getContrastYIQ(hexcolor) {
  if (hexcolor.indexOf("#") === 0) {
    hexcolor = hexcolor.slice(1);
  }
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

export function textColorBasedOnBg(bgColor) {
  const primaryColor = bgColor || "#262424";
  return getContrastYIQ(primaryColor);
}
