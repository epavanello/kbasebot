import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSitePublicUrl = (domains = {}, path = "") => {
  const { custom_domain, subdomain } = domains;
  const publicUrl = new URL(process.env.NEXT_PUBLIC_URL);
  return `${publicUrl.protocol}//${custom_domain || subdomain}.${
    publicUrl.host
  }/${path}`;
};

export const getHostFromUrl = (url) => {
  const host = new URL(url)?.host?.replace("www.", "");

  return isDevelopment ? host.replace("localhost:3000", "turbosite.io") : host;
};

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
    return new URL(process.env.NEXT_PUBLIC_URL);
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
