import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Read `.message` from a thrown value (Error, Supabase error, or anything else). */
export function getErrorMessage(error: unknown): string | undefined {
  return (error as { message?: string } | null)?.message;
}
