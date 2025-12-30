import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface ControllerBoxProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  borderTop?: boolean;
  className?: string;
  itemClassName?: string;
  contentClassName?: string;
  action?: React.ReactNode;
}

const ControllerBox = React.forwardRef<HTMLDivElement, ControllerBoxProps>(
  (
    {
      title,
      children,
      defaultOpen = true,
      borderTop = true,
      className,
      itemClassName,
      contentClassName,
      action,
    },
    ref
  ) => {
    const generatedId = React.useId().replace(/[:]/g, "");

    return (
      <Accordion
        type="single"
        collapsible
        className={cn("px-2", className)}
        defaultValue={defaultOpen ? generatedId : undefined}
      >
        <AccordionItem
          ref={ref}
          value={generatedId}
          className={cn(
            "border-border",
            {
              "border-t": borderTop,
            },
            itemClassName
          )}
        >
          <div className="flex items-center justify-between pr-2">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
              {title}
            </AccordionTrigger>
            {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
          </div>
          <AccordionContent
            className={cn("flex flex-col gap-2.5", contentClassName)}
          >
            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }
);

ControllerBox.displayName = "ControllerBox";

export default ControllerBox;
