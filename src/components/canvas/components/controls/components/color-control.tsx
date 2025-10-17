import { Cross2Icon } from "@radix-ui/react-icons";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import ControllerRow from "./controller-row";
import CustomColorPicker from "./color-picker";

function ColorControl({
  name,
  onChange,
  value,
  disableGradient,
}: {
  name: string;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  disableGradient?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const onClick = () => {
    if (!value) {
      onChange("#000000");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const removeBorder = (e: any) => {
    e.stopPropagation();
    onChange(undefined);
    setOpen(false);
  };

  return (
    <ControllerRow label={name}>
      <Popover open={open} onOpenChange={(e) => setOpen(e)}>
        <PopoverTrigger asChild>
          <div
            role="presentation"
            onClick={onClick}
            onKeyDown={onClick}
            className="h-7 rounded-md bg-gray w-full border border-border flex items-center justify-between px-1 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-5 w-5 rounded-sm bg-foreground/20"
                style={{
                  ...(value ? { background: value } : {}),
                }}
              />
              {value ? (
                <p className="text-xs max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {value?.includes("gradient") ? "Gradient" : value}
                </p>
              ) : (
                <p className="text-xs opacity-40">Add...</p>
              )}
            </div>
            {value && (
              <div
                role="presentation"
                className="p-1 -mr-1"
                onClick={removeBorder}
                onKeyDown={removeBorder}
              >
                <Cross2Icon className="opacity-50 h-3 w-3" />
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-[293px]" side="left">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
            <p className="text-xs font-semibold">{name}</p>
            <div
              role="presentation"
              className="p-1 -mr-1 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Cross2Icon className="h-3.5 w-3.5 opacity-50" />
            </div>
          </div>
          <CustomColorPicker
            value={value}
            onChange={onChange}
            disableGradient={disableGradient}
          />
        </PopoverContent>
      </Popover>
    </ControllerRow>
  );
}

export default ColorControl;
