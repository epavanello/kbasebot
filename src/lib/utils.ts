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
