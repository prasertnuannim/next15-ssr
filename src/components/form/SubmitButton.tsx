"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button"; // ShadCN Button

type SubmitButtonProps = {
  className?: string;
  text: string;
};
export function SubmitButton({ text, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      className={`w-full rounded-md py-2 ${
        pending
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600"
      } text-white font-semibold transition duration-300 ${className || ""}`}
      type="submit"
      disabled={pending}
    >
      {pending ? "Loading..." : text}
    </Button>
  );
}
