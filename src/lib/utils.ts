import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function serializeData<T extends Record<string, unknown>>(
  items: T[],
): T[] {
  return items.map((item) => {
    const serialized: { [key: string]: unknown } = { ...item };
    for (const key in serialized) {
      const value = serialized[key];
      if (
        typeof value === "string" &&
        !isNaN(Number(value)) &&
        value.trim() !== ""
      ) {
        serialized[key] = Number(value);
      } else if (
        typeof value === "string" &&
        !isNaN(Date.parse(value)) &&
        ISO_DATE_REGEX.test(value)
      ) {
        serialized[key] = new Date(value).toISOString();
      }
    }
    return serialized as T;
  });
}
