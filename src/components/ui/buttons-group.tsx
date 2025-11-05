import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import CustomTooltip from "./tooltip";

interface ButtonsGroupProps {
  buttons: {
    children: React.ReactNode;
    onClick?: () => void;
    isActive?: boolean;
    label: string;
    disabled?: boolean;
  }[];
}

function ButtonsGroup(props: ButtonsGroupProps) {
  const { buttons } = props;
  return (
    <div className="flex items-center rounded-md">
      {buttons.map((button, index) => (
        <CustomTooltip key={index} content={button.label}>
          <Button
            onClick={button.onClick}
            variant="ghost"
            disabled={button.disabled}
            className={cn(
              "h-8 min-w-8 text-lg flex items-center justify-center p-0 rounded-none border border-border relative",
              "focus:outline-hidden focus:border-primary focus:bg-primary/5 focus:z-2",
              {
                "-ml-[1px]": index !== 0,
                "bg-primary! text-primary-foreground border-primary":
                  button.isActive,
                "rounded-l-md": index === 0,
                "rounded-r-md": index === buttons.length - 1,
              },
            )}
          >
            {button.children}
          </Button>
        </CustomTooltip>
      ))}
    </div>
  );
}

export default ButtonsGroup;
