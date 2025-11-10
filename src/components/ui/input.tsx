import * as React from "react";

import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground h-7 w-full min-w-0 rounded-md border border-border bg-muted px-1 text-xs transition hover:border-primary outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

interface NumberInputProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  leftChild?: React.ReactNode;
  className?: string;
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  leftChild,
  className,
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = Number.parseFloat(e.target.value);
    if (!Number.isNaN(numValue)) {
      onChange?.(numValue);
    }
  };

  return (
    <InputGroup className={className}>
      {leftChild && <InputGroupAddon>{leftChild}</InputGroupAddon>}
      <InputGroupInput
        type="number"
        value={value ?? ""}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
      />
    </InputGroup>
  );
}

export { Input, NumberInput };
