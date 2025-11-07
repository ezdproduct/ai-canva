import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

function CustomTooltip({
  content,
  hotkey,
  children,
}: {
  content: string;
  hotkey?: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="TooltipContent rounded-md z-50 px-2 py-1.5 text-sm shadow-sm text-background bg-foreground animate-in fade-in-0 zoom-in-95"
            sideOffset={5}
          >
            <div className="flex items-center gap-2">
              <span>{content}</span>
              {hotkey && (
                <span className="text-xs opacity-70 font-mono">{hotkey}</span>
              )}
            </div>
            <Tooltip.Arrow className="TooltipArrow !text-foreground fill-foreground" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export default CustomTooltip;
