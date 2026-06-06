"use client";

import { Search } from "lucide-react";
import type { ComponentProps } from "react";

import { Input } from "@/components/ui/input";

type SearchBarProps = {
  value: string;
  onValueChange: (value: string) => void;
} & Omit<ComponentProps<"input">, "value" | "onChange" | "type">;

export function SearchBar({ value, onValueChange, ...inputProps }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search
        className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-primary"
        aria-hidden="true"
      />
      <Input
        type="text"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder="Cerca una città..."
        aria-label="Cerca una città"
        autoComplete="off"
        spellCheck={false}
        className="h-12 rounded-xl bg-card pl-11 text-base"
        {...inputProps}
      />
    </div>
  );
}
